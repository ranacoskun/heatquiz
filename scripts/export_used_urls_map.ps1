param(
  [Parameter(Mandatory=$true)]
  [int]$MapId,

  [string]$OutFile = "used_map_urls.txt",

  # Uses existing PG* env vars (recommended). You can also pass a full psql connection string:
  # e.g. "host=... port=5432 dbname=postgres user=... sslmode=require"
  [string]$PsqlConn = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$sql = Join-Path $PSScriptRoot "export_used_urls_map.sql"
if (!(Test-Path $sql)) { throw "Missing SQL file: $sql" }

Write-Host "Exporting used URLs for MapId=$MapId to $OutFile"

if ([string]::IsNullOrWhiteSpace($PsqlConn)) {
  # Use PGHOST/PGUSER/PGDATABASE/PGPORT/PGPASSWORD environment variables.
  # If these aren't set, psql falls back to localhost + your Windows username (that's what happened to you).
  if ([string]::IsNullOrWhiteSpace($env:PGHOST) -or [string]::IsNullOrWhiteSpace($env:PGUSER)) {
    throw "Missing connection info. Set PGHOST/PGUSER/PGDATABASE/PGPORT/PGPASSWORD (from Azure DB → Connect page), or pass -PsqlConn."
  }
  if ([string]::IsNullOrWhiteSpace($env:PGSSLMODE)) {
    Write-Warning "PGSSLMODE is not set. Azure requires SSL. Setting PGSSLMODE=require for this process."
    $env:PGSSLMODE = "require"
  }
  Write-Host "Connecting via PG* env vars: PGHOST=$env:PGHOST PGUSER=$env:PGUSER PGDATABASE=$env:PGDATABASE PGPORT=$env:PGPORT PGSSLMODE=$env:PGSSLMODE"
  $args = @(
    "-X",                 # don't read ~/.psqlrc
    "-q",                 # quiet (no INSERT 0 n chatter)
    "-t", "-A",           # tuples-only, unaligned (1 url per line)
    "-P", "pager=off",
    "-v", "map_id=$MapId",
    "-f", $sql
  )
} else {
  Write-Host "Connecting via explicit connection string (PsqlConn)."
  # IMPORTANT: psql expects options BEFORE the connection string/DBNAME.
  # If you put the conn string first, psql treats later flags/values as extra args.
  $args = @(
    "-X",
    "-q",
    "-t", "-A",
    "-P", "pager=off",
    "-v", "map_id=$MapId",
    "-f", $sql,
    $PsqlConn
  )
}

# Run psql and save output. Include stderr so errors get captured too.
$prev = $ErrorActionPreference
$ErrorActionPreference = "Continue"
$output = (& psql @args 2>&1 | Out-String)
$ErrorActionPreference = $prev
$output | Out-File -FilePath $OutFile -Encoding utf8
if ($LASTEXITCODE -ne 0) {
  throw "psql failed (exit code $LASTEXITCODE). Check $OutFile for details."
}

Write-Host "Done. Preview:"
Get-Content $OutFile -TotalCount 20

