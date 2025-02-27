# OpenAGI

Advanced AI-powered coding assistant with direct filesystem access.

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=OpenAGI" alt="OpenAGI Logo" width="400" />
</div>

## Overview

OpenAGI provides developers with a powerful AI assistant capable of directly interacting with files, running commands, and providing intelligent code assistance. This standalone version allows integration with custom language models for maximum flexibility.

## Features

- **Direct File Operations**: Edit, search, and analyze your codebase
- **Command Execution**: Run commands without leaving the interface
- **Model Flexibility**: Use Claude, GPT-4, or any custom model
- **Smart Code Understanding**: Analyze and understand complex codebases
- **Multi-Directory Support**: Switch working directories with ease
- **Cross-Platform**: Works on Windows, macOS, and Linux

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

OpenAGI provides the following tools:

- **Bash**: Execute shell commands
- **Glob**: Find files using glob patterns
- **Grep**: Search file contents with regex
- **LS**: List directory contents
- **View**: Read file contents
- **Edit**: Make precise edits to files
- **Replace**: Completely replace file contents
- **Notebook**: Read and edit Jupyter notebooks
- **Think**: AI reflection and planning capabilities
- **Memory**: Store and retrieve information across sessions

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

## License

MIT