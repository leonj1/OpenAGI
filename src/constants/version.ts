/**
 * Global version information for the application
 * Used for displaying version info and checking for updates
 */
export const MACRO = {
  // Version from package.json
  VERSION: '1.0.0',
  
  // Build number or git commit hash (if available)
  BUILD: 'development',
  
  // Build date
  BUILD_DATE: new Date().toISOString(),
  
  // Package URL for updates
  PACKAGE_URL: 'https://www.npmjs.com/package/claude-code-standalone',
  
  // README URL for documentation links
  README_URL: 'https://docs.anthropic.com/claude/docs/claude-code',
  
  // Issues explainer for bug reports
  ISSUES_EXPLAINER: 'create an issue on GitHub',

  // Cost threshold URL for spending notifications
  COST_THRESHOLD_URL: 'https://docs.anthropic.com/s/claude-code-cost',

  // Security URL for trust dialog
  SECURITY_URL: 'https://docs.anthropic.com/s/claude-code-security',

  // MCP URL for MCP documentation
  MCP_URL: 'https://docs.anthropic.com/s/claude-code-mcp',
} 