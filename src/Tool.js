// Tool.js - Dummy implementation to fix TypeScript type errors

/**
 * Base Tool class with dummy implementations
 */
export class Tool {
  description = "";
  inputSchema = {
    safeParse: () => ({ success: true }),
  };

  constructor() {
    this.prompt = this.description;
  }

  needsPermissions(input) {
    return false;
  }

  validateInput(input, context) {
    return new ValidationResult(true);
  }

  call(input, context, canUseTool) {
    return Promise.resolve({ type: 'result', data: {} });
  }

  userFacingName() {
    return "Tool";
  }

  // Add generic static methods for compatibility
  static async description() {
    return "Tool description";
  }
  
  static prompt({ }) {
    return "Tool prompt";
  }

  static call(input, context) {
    return Promise.resolve({ data: {}, type: 'result' });
  }
}

/**
 * Validation result class
 */
export class ValidationResult {
  constructor(valid, errorMessage = "") {
    this.valid = valid;
    this.errorMessage = errorMessage;
  }
}

/**
 * Tool use context class
 */
export class ToolUseContext {
  constructor() {
    this.permissions = {};
  }
}

/**
 * Tool input schema definition
 */
export const ToolInputSchema = {
  object: () => ({ safeParse: () => ({ success: true }) }),
};

/**
 * Set Tool JSX function type
 */
export function SetToolJSXFn(fn) {
  // Dummy implementation
}

/**
 * Tool use context
 */
export const ToolUseCoantext = ToolUseContext;

// Add some additional exports to satisfy specific imports
export const z = {
  object: (schema) => ({
    safeParse: (data) => ({ success: true, data }),
    optional: () => ({ safeParse: (data) => ({ success: true, data }) }),
  }),
  string: () => ({
    optional: () => ({ safeParse: (data) => ({ success: true, data }) }),
  }),
  boolean: () => ({
    optional: () => ({ safeParse: (data) => ({ success: true, data }) }),
  }),
  array: (type) => ({
    optional: () => ({ safeParse: (data) => ({ success: true, data }) }),
  }),
}; 