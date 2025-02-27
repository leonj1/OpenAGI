import React, { useMemo, useState, useEffect } from 'react'
import { PRODUCT_NAME } from '../constants/product.js'
import { Box, Newline, Text, useInput } from 'ink'
import {
  getGlobalConfig,
  saveGlobalConfig,
  getCustomApiKeyStatus,
  normalizeApiKeyForConfig,
  DEFAULT_GLOBAL_CONFIG,
} from '../utils/config.js'
import { OrderedList } from '@inkjs/ui'
import { useExitOnCtrlCD } from '../hooks/useExitOnCtrlCD.js'
import { MIN_LOGO_WIDTH } from './Logo.js'
import { ConsoleOAuthFlow } from './ConsoleOAuthFlow.js'
import { ApproveApiKey } from './ApproveApiKey.js'
import { Select } from './CustomSelect/select.js'
import { StructuredDiff } from './StructuredDiff.js'
import { getTheme, ThemeNames } from '../utils/theme.js'
import { isAnthropicAuthEnabled } from '../utils/auth.js'
import Link from './Link.js'
import { clearTerminal } from '../utils/terminal.js'
import { PressEnterToContinue } from './PressEnterToContinue.js'
import { MACRO } from '../constants/version.js'
import { AsciiLogo } from './AsciiLogo.js'
import { SimpleSpinner } from './Spinner.js'
import { ModelConfigStep } from './ModelConfigStep.js'

type StepId = 'theme' | 'oauth' | 'api-key' | 'usage' | 'security' | 'welcome' | 'model-config' | 'about'

interface OnboardingStep {
  id: StepId
  component: React.ReactNode
}

type Props = {
  onDone(): void
}

// Fancy border frames
const borders = {
  topLeft: '╭',
  topRight: '╮',
  bottomRight: '╯',
  bottomLeft: '╰',
  horizontal: '━',
  vertical: '┃',
}

// Function to create a horizontal border with specified width
const horizontalBorder = (width: number, char = borders.horizontal) => char.repeat(width)

// Function to create a fancy box with a title
function FancyBox({ 
  children, 
  title = '', 
  width = 70, 
  padding = 1, 
  borderColor = 'gray' 
}: { 
  children: React.ReactNode, 
  title?: string, 
  width?: number, 
  padding?: number, 
  borderColor?: string 
}) {
  const theme = getTheme()
  const color = theme[borderColor] || borderColor
  const contentWidth = width - 2
  return (
    <Box flexDirection="column">
      <Box>
        <Text color={color}>{borders.topLeft}</Text>
        {title ? (
          <>
            <Text color={color}>{horizontalBorder(2)}</Text>
            <Text color={theme.openagi} bold> {title} </Text>
            <Text color={color}>{horizontalBorder(contentWidth - title.length - 4)}</Text>
          </>
        ) : (
          <Text color={color}>{horizontalBorder(contentWidth)}</Text>
        )}
        <Text color={color}>{borders.topRight}</Text>
      </Box>
      <Box>
        <Text color={color}>{borders.vertical}</Text>
        <Box 
          paddingX={padding} 
          paddingY={padding} 
          width={contentWidth}
          flexDirection="column"
        >
          {children}
        </Box>
        <Text color={color}>{borders.vertical}</Text>
      </Box>
      <Box>
        <Text color={color}>{borders.bottomLeft}</Text>
        <Text color={color}>{horizontalBorder(contentWidth)}</Text>
        <Text color={color}>{borders.bottomRight}</Text>
      </Box>
    </Box>
  )
}

