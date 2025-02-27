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

## Environment Variables

Create a `.env` file with your API key:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## License

MIT (feel free to do whatever, I'm not your boss)