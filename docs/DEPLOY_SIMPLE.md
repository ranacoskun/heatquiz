# How to Deploy This Project (Simple Guide)

## What You Have
- **Backend**: .NET Core API (QuizAPI)
- **Frontend**: React app (heatquizapp)
- **Database**: PostgreSQL

## Azure Deployment Steps

### ✅ Step 1: Create Account
1. Go to https://azure.microsoft.com/free/
2. Sign up (free tier available)

### ✅ Step 2: Create App Service (COMPLETED)

**Quick Reference - What You Created:**
- Name: `heatquiz`
- Resource Group: `heatquiz_group`
- Runtime: .NET 8 (LTS)
- OS: Windows
- Plan: Free (F1) - Can upgrade to B1 later for real users

**Upgrade to B1 later:** App Service → "Scale up" → Choose B1 → Apply (~$13/month)

---

### Step 3: Create PostgreSQL Database

1. In Azure Portal, click **"+ Create"** → Search **"PostgreSQL"**
2. From the list, choose **"Azure Database for PostgreSQL flexible servers"**
   - ⚠️ **Note:** "Single server" might not be available anymore (deprecated)
   - Flexible server can be cheap IF you choose the right tier (see below)
3. Click **"Create"**

#### **Basics Tab**

**Subscription:** Choose your subscription

**Resource Group:** 
- ✅ **"Use existing"** → Select `heatquiz_group`

**Server name:**
- ✅ Enter: `heatquiz-db` (lowercase, letters/numbers only, 3-63 chars)
- If taken, try: `heatquiz-db-2025`

**Location:**
- ⚠️ **If you get "not allowed to provision" error:** Try a different region
- ✅ Try these regions in order:
  1. **"East US"** (usually available)
  2. **"West US 2"**
  3. **"North Europe"**
  4. **"UK South"**
- **Note:** Database and App Service can be in different regions (slightly slower but works fine)
- **Best practice:** Choose the same region as your App Service if possible, but any region works

**Version:**
- ✅ Choose **"14"** (recommended - stable and well-supported)
- OR **"15"** (newer, also good)
- OR **"16"** or **"17"** (newest, should work fine)
- ❌ **Don't choose:** 11, 12, or 13 (unsupported versions)
- **Note:** All supported versions work with your .NET Core project - newer versions have better performance

**Compute + storage:**
- ✅ Click **"Configure server"** or **"Configure compute + storage"**
- ⚠️ **CRITICAL - Choose the cheapest tier:**
  - **Compute tier:** Choose **"Burstable"** (NOT "General Purpose" or "Memory Optimized" - those are $300+/month!)
  - **Compute size:** Choose **"Standard_B1ms"** or **"Standard_B1s"** (cheapest - ~$12-15/month)
  - **Storage:** Choose **"32 GiB"** (or minimum available). Your screenshot shows **128 GiB** which adds ~$18/month.
  - **Storage autogrow:** Can leave ON (only charges if you use more)
  - **Backup:** **"7 days"** (default)
- ✅ Click **"OK"** or **"Apply"**
- ⚠️ **Check estimated cost** - should be ~$12-25/month, NOT $600!

**Authentication method:**
- ✅ Choose **"PostgreSQL authentication only"** (simplest option)
- ❌ **Don't choose** "Microsoft Entra authentication" or "PostgreSQL and Microsoft Entra" (more complex, not needed)
- **Why:** You just need basic username/password authentication - Entra is for enterprise SSO (not needed here)

**Admin username:**
- ✅ Enter: `heatquizadmin` (remember this!)

**Password:**
- ✅ Create strong password (8+ chars, uppercase, lowercase, number, special char)
- ⚠️ **SAVE THIS PASSWORD!** You'll need it!
- Example: `DigiTraiL2025`

**Confirm password:** Enter same password

**Click "Next: Networking"**

#### **Networking Tab**

**Connectivity method:**
- ✅ Choose **Public access** (simple)
- ❌ Avoid **Private endpoint** for now (requires more networking setup)

**Allow public access from any Azure service within Azure:**
- ✅ Set to **Yes** ✅ (this is what lets your App Service connect)
- If you leave this **No**, your backend will usually fail to connect to the DB.

**Firewall rules:**
- ✅ Add **your current IP** (so you can connect from your computer)

**Click "Next: Additional settings"**

#### **Additional Settings Tab**

**PostgreSQL minor version:** Leave default

**Server parameters:** Leave default

**Click "Next: Tags"**

#### **Tags Tab**

**Tags:** Skip (leave empty)

**Click "Next: Review + create"**

#### **Review + Create**

