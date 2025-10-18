@echo off
REM ==========================================================
REM Convert all JPG and PNG images in the current folder to WebP
REM Requires ImageMagick installed and magick.exe available in PATH
REM ==========================================================

echo.
echo ============================================
echo  Converting images in: %cd%
echo ============================================

REM Verify magick.exe exists
where magick >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: ImageMagick not found in PATH.
    echo Please ensure magick.exe is installed and on your PATH.
    pause
    exit /b 1
)

REM Convert JPG and PNG to WebP (quality 85)
for %%f in (*.jpg *.jpeg *.png) do (
    echo Converting: %%f
    magick "%%f" -quality 85 "%%~nf.webp"
)

echo.
echo ============================================
echo  Conversion complete!
echo  WebP files are in: %cd%
echo ============================================
pause
