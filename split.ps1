# Set working directory to the folder containing this script
Set-Location $PSScriptRoot

$inputFile = "rites\book-of-blessings.html"
$filename = "default.txt"
$createdFiles = @{}

if (-not (Test-Path $inputFile)) {
    Write-Error "Could not find $inputFile in $PSScriptRoot"
    exit
}

[System.IO.File]::ReadLines((Resolve-Path $inputFile)) | ForEach-Object {
    if ($_ -match "<!--\s*SPLIT\s+(.+)\s*-->") {
        # Sanitize title to prevent invalid Windows filename errors
        $cleanTitle = $Matches[1].Trim() -replace '[\\/:*?"<>|]', '_'
        $filename = "rites\$cleanTitle.html"
        Write-Host ">>> SPLIT TRIGGERED! New target file: $filename" -ForegroundColor Green
    }

    # Overwrite/clear target file on its first write of this execution
    if (-not $createdFiles.ContainsKey($filename)) {
        $_ | Out-File -FilePath $filename -Encoding utf8 -Force
        $createdFiles[$filename] = $true
    } else {
        $_ | Out-File -Append -FilePath $filename -Encoding utf8
    }
}

Write-Host "Done splitting files."