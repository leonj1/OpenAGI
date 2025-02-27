import { Box, Text } from 'ink'
import React from 'react'
import { getTheme } from '../utils/theme.js'

export function AsciiLogo(): React.ReactNode {
  const theme = getTheme()
  return (
    <Box flexDirection="column" alignItems="flex-start">
      <Text color={theme.openagi}>
        {
`
╭──────────────────────────────────────────────────────────╮
│  ██████╗ ██████╗ ███████╗███╗   ██╗                      │
│ ██╔═══██╗██╔══██╗██╔════╝████╗  ██║                      │
│ ██║   ██║██████╔╝█████╗  ██╔██╗ ██║                      │
│ ██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║                      │
│ ╚██████╔╝██║     ███████╗██║ ╚████║                      │
│  ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝                      │
│                                                          │
│  █████╗  ██████╗ ██╗      ✧ A NEW ERA OF                 │
│ ██╔══██╗██╔════╝ ██║        AI ASSISTANCE                │
│ ███████║██║  ███╗██║      ───────────────                │
│ ██╔══██║██║   ██║██║      ✦ INTELLIGENT                  │
│ ██║  ██║╚██████╔╝██║      ✦ CREATIVE                     │
│ ╚═╝  ╚═╝ ╚═════╝ ╚═╝      ✦ HELPFUL                      │
╰──────────────────────────────────────────────────────────╯
`.trim()}
      </Text>
    </Box>
  )
}
