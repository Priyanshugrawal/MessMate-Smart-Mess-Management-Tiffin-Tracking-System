@echo off
REM MessMate Database Setup Script for Windows

echo ========================================
echo MessMate Database Setup
echo ========================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 9.4\bin\mysql.exe"
set SCHEMA_FILE=backend\database\schema.sql

echo Checking MySQL installation...
if not exist %MYSQL_PATH% (
    echo ERROR: MySQL not found at %MYSQL_PATH%
    echo Please update MYSQL_PATH in this script with your MySQL installation path
    pause
    exit /b 1
)

echo MySQL found!
echo.
echo This will create the 'messmate' database and all tables.
echo.
echo Please enter your MySQL root password when prompted.
echo (If you have no password, just press Enter)
echo.

%MYSQL_PATH% -u root -p < %SCHEMA_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database setup complete.
    echo ========================================
    echo.
    echo You can now:
    echo 1. Make sure backend/.env has correct DB_PASSWORD
    echo 2. Restart the backend server: cd backend ^&^& npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Database setup failed
    echo ========================================
    echo.
    echo Common fixes:
    echo 1. Check your MySQL root password
    echo 2. Update DB_PASSWORD in backend/.env
    echo 3. Make sure MySQL service is running
    echo.
)

pause
