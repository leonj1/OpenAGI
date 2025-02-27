#!/usr/bin/env node

/**
 * OpenAGI - Advanced AI-powered coding assistant
 * Command line interface with direct filesystem access
 */

// Load environment variables from .env file
import 'dotenv/config';
import { execSync } from 'child_process';
import { join } from 'path';
import fs from 'fs';

// Parse command line arguments
const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const helpMode = hasFlag('--help') || hasFlag('-h');
const debugMode = hasFlag('--debug') || hasFlag('-d');
const noPrompt = hasFlag('--no-prompt');
const skipOnboarding = hasFlag('--skip-onboarding');
const printMode = hasFlag('--print') || hasFlag('-p');

// Check for directory parameter
const dirParam = args.find(arg => arg.startsWith('--dir='));
if (dirParam) {
  const specifiedDir = dirParam.split('=')[1];
  if (specifiedDir) {
    try {
      // Change to the specified directory
      process.chdir(specifiedDir);
      console.log(`Working directory set to: ${process.cwd()}`);
      
      // Remove the dir parameter from args to avoid passing it to the CLI
      const dirIndex = args.indexOf(dirParam);
      if (dirIndex !== -1) {
        args.splice(dirIndex, 1);
      }
    } catch (error) {
      console.error(`Error changing to directory ${specifiedDir}:`, error.message);
      process.exit(1);
    }
  }
}

// Show help if requested
if (helpMode) {
  console.log(`
  OpenAGI - Advanced AI Coding Assistant
  
  Usage:
    openagi [options] [prompt]
  
  Options:
    --help, -h         Show this help message
    --debug, -d        Enable debug mode
    --no-prompt        Skip initial prompt
    --skip-onboarding  Skip onboarding screens
    --print, -p        Print response and exit (non-interactive mode)
    --dir=PATH         Set working directory
    
  Environment:
    Set environment variables in .env file:
    ANTHROPIC_API_KEY  Your Anthropic API key (required)
    USER_TYPE          User type (default: 'ant')
    NODE_ENV           Environment (default: 'development')
  
  Example:
    openagi "Create a React component for user profiles"
    openagi --dir=/path/to/project "What's in this codebase?"
    
  Note:
    The first run will complete onboarding setup.
    Subsequent runs will use the saved configuration.
  `);
  process.exit(0);
}

// Set required environment variables if not already set
process.env.USER_TYPE = process.env.USER_TYPE || 'ant';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Check for API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error(`
ERROR: No ANTHROPIC_API_KEY found in environment variables.
Please add your API key to .env file in the format:
ANTHROPIC_API_KEY=sk-ant-yourKeyHere
`);
  process.exit(1);
}

// Build the CLI arguments
const cliArgs = [];

// Add debug flag if requested
if (debugMode) {
  cliArgs.push('-d');
}

// Add print mode if requested
if (printMode) {
  cliArgs.push('-p');
}

// Add user prompt if provided
const promptIndex = args.findIndex(arg => !arg.startsWith('-'));
if (promptIndex >= 0) {
  cliArgs.push(args[promptIndex]);
}

// Display startup message
console.log('\nStarting OpenAGI...');
if (debugMode) console.log('Debug mode enabled');
if (noPrompt) console.log('Skipping initial prompt');
if (printMode) console.log('Print-only mode enabled');
console.log('-------------------------------\n');

// Run the CLI with additional arguments
try {
  // We need to import dynamically to ensure environment vars are set first
  const cliPath = join(process.cwd(), 'dist', 'entrypoints', 'cli.js');
  
  // Execute directly to maintain interactive input
  const { spawn } = await import('child_process');
  
  const proc = spawn('node', [cliPath, ...cliArgs], {
    stdio: 'inherit',
    env: process.env
  });
  
  proc.on('error', (err) => {
    console.error('Failed to start OpenAGI:', err);
    process.exit(1);
  });
  
  proc.on('close', (code) => {
    console.log(`\nOpenAGI exited with code ${code}`);
    process.exit(code);
  });
} catch (err) {
  console.error('Error running OpenAGI CLI:', err);
  process.exit(1);
}