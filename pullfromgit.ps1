<# 
  pullfromgit.ps1  — for InfectedSaint / 3Dprintandburn

  Safely overwrite the CURRENT FOLDER with what's on GitHub (origin/<HEAD branch>).
  - Verifies Git user and remote URL.
  - Lets you pick Shallow or Full fetch.
  - Resets hard to remote and cleans untracked files.
  - Makes a backup .zip (unless -NoBackup).

  Typical usage (from repo folder):
    .\pullfromgit.ps1 -Shallow
    .\pullfromgit.ps1 -Full
#>

[CmdletBinding()]
param(
  # Defaults set for your Git identity and repo:
  [string]$ExpectedUser = "InfectedSaint",
  [string]$ExpectedRepoUrl = "https://github.com/InfectedSaint/3Dprintandburn.git",

  # Optional overrides:
  [string]$Branch,              # if omitted, auto-detects origin HEAD (falls back to 'main')
  [switch]$Shallow,             # use --depth=1 (fast)
  [switch]$Full,                # full history (--all --prune)
  [switch]$NoBackup,            # skip backup .zip
  [switch]$Force,               # bypass mismatch checks
  [switch]$AddSafeDirectory     # add current folder to git safe.directory (avoids “dubious ownership”)
)

$ErrorActionPreference = 'Stop'
function Info($m){ Write-Host "[INFO]" $m -ForegroundColor Cyan }
function Ok($m){ Write-Host "[ OK ]" $m -ForegroundColor Green }
function Warn($m){ Write-Warning $m }
function Fail($m){ Write-Error $m; exit 1 }

# 0) Preconditions
try { git --version | Out-Null } catch { Fail "Git is not installed or not on PATH." }

$here = (Get-Location).Path
Info "Working folder: $here"

# 1) Must be a git repo
$inside = ''
try { $inside = (git rev-parse --is-inside-work-tree).Trim() } catch { }
if ($inside -ne 'true') { Fail "This is not a git repository. cd into your repo folder first." }

# 2) Optional safe.directory
if ($AddSafeDirectory) {
  Info "Adding this folder to git safe.directory"
  git config --global --add safe.directory "$here"
}

# 3) Gather context
$userName = (git config user.name).Trim()
$remoteUrl = ''
try { $remoteUrl = (git remote get-url origin).Trim() } catch { Fail "No 'origin' remote found. Add it: git remote add origin <URL>" }

Info "Git user.name: '${userName}'"
Info "origin URL:   '${remoteUrl}'"

# 4) Verify identity & remote
if ($ExpectedUser -and $userName -ne $ExpectedUser) {
  $msg = "Git user.name mismatch. Expected '$ExpectedUser' but found '$userName'."
  if (-not $Force) { Fail $msg } else { Warn "$msg Proceeding due to -Force." }
} else { Ok "Git user matches expected." }

function NormalizeUrl([string]$u){ if ($u.EndsWith('.git')) { $u.Substring(0,$u.Length-4) } else { $u } }
if ($ExpectedRepoUrl -and (NormalizeUrl $remoteUrl) -ne (NormalizeUrl $ExpectedRepoUrl)) {
  $msg = "Remote 'origin' mismatch. Expected '$ExpectedRepoUrl' but found '$remoteUrl'."
  if (-not $Force) { Fail $msg } else { Warn "$msg Proceeding due to -Force." }
} else { Ok "origin remote matches expected." }

# 5) Choose fetch mode
if (-not $Shallow -and -not $Full) {
  $choice = Read-Host "Fetch mode? 's' = shallow (fast), 'f' = full"
  if ($choice -match '^[sS]') { $Shallow = $true } else { $Full = $true }
}

# 6) Optional backup
if (-not $NoBackup) {
  $stamp = (Get-Date -Format "yyyyMMdd-HHmmss")
  $zipName = "backup-$(Split-Path -Leaf $here)-$stamp.zip"
  $zipPath = Join-Path (Split-Path $here) $zipName
  Info "Creating backup zip (excluding .git): $zipPath"
  $tmpDir = Join-Path $env:TEMP "pullfromgit-$stamp"
  New-Item -ItemType Directory -Path $tmpDir | Out-Null
  try {
    robocopy "$here" "$tmpDir" /MIR /XD ".git" | Out-Null
    Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
    if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tmpDir, $zipPath)
    Ok "Backup created."
  } catch {
    Warn "Backup failed: $($_.Exception.Message). Continuing."
  } finally {
    Remove-Item $tmpDir -Recurse -Force -ErrorAction SilentlyContinue | Out-Null
  }
} else {
  Info "Skipping backup due to -NoBackup."
}

# 7) Fetch
try {
  if ($Shallow) {
    Info "Shallow fetch: git fetch --depth=1"
    git fetch --depth=1
  } else {
    Info "Full fetch: git fetch --all --prune"
    git fetch --all --prune
  }
} catch {
  Fail "git fetch failed: $($_.Exception.Message)"
}

# 8) Determine target branch
$targetBranch = $Branch
if (-not $targetBranch) {
  $headLine = ''
  try { $headLine = (git remote show origin | Select-String 'HEAD branch').ToString() } catch { }
  if ($headLine) {
    $targetBranch = ($headLine -split ':')[-1].Trim()
    Ok "Detected remote HEAD branch: $targetBranch"
  } else {
    $targetBranch = 'main'
    Warn "Could not auto-detect remote HEAD. Falling back to '$targetBranch' (use -Branch to override)."
  }
}

# 9) Ensure remote branch exists
$branches = git branch -r
if ($branches -notmatch "origin/$targetBranch") { Fail "Remote branch 'origin/$targetBranch' not found." }

# 10) Force-sync
try {
  Info "Resetting to origin/$targetBranch"
  git reset --hard "origin/$targetBranch"

  Info "Cleaning untracked files & directories"
  git clean -fdx

  # Housekeeping (useful after interrupted/large fetches)
  Info "Optimizing repository (git gc --prune=now)"
  git gc --prune=now | Out-Null

  Ok "Done. Working tree now matches origin/$targetBranch."
  Info "git status:"
  git status
} catch {
  Fail "Sync failed: $($_.Exception.Message)"
}
