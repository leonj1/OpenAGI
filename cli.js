#!/usr/bin/env node

/**
 * OpenAGI CLI Wrapper
 * This script is a convenience wrapper to run the CLI directly from the project root.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled CLI
const cliPath = join(__dirname, 'dist', 'entrypoints', 'cli.js');

// Pass all arguments to the CLI
const args = process.argv.slice(2);

// Spawn the CLI process with all arguments
const proc = spawn('node', ['--experimental-json-modules', cliPath, ...args], {
  stdio: 'inherit',
  env: process.env
});

// Handle errors
proc.on('error', (err) => {
  console.error('Failed to start OpenAGI:', err);
  process.exit(1);
});

// Pass the exit code through
proc.on('close', (code) => {
  process.exit(code || 0);
}); 