import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { getTheme } from '../utils/theme.js'
import { AnimatedClaudeAsterisk } from './AnimatedClaudeAsterisk.js'

// Animated frames for the startup sequence
const frames = [
  `
   ░░░░░░░░░░░░░░
   ░░░░░░░░░░░░░░
   ░░░░░░░░░░░░░░
`,
  `
   ▒▒░░░░░░░░░░░░
   ▒▒░░░░░░░░░░░░
   ▒▒░░░░░░░░░░░░
`,
  `
   ▓▓▒▒░░░░░░░░░░
   ▓▓▒▒░░░░░░░░░░
   ▓▓▒▒░░░░░░░░░░
`,
  `
   ██▓▓▒▒░░░░░░░░
   ██▓▓▒▒░░░░░░░░
   ██▓▓▒▒░░░░░░░░
`,
  `
   ████▓▓▒▒░░░░░░
   ████▓▓▒▒░░░░░░
   ████▓▓▒▒░░░░░░
`,
  `
   ██████▓▓▒▒░░░░
   ██████▓▓▒▒░░░░
   ██████▓▓▒▒░░░░
`,
  `
   ████████▓▓▒▒░░
   ████████▓▓▒▒░░
   ████████▓▓▒▒░░
`,
  `
   ██████████▓▓▒▒
   ██████████▓▓▒▒
   ██████████▓▓▒▒
`,
  `
   ████████████▓▓
   ████████████▓▓
   ████████████▓▓
`,
  `
   ██████████████
   ██████████████
   ██████████████
`,
]

// Messages that fade in during startup
const messages = [
  'Initializing neural networks...',
  'Loading semantic embeddings...',
  'Calibrating reasoning capabilities...',
  'Activating creative modules...',
  'Establishing code understanding...',
  'Ready to assist...',
]

interface Props {
  onComplete: () => void
}

export function AnimatedStartup({ onComplete }: Props): React.ReactNode {
  const [frameIndex, setFrameIndex] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showLogo, setShowLogo] = useState(false)
  const theme = getTheme()

  // Progress the animation frames
  useEffect(() => {
    if (!visible) return

    const timer = setTimeout(() => {
      if (frameIndex < frames.length - 1) {
        setFrameIndex(prevIndex => prevIndex + 1)
      } else if (messageIndex < messages.length - 1) {
        setMessageIndex(prevIndex => prevIndex + 1)
      } else {
        // Show logo briefly before completing
        setShowLogo(true)
        setTimeout(() => {
          setVisible(false)
          onComplete()
        }, 2000)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [frameIndex, visible, messageIndex, onComplete])

  if (!visible) {
    return null
  }

  return (
    <Box flexDirection="column" alignItems="center" justifyContent="center" padding={2}>
      {showLogo ? (
        <Box flexDirection="column" alignItems="center" gap={1}>
          <Text bold color={theme.claude}>
            OPEN AGI ACTIVATED
          </Text>
          <Text color={theme.claude}>
            <AnimatedClaudeAsterisk size="large" />
          </Text>
        </Box>
      ) : (
        <>
          <Box marginY={1}>
            <Text color={theme.claude}>{frames[frameIndex]}</Text>
          </Box>
          <Box>
            <Text color={theme.secondaryText}>{messages[messageIndex]}</Text>
            <AnimatedClaudeAsterisk size="small" />
          </Box>
        </>
      )}
    </Box>
  )
} 