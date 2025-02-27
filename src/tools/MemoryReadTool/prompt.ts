export const DESCRIPTION = 'Read data from memory storage.'
export const PROMPT = `This tool allows you to read data that has been stored in memory using the MemoryWriteTool.

The tool has the following parameters:
- file_path (optional): The path to a specific memory file to read. If not provided, the tool will list all available memory files.

Memory is persistent storage that allows you to save and retrieve information across different runs of the application. 
This is useful for storing context, preferences, or any other data that needs to be preserved between sessions.

When you read from memory, the tool will return the content of the requested memory file, or a list of all available memory files if no specific file path is provided.

Examples:
1. Read a specific memory file:
   file_path: "user_preferences"

2. List all available memory files:
   (no parameters)
` 