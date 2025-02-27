// Types for log functionality

/**
 * LogOption class representing a log entry option
 */
export class LogOption {
  constructor() {
    this.created = new Date();
    this.modified = new Date();
    this.messageCount = 0;
    this.firstPrompt = '';
    this.sidechainNumber = 0;
    this.value = '';
  }
}

/**
 * SerializedMessage class for log messages
 */
export class SerializedMessage {
  constructor() {
    this.id = '';
    this.type = 'user';
    this.content = '';
    this.timestamp = new Date();
  }
}

/**
 * LogListProps interface for log list component
 */
export class LogListProps {
  constructor() {
    this.type = 'log';
    this.logNumber = 0;
  }
}

// Additional exports to satisfy imports
export default {
  LogOption,
  SerializedMessage,
  LogListProps
}; 