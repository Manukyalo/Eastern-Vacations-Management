# Setup script for Eastern Vacations Management System
# Since npm/node are not in PATH, this script attempts to find them and run install

$nodePaths = @(
    "$env:LOCALAPPDATA\ms-playwright-go\1.50.1\node.exe",
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe"
)

$nodeExe = $null
foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        $nodeExe = $path
        break
    }
}

if ($null -eq $nodeExe) {
    Write-Error "Could not find node.exe. Please ensure Node.js is installed."
    exit 1
}

Write-Host "Found node.exe at: $nodeExe"

# Try to find npm. It's usually a .cmd file in the same dir as node.exe or in a sibling 'node_modules\npm\bin'
$npmPath = Join-Path (Split-Path $nodeExe) "npm.cmd"
if (-not (Test-Path $npmPath)) {
    $npmPath = Join-Path (Split-Path $nodeExe) "node_modules\npm\bin\npm-cli.js"
    if (Test-Path $npmPath) {
        function npm { & $nodeExe $npmPath $args }
    } else {
        Write-Error "Could not find npm. Please ensure Node.js is installed correctly."
        exit 1
    }
} else {
    function npm { & $npmPath $args }
}

Write-Host "Starting npm install..."
npm install

Write-Host "Setup complete!"
