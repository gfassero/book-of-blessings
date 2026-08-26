@echo off
setlocal enabledelayedexpansion

for %%F in ("working\*") do (
    if exist "%%F" (
        type "header.html" > "docs\%%~nxF"
        type "%%F" >> "docs\%%~nxF"
        echo. >> "docs\%%~nxF"
        type "footer.html" >> "docs\%%~nxF"
    )
)

echo Processing complete.