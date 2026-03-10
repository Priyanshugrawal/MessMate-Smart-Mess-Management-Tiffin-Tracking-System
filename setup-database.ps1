# MessMate Database Setup
$ErrorActionPreference = "Stop"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "     MessMate Database Setup" -ForegroundColor Cyan  
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$mysqlExe = "C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"
$schemaPath = "backend\database\schema.sql"

# Check files exist
if (-not (Test-Path $mysqlExe)) {
    Write-Host "ERROR: MySQL not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $schemaPath)) {
    Write-Host "ERROR: Schema file not found!" -ForegroundColor Red
    exit 1
}

# Get password
Write-Host "Enter your MySQL root password:" -ForegroundColor Yellow
$password = Read-Host -AsString
Write-Host ""

try {
    Write-Host "Setting up database..." -ForegroundColor Yellow
    
    # Set password in environment variable
    $env:MYSQL_PWD = $password
    
    # Run MySQL
    & $mysqlExe -u root --execute="SOURCE $schemaPath"
    
    # Clean up
    Remove-Item Env:\MYSQL_PWD
    
    Write-Host ""
    Write-Host "SUCCESS! Database created." -ForegroundColor Green
    Write-Host ""
    Write-Host "Now update backend\.env with:" -ForegroundColor Cyan
    Write-Host "DB_PASSWORD=$password" -ForegroundColor Yellow
    Write-Host ""
    
    # Ask to update .env
    $update = Read-Host "Update backend\.env automatically? (y/n)"
    if ($update -eq 'y') {
        $envFile = "backend\.env"
        (Get-Content $envFile) -replace '^DB_PASSWORD=.*', "DB_PASSWORD=$password" | Set-Content $envFile
        Write-Host "Done!" -ForegroundColor Green
    }
    
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Check your password and try again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
pause