**Review settings:**
- Server name: `heatquizdb`
- Pricing: Basic, 1 vCore
- Firewall: Azure services allowed ✅

**⚠️ Make sure you saved your password!**

**Click "Create"**

⏳ Wait 5-10 minutes for deployment

✅ Click **"Go to resource"** when done

#### **Save Connection String**

Azure portal UI differs. Use **any** of these:

- **Option A (most common):** Database resource → **Overview** → top toolbar button **Connect**
- **Option B:** Database resource → left menu search box → type **Connect** → open **Connect**
- **Option C:** Database resource → **Settings** → **Connect**

In the **Connect** page, choose **Connect from your app** and copy the **ADO.NET** connection string (best for .NET apps), or at least copy:
- Host (server)
- Username format
- Port (5432)
- SSL requirement

Save it! You’ll need it in Step 5.

**Or write down:**
- Server: `heatquiz-db.postgres.database.azure.com`
- Username: `heatquizadmin@heatquiz-db`
- Password: (the one you created)

#### Optional: Connect from VS Code (Yes, possible)

This is only for **viewing/editing DB data** (it does not deploy your app).

1. In VS Code, install extension: **SQLTools**
2. Install driver: **SQLTools PostgreSQL/Redshift Driver**
3. Create a new connection:
   - **Server/Host**: `<your-server-name>.postgres.database.azure.com` (example: `heatquizdb.postgres.database.azure.com`)
   - **Port**: `5432`
   - **Database**: `postgres` (or the DB name you use)
   - **Username**: `heatquizadmin` **or** `heatquizadmin@<your-server-name>` (use what Azure shows in “Connection strings”)
   - **Password**: your password
   - **SSL**: **Required** (if there’s an “SSL mode”, use **Require**)

Tip: If you get SSL/cert errors, use the exact connection string Azure provides and/or enable “Trust server certificate”.

---

### Step 4: Deploy Your Code

#### **Option A: Connect GitHub (Recommended - Automatic Updates)**

1. Go to your App Service (`heatquiz`)
2. Click **"Deployment Center"** (left menu)
3. Click **"Settings"** tab
4. **Source:** Choose **"GitHub"**
5. Click **"Authorize"** → Sign in to GitHub
6. **Organization:** Your GitHub username
7. **Repository:** Your repository name
8. **Branch:** `main` or `master`
9. **Build provider:** **GitHub Actions**
10. **Workflow:** **Create new workflow** (if asked)
11. **Authentication settings (GitHub Actions → Azure):**
   - ✅ Choose **User-assigned identity** (recommended, more secure)
   - Subscription: your subscription
   - Identity: leave the auto-created **(New) oidc-...** selected
   - Then click **Preview file** (optional) and **Save**

✅ Now every `git push` will automatically deploy!

---

## IMPORTANT: Large `wwwroot` assets (videos/images) can break App Service deploy

This repo’s `QuizAPI/QuizAPI/wwwroot` contains **multiple GB** of media (mp4/mp3/images). Deploying it all can fail with **OneDeploy 500/502**.

**Fix used in this repo:** the publish step excludes the biggest folders by default:
- `wwwroot/Maps`
- `wwwroot/SimpleClickableQuestions`
- `wwwroot/Tutorials`
- `wwwroot/CourseaMap`
- `wwwroot/NumericKeys`

If your app needs these assets in production, host them separately and link/mount them later:
- **Recommended:** Azure Storage (Blob or Azure Files) and serve via URLs

---

## Optional: shrink `wwwroot` to only what Map 31 uses (recommended)

If you removed learning paths / most maps, you can delete most media. The safe way is:
- **Keep only files referenced by the DB for Map 31**
- Move everything else out of `wwwroot` to reduce deploy size

### Step A — export “used URLs for Map 31” from Azure DB (automatic)

1. Make sure you can connect to Azure DB from your PC (use the Azure DB **Connect** page).
2. Set the `PG*` env vars like Azure shows (Host/User/DB/Port/Password). Example (PowerShell):

```powershell
$env:PGHOST="heatquizdb.postgres.database.azure.com"
$env:PGPORT="5432"
$env:PGDATABASE="postgres"
$env:PGUSER="heatquizadmin"          # if this fails, try heatquizadmin@heatquizdb
$env:PGPASSWORD="YourPasswordHere"
$env:PGSSLMODE="require"
```

3. Run the export script (this creates `used_map31_urls.txt`):

```powershell
.\scripts\export_used_urls_map.ps1 -MapId 31 -OutFile .\used_map31_urls.txt
```

If you still see it trying to connect to `localhost`, pass an explicit connection string:

