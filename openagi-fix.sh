#!/bin/bash
# openagi-fix.sh - Wrapper script to run OpenAGI with experimental JSON modules flag

# Find the path to the openagi executable
OPENAGI_PATH=$(which openagi)

if [ -z "$OPENAGI_PATH" ]; then
  echo "Error: OpenAGI executable not found in PATH."
  echo "Please make sure OpenAGI is installed globally with npm install -g open-agi"
  exit 1
fi

# Run OpenAGI with the experimental JSON modules flag
# Pass all arguments to the openagi command
node --experimental-json-modules "$OPENAGI_PATH" "$@"

# Exit with the same code as the openagi command
exit $? 