export function Onboarding({ onDone }: Props): React.ReactNode {
  // Avoid clearing terminal immediately on mount which causes empty screen
  // Instead, we'll make sure our initial render is immediate and visible
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Only clear terminal when changing steps after initial render
  useEffect(() => {
    // Set initialized after first render
    setIsInitialized(true)
  }, []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const config = getGlobalConfig()
  const [selectedTheme, setSelectedTheme] = useState(
    DEFAULT_GLOBAL_CONFIG.theme,
  )
  const theme = getTheme()
  const [easterEggActivated, setEasterEggActivated] = useState(false)
  const [konami, setKonami] = useState<string[]>([])
  const konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a']

  function goToNextStep() {
    if (currentStepIndex < steps.length - 1) {
      // Clear terminal between steps, but not on initial render
      process.stdout.write('\x1Bc');
      clearTerminal();
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)
    }
  }

  function handleThemeSelection(newTheme: string) {
    saveGlobalConfig({
      ...config,
      theme: newTheme as ThemeNames,
    })
    goToNextStep()
  }

  function handleThemePreview(newTheme: string) {
    setSelectedTheme(newTheme as ThemeNames)
  }
  
  function handleModelConfig(modelName: string, apiKey: string) {
    // Save the model name and API key to the global config
    saveGlobalConfig({
      ...config,
      modelName,
      apiKey,
    })
    goToNextStep()
  }

  const exitState = useExitOnCtrlCD(() => process.exit(0))

  // Navigation input handler
  useInput(async (_, key) => {
    const currentStep = steps[currentStepIndex]
    if (
      key.return &&
      currentStep &&
      ['welcome', 'about', 'usage', 'security'].includes(currentStep.id)
    ) {
      // Clear terminal before navigating to next step
      process.stdout.write('\x1Bc');
      await clearTerminal();
      if (currentStepIndex === steps.length - 1) {
        onDone()
      } else {
        goToNextStep()
      }
    }
  })

  // Konami code easter egg
  useInput((input, key) => {
    // Don't process if the Easter egg is already activated
    if (easterEggActivated) return
    
    let newKonami = [...konami]
    
    if (key.upArrow) newKonami.push('up')
    else if (key.downArrow) newKonami.push('down')
    else if (key.leftArrow) newKonami.push('left')
    else if (key.rightArrow) newKonami.push('right')
    else if (input.toLowerCase() === 'a') newKonami.push('a')
    else if (input.toLowerCase() === 'b') newKonami.push('b')
    else newKonami = [] // Reset on any other key
    
    // Keep only the last 10 keys (length of Konami code)
    if (newKonami.length > 10) {
      newKonami = newKonami.slice(newKonami.length - 10)
    }
    
    setKonami(newKonami)
    
    // Check if the Konami code is complete
    if (newKonami.length === 10 && 
        newKonami.every((value, index) => value === konamiCode[index])) {
      setEasterEggActivated(true)
      // Reset after 5 seconds
      setTimeout(() => setEasterEggActivated(false), 5000)
    }
  })

  // Welcome screen with static content - showing only logo and welcome message
  const welcomeStep = (
    <Box flexDirection="column" gap={1} alignItems="center" paddingLeft={1}>
      <AsciiLogo />
      
      <Box marginY={2} marginTop={3}>
        <Text bold color={theme.openagi} backgroundColor={theme.text}>
          Welcome to {PRODUCT_NAME}! 
        </Text>
      </Box>
      
      <Box marginTop={3}>
        <Text color={theme.permission}>
          Press <Text bold>Enter</Text> to start your personalized setup...
        </Text>
      </Box>
    </Box>
  )

  // About and features step added separately
  const aboutStep = (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      <Box marginY={1}>
        <Text color={theme.openagi} bold>About {PRODUCT_NAME}</Text>
      </Box>
      
      <FancyBox title="About" borderColor="claude" width={72}>
        <Box flexDirection="column" gap={1}>
          <Text>
            {PRODUCT_NAME} is an advanced AI coding assistant that helps you analyze, 
            edit, and understand code through natural language.
          </Text>
          <Text>
            Powered by Claude's advanced reasoning capabilities, it can work with your
            projects to solve complex problems and enhance your development workflow.
          </Text>
        </Box>
      </FancyBox>
      
      <FancyBox title="Features" width={72}>
        <Box flexDirection="column" gap={1}>
          <Box>
            <Text color={theme.openagi}>✦</Text>
            <Text bold> Code Analysis </Text>
            <Text dimColor>- Deep understanding of your codebase structure</Text>
          </Box>
          <Box>
            <Text color={theme.openagi}>✦</Text>
            <Text bold> Intelligent Editing </Text>
            <Text dimColor>- Precise file modifications based on your needs</Text>
          </Box>
          <Box>
            <Text color={theme.openagi}>✦</Text>
            <Text bold> Shell Commands </Text>
            <Text dimColor>- Run and explain terminal operations</Text>
          </Box>
          <Box>
            <Text color={theme.openagi}>✦</Text>
            <Text bold> Natural Conversations </Text>
            <Text dimColor>- Talk about your code like you would with a colleague</Text>
          </Box>
        </Box>
      </FancyBox>
      
      <Box marginTop={1}>
        <Text color={theme.permission}>
          Press <Text bold>Enter</Text> to continue...
        </Text>
      </Box>
    </Box>
  )

  // Define all onboarding steps with no animations
  const themeStep = (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      <Box marginY={1}>
        <Text color={theme.openagi} bold>Personalize Your Experience</Text>
      </Box>

      <FancyBox title="Theme Selection" width={75}>
        <Box flexDirection="column" gap={1}>
          <Text>Choose the option that looks best when you select it:</Text>
          <Text dimColor>To change this later, run /config</Text>
        
          <Select
            options={[
              { label: 'OpenAGI Theme (Recommended)', value: 'openagi' },
              { label: 'Light text', value: 'dark' },
              { label: 'Dark text', value: 'light' },
              {
                label: 'Light text (colorblind-friendly)',
                value: 'dark-daltonized',
              },
              {
                label: 'Dark text (colorblind-friendly)',
                value: 'light-daltonized',
              },
            ]}
            onFocus={handleThemePreview}
            onChange={handleThemeSelection}
          />
        
          <Box flexDirection="column" marginTop={1}>
            <Text>Preview:</Text>
            <Box
              marginTop={1}
              paddingLeft={1}
              marginRight={1}
              borderStyle="round"
              borderColor="gray"
              flexDirection="column"
            >
              <StructuredDiff
                patch={{
                  oldStart: 1,
                  newStart: 1,
                  oldLines: 3,
                  newLines: 3,
                  lines: [
                    'function greet() {',
                    '-  console.log("Hello, World!");',
                    '+  console.log("Hello, Claude!");',
                    '}',
                  ],
                }}
                dim={false}
                width={40}
                overrideTheme={selectedTheme}
              />
            </Box>
          </Box>
        </Box>
      </FancyBox>
    </Box>
  )

  const securityStep = (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      <Box marginY={1}>
        <Text color={theme.openagi} bold>Security Information</Text>
      </Box>

      <FancyBox title="Security Notes" width={72} borderColor="warning">
        <Box flexDirection="column" gap={1} width={70}>
          <OrderedList>
            <OrderedList.Item>
              <Text bold>{PRODUCT_NAME} is currently in research preview</Text>
              <Text color={theme.secondaryText} wrap="wrap">
                This beta version may have limitations or unexpected behaviors.
                <Newline />
                Run /bug at any time to report issues.
                <Newline />
              </Text>
            </OrderedList.Item>
            <OrderedList.Item>
              <Text bold>AI models can make mistakes</Text>
              <Text color={theme.secondaryText} wrap="wrap">
                You should always review AI responses, especially when
                <Newline />
                running code.
                <Newline />
              </Text>
            </OrderedList.Item>
            <OrderedList.Item>
              <Text bold>
                Due to prompt injection risks, only use it with code you trust
              </Text>
              <Text color={theme.secondaryText} wrap="wrap">
                For more details see:
                <Newline />
                <Link url={MACRO.SECURITY_URL} />
              </Text>
            </OrderedList.Item>
          </OrderedList>
        </Box>
      </FancyBox>
      
      <Box marginTop={1} flexDirection="column">
        <PressEnterToContinue />
      </Box>
    </Box>
  )

  const usageStep = (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      <Box marginY={1}>
        <Text color={theme.openagi} bold>Getting Started</Text>
      </Box>

      <FancyBox title="Best Practices" width={72} borderColor="success">
        <Box flexDirection="column" gap={1} width={70}>
          <OrderedList>
            <OrderedList.Item>
              <Text bold>
                Start in your project directory
              </Text>
              <Text color={theme.secondaryText}>
                Files are automatically added to context when needed.
              </Text>
              <Newline />
            </OrderedList.Item>
            <OrderedList.Item>
              <Text bold>
                Use {PRODUCT_NAME} as a development partner
              </Text>
              <Text color={theme.secondaryText}>
                Get help with file analysis, editing, bash commands,
                <Newline />
                and git history.
              </Text>
              <Newline />
            </OrderedList.Item>
            <OrderedList.Item>
              <Text bold>
                Provide clear context
              </Text>
              <Text color={theme.secondaryText}>
                Be as specific as you would with another engineer. <Newline />
                The better the context, the better the results.
              </Text>
              <Newline />
            </OrderedList.Item>
          </OrderedList>
          
          <Box marginTop={1} paddingX={1} borderStyle="single" borderColor={theme.openagi}>
            <Text bold color={theme.openagi}>
              For more details on {PRODUCT_NAME}, see:
              <Newline />
              <Link url={MACRO.README_URL} />
            </Text>
          </Box>
        </Box>
      </FancyBox>
      
      <Box marginTop={1} flexDirection="column">
        <PressEnterToContinue />
      </Box>
    </Box>
  )

  // Model configuration step
  const modelConfigStep = (
    <ModelConfigStep onComplete={handleModelConfig} />
  )

  // Create the steps array
  const steps: OnboardingStep[] = []
  
  // Add welcome step
  steps.push({ id: 'welcome', component: welcomeStep })
  
  // Add about step
  steps.push({ id: 'about', component: aboutStep })
  
  // Add theme step
  steps.push({ id: 'theme', component: themeStep })
  
  // Add model configuration step
  steps.push({ id: 'model-config', component: modelConfigStep })

  // Add security step
  steps.push({ id: 'security', component: securityStep })

  // Add usage step as the last content step
  steps.push({ id: 'usage', component: usageStep })
  
  // If the Easter egg is activated, add a special overlay
  const easterEggOverlay = easterEggActivated ? (
    <Box 
      position="absolute"
      width="100%"
      height={20}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Text bold color="#FF00FF">
        {`
  ⭐️ DEVELOPER MODE ACTIVATED ⭐️
  
  UNLIMITED POWER UNLOCKED!
  QUANTUM ALGORITHMS ENGAGED!
  NEURAL PATHWAYS OPTIMIZED!
  
  "With great power comes great responsibility."
        `}
      </Text>
    </Box>
  ) : null
  
  return (
    <Box flexDirection="column" gap={1}>
      {easterEggOverlay}
      <SimpleWelcomeBox step={currentStepIndex + 1} totalSteps={steps.length} />
      <Box flexDirection="column" padding={0} gap={0}>
        {steps[currentStepIndex]?.component}
        {exitState.pending && (
          <Box padding={1}>
            <Text dimColor>Press {exitState.keyName} again to exit</Text>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export function WelcomeBox(): React.ReactNode {
  const theme = getTheme()
  return (
    <Box
      borderColor={theme.openagi}
      borderStyle="round"
      paddingX={1}
      width={MIN_LOGO_WIDTH}
    >
      <Text>
        <Text color={theme.openagi}>✻</Text> Welcome to{' '}
        <Text bold>{PRODUCT_NAME}</Text> research preview!
      </Text>
    </Box>
  )
}

// Simplified welcome box with no animations
function SimpleWelcomeBox({ step, totalSteps }: { step: number, totalSteps: number }): React.ReactNode {
  const theme = getTheme()
  return (
    <Box
      borderColor={theme.openagi}
      borderStyle="round"
      paddingX={1}
      width={MIN_LOGO_WIDTH}
    >
      <Text>
        <Text color={theme.openagi}>✻</Text>
        <Text> Welcome to </Text>
        <Text bold color={theme.openagi}>{PRODUCT_NAME}</Text>
        <Text> research preview! </Text>
        <Text dimColor>[{step}/{totalSteps}]</Text>
      </Text>
    </Box>
  )
}