```powershell
.\scripts\export_used_urls_map.ps1 -MapId 31 -OutFile .\used_map31_urls.txt -PsqlConn "host=heatquizdb.postgres.database.azure.com port=5432 dbname=postgres user=heatquizadmin sslmode=require"
```

Note: the exporter writes **one URL per line** (clean output). If you have an older output file with `INSERT 0 ...` lines, just re-run the exporter.

**If PowerShell says “running scripts is disabled on this system”**

Run ONE of these, then try again:

```powershell
# Recommended (safe): allow local scripts for your user only
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

```powershell
# One-time bypass (no system changes)
powershell -ExecutionPolicy Bypass -File .\scripts\export_used_urls_map.ps1 -MapId 31 -OutFile .\used_map31_urls.txt
```

### Step B — prune `wwwroot` using the script (dry-run first)

From repo root in PowerShell:

```powershell
# Dry run (no changes)
.\scripts\prune_wwwroot.ps1 -UsedUrlsFile .\used_map31_urls.txt

# Actually move unused files to a backup folder
.\scripts\prune_wwwroot.ps1 -UsedUrlsFile .\used_map31_urls.txt -Apply
```

This will keep only the referenced files and move the rest into a backup folder.

#### **Option B: Manual Deploy from Visual Studio**

1. Open your project in Visual Studio
2. Right-click `QuizAPI` project → **"Publish"**
3. Choose **"Azure"** → **"Azure App Service"**
4. Select your subscription → Select `heatquiz`
5. Click **"Publish"**

#### **Option C: Manual Deploy via Azure Portal**

1. Go to App Service → **"Deployment Center"**
2. Choose **"Local Git"** or **"Zip Deploy"**
3. Follow instructions to upload your code

---

### Step 5: Connect Database to App

1. Go to your App Service (`heatquiz`)
2. Find the settings page (Azure UI varies):
   - **Option A:** Left menu → **Settings** → **Environment variables**
   - **Option B:** Left menu → **Settings** → **Configuration**
   - **Option C:** Use the left-menu search box and type **environment** or **configuration**
3. Open **Application settings** (or the **App settings** section on the Environment variables page)
4. Click **"+ New application setting"**
5. **Name:** `ConnectionStrings__DefaultConnection`
6. **Value:** Paste your PostgreSQL connection string (from Step 3)
7. Click **"OK"** → Click **"Save"** (top)
8. Click **"Continue"** to restart app

✅ Your app is now connected to the database!

---

### Step 6: Import Database Schema

Your database is empty. You need to import your schema:

#### **Option A: Using Azure Cloud Shell**

1. In Azure Portal, click **Cloud Shell** icon (top bar, `>_` symbol)
2. Choose **"PowerShell"** or **"Bash"**
3. Open the **Upload/Download files** menu in Cloud Shell and upload your `.sql`

⚠️ **Cloud Shell upload limit:** If your `.sql` is **over 100MB**, the upload will fail.
Use **Option B (pgAdmin)** or **Option C (psql from your computer)** instead.

4. Import:
   ```bash
   psql -h <your-server>.postgres.database.azure.com -U <admin-user>@<your-server> -d postgres -f your_file.sql
   ```
5. Enter password when prompted (or use the `PGPASSWORD` export shown in Azure “Connect” page)

#### **Option B: Using pgAdmin (GUI)**

1. Download pgAdmin: https://www.pgadmin.org/download/
2. Add new server:
   - Host: `heatquiz-db.postgres.database.azure.com`
   - Port: `5432`
   - Database: `postgres`
   - Username: `heatquizadmin@heatquiz-db`
   - Password: (your password)
3. Right-click database → **"Restore"**
4. Select `db_16_10_2025_full.sql`
5. Click **"Restore"**

#### **Option C: Using psql from Your Computer**

```powershell
# This option is easiest to do inside VS Code using the built-in Terminal.

# 1) Install PostgreSQL client tools (includes psql)
#    - Download: https://www.postgresql.org/download/windows/
#    - During install, ensure "Command Line Tools" is selected
#
# 2) Open VS Code
#    - Open your project folder
#    - Open Terminal: Terminal → New Terminal
#
# 3) (Optional) set password so you won’t be prompted
$env:PGPASSWORD = "YourPasswordHere"
#
# 4) Run the import (NO upload to Azure needed)
psql "host=heatquizdb.postgres.database.azure.com port=5432 dbname=postgres user=heatquizadmin sslmode=require" -f "C:\Users\RanaCoskun\Downloads\HQ\docs\db_20260203_only_map31.sql"
```

**VS Code method (same thing, more \"guided\"):**
1. In your Azure DB resource → **Connect** page, copy these values:
   - `PGHOST` (example: `heatquizdb.postgres.database.azure.com`)
   - `PGUSER` (example: `heatquizadmin`)
   - `PGDATABASE` (usually `postgres`)
   - `PGPORT` (`5432`)
2. In VS Code Terminal, paste (replace password and file path):
   ```powershell
   $env:PGHOST="heatquizdb.postgres.database.azure.com"
   $env:PGUSER="heatquizadmin"
   $env:PGDATABASE="postgres"
   $env:PGPORT="5432"
   $env:PGPASSWORD="YourPasswordHere"
