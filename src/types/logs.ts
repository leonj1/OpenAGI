/**
 * Represents a log option for conversation history
 */
export interface LogOption {
  /**
   * The date of the conversation, used as part of the log name
   */
  date: string;
  
  /**
   * The fork number of the conversation
   */
  forkNumber?: number;
  
  /**
   * The serialized messages from the conversation
   */
  messages: any[];
  
  /**
   * Full path to the log file
   */
  fullPath: string;
  
  /**
   * Display text to show in the UI
   */
  displayText?: string;
} 