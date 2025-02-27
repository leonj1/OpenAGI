/**
 * Interface for tools that can be used by Claude Code
 */
export interface Tool {
  name: string;
  description: string;
  isEnabled: () => Promise<boolean>;
  isReadOnly: () => boolean;
  execute: (params: any) => Promise<any>;
} 