#
# IMPORTANT: Azure PostgreSQL enforces SSL/TLS. Always use sslmode=require.
# (If you don't, you may see: "no pg_hba.conf entry ... no encryption")
   psql -f "C:\Users\RanaCoskun\Downloads\HQ\docs\db_20260203_only_map31.sql"
   ```
3. Wait for it to finish. It can take minutes for big files.
4. If it ends with `ERROR`, copy the last 20 lines and send them to me.

**If you see warning about \"extra command-line argument ... ignored\":** use the long flag form:
```powershell
psql --file="C:\Users\RanaCoskun\Downloads\HQ\docs\db_20260203_only_map31.sql"
```

**If your terminal output scrolls away (recommended): save output to a log**
```powershell
# Run import and write ALL output to a log file you can open later
$env:PGHOST="heatquizdb.postgres.database.azure.com"
$env:PGPORT="5432"
$env:PGDATABASE="postgres"
$env:PGUSER="heatquizadmin"         # or heatquizadmin@heatquizdb
$env:PGPASSWORD="YourPasswordHere"

psql -v ON_ERROR_STOP=0 --file="C:\Users\RanaCoskun\Downloads\HQ\docs\db_20260203_only_map31.sql" *> "C:\Users\RanaCoskun\Downloads\HQ\import.log"

# Check if there were errors
Select-String -Path "C:\Users\RanaCoskun\Downloads\HQ\import.log" -Pattern "ERROR:" -Context 0,2
```

**Quick verification (did it import anything?):**
```powershell
# How many tables exist in public schema?
psql -c "SELECT COUNT(*) AS public_table_count FROM information_schema.tables WHERE table_schema='public';"
```

**If you see auth/SSL errors (common):**
- **password authentication failed**: wrong password OR wrong username format
  - For **Flexible Server**, username is usually just the admin login (example: `heatquizadmin`)
  - If that fails, try the older format: `heatquizadmin@heatquizdb`
- **no pg_hba.conf entry ... no encryption**: you forgot SSL
  - Use `sslmode=require` in your connection string

**If it looks "stuck" (no output for a long time), run it with logging and monitor progress:**

```powershell
# Write all output to a log so you can see if it's still moving
$env:PGPASSWORD = "YourPasswordHere"
psql -h heatquiz-db.postgres.database.azure.com -U heatquizadmin@heatquiz-db -d postgres `
  -v ON_ERROR_STOP=1 `
  -f "C:\path\to\db_16_10_2025_full.sql" `
  *> "C:\path\to\restore.log"

# In a SECOND terminal, watch the log as it grows
Get-Content "C:\path\to\restore.log" -Wait -Tail 50
```

**In a SECOND psql session**, you can also see what the server is currently executing:

```powershell
$env:PGPASSWORD="YourPasswordHere"

# Flexible Server usually uses the admin login without @servername:
# If this fails, try: -U heatquizadmin@heatquizdb
psql "host=heatquizdb.postgres.database.azure.com port=5432 dbname=postgres user=heatquizadmin sslmode=require" -c @"
SELECT
  pid,
  state,
  wait_event_type,
  wait_event,
  now() - query_start AS running_for,
  left(query, 200) AS query_preview
FROM pg_stat_activity
WHERE datname = current_database()
  AND pid <> pg_backend_pid()
  AND state <> 'idle'
ORDER BY query_start;
"@
```

> Tip: restoring a large `.sql` file over the internet can be very slow. If possible, run the import from a machine close to the database (Azure Cloud Shell / an Azure VM in the same region).

---

### Step 7: Test Your App

1. Go to your App Service → **"Overview"**
2. Click the URL: `https://heatquiz.azurewebsites.net`
3. Your app should load!

### What about my `.env` (I didn’t push it to GitHub)?

✅ **That’s correct and recommended.** You should NOT commit `.env` to GitHub (it usually contains secrets).

Instead, put those values into Azure as **App settings / Environment variables**:

