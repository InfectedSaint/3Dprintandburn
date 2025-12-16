# gopush.ps1
param(
  [string]$Message = "Update 3D Print & Burn site",
  [string]$Profile,
  [string]$User,
  [string]$Email,
  [switch]$PushOnly,
  [switch]$AmendAndFixAuthor,
  [string]$Remote = "origin",
  [string]$Branch,
  [switch]$NoRebase,          # if set, uses pull (merge) instead of pull --rebase
  [switch]$NoAutoStash        # if set, will NOT auto-stash; will error if dirty
)

$ErrorActionPreference = "Stop"

function Get-CurrentBranch { (git rev-parse --abbrev-ref HEAD).Trim() }
function Get-GitConfig([string]$key) { try { (git config --get $key).Trim() } catch { "" } }
function Set-GitConfigLocal([string]$key, [string]$value) { git config $key $value | Out-Null }
function Write-Info($m){Write-Host "[INFO]  $m" -ForegroundColor Cyan}
function Write-Warn($m){Write-Host "[WARN]  $m" -ForegroundColor Yellow}
function Write-Ok($m){Write-Host "[OK]    $m" -ForegroundColor Green}
function Write-Step($m){Write-Host "[STEP]  $m" -ForegroundColor Magenta}
function Write-ErrorMsg($m){Write-Host "[ERROR] $m" -ForegroundColor Red}

function Is-Dirty {
  # includes untracked
  $s = (git status --porcelain)
  return [bool]$s
}

# ---- Profiles ----
$Profiles = @{
  john = @{ name = "infectedsaint"; email = "johncomalander@gmail.com" }
  gary = @{ name = "Gnoski1236";    email = "gnoski1236@yahoo.com" }
}

# Resolve identity
$desiredName  = $null; $desiredEmail = $null
if ($Profile) {
  if (-not $Profiles.ContainsKey($Profile)) {
    Write-ErrorMsg "Profile '$Profile' not found. Available: $($Profiles.Keys -join ', ')"; exit 1
  }
  $desiredName  = $Profiles[$Profile].name
  $desiredEmail = $Profiles[$Profile].email
}
if ($User)  { $desiredName  = $User }
if ($Email) { $desiredEmail = $Email }

# Show context
Write-Info ("Repo:        " + (git rev-parse --show-toplevel))
Write-Info ("Remote URL:  " + (git remote get-url $Remote))
if (-not $Branch) { $Branch = Get-CurrentBranch }
Write-Info ("Branch:      " + $Branch)
$currentName  = Get-GitConfig "user.name"
$currentEmail = Get-GitConfig "user.email"
Write-Info ("Current cfg: user.name=`"$currentName`", user.email=`"$currentEmail`"")

# Ensure correct author (repo-local)
if ($desiredName -and $desiredEmail) {
  if ($currentName -ne $desiredName -or $currentEmail -ne $desiredEmail) {
    Write-Step "Setting repo author to: `"$desiredName`" <$desiredEmail>"
    Set-GitConfigLocal "user.name"  $desiredName
    Set-GitConfigLocal "user.email" $desiredEmail
    Write-Ok "Now using: user.name=`"$desiredName`", user.email=`"$desiredEmail`""
  } else {
    Write-Ok "Author already correct."
  }
} else {
  Write-Warn "No profile/name/email provided. Continuing with current author."
}

# -------------------------
# Sync with remote FIRST
# -------------------------
Write-Step "Fetching from '$Remote'…"
git fetch $Remote

$stashName = $null
$didStash = $false

if (Is-Dirty) {
  if ($NoAutoStash) {
    Write-ErrorMsg "Working tree has changes. Commit/stash first, or rerun without -NoAutoStash."
    exit 1
  }
  $stashName = "autostash before pull -- $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
  Write-Step "Working tree dirty — auto-stashing (including untracked)…"
  git stash push -u -m $stashName | Out-Null
  $didStash = $true
  Write-Ok "Stashed: $stashName"
}

Write-Step "Pulling latest from '$Remote/$Branch'…"
if ($NoRebase) {
  git pull $Remote $Branch
} else {
  git pull --rebase $Remote $Branch
}
Write-Ok "Repo up to date."

if ($didStash) {
  Write-Step "Re-applying stashed changes…"
  try {
    git stash pop | Out-Null
    Write-Ok "Stash applied."
  } catch {
    Write-Warn "Stash apply had conflicts. Fix files, then run: git add -A ; git rebase --continue (if rebase), or commit normally."
    throw
  }
}

# -------------------------
# Commit + push
# -------------------------
if (-not $PushOnly) {
  Write-Step "Checking changes…"
  $porcelain = (git status --porcelain)
  if (-not $porcelain) {
    Write-Warn "No file changes detected."
  } else {
    Write-Step "Adding…"; git add -A

    if ($AmendAndFixAuthor) {
      Write-Step "Amending commit (and fixing author)…"
      git commit --amend --no-edit --reset-author
      Write-Ok "Commit amended."
    } else {
      Write-Step "Committing…"
      try { git commit -m "$Message"; Write-Ok "Commit created." }
      catch { Write-Warn "Nothing to commit (working tree clean)." }
    }
  }
} else {
  Write-Warn "-PushOnly specified: skipping add/commit."
}

Write-Step "Pushing to '$Remote/$Branch'…"
git push $Remote $Branch
Write-Ok "Done! Changes pushed."
