$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

$node = $null
$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  $node = $nodeCommand.Source
}
if (-not $node) {
  $candidates = @(
    "C:\Users\Asus\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe",
    "$env:ProgramFiles\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
  )
  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      $node = $candidate
      break
    }
  }
}

if ($node) {
  if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot "dist\app.js"))) {
    Write-Host "First run: building the app..." -ForegroundColor Yellow
    & $node "scripts\build.mjs"
  }
  Write-Host ""
  Write-Host "  Starting FUKUOKA POP!..." -ForegroundColor Cyan
  Write-Host "  If Windows Firewall asks, allow Private networks." -ForegroundColor DarkGray
  Write-Host ""
  & $node "scripts\serve.mjs"
  exit $LASTEXITCODE
}

$python = $null
$pythonCommand = Get-Command python -ErrorAction SilentlyContinue
if ($pythonCommand) { $python = $pythonCommand.Source }
if (-not $python) {
  $pythonCandidates = @(
    "C:\Users\Asus\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe",
    "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe"
  )
  foreach ($candidate in $pythonCandidates) {
    if (Test-Path -LiteralPath $candidate) {
      $python = $candidate
      break
    }
  }
}

if ($python) {
  Write-Host ""
  Write-Host "  Node not found - serving the prebuilt site with Python." -ForegroundColor Yellow
  Write-Host "  Open http://localhost:4173 on this PC." -ForegroundColor Cyan
  Write-Host "  On your phone, use http://<this-PC-LAN-IP>:4173 on the same Wi-Fi." -ForegroundColor Cyan
  Write-Host ""
  & $python -m http.server 4173 --directory "dist"
  exit $LASTEXITCODE
}

Write-Host "Node.js or Python is required to serve this site." -ForegroundColor Red
Write-Host "Install Node.js, then run: pnpm install; pnpm build; pnpm serve" -ForegroundColor Yellow
Read-Host "Press Enter to close"