#### Backend (.NET / QuizAPI)
- Put secrets like DB connection string in:
  - App Service → **Environment variables** → **App settings**
- For this project the key is:
  - `ConnectionStrings__DefaultConnection` = your Postgres connection string

#### Frontend (React)
React variables like `REACT_APP_API_SERVER`, `REACT_APP_OPENAI_API_KEY`, etc. are **build-time** values.
That means:
- If you deploy the React app as a static build, you must set `REACT_APP_*` in the build step (GitHub Actions / Railway build), not after.
- If you don’t deploy the React app separately and only use the Angular UI inside `QuizAPI`, you can ignore React `.env`.

**If you see errors:**
- Check **"Log stream"** (left menu) for error messages
- Verify connection string in **Environment variables / App settings**
- Make sure database schema was imported

---

## If the website shows a generic “Error. An error occurred while processing your request.”

This means the app crashed on the server, but Azure is hiding the details.

### Step 1 — Open logs
App Service (`heatquiz`) → **Log stream**

Refresh the site once, then look for the first exception in the log stream.

### Step 2 — Most common fix: database connection string
App Service → **Environment variables** → **App settings**

Make sure you have:
- `ConnectionStrings__DefaultConnection` = a valid Azure Postgres connection string

Important details:
- Database name must match where you imported the schema (often `postgres` unless you created `quizdb`)
- Azure Postgres requires SSL, so include:
  - `Ssl Mode=Require;Trust Server Certificate=true;`

### Step 3 — Temporarily enable more detail (ONLY for debugging)
In App Service → **Environment variables** → **App settings**, add:
- `ASPNETCORE_ENVIRONMENT` = `Development`
- `ASPNETCORE_DETAILEDERRORS` = `true`
- `Logging__LogLevel__Default` = `Information`

Click **Save** and let the app restart, then refresh the site and check **Log stream** again.

⚠️ After you capture the error, set `ASPNETCORE_ENVIRONMENT` back to `Production` (or delete it).

---

## Updating Your App

### Automatic Updates (GitHub Connected)

```powershell
# Make changes to your code
git add .
git commit -m "Your changes"
git push

# Wait 2-5 minutes - app updates automatically!
```

### Manual Updates

1. Build: `dotnet publish -c Release`
2. Deploy via Visual Studio or Azure Portal (same as Step 4)

**You can update as often as you want - it's free!**

---

## Pricing Summary

| Tier | App Service | Database | Total/Month |
|------|-------------|----------|-------------|
| **Free (Testing)** | F1: Free (60 min/day) | Basic: $25 | $25 |
| **Basic (150 users)** | B1: $13 | Basic: $25 | $38 |

**Upgrade anytime:** App Service → "Scale up" → Choose B1

---

## Troubleshooting

**App won't start?**
- Check **"Log stream"** for errors
- Verify connection string format
- Check database firewall allows Azure services

**Database connection errors?**
- Verify connection string in App Service **Environment variables / Configuration**
- Check database firewall rules
- Make sure database exists and schema is imported

**Can't connect to database?**
- Make sure "Allow Azure services" is ON in database firewall
- Verify username format: `heatquizadmin@heatquiz-db`
- Check password is correct

**"Subscription not allowed to provision in [region]" error?**
- Your subscription has regional restrictions
- **Solution:** Try a different region (East US, West US 2, North Europe, UK South)
- Database and App Service can be in different regions (works fine, just slightly slower)
- If all regions fail, you may need to upgrade your subscription or contact Azure support

**Database showing $600+/month instead of $25/month?**
- ⚠️ **You chose the wrong compute tier!** 
- **Problem:** You selected "General Purpose" or "Memory Optimized" compute tier (these are $300-600/month!)
- **Solution:** 
  1. Go back to "Compute + storage" configuration
  2. Change **Compute tier** to **"Burstable"** (the cheapest!)
  3. Choose **"Standard_B1ms"** or **"Standard_B1s"** (smallest size)
  4. Check estimated cost - should be ~$12-25/month
- **Correct tiers:**
  - ✅ Burstable (B1ms/B1s) = ~$12-25/month (what you want!)
  - ❌ General Purpose = $300+/month (too expensive!)
  - ❌ Memory Optimized = $400+/month (too expensive!)

---

## Next Steps

1. ✅ App Service created
2. ⏳ Create database (Step 3)
3. ⏳ Deploy code (Step 4)
4. ⏳ Connect database (Step 5)
5. ⏳ Import schema (Step 6)
6. ⏳ Test app (Step 7)

**You're on the right track!** Continue with Step 3 above.
