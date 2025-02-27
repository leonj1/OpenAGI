export const DESCRIPTION = 'Write data to memory storage.'
export const PROMPT = `This tool allows you to write data to persistent memory storage.

The tool has the following parameters:
- file_path: The path where you want to store the data.
- content: The data you want to store. This can be any text content.

Memory is persistent storage that allows you to save and retrieve information across different runs of the application.
This is useful for storing context, preferences, or any other data that needs to be preserved between sessions.

When you write to memory, the data will be stored at the specified file path and can later be retrieved using the MemoryReadTool.

Example:
  file_path: "user_preferences"
  content: "{ \"theme\": \"dark\", \"fontSize\": 14 }"

Note: If a file with the same path already exists, it will be overwritten. Make sure to use unique file paths for different types of data.
` 