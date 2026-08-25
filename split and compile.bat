@echo off
setlocal enabledelayedexpansion

powershell.exe -ExecutionPolicy Bypass -File "split.ps1"

for %%F in ("rites\*") do (
    if exist "%%F" (
        type "header.html" > "book-of-blessings\%%~nxF"
        type "%%F" >> "book-of-blessings\%%~nxF"
        echo. >> "book-of-blessings\%%~nxF"
        type "footer.html" >> "book-of-blessings\%%~nxF"
    )
)

echo Processing complete.