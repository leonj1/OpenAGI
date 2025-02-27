# OpenAGI

AI-powered coding assistant with direct filesystem access. No login required, just your API key.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=OpenAGI" alt="OpenAGI Logo" width="400" />
</div>

## What is this thing?

OpenAGI is a standalone coding assistant built from the TypeScript code extracted from the official Claude Code package by Anthropic (https://www.npmjs.com/package/@anthropic-ai/claude-code). 

The original extraction work was done by [dnakov/claude-code](https://github.com/dnakov/claude-code/), which I've forked and enhanced by removing the authentication requirements. Now you can use all the features with just an Anthropic API key - no login process needed.

Future plans include adding support for multiple AI models through the [Vercel AI SDK](https://github.com/vercel/ai), making this tool even more versatile.

## Features

- **Direct File Operations**: Let AI edit your code while you grab another energy drink
- **Command Execution**: Run terminal stuff without switching windows (productivity hack!)
- **Model Flexibility**: Coming soon
- **Smart Code Understanding**: It actually gets your spaghetti code somehow
- **Multi-Directory Support**: Jump around your project like a coding ninja
- **Cross-Platform**: Works wherever you do (Windows/Mac/Linux)

## Installation

### Global Installation (Recommended)

```bash
npm install -g open-agi
```

Then run it from any directory:

```bash
openagi
```

### Local Installation

```bash
npm install open-agi
```

## Usage

### Command Line

```bash
# Start OpenAGI in the current directory
openagi

# Start with a specific directory
openagi --dir=/path/to/project

# Run in print-only mode (non-interactive)
openagi -p "Generate a React component for a user profile"

# Enable debug mode
openagi -d
```

### Programmatic Usage

```javascript
import OpenAGI from 'open-agi';

async function main() {
  // Create a new instance with custom configuration
  const assistant = new OpenAGI({
    model: 'claude-3-opus', // Choose your model
    workingDirectory: '/path/to/project', // Set working directory
    enableArchitect: true // Enable advanced planning capabilities
  });
  
  // Initialize the instance
  await assistant.initialize();
  
  // Get available tools
  const tools = await assistant.getAvailableTools();
  console.log('Available tools:', tools.map(tool => tool.name));
  
  // Execute a tool
  const result = await assistant.executeTool('LS', { path: '.' });
  console.log('Files in directory:', result);
}

main();
```

## Available Tools

This thing comes with some serious firepower:

- **Bash**: Shell commands go brrr
- **Glob**: Find files faster than you can say "regex"
- **Grep**: Search your codebase like a boss
- **LS**: List dirs because typing 'ls' is too much work
- **View**: Read files without opening them (mind blown)
- **Edit**: Make surgical code edits while you chill
- **Replace**: Nuke entire files when you're feeling dangerous
- **Notebook**: Jupyter notebook support because why not
- **Think**: Let AI plan stuff while you take credit
- **Memory**: It remembers things so you don't have to

## Development

To build the project:

```bash
npm run build:no-types
```

To run the tests:

```bash
npm test
```

## Examples

See the `examples` directory for more usage examples, including:

- Basic tool usage
- Creating custom tools
- Working with different models
- Advanced file operations

## Troubleshooting

### JSON Import Error on Linux/Node.js v20

If you see this error:

```
SyntaxError: Unexpected token 'with'
    at DefaultModuleLoader.moduleStrategy (node:internal/modules/esm/translators:116:18)
```

Node.js is being Node.js again. Try one of these hacks:

1. **Option 1**: The experimental flag way:
   ```bash
   node --experimental-json-modules $(which openagi)
   ```

2. **Option 2**: The lazy alias way:
   ```bash
   # Add to your .bashrc or .zshrc
   alias openagi='node --experimental-json-modules $(which openagi)'
   ```

3. **Option 3**: Use my wrapper scripts because I thought of everything:
   
   For Linux/macOS:
   ```bash
   # Make the script executable
   chmod +x openagi-fix.sh
   
   # Run OpenAGI with the script
   ./openagi-fix.sh "Your prompt here"
   ```
   
   For Windows (PowerShell):
   ```powershell
   # Run OpenAGI with the script
   .\openagi-fix.ps1 "Your prompt here"
   ```

4. **Option 4**: Just update to Node.js v21+ like a normal person.

5. **Option 5**: Create a `.npmrc` file to pin the problematic dependency:
   ```
   # Create this file in your project directory
   cli-spinners@>=3.0.0:=2.9.2
   ```
   Then reinstall:
   ```bash
   npm uninstall -g open-agi
   npm install -g open-agi
   ```

### Missing ripgrep Error on Windows

If you see this error:

```
Error: spawn c:\Users\...\node_modules\open-agi\dist\utils\vendor\ripgrep\x64-win32\rg.exe ENOENT
```

This means OpenAGI can't find the ripgrep binary it needs for code searching. You can fix this by:

1. **Option 1**: Download and install ripgrep manually using the provided script:
   
   Save this content as `download-ripgrep.ps1` and run it in PowerShell:
   ```powershell
   # Script to download ripgrep for OpenAGI
   $ErrorActionPreference = "Stop"
   
   # Define constants
   $ripgrepVersion = "13.0.0"
   $downloadUrl = "https://github.com/BurntSushi/ripgrep/releases/download/$ripgrepVersion/ripgrep-$ripgrepVersion-x86_64-pc-windows-msvc.zip"
   $tempZipFile = "ripgrep-temp.zip"
   $extractDir = "ripgrep-extract"
   $targetDir = "$env:USERPROFILE\AppData\Roaming\npm\node_modules\open-agi\dist\utils\vendor\ripgrep\x64-win32"
   $moduleDir = "$env:USERPROFILE\AppData\Roaming\nvm\v20.18.2\node_modules\open-agi\dist\utils\vendor\ripgrep\x64-win32"
   
   Write-Host "Starting ripgrep download for OpenAGI..." -ForegroundColor Cyan
   
   # Create directories if they don't exist
   if (-not (Test-Path $targetDir)) {
       New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
   }
   
   if (-not (Test-Path $moduleDir)) {
       New-Item -Path $moduleDir -ItemType Directory -Force | Out-Null
   }
   
   # Download ripgrep
   [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
   Invoke-WebRequest -Uri $downloadUrl -OutFile $tempZipFile
   
   # Extract the zip file
   Expand-Archive -Path $tempZipFile -DestinationPath $extractDir -Force
   
   # Copy the executable to the target directory
   $rgPath = Get-ChildItem -Path $extractDir -Recurse -Filter "rg.exe" | Select-Object -First 1 -ExpandProperty FullName
   if ($rgPath) {
       Copy-Item -Path $rgPath -Destination $targetDir -Force
       Copy-Item -Path $rgPath -Destination $moduleDir -Force
   }
   
   # Clean up
   Remove-Item -Path $tempZipFile -Force
   Remove-Item -Path $extractDir -Recurse -Force
   
   Write-Host "ripgrep installation complete!" -ForegroundColor Green
   ```

2. **Option 2**: Install ripgrep globally and add it to your PATH:
   ```powershell
   # Install with Chocolatey
   choco install ripgrep
   
   # OR install with Scoop
   scoop install ripgrep
   ```

## Environment Variables

Create a `.env` file with your API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## License

MIT (feel free to do whatever, I'm not your boss)

## Running the CLI

There are several ways to run OpenAGI:

### Global Installation
After installing the package globally with `npm install -g open-agi`:
```
openagi [options] [prompt]
```

### Local Development
When working on OpenAGI locally, you can run the CLI using:

1. **Using npm script** (recommended):
   ```
   npm run cli -- [options] [prompt]
   ```
   Note the extra `--` which is needed to pass arguments to the underlying script.

2. **Directly using node**:
   ```
   node dist/entrypoints/cli.js [options] [prompt]
   ```

3. **Using the wrapper script**:
   ```
   node cli.js [options] [prompt]
   ```

### Resetting Onboarding Screens

If you've already completed the onboarding process but want to see it again (for example, to view the startup animation or reconfigure settings), you can reset the onboarding status:

1. **Using npm script**:
   ```
   npm run reset:onboarding
   ```

2. **Using the reset script**:
   ```
   node reset-onboarding.js
   ```

After resetting, run OpenAGI again to see the full onboarding experience, including the animated startup screen.