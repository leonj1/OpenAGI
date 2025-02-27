import { getAllTools } from './tools.js'
import { getCwd } from './utils/state.js'
import { getContext, setContext } from './context.js'
import { fileURLToPath } from 'node:url'
import { resolve } from 'path'
import { MACRO } from './constants/version.js'
import { enableConfigs, getGlobalConfig, normalizeApiKeyForConfig, saveGlobalConfig } from './utils/config.js'
import 'dotenv/config'

// Make MACRO globally available
// This creates a global variable that's accessible throughout the application
// @ts-ignore - Extending global object
global.MACRO = MACRO;

console.log('Starting OpenAGI...')

try {
  // Enable configs before accessing any configuration
  enableConfigs()
  
  // Initialize basic context
  setContext('cwd', getCwd())
  
  // Load available tools
  const tools = getAllTools()
  console.log('Loaded tools:', tools.length)
  
  // Keep process alive
  process.stdin.resume()
} catch (error) {
  console.error('Failed to start:', error)
  process.exit(1)
}

export interface OpenAGIConfig {
  model?: string;
  workingDirectory?: string;
  enableArchitect?: boolean;
  autoApproveApiKey?: boolean;
}

class OpenAGI {
  private tools: any[] = [];
  private config: OpenAGIConfig;

  constructor(config: OpenAGIConfig = {}) {
    this.config = {
      model: 'gpt-4', // Default model, can be changed to any other model
      workingDirectory: process.cwd(),
      enableArchitect: false,
      autoApproveApiKey: true, // Auto-approve API key by default
      ...config
    };

    // Set working directory
    if (this.config.workingDirectory) {
      process.chdir(this.config.workingDirectory);
    }
    
    // Auto-approve API key for ant users
    if (this.config.autoApproveApiKey && 
        process.env.USER_TYPE === 'ant' && 
        process.env.ANTHROPIC_API_KEY) {
      this.approveCustomApiKey();
    }
  }
  
  private approveCustomApiKey() {
    if (!process.env.ANTHROPIC_API_KEY) return;
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const truncatedKey = normalizeApiKeyForConfig(apiKey);
    const config = getGlobalConfig();
    
    // Ensure customApiKeyResponses object exists
    if (!config.customApiKeyResponses) {
      config.customApiKeyResponses = {
        approved: [],
        rejected: []
      };
    }
    
    if (!config.customApiKeyResponses.approved) {
      config.customApiKeyResponses.approved = [];
    }
    
    // Add to approved keys if not already there
    if (!config.customApiKeyResponses.approved.includes(truncatedKey)) {
      config.customApiKeyResponses.approved.push(truncatedKey);
      console.log(`Auto-approved API key: sk-ant-...${truncatedKey}`);
    }
    
    // Remove from rejected if present
    if (config.customApiKeyResponses.rejected && 
        config.customApiKeyResponses.rejected.includes(truncatedKey)) {
      config.customApiKeyResponses.rejected = 
        config.customApiKeyResponses.rejected.filter(k => k !== truncatedKey);
    }
    
    // Save the updated config
    saveGlobalConfig(config);
  }

  async initialize() {
    // Enable configs
    enableConfigs()
    
    // Initialize tools
    this.tools = getAllTools();
    
    // Set up initial context
    setContext('model', this.config.model || 'gpt-4');
    setContext('cwd', getCwd());
    
    return this;
  }

  async getAvailableTools() {
    return this.tools;
  }

  // Add method to execute a tool
  async executeTool(toolName: string, params: any) {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool ${toolName} not found`);
    }
    
    // Tools in OpenAGI use call() not execute()
    if (typeof tool.call === 'function') {
      const abortController = new AbortController();
      const options = {
        commands: [],
        tools: this.tools,
        slowAndCapableModel: this.config.model || 'claude-3-7-sonnet-20250219',
        forkNumber: 0,
        messageLogName: 'default',
        maxThinkingTokens: 0
      };
      
      const context = {
        abortController,
        options,
        messageId: undefined,
        readFileTimestamps: {}
      };
      
      const generator = tool.call(params, context);
      
      // If it returns a generator, get the last value
      if (generator && typeof generator[Symbol.asyncIterator] === 'function') {
        let lastValue;
        for await (const value of generator) {
          lastValue = value;
        }
        return lastValue?.data;
      }
      
      // Otherwise, return the result directly
      return generator?.data;
    }
    
    // Fallback to execute if it exists (for custom tools)
    if (typeof tool.execute === 'function') {
      return await tool.execute(params);
    }
    
    throw new Error(`Tool ${toolName} doesn't have a valid execution method`);
  }
  
  // Add method to register a custom tool
  registerTool(tool: any) {
    this.tools.push(tool);
  }
}

export default OpenAGI;

// For backward compatibility
export { OpenAGI as ClaudeCode };

// Allow direct execution for testing
if (fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  (async () => {
    try {
      const assistant = new OpenAGI();
      await assistant.initialize();
      const tools = await assistant.getAvailableTools();
      console.log('Available tools:', tools.map(tool => tool.name));
    } catch (err) {
      console.error('Error during execution:', err);
      process.exit(1);
    }
  })();
}