import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { getTheme } from '../utils/theme.js'
import TextInput from './TextInput.js'
import { Select } from './CustomSelect/select.js'
import { AnimatedClaudeAsterisk } from './AnimatedClaudeAsterisk.js'
import { SimpleSpinner } from './Spinner.js'
import { PRODUCT_NAME } from '../constants/product.js'

// Popular AI model options
const MODEL_OPTIONS = [
  { label: 'Claude 3.7 Sonnet', value: 'claude-3-7-sonnet-20250219' },
  { label: 'Claude 3.5 Haiku', value: 'claude-3-5-haiku-20241022' },
]

interface ModelConfigStepProps {
  onComplete: (modelName: string, apiKey: string) => void
}

export function ModelConfigStep({ onComplete }: ModelConfigStepProps): React.ReactNode {
  const [selectedModelOption, setSelectedModelOption] = useState(MODEL_OPTIONS[0])
  const [customModelName, setCustomModelName] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [focusedElement, setFocusedElement] = useState<'show' | 'connect' | null>(null)
  const theme = getTheme()

  // Handle keyboard input
  useInput((input, key) => {
    if (key.return) {
      if (focusedElement === 'show') {
        toggleApiKeyVisibility()
      } else if (focusedElement === 'connect' && !isValidating) {
        handleSubmit()
      }
    }
    
    // Tab navigation between focusable elements
    if (key.tab) {
      if (focusedElement === null) {
        setFocusedElement('show')
      } else if (focusedElement === 'show') {
        setFocusedElement('connect')
      } else {
        setFocusedElement('show')
      }
    }
  })

  // Toggle API key visibility
  const toggleApiKeyVisibility = () => {
    setApiKeyVisible(!apiKeyVisible)
  }

  // Handle model selection
  const handleModelSelection = (value: string) => {
    const selected = MODEL_OPTIONS.find(option => option.value === value)
    if (selected) {
      setSelectedModelOption(selected)
      // Clear any previous error
      setErrorMessage('')
    }
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate inputs
    if (!apiKey) {
      setErrorMessage('API key is required')
      return
    }

    // For custom model, ensure a name is provided
    if (selectedModelOption.value === 'custom' && !customModelName) {
      setErrorMessage('Custom model name is required')
      return
    }

    // Show validation spinner
    setIsValidating(true)

    // Simulate validation (in a real app, you would verify the API key here)
    setTimeout(() => {
      setIsValidating(false)
      
      // Determine which model name to use
      const modelName = selectedModelOption.value === 'custom' 
        ? customModelName 
        : selectedModelOption.value
        
      // Call the completion handler with the model name and API key
      onComplete(modelName, apiKey)
    }, 1500)
  }

  return (
    <Box flexDirection="column" gap={1} paddingLeft={1}>
      <Box marginY={1}>
        <AnimatedClaudeAsterisk size="small" />
        <Text color={theme.claude} bold> Connect Your AI Model</Text>
      </Box>

      <Box flexDirection="column" gap={1} borderStyle="round" borderColor={theme.claude} padding={1}>
        <Text>
          {PRODUCT_NAME} needs to connect to an AI model to provide assistance.
        </Text>
        
        <Box flexDirection="column" marginTop={1}>
          <Text bold>Select Model:</Text>
          <Select
            options={MODEL_OPTIONS.map(option => ({ 
              label: option.label, 
              value: option.value 
            }))}
            onChange={handleModelSelection}
          />
        </Box>

        {selectedModelOption.value === 'custom' && (
          <Box flexDirection="column" marginTop={1}>
            <Text bold>Custom Model Name:</Text>
            <Box>
              <TextInput
                value={customModelName}
                onChange={setCustomModelName}
                placeholder="Enter custom model name"
                columns={30}
                cursorOffset={0}
                onChangeCursorOffset={() => {}}
              />
            </Box>
          </Box>
        )}

        <Box flexDirection="column" marginTop={1}>
          <Box>
            <Text bold>API Key:</Text>
            <Text dimColor> (for {selectedModelOption.label})</Text>
          </Box>
          <Box>
            <TextInput
              value={apiKey}
              onChange={setApiKey}
              placeholder="Enter your API key"
              mask={apiKeyVisible ? undefined : '*'}
              columns={30}
              cursorOffset={0}
              onChangeCursorOffset={() => {}}
            />
            <Box marginLeft={1}>
              <Text 
                color={focusedElement === 'show' ? theme.claude : theme.secondaryText} 
                underline 
                dimColor={apiKeyVisible}
              >
                {apiKeyVisible ? 'Hide' : 'Show'}
              </Text>
            </Box>
          </Box>
        </Box>

        {errorMessage && (
          <Box marginTop={1}>
            <Text color={theme.error}>{errorMessage}</Text>
          </Box>
        )}

        <Box marginTop={1}>
          {isValidating ? (
            <Box>
              <SimpleSpinner />
              <Text> Validating credentials...</Text>
            </Box>
          ) : (
            <Box>
              <Text 
                backgroundColor={theme.claude} 
                color={theme.text} 
                bold
              >
                <Box paddingLeft={2} paddingRight={2}>
                  Connect
                </Box>
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      <Box marginTop={1} flexDirection="column">
        <Text dimColor>
          Your API key is stored locally and used only for communicating with the AI model.
        </Text>
        <Text dimColor>
          You can change these settings later by running /config.
        </Text>
      </Box>
    </Box>
  )
} 