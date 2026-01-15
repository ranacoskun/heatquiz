# HeatQuiz Application - Complete Setup Guide for Windows

Heat quiz application developed by Institute of Heat and Mass Transfer [(Institut für Wärme- und Stoffübertragung WSA)](https://www.wsa.rwth-aachen.de/go/id/gkct/?lidx=1) of RWTH Aachen University.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Installation Instructions](#installation-instructions-windows)
   - [Install Required Software](#step-1-install-required-software)
   - [Choose Installation Method](#step-2-choose-installation-method)
   - [Verify Installations](#step-3-verify-installations)
3. [Project Setup and Running Instructions](#project-setup-and-running-instructions-windows)
   - [Database Setup](#step-1-database-setup)
   - [QuizAPI Setup](#step-2-setup-quizapi-net-core-backend)
   - [React App Setup](#step-3-setup-react-frontend-hqworkheatquizapp)
   - [Run Applications](#step-4-run-the-applications)
4. [Quick Start](#quick-start-summary)
5. [Detailed Setup Instructions](#detailed-setup-instructions-windows)
6. [Troubleshooting](#troubleshooting-windows-specific)
7. [Common Commands](#common-commands)
8. [Technology Stack](#technology-stack)

---

## Project Overview

This project consists of:
- **QuizAPI**: A .NET Core 2.0 backend API with ASP.NET Core and Angular 4 frontend
- **hqwork/heatquizapp**: A React 18 frontend application
- **Database**: PostgreSQL database with schema provided in `db_16_10_2025_full.sql`

**Quick Start:** If you're experienced with Windows development, jump to [Quick Start](#quick-start-summary). For first-time setup, follow the [Installation Instructions](#installation-instructions-windows) first.

---

## Installation Instructions (Windows)

### Step 1: Install Required Software

Before setting up the project, you need to install the following software on your Windows machine:

#### Required Software
1. **Node.js** (v14+ recommended for React app, v8.0+ for QuizAPI) - [Download](https://nodejs.org/)
2. **.NET Core 2.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/2.0)
3. **PostgreSQL** (v10+) - [Download](https://www.postgresql.org/download/)
4. **npm** (comes with Node.js) or **yarn**
5. **Git** (for cloning repositories) - [Download](https://git-scm.com/download/win)

### Step 2: Choose Installation Method

Choose one of the following methods to install the required software:

#### Option 1: Using Chocolatey (Recommended for Windows)

Chocolatey is a Windows package manager that makes installation easy. Follow these steps:

**1. Install Chocolatey:**

Open PowerShell as Administrator (Right-click PowerShell → Run as Administrator) and run:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**2. Install all required software:**

```powershell
# Install Node.js (includes npm)
choco install nodejs -y

# Install .NET Core 2.0 SDK
choco install dotnetcore-sdk --version=2.0.0 -y

# Install PostgreSQL (with default password: 123456)
choco install postgresql -y --params '/Password:123456'

# Install Git (if not already installed)
choco install git -y
```

**3. Verify installations:**

```powershell
# Check Node.js installation
node --version
npm --version

# Check .NET Core installation
dotnet --version

# Check PostgreSQL installation
psql --version

# Check Git installation
git --version
```

#### Option 2: Using Windows Package Manager (winget)

If you have Windows 10+ with winget installed:

```powershell
# Install Node.js
winget install OpenJS.NodeJS

# Install .NET Core 2.0 SDK (Note: winget may not have 2.0, use manual install or Chocolatey)
winget install Microsoft.DotNet.SDK.2.0

# Install PostgreSQL
winget install PostgreSQL.PostgreSQL
```

**Note:** .NET Core 2.0 may not be available via winget. Use Chocolatey or manual installation instead.

### Option 3: Using Command Line Installers

#### Install Node.js
```powershell
# Download and install Node.js (latest LTS)
# Using PowerShell
$NodeUrl = "https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"
$Output = "$env:TEMP\nodejs-installer.msi"
Invoke-WebRequest -Uri $NodeUrl -OutFile $Output
msiexec.exe /i $Output /qb
```

#### Install .NET Core 2.0 SDK
```powershell
# Download .NET Core 2.0 SDK
$DotNetUrl = "https://dot.net/v1/dotnet-install.ps1"
$DotNetScript = "$env:TEMP\dotnet-install.ps1"
Invoke-WebRequest -Uri $DotNetUrl -OutFile $DotNetScript
& $DotNetScript -Channel 2.0 -Version latest
```

#### Install PostgreSQL
```powershell
# Download PostgreSQL installer
$PgUrl = "https://get.enterprisedb.com/postgresql/postgresql-15-windows-x64.exe"
$Output = "$env:TEMP\postgresql-installer.exe"
Invoke-WebRequest -Uri $PgUrl -OutFile $Output

# Run installer (unattended mode)
& $Output --unattend --superpassword 123456 --serverport 5432
```

### Step 3: Verify Installations

After installation, verify everything is working:

```powershell
# Check Node.js installation
node --version
npm --version

# Check .NET Core installation
dotnet --version
dotnet --info

# Check PostgreSQL installation
psql --version

# Test PostgreSQL connection
psql -U postgres -c "SELECT version();"
```

If any command fails, restart your terminal/PowerShell and try again. If issues persist, see the Troubleshooting section below.

---

## Project Setup and Running Instructions (Windows)

### Step 1: Database Setup

**1.1. Create the PostgreSQL Database**

Open PowerShell and run:

```powershell
# Create QUIZDB database
psql -U postgres -c "CREATE DATABASE QUIZDB;"
```

If you get a password prompt, enter the password you set during PostgreSQL installation (default: `123456`).

**1.2. Import the Database Schema**

Navigate to the project root directory and import the SQL file:

```powershell
# Navigate to project root (adjust path as needed)
cd "C:\Users\RanaCoskun\Downloads\HQ"

# Import the database schema
psql -U postgres -d QUIZDB -f "db_16_10_2025_full.sql"
```

**Alternative: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → Create → Database
4. Name it `QUIZDB`
5. Right-click on `QUIZDB` → Restore
6. Select `db_16_10_2025_full.sql` file
7. Click "Restore"

**1.3. Verify Database Connection**

The connection string in `appsettings.json` should be:
```
Server=localhost;Port=5432;Database=QUIZDB;User Id=postgres;Password=123456;
```

If you used a different password, update it in `QuizAPI\QuizAPI\appsettings.json`.

---

### Step 2: Setup QuizAPI (.NET Core Backend)

**2.1. Navigate to QuizAPI Project**

```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"
```

**2.2. Restore .NET Dependencies**

```powershell
dotnet restore
```

**2.3. Install Frontend Dependencies (Angular 4)**

```powershell
npm install
```

This will install all Angular 4 and frontend dependencies.

**2.4. Build the Project**

```powershell
dotnet build
```

This will compile the C# backend and bundle the Angular frontend.

---

### Step 3: Setup React Frontend (hqwork/heatquizapp)

**3.1. Navigate to React App Directory**

```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
```

**3.2. Install Dependencies**

```powershell
npm install
```

**3.3. Build the React App (Optional - for production)**

```powershell
npm run build
```

---

### Step 4: Run the Applications

#### Running QuizAPI (Backend + Angular Frontend)

**Option A: Using dotnet CLI (Recommended)**

```powershell
# Navigate to QuizAPI project
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"

# Run the application
dotnet run
```

The application will start on: `http://167.86.98.171:6001` (or the URL configured in `Program.cs`)

**Option B: Using Visual Studio**

1. Open `QuizAPI\QuizAPI.sln` in Visual Studio
2. Set `QuizAPI` as the startup project
3. Press `F5` or click "Start Debugging"
4. The application will launch in your default browser

#### Running React Frontend (hqwork/heatquizapp)

Open a new PowerShell window:

```powershell
# Navigate to React app
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"

# Start the development server
npm start
```

The React app will start on: `http://localhost:3000` (default React port)

**Note:** Make sure the QuizAPI backend is running if the React app needs to connect to it.

---

## Quick Start Summary

**For first-time setup, follow these steps in order:**

1. ✅ **Install Required Software** (see Installation Instructions above)
2. ✅ **Setup Database** (create QUIZDB and import schema)
3. ✅ **Setup QuizAPI** (restore .NET packages and npm packages)
4. ✅ **Setup React App** (optional, install npm packages)
5. ✅ **Run Applications** (start backend and frontend)

**Estimated time:** 30-60 minutes (depending on download speeds)

---

## Quick Start Commands (Windows PowerShell)

**Prerequisites:** Ensure all software is installed (see Installation Instructions above)

### Complete Setup Script

Copy and paste this entire script into PowerShell (run as Administrator if needed):

```powershell
# Set project root path (adjust as needed)
$ProjectRoot = "C:\Users\RanaCoskun\Downloads\HQ"
$QuizAPIPath = "$ProjectRoot\QuizAPI\QuizAPI"
$ReactAppPath = "$ProjectRoot\hqwork\hqwork\heatquizapp"

# Step 1: Database Setup
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Step 1: Setting up Database" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Create QUIZDB database (if it doesn't exist)
Write-Host "Creating QUIZDB database..." -ForegroundColor Yellow
psql -U postgres -c "CREATE DATABASE QUIZDB;" 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully!" -ForegroundColor Green
} else {
    Write-Host "Database may already exist or there was an error." -ForegroundColor Yellow
}

# Import database schema
Write-Host "Importing database schema..." -ForegroundColor Yellow
$SqlFile = "$ProjectRoot\db_16_10_2025_full.sql"
if (Test-Path $SqlFile) {
    psql -U postgres -d QUIZDB -f $SqlFile
    Write-Host "Database schema imported!" -ForegroundColor Green
} else {
    Write-Host "SQL file not found at: $SqlFile" -ForegroundColor Red
}

# Step 2: QuizAPI Setup
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Step 2: Setting up QuizAPI" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Set-Location $QuizAPIPath

Write-Host "Restoring .NET packages..." -ForegroundColor Yellow
dotnet restore

Write-Host "Installing npm packages..." -ForegroundColor Yellow
npm install

Write-Host "Building project..." -ForegroundColor Yellow
dotnet build

# Step 3: React App Setup (Optional)
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Step 3: Setting up React App (Optional)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

if (Test-Path $ReactAppPath) {
    Set-Location $ReactAppPath
    Write-Host "Installing React app dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "React app setup complete!" -ForegroundColor Green
} else {
    Write-Host "React app path not found, skipping..." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTo run QuizAPI:" -ForegroundColor Cyan
Write-Host "  cd `"$QuizAPIPath`"" -ForegroundColor White
Write-Host "  dotnet run" -ForegroundColor White
Write-Host "`nTo run React App:" -ForegroundColor Cyan
Write-Host "  cd `"$ReactAppPath`"" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
```

### Manual Step-by-Step Commands

If you prefer to run commands manually:

**1. Database Setup:**
```powershell
# Navigate to project root
cd "C:\Users\RanaCoskun\Downloads\HQ"

# Create QUIZDB database
psql -U postgres -c "CREATE DATABASE QUIZDB;"

# Import the database schema
psql -U postgres -d QUIZDB -f "db_16_10_2025_full.sql"
```

**2. QuizAPI Setup:**
```powershell
# Navigate to QuizAPI project
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"

# Restore .NET dependencies
dotnet restore

# Install frontend npm packages
npm install

# Build the project
dotnet build
```

**3. React App Setup (Optional):**
```powershell
# Navigate to React app
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"

# Install dependencies
npm install
```

**4. Run Applications:**

**Terminal 1 - QuizAPI:**
```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"
dotnet run
```
The application will be available at: **http://167.86.98.171:6001**

**Terminal 2 - React App (if needed):**
```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
npm start
```
The React app will be available at: **http://localhost:3000**

---

## Detailed Setup Instructions (Windows)

> **Note:** If you've already completed the Quick Start section above, you can skip this detailed section. This provides more in-depth explanations.

### Database Setup Details

#### Verify PostgreSQL Service is Running

Before creating the database, ensure PostgreSQL service is running:

```powershell
# Check PostgreSQL service status
Get-Service -Name postgresql*

# If stopped, start it
Start-Service postgresql-x64-15  # Adjust version number as needed
```

#### Create Database Using Command Line

```powershell
# Connect to PostgreSQL and create database
psql -U postgres -c "CREATE DATABASE QUIZDB;"

# Verify database was created
psql -U postgres -c "\l" | findstr QUIZDB
```

#### Import Schema - Detailed Steps

**Method 1: Using psql (Command Line)**
```powershell
# Navigate to project root
cd "C:\Users\RanaCoskun\Downloads\HQ"

# Import schema (you'll be prompted for password)
psql -U postgres -d QUIZDB -f "db_16_10_2025_full.sql"

# Or set password as environment variable to avoid prompts
$env:PGPASSWORD = "123456"
psql -U postgres -d QUIZDB -f "db_16_10_2025_full.sql"
```

**Method 2: Using pgAdmin (GUI)**
1. Open pgAdmin (installed with PostgreSQL)
2. Connect to your PostgreSQL server (localhost)
3. Expand "Databases" → Right-click → Create → Database
4. Name: `QUIZDB` → Save
5. Right-click on `QUIZDB` → Restore
6. Filename: Browse to `db_16_10_2025_full.sql`
7. Click "Restore"

#### Verify Database Connection String

Check `QuizAPI\QuizAPI\appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=QUIZDB;User Id=postgres;Password=123456;"
  }
}
```

Update the password if you used a different one during PostgreSQL installation.

### QuizAPI Project Setup Details

#### Understanding the Project Structure

```
QuizAPI/
├── QuizAPI/              # Main project folder
│   ├── ClientApp/        # Angular 4 frontend
│   ├── Controllers/      # API endpoints
│   ├── Models/          # Data models
│   ├── Services/        # Business logic
│   ├── Data/            # Database context
│   ├── appsettings.json # Configuration
│   └── Program.cs       # Application entry point
└── QuizAPI.sln          # Solution file
```

#### Install Dependencies - What Happens

**1. .NET Dependencies (`dotnet restore`):**
- Downloads NuGet packages (Entity Framework, ASP.NET Core, etc.)
- Stores them in `~/.nuget/packages` (user profile)
- Creates `obj/project.assets.json` with dependency graph

**2. npm Dependencies (`npm install`):**
- Downloads Node.js packages (Angular, Webpack, TypeScript, etc.)
- Creates `node_modules` folder (can be large, ~500MB+)
- Creates `package-lock.json` with exact versions

**3. Build Process (`dotnet build`):**
- Compiles C# code to DLLs
- Runs Webpack to bundle Angular frontend
- Outputs to `bin/Debug/netcoreapp2.0/`

#### Verify Installation

```powershell
# Check .NET version
dotnet --version

# Check npm version
npm --version

# Check if Angular is installed
npm list @angular/core

# Check project structure
Get-ChildItem -Recurse -Directory | Select-Object FullName
```

### React App Setup Details

#### Understanding the React App Structure

```
hqwork/hqwork/heatquizapp/
├── src/              # React source code
│   ├── Pages/       # Page components
│   ├── Components/  # Reusable components
│   └── services/    # API services
├── public/          # Static files
├── package.json     # Dependencies
└── package-lock.json
```

#### Install Dependencies

```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
npm install
```

This installs React 18, Ant Design, and other dependencies listed in `package.json`.

### Building the Projects

#### Build QuizAPI

```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"
dotnet build
```

**What happens:**
- Compiles C# backend code
- Runs Webpack to bundle Angular frontend
- Outputs to `bin/Debug/netcoreapp2.0/`

#### Build React App (Production)

```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
npm run build
```

**What happens:**
- Compiles TypeScript/JSX to JavaScript
- Minifies and optimizes code
- Outputs to `build/` folder

### Running the Projects

#### Running QuizAPI

**Development Mode:**
```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"
dotnet run
```

**Production Mode:**
```powershell
dotnet run --configuration Release
```

**Change Port/URL:**
Edit `QuizAPI\QuizAPI\Program.cs`:
```csharp
.UseUrls("http://localhost:5000")  // Change port here
```

#### Running React App

**Development Mode (with hot reload):**
```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
npm start
```

Opens browser automatically at `http://localhost:3000`

**Production Mode:**
```powershell
npm run build
# Then serve the build folder using a static server
```

#### Running Both Applications

You need **two PowerShell windows**:

**Window 1 - Backend:**
```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"
dotnet run
```

**Window 2 - Frontend:**
```powershell
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
npm start
```

## Application Structure

```
QuizAPI/
├── ClientApp/           # Angular frontend application
│   ├── app/            # Angular components and services
│   ├── boot.browser.ts # Browser entry point
│   └── boot.server.ts  # Server-side rendering entry point
├── Controllers/        # ASP.NET Core API endpoints
├── Models/            # Data models
├── Services/          # Business logic services
├── Data/              # Entity Framework Core DbContext
├── Migrations/        # Database migrations
├── Views/             # Server-side views
├── wwwroot/           # Static files (CSS, JavaScript, images)
└── Properties/        # Project configuration
```

## Configuration Files

### appsettings.json
Main configuration file with database connection string:
- **Database**: QUIZDB on localhost:5432
- **User**: postgres
- **Password**: 123456 (change if different)

### appsettings.Development.json
Development-specific settings

### package.json
Frontend dependencies and build scripts for Angular application

### QuizAPI.csproj
.NET project configuration and backend dependencies

### tsconfig.json
TypeScript compiler configuration for the Angular frontend

## Development Workflow

### Making Frontend Changes (Angular)
1. Edit files in `ClientApp/app/`
2. Changes are automatically compiled by webpack during development
3. Refresh the browser to see changes

### Making Backend Changes (.NET)
1. Edit files in `Controllers/`, `Services/`, or `Models/`
2. Stop the running application (`Ctrl+C`)
3. Run `dotnet run` again

### Database Schema Changes
1. Create or modify your models in `Models/`
2. Create a migration:
   ```bash
   dotnet ef migrations add MigrationName
   ```
3. Apply migration:
   ```bash
   dotnet ef database update
   ```

## Troubleshooting (Windows-Specific)

### Installation Issues

**Problem: "Command not found" after installation**
```powershell
# Refresh environment variables without restarting
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Close and reopen PowerShell/terminal
```

**Problem: PostgreSQL password prompt keeps appearing**
```powershell
# Set PostgreSQL password (if not set during installation)
psql -U postgres -c "ALTER USER postgres WITH PASSWORD '123456';"

# Or set environment variable to avoid prompts
$env:PGPASSWORD = "123456"
```

**Problem: Chocolatey installation fails**
```powershell
# Uninstall and retry
choco uninstall nodejs -y
choco install nodejs -y

# Or use manual installation (Option 3)
```

### Database Connection Issues

**Problem: "Connection refused" error**
- Ensure PostgreSQL service is running:
  ```powershell
  # Check if PostgreSQL service is running
  Get-Service -Name postgresql*
  
  # Start PostgreSQL service if stopped
  Start-Service postgresql-x64-15  # Adjust version number as needed
  ```
- Check connection string in `QuizAPI\QuizAPI\appsettings.json`
- Verify QUIZDB database exists:
  ```powershell
  psql -U postgres -c "\l" | findstr QUIZDB
  ```

**Problem: "Database QUIZDB does not exist"**
```powershell
# Create the database
psql -U postgres -c "CREATE DATABASE QUIZDB;"
```

### Port Issues

**Problem: Port already in use (6001)**
- Find what's using the port:
  ```powershell
  netstat -ano | findstr :6001
  ```
- Kill the process (replace `<PID>` with the process ID from above):
  ```powershell
  taskkill /PID <PID> /F
  ```
- Or change the port in `QuizAPI\QuizAPI\Program.cs`:
  ```csharp
  .UseUrls("http://localhost:5000")
  ```

**Problem: Port 3000 already in use (React app)**
- The React app will automatically try the next available port (3001, 3002, etc.)
- Or kill the process using port 3000:
  ```powershell
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### npm and Node.js Issues

**Problem: npm modules not found**
```powershell
# Navigate to project directory
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

**Problem: "openssl-legacy-provider" error (React app)**
- This is already handled in `package.json` scripts with `NODE_OPTIONS=--openssl-legacy-provider`
- If you still get the error:
  1. Ensure you're using Node.js v14+:
     ```powershell
     node --version
     ```
  2. Or set the environment variable manually:
     ```powershell
     $env:NODE_OPTIONS = "--openssl-legacy-provider"
     npm start
     ```
  3. Or update `package.json` scripts to use PowerShell syntax:
     ```json
     "start": "$env:NODE_OPTIONS='--openssl-legacy-provider'; react-scripts start"
     ```

**Problem: npm install fails with permission errors**
```powershell
# Run PowerShell as Administrator
# Or clear npm cache and retry
npm cache clean --force
npm install
```

### .NET Build Errors

**Problem: .NET build errors**
```powershell
# Navigate to QuizAPI project
cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"

# Clean build artifacts
dotnet clean

# Restore dependencies
dotnet restore

# Rebuild
dotnet build
```

**Problem: "dotnet command not found"**
- Ensure .NET Core SDK is installed and PATH is updated
- Restart PowerShell/terminal
- Verify installation:
  ```powershell
  dotnet --version
  ```

### TypeScript Compilation Errors

**Problem: TypeScript compilation errors**
```powershell
# Check TypeScript version
npm list typescript

# Rebuild
npm run build

# Or for React app
cd "C:\Users\RanaCoskun\Downloads\HQ\hqwork\hqwork\heatquizapp"
npm run build
```

### Path Issues

**Problem: Path contains spaces or special characters**
- Ensure paths are quoted in PowerShell:
  ```powershell
  cd "C:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI"
  ```
- Avoid spaces in project path if possible

**Problem: Long path names (Windows limitation)**
- Enable long path support in Windows:
  1. Open Group Policy Editor (`gpedit.msc`)
  2. Navigate to: Computer Configuration → Administrative Templates → System → Filesystem
  3. Enable "Enable Win32 long paths"
  4. Restart computer

## Common Commands

| Command | Description |
|---------|-------------|
| `dotnet restore` | Restore .NET dependencies |
| `npm install` | Install frontend dependencies |
| `dotnet build` | Build .NET project |
| `npm run build` | Build frontend (Angular) |
| `dotnet run` | Run the application |
| `dotnet test` | Run tests |
| `npm test` | Run frontend tests |
| `dotnet ef migrations add Name` | Create database migration |
| `dotnet ef database update` | Apply pending migrations |

## Complete Command Reference

### Database Commands
```bash
# Create the QUIZDB database
psql -U postgres -c "CREATE DATABASE QUIZDB;"

# Import SQL schema
psql -U postgres -d QUIZDB -f db_16_10_2025_full.sql

# Connect to the database (interactive mode)
psql -U postgres -d QUIZDB

# Drop database (if needed)
psql -U postgres -c "DROP DATABASE QUIZDB;"

# List all databases
psql -U postgres -c "\l"
```

### .NET / Backend Commands
```bash
# Navigate to project directory
cd c:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI

# Restore all NuGet packages
dotnet restore

# Clean build artifacts
dotnet clean

# Build the project (Debug)
dotnet build

# Build the project (Release)
dotnet build -c Release

# Run the application
dotnet run

# Run the application with specific configuration
dotnet run --configuration Release

# Publish for deployment
dotnet publish -c Release

# Add Entity Framework migration
dotnet ef migrations add InitialCreate

# Update database with migrations
dotnet ef database update

# Revert last migration
dotnet ef migrations remove

# View migration history
dotnet ef migrations list

# Drop database
dotnet ef database drop

# Create database
dotnet ef database update

# Run tests
dotnet test

# List installed packages
dotnet list package
```

### Frontend / NPM Commands
```bash
# Navigate to project directory
cd c:\Users\RanaCoskun\Downloads\HQ\QuizAPI\QuizAPI

# Install all npm packages (from package.json)
npm install

# Update npm packages to latest versions
npm update

# Install a specific package
npm install package-name

# Install a package as dev dependency
npm install --save-dev package-name

# Remove a package
npm remove package-name

# Build the Angular frontend
npm run build

# Run tests
npm test

# List installed packages
npm list

# Check for package vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Clear npm cache
npm cache clean --force

# Check package versions
npm outdated
```

### TypeScript Commands
```bash
# Check TypeScript version
tsc --version

# Compile TypeScript to JavaScript
tsc

# Compile with watch mode (auto-recompile on changes)
tsc --watch

# Check for TypeScript errors
npx tsc --noEmit
```

### Complete Setup Scripts

#### PowerShell Script (Recommended)

Save as `setup.ps1` in the project root:

```powershell
# HeatQuiz Setup Script for Windows
# Run: .\setup.ps1

param(
    [string]$ProjectRoot = "C:\Users\RanaCoskun\Downloads\HQ",
    [string]$PostgresPassword = "123456"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Green
Write-Host "HeatQuiz Setup Script" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Set PostgreSQL password environment variable
$env:PGPASSWORD = $PostgresPassword

# Step 1: Database Setup
Write-Host "`n[1/4] Setting up Database..." -ForegroundColor Cyan
Set-Location $ProjectRoot

Write-Host "  Creating QUIZDB database..." -ForegroundColor Yellow
try {
    psql -U postgres -c "CREATE DATABASE QUIZDB;" 2>$null
    Write-Host "  ✓ Database created" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Database may already exist" -ForegroundColor Yellow
}

$SqlFile = Join-Path $ProjectRoot "db_16_10_2025_full.sql"
if (Test-Path $SqlFile) {
    Write-Host "  Importing database schema..." -ForegroundColor Yellow
    psql -U postgres -d QUIZDB -f $SqlFile
    Write-Host "  ✓ Schema imported" -ForegroundColor Green
} else {
    Write-Host "  ✗ SQL file not found: $SqlFile" -ForegroundColor Red
    exit 1
}

# Step 2: QuizAPI Setup
Write-Host "`n[2/4] Setting up QuizAPI..." -ForegroundColor Cyan
$QuizAPIPath = Join-Path $ProjectRoot "QuizAPI\QuizAPI"
Set-Location $QuizAPIPath

Write-Host "  Restoring .NET packages..." -ForegroundColor Yellow
dotnet restore
Write-Host "  ✓ .NET packages restored" -ForegroundColor Green

Write-Host "  Installing npm packages..." -ForegroundColor Yellow
npm install
Write-Host "  ✓ npm packages installed" -ForegroundColor Green

Write-Host "  Building project..." -ForegroundColor Yellow
dotnet build
Write-Host "  ✓ Project built" -ForegroundColor Green

# Step 3: React App Setup
Write-Host "`n[3/4] Setting up React App..." -ForegroundColor Cyan
$ReactAppPath = Join-Path $ProjectRoot "hqwork\hqwork\heatquizapp"
if (Test-Path $ReactAppPath) {
    Set-Location $ReactAppPath
    Write-Host "  Installing npm packages..." -ForegroundColor Yellow
    npm install
    Write-Host "  ✓ React app setup complete" -ForegroundColor Green
} else {
    Write-Host "  ⚠ React app path not found, skipping..." -ForegroundColor Yellow
}

# Step 4: Summary
Write-Host "`n[4/4] Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nTo run QuizAPI:" -ForegroundColor Cyan
Write-Host "  cd `"$QuizAPIPath`"" -ForegroundColor White
Write-Host "  dotnet run" -ForegroundColor White
Write-Host "`nTo run React App:" -ForegroundColor Cyan
Write-Host "  cd `"$ReactAppPath`"" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
```

#### Batch Script (Alternative)

Save as `setup.bat`:

```batch
@echo off
setlocal enabledelayedexpansion

set PROJECT_ROOT=C:\Users\RanaCoskun\Downloads\HQ
set POSTGRES_PASSWORD=123456

echo ========================================
echo HeatQuiz Setup Script
echo ========================================
echo.

cd /d "%PROJECT_ROOT%"

echo [1/4] Setting up Database...
echo   Creating QUIZDB database...
psql -U postgres -c "CREATE DATABASE QUIZDB;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   Database created successfully
) else (
    echo   Database may already exist
)

echo   Importing database schema...
psql -U postgres -d QUIZDB -f "db_16_10_2025_full.sql"
if %ERRORLEVEL% EQU 0 (
    echo   Schema imported successfully
) else (
    echo   Error importing schema
    pause
    exit /b 1
)

echo.
echo [2/4] Setting up QuizAPI...
cd /d "%PROJECT_ROOT%\QuizAPI\QuizAPI"

echo   Restoring .NET packages...
dotnet restore
if %ERRORLEVEL% NEQ 0 (
    echo   Error restoring .NET packages
    pause
    exit /b 1
)

echo   Installing npm packages...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo   Error installing npm packages
    pause
    exit /b 1
)

echo   Building project...
dotnet build
if %ERRORLEVEL% NEQ 0 (
    echo   Error building project
    pause
    exit /b 1
)

echo.
echo [3/4] Setting up React App...
cd /d "%PROJECT_ROOT%\hqwork\hqwork\heatquizapp"
if exist "%PROJECT_ROOT%\hqwork\hqwork\heatquizapp" (
    echo   Installing npm packages...
    call npm install
    if %ERRORLEVEL% EQU 0 (
        echo   React app setup complete
    )
) else (
    echo   React app path not found, skipping...
)

echo.
echo [4/4] Setup Complete!
echo ========================================
echo.
echo To run QuizAPI:
echo   cd "%PROJECT_ROOT%\QuizAPI\QuizAPI"
echo   dotnet run
echo.
echo To run React App:
echo   cd "%PROJECT_ROOT%\hqwork\hqwork\heatquizapp"
echo   npm start
echo.
pause
```

### Development Commands

#### Hot Reload Frontend (Development)
```bash
# In one terminal, watch for TypeScript changes
npm run build -- --watch

# In another terminal, run the application
dotnet run
```

#### Debug Mode
```bash
# Run with debug flag
dotnet run --configuration Debug

# Or in Visual Studio, press F5
```

#### Watch for Changes
```bash
# Watch TypeScript files for changes and recompile
tsc --watch

# Or with webpack (if configured)
npm run build -- --watch
```

### Cleaning Up Commands

```bash
# Remove node_modules (to free space or reset npm)
rmdir /s /q node_modules
# Or: Remove-Item -Recurse -Force node_modules (PowerShell)

# Clean .NET build artifacts
dotnet clean

# Remove bin and obj directories
rmdir /s /q bin obj
# Or: Remove-Item -Recurse -Force bin, obj (PowerShell)

# Clear npm cache
npm cache clean --force

# Reset npm to default state
npm ci

# Delete node_modules and reinstall (fresh install)
rmdir /s /q node_modules & npm install
```

### Troubleshooting Commands

```bash
# Check .NET version
dotnet --version

# Check Node.js version
node --version

# Check npm version
npm --version

# Check TypeScript version
npx tsc --version

# Check PostgreSQL version (from psql)
psql --version

# Verify PostgreSQL connection
psql -U postgres -c "SELECT version();"

# List all PostgreSQL databases
psql -U postgres -c "\l"

# Check if port 6001 is in use (Windows)
netstat -ano | findstr :6001

# Kill process on port 6001 (Windows)
taskkill /PID <PID> /F

# Verify .NET installation
dotnet --info

# Check installed NuGet packages
dotnet list package

# Find global npm packages
npm list -g --depth=0

# Verify package.json integrity
npm ci

# Check project structure
tree /F
# Or in PowerShell: Get-ChildItem -Recurse
```


## Technology Stack

### Backend
- **.NET Core 2.0** - Web framework
- **ASP.NET Core** - Web API
- **Entity Framework Core 2.1** - ORM
- **PostgreSQL 10+** - Database
- **AutoMapper** - Object mapping
- **Newtonsoft.Json** - JSON serialization
- **RestSharp** - HTTP client

### Frontend
- **Angular 4** - UI framework
- **TypeScript 2.4** - Programming language
- **Webpack 2** - Module bundler
- **Bootstrap 3** - CSS framework
- **RxJS 5** - Reactive programming

## API Endpoints

The API is located at `http://167.86.98.171:6001/api/`

Key controllers:
- `/api/account` - User authentication
- `/api/questions` - Question management
- `/api/courses` - Course management
- `/api/statistics` - Statistics and reporting

For detailed API documentation, see the [Controllers](QuizAPI/Controllers/) folder.

## Performance Tips

1. **Development Build**: Use `npm run build -- --watch` for automatic rebuilds
2. **Production Build**: Ensure minification is enabled in webpack config
3. **Database**: Create indexes on frequently queried columns
4. **Caching**: Enable HTTP caching for static files in production

## Deployment

### To Production
1. Build release version:
   ```bash
   dotnet build -c Release
   ```

2. Publish:
   ```bash
   dotnet publish -c Release
   ```

3. Update `appsettings.json` with production database credentials
4. Deploy to your hosting environment

## Getting Help

If you encounter issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review error messages in the console
3. Check PostgreSQL logs: `SHOW log_directory;`
4. Check application logs in `bin/Debug/` or `bin/Release/`

## License

This project is developed by the Institute of Heat and Mass Transfer (WSA) of RWTH Aachen University.

---

**Last Updated**: January 13, 2026  
**Target Framework**: .NET Core 2.0 / Angular 4 / React 18  
**Platform**: Windows 10/11  
**Tested On**: Windows 10/11 with PowerShell 5.1+
