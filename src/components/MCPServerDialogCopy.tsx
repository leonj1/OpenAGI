import React from 'react'
import { Text } from 'ink'
import Link from 'ink-link'
import { MACRO } from '../constants/version.js'

export function MCPServerDialogCopy(): React.ReactNode {
  return (
    <>
      <Text>
        MCP servers provide additional functionality to Claude. They may execute
        code, make network requests, or access system resources via tool calls.
        All tool calls will require your explicit approval before execution. For
        more information, see{' '}
        <Link url={MACRO.MCP_URL}>
          MCP documentation
        </Link>
      </Text>

      <Text dimColor>
        Remember: You can always change these choices later by running `claude
        mcp reset-mcprc-choices`
      </Text>
    </>
  )
}
