# gosee.ps1
param(
  [string]$Remote = "origin",
  [string]$Branch
)

$ErrorActionPreference = "Stop"

function Write-Info($m){Write-Host "[INFO]  $m" -f Cyan}
function Write-Step($m){Write-Host "[STEP]  $m" -f Magenta}
function Write-Warn($m){Write-Host "[WARN]  $m" -f Yellow}
function Write-Ok($m){Write-Host "[OK]    $m" -f Green}

# Show repo context
Write-Info ("Repo:   " + (git rev-parse --show-toplevel))
Write-Info ("Remote: " + (git remote get-url $Remote))
if (-not $Branch) { $Branch = (git rev-parse --abbrev-ref HEAD).Trim() }
Write-Info ("Branch: " + $Branch)

# ---- Build ----
Write-Step "Building site…"
npm run build

# ---- Preview ----
Write-Step "Starting preview server in a new window…"
Start-Process powershell -ArgumentList "npm run preview"
Start-Process "http://localhost:4173"

Write-Ok "Preview started. Check the site at http://localhost:4173"
Write-Warn "Close the preview window manually when finished. No Git changes were pushed."
