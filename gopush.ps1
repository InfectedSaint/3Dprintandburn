# gopush.ps1
param (
    [string]$Message = "Update 3D Print & Burn site"
)

Write-Host "[INFO] Checking changes..." -ForegroundColor Cyan
git status

Write-Host "[INFO] Adding changes..." -ForegroundColor Yellow
git add .

Write-Host "[INFO] Committing changes..." -ForegroundColor Green
git commit -m "$Message"

Write-Host "[INFO] Pushing to GitHub (origin/main)..." -ForegroundColor Magenta
git push origin main

Write-Host "[SUCCESS] Done! Changes pushed to 3D Print & Burn repo." -ForegroundColor Cyan
