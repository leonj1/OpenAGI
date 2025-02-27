# openagi-fix.ps1 - Wrapper script to run OpenAGI with experimental JSON modules flag

# Find the path to the openagi executable
$OPENAGI_PATH = Get-Command openagi -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source

if (-not $OPENAGI_PATH) {
    Write-Error "Error: OpenAGI executable not found in PATH."
    Write-Error "Please make sure OpenAGI is installed globally with npm install -g open-agi"
    exit 1
}

# Run OpenAGI with the experimental JSON modules flag
# Pass all arguments to the openagi command
$arguments = @("--experimental-json-modules", "$OPENAGI_PATH") + $args
node $arguments

# Exit with the same code as the openagi command
exit $LASTEXITCODE 