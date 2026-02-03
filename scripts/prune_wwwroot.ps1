param(
  [Parameter(Mandatory=$true)]
  [string]$UsedUrlsFile,

  [string]$WwwrootPath = "QuizAPI/QuizAPI/wwwroot",

  # If set, actually move files. Otherwise we only print what would happen.
  [switch]$Apply,

  # Where to move unused files (keeps folder structure). Created if missing.
  [string]$ArchiveDir = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Normalize-UrlToRelativePath([string]$url) {
  if ([string]::IsNullOrWhiteSpace($url)) { return $null }

  $u = $url.Trim()

  # strip quotes if present
  if (($u.StartsWith('"') -and $u.EndsWith('"')) -or ($u.StartsWith("'") -and $u.EndsWith("'"))) {
    $u = $u.Substring(1, $u.Length - 2)
  }

  $u = $u.Trim()
  if ($u.Length -eq 0) { return $null }

  # remove leading ~ or /
  $u = $u -replace '^[~\/]+', ''

  # convert backslashes to forward slashes
  $u = $u.Replace('\', '/')

  # drop protocol+host if it's a full URL
  if ($u -match '^[a-zA-Z]+://') {
    try {
      $uri = [System.Uri]$u
      $u = $uri.AbsolutePath.TrimStart('/').Replace('\', '/')
    } catch {
      # ignore parse errors; keep original
    }
  }

  # strip wwwroot prefix if present
  if ($u.StartsWith("wwwroot/")) {
    $u = $u.Substring("wwwroot/".Length)
  }

  # normalize repeated slashes
  $u = ($u -replace '/+', '/')

  return $u
}

if (!(Test-Path $UsedUrlsFile)) {
  throw "UsedUrlsFile not found: $UsedUrlsFile"
}
if (!(Test-Path $WwwrootPath)) {
  throw "WwwrootPath not found: $WwwrootPath"
}

if ([string]::IsNullOrWhiteSpace($ArchiveDir)) {
  $ArchiveDir = Join-Path (Get-Location) ("wwwroot_pruned_backup_" + (Get-Date -Format "yyyyMMdd_HHmmss"))
}

$used = New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$raw = Get-Content -LiteralPath $UsedUrlsFile | Where-Object { $_ -and $_.Trim().Length -gt 0 }
foreach ($line in $raw) {
  $p = Normalize-UrlToRelativePath $line
  if ($p) { [void]$used.Add($p) }
}

Write-Host "Loaded $($used.Count) used paths from: $UsedUrlsFile"

$allFiles = Get-ChildItem -LiteralPath $WwwrootPath -Recurse -File

$unused = @()
$usedFiles = @()
foreach ($f in $allFiles) {
  $rel = $f.FullName.Substring((Resolve-Path $WwwrootPath).Path.Length).TrimStart('\','/').Replace('\','/')
  if ($used.Contains($rel)) {
    $usedFiles += $f
  } else {
    $unused += $f
  }
}

$unusedBytes = ($unused | Measure-Object -Sum Length).Sum
$usedBytes = ($usedFiles | Measure-Object -Sum Length).Sum

Write-Host ""
Write-Host "Wwwroot: $WwwrootPath"
Write-Host ("Total files: {0}, Used: {1}, Unused: {2}" -f $allFiles.Count, $usedFiles.Count, $unused.Count)
Write-Host ("Total size:  {0:N2} MB" -f (($usedBytes + $unusedBytes)/1MB))
Write-Host ("Used size:   {0:N2} MB" -f ($usedBytes/1MB))
Write-Host ("Unused size: {0:N2} MB" -f ($unusedBytes/1MB))

if (-not $Apply) {
  Write-Host ""
  Write-Host "DRY RUN (no changes). Re-run with -Apply to move unused files to:"
  Write-Host "  $ArchiveDir"
  Write-Host ""
  Write-Host "Example:"
  Write-Host "  .\\scripts\\prune_wwwroot.ps1 -UsedUrlsFile .\\used_map31_urls.txt -Apply"
  exit 0
}

New-Item -ItemType Directory -Force -Path $ArchiveDir | Out-Null

foreach ($f in $unused) {
  $rel = $f.FullName.Substring((Resolve-Path $WwwrootPath).Path.Length).TrimStart('\','/').Replace('\','/')
  $dest = Join-Path $ArchiveDir ($rel.Replace('/','\'))
  $destDir = Split-Path $dest -Parent
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  Move-Item -LiteralPath $f.FullName -Destination $dest -Force
}

Write-Host ""
Write-Host "DONE. Moved $($unused.Count) unused files to: $ArchiveDir"

