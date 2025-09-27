# gopush.ps1
param(
  [string]$Message = "Update 3D Print & Burn site",
  [string]$Profile,
  [string]$User,
  [string]$Email,
  [switch]$PushOnly,
  [switch]$AmendAndFixAuthor,
  [string]$Remote = "origin",
  [string]$Branch
)

$ErrorActionPreference = "Stop"

function Get-CurrentBranch { (git rev-parse --abbrev-ref HEAD).Trim() }
function Get-GitConfig([string]$key) { try { (git config --get $key).Trim() } catch { "" } }
function Set-GitConfigLocal([string]$key, [string]$value) { git config $key $value | Out-Null }
function Write-Info($m){Write-Host "[INFO]  $m" -f Cyan}
function Write-Warn($m){Write-Host "[WARN]  $m" -f Yellow}
function Write-Ok($m){Write-Host "[OK]    $m" -f Green}
function Write-Step($m){Write-Host "[STEP]  $m" -f Magenta}
function Write-ErrorMsg($m){Write-Host "[ERROR] $m" -f Red}

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

# Commit + push
Write-Step "Checking changes…"
$porcelain = (git status --porcelain)
if (-not $porcelain) {
  Write-Warn "No file changes detected."
} else {
  Write-Step "Adding…"; git add -A
  Write-Step "Committing…"
  try { git commit -m "$Message"; Write-Ok "Commit created." }
  catch { Write-Warn "Nothing to commit (working tree clean)." }
}

Write-Step "Pushing to '$Remote/$Branch'…"
git push $Remote $Branch
Write-Ok "Done! Changes pushed."
