# Claude Code Project Structure

## Root Directory
- `src/` - Source code
- `.git/` - Git repository
- `README.md` - Project documentation
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## Source Code Structure (`src/`)

### Core Files
- `index.ts` - Main entry point
- `tools.ts` - Tool definitions
- `messages.ts` - Message handling
- `permissions.ts` - Permission system
- `query.ts` - Query handling
- `history.ts` - History tracking
- `cost-tracker.ts` - Cost tracking
- `context.ts` - Context management
- `commands.ts` - Command handling
- `ProjectOnboarding.tsx` - Onboarding UI

### Directories
1. `utils/` - Utility functions
   - File operations
   - Git operations
   - Terminal handling
   - Configuration
   - Logging
   - And many more utility modules

2. `tools/` - Tool implementations
   - `AgentTool/`
   - `ArchitectTool/`
   - `BashTool/`
   - `FileReadTool/`
   - `FileWriteTool/`
   - `FileEditTool/`
   - `GrepTool/`
   - `GlobTool/`
   - `LSTool/`
   - `MCPTool/`
   - `MemoryReadTool/`
   - `MemoryWriteTool/`
   - `NotebookReadTool/`
   - `NotebookEditTool/`
   - `StickerRequestTool/`
   - `ThinkTool/`

3. `services/` - External service integrations
   - `claude.ts` - Claude AI integration
   - `sentry.ts` - Error tracking
   - `statsig.ts` - Analytics
   - `oauth.ts` - Authentication
   - `mcpClient.ts` - MCP client
   - `vcr.ts` - VCR functionality
   - `notifier.ts` - Notifications
   - `browserMocks.ts` - Browser mocks

4. `screens/` - Terminal UI screens
5. `hooks/` - React hooks
6. `entrypoints/` - Application entry points
7. `constants/` - Constant definitions
8. `components/` - React components
9. `commands/` - Command implementations 