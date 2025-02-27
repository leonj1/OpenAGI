// Mock implementation of @anthropic-ai/vertex-sdk
export class AnthropicVertex {
  constructor(config = {}) {
    this.apiKey = config.apiKey || '';
    this.baseURL = config.baseURL || '';
  }

  messages(options = {}) {
    return {
      stream: async () => ({
        on: (event, callback) => {},
        off: (event, callback) => {},
        once: (event, callback) => {},
        removeAllListeners: () => {},
      }),
      text: async () => "",
      json: async () => ({}),
    };
  }
}

// Tool namespace for type compatibility
AnthropicVertex.Tool = {
  InputSchema: {},
};

export default AnthropicVertex; 