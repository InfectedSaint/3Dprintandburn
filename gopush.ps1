# gopush.ps1
param(
  [string]$Message = "Update 3D Print & Burn site",
  [string]$Remote = "origin",
  [string]$Branch
)

$ErrorActionPreference = "Stop"

function Write-Info($m){Write-Host "[INFO]  $m" -f Cyan}
function Write-Warn($m){Write-Host "[WARN]  $m" -f Yellow}
function Write-Ok($m){Write-Host "[OK]    $m" -f Green}
function Write-Step($m){Write-Host "[STEP]  $m" -f Magenta}

# ---- Step 1: Build ----
Write-Step "Building site…"
npm run build

# ---- Step 2: Preview ----
Write-Step "Starting preview server…"
Write-Host ">>> Preview running at http://localhost:4173"
Write-Host ">>> Browser will open automatically."
Write-Host ">>> Press Ctrl+C to stop preview when finished checking."

Start-Process "http://localhost:4173"
npm run preview   # this blocks until you Ctrl+C

# ---- Step 3: Ask before push ----
$confirm = Read-Host "Do you want to continue with Git commit & push? (y/n)"
if ($confirm -ne "y") {
  Write-Warn "Aborting push per user choice."
  exit 0
}

# ---- Step 4: Git commit & push ----
if (-not $Branch) { $Branch = (git rev-parse --abbrev-ref HEAD).Trim() }

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
