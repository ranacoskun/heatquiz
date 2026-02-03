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
  # Important: Azure requires SSL; ensure your env includes sslmode=require in PGSSLMODE or via conn string.
  # If you don't have env vars set, go to Azure DB → Connect page and copy the export lines.
  $cmd = @(
    "psql",
    "-v", "map_id=$MapId",
    "-f", "`"$sql`""
  ) -join " "
} else {
  $cmd = @(
    "psql",
    "`"$PsqlConn`"",
    "-v", "map_id=$MapId",
    "-f", "`"$sql`""
  ) -join " "
}

# Write one URL per line
& powershell -NoProfile -Command "$cmd" | Out-File -FilePath $OutFile -Encoding utf8

Write-Host "Done. Preview:"
Get-Content $OutFile -TotalCount 20

