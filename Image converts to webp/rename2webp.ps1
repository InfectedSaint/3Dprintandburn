# rename2webp.ps1
# Reads a list of filenames, converts to .webp, outputs lines like:
#   "name.webp",
# with NO trailing comma on the last line.

param(
  [string]$InputFile = "filenames.txt",
  [string]$OutputFile = "webp_filenames.txt"
)

if (!(Test-Path -LiteralPath $InputFile)) {
  Write-Host "Input file not found: $InputFile" -ForegroundColor Red
  exit 1
}

# Read all non-empty lines
$lines = Get-Content -LiteralPath $InputFile | Where-Object { $_ -match '\S' }

# Convert each line to a clean .webp filename
$converted = $lines | ForEach-Object {
  $s = $_.Trim()

  # remove trailing comma and surrounding quotes (if present)
  if ($s.EndsWith(",")) { $s = $s.Substring(0, $s.Length - 1) }
  if ($s.StartsWith('"') -and $s.EndsWith('"') -and $s.Length -ge 2) {
    $s = $s.Substring(1, $s.Length - 2)
  }

  # keep only filename (strip any path)
  $s = Split-Path -Leaf $s

  if ($s -match '\S') {
    ([System.IO.Path]::GetFileNameWithoutExtension($s)) + ".webp"
  }
}

if (-not $converted -or $converted.Count -eq 0) {
  Write-Host "No valid filenames found in $InputFile" -ForegroundColor Yellow
  exit 0
}

# Format as lines with quotes; last line without trailing comma
$formatted = for ($i = 0; $i -lt $converted.Count; $i++) {
  if ($i -lt ($converted.Count - 1)) {
    '  "{0}",' -f $converted[$i]
  } else {
    '  "{0}"' -f $converted[$i]
  }
}

Set-Content -LiteralPath $OutputFile -Value $formatted -Encoding UTF8
Write-Host "✅ Wrote $($converted.Count) lines to: $OutputFile" -ForegroundColor Green
