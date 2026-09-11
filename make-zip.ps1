# =========================================================================
# Production ZIP Builder for RSU Livasya Awards (CyberPanel Deployment)
# =========================================================================

$ErrorActionPreference = "Continue"
$zipName = "award-livasya-production.zip"
$destination = Join-Path (Get-Location) $zipName

if (Test-Path $destination) {
    Write-Host "Removing existing $zipName..."
    Remove-Item $destination -Force
}

$stagingDir = Join-Path $env:TEMP "livasya_prod_staging"
if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}
New-Item -ItemType Directory -Path $stagingDir -Force | Out-Null

Write-Host "Copying core application directories..." -ForegroundColor Cyan

# 1. Standard folders
$folders = @("app", "config", "database", "resources", "routes", "vendor")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        Write-Host "  -> Copying $folder..."
        Copy-Item -Path $folder -Destination (Join-Path $stagingDir $folder) -Recurse -Force
    }
}

# 2. Bootstrap (exclude cache files, keep .gitignore)
Write-Host "  -> Preparing bootstrap..."
$bootStaging = Join-Path $stagingDir "bootstrap"
Copy-Item -Path "bootstrap" -Destination $bootStaging -Recurse -Force
$cacheFiles = Get-ChildItem -Path (Join-Path $bootStaging "cache") -File -Exclude ".gitignore" -ErrorAction SilentlyContinue
foreach ($f in $cacheFiles) {
    Remove-Item $f.FullName -Force -ErrorAction SilentlyContinue
}

# 3. Storage directory structure (clean & secure)
Write-Host "  -> Preparing clean storage structure..."
$storageDirs = @(
    "storage/app/public/uploads/categories",
    "storage/app/public/uploads/employees",
    "storage/app/public/uploads/audio",
    "storage/framework/cache/data",
    "storage/framework/sessions",
    "storage/framework/testing",
    "storage/framework/views",
    "storage/logs"
)

foreach ($dir in $storageDirs) {
    $targetDir = Join-Path $stagingDir $dir
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    $gitIgnore = Join-Path $targetDir ".gitignore"
    if (-not (Test-Path $gitIgnore)) {
        Set-Content -Path $gitIgnore -Value "*`n!.gitignore`n"
    }
}

# Copy existing upload assets safely (omitting corrupt/locked files)
Write-Host "  -> Copying upload assets..."
if (Test-Path "storage/app/public/uploads/categories") {
    Copy-Item -Path "storage/app/public/uploads/categories/*" -Destination (Join-Path $stagingDir "storage/app/public/uploads/categories") -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "storage/app/public/uploads/employees") {
    Copy-Item -Path "storage/app/public/uploads/employees/*" -Destination (Join-Path $stagingDir "storage/app/public/uploads/employees") -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "storage/app/public/uploads/audio") {
    Get-ChildItem -Path "storage/app/public/uploads/audio" -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "0M8DSsgkKFIBR7mr8ylN.mp3" } | ForEach-Object {
        try {
            Copy-Item -Path $_.FullName -Destination (Join-Path $stagingDir "storage/app/public/uploads/audio") -Force -ErrorAction Stop
        } catch {
            Write-Warning "Skipped audio file: $($_.Name)"
        }
    }
}

# 4. Public directory (Exclude Windows junction 'storage')
Write-Host "  -> Preparing public folder (with compiled assets & setup-deploy.php)..."
$publicStaging = Join-Path $stagingDir "public"
New-Item -ItemType Directory -Path $publicStaging -Force | Out-Null

Get-ChildItem -Path "public" | Where-Object { $_.Name -ne "storage" } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination (Join-Path $publicStaging $_.Name) -Recurse -Force
}

# 5. Core root files
Write-Host "  -> Copying root configuration files..."
$rootFiles = @(
    "artisan",
    "composer.json",
    "composer.lock",
    "package.json",
    "package-lock.json",
    ".env.example",
    ".htaccess",
    "setup-deploy.php",
    "README.md",
    "DESIGN.md"
)

foreach ($file in $rootFiles) {
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination (Join-Path $stagingDir $file) -Force
    }
}

# 6. Compress with .NET ZipFile for speed and accuracy
Write-Host "Compressing package into $zipName (this may take ~10-20 seconds)..." -ForegroundColor Yellow
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($stagingDir, $destination, [System.IO.Compression.CompressionLevel]::Optimal, $false)

# 7. Clean up staging
Remove-Item $stagingDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "`nSUCCESS! Production ZIP created successfully." -ForegroundColor Green
$item = Get-Item $destination
[PSCustomObject]@{
    FileName = $item.Name
    "Size(MB)" = [math]::Round($item.Length / 1MB, 2)
    FullPath = $item.FullName
    Created = $item.LastWriteTime
} | Format-Table -AutoSize
