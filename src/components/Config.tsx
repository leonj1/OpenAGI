import { Box, Text, useInput } from 'ink'
import * as React from 'react'
import { useState } from 'react'
import figures from 'figures'
import { getTheme } from '../utils/theme.js'
import {
  GlobalConfig,
  saveGlobalConfig,
  normalizeApiKeyForConfig,
} from '../utils/config.js'
import { getGlobalConfig } from '../utils/config.js'
import chalk from 'chalk'
import { PRODUCT_NAME } from '../constants/product.js'
import { useExitOnCtrlCD } from '../hooks/useExitOnCtrlCD.js'
import TextInput from './TextInput.js'

type Props = {
  onClose: () => void
}

type Setting =
  | {
      id: string
      label: string
      value: boolean
      onChange(value: boolean): void
      type: 'boolean'
    }
  | {
      id: string
      label: string
      value: string
      options: string[]
      onChange(value: string): void
      type: 'enum'
    }
  | {
      id: string
      label: string
      type: 'apikey'
      value: string
      onChange(value: string): void
    }

export function Config({ onClose }: Props): React.ReactNode {
  const [globalConfig, setGlobalConfig] = useState(getGlobalConfig())
  const initialConfig = React.useRef(getGlobalConfig())
  const [selectedIndex, setSelectedIndex] = useState(0)
  const exitState = useExitOnCtrlCD(() => process.exit(0))
  
  // API key editing state
  const [isEditingApiKey, setIsEditingApiKey] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(globalConfig.apiKey || '')
  const [apiKeyVisible, setApiKeyVisible] = useState(false)
  const [apiKeyInputCursorOffset, setApiKeyInputCursorOffset] = useState(0)

  // Available models
  const availableModels = [
    'claude-3-7-sonnet-20250219',
    'claude-3-5-haiku-20241022',
  ]

  // TODO: Add MCP servers
  const settings: Setting[] = [
    // Model selection
    {
      id: 'modelName',
      label: 'AI Model',
      value: globalConfig.modelName || 'claude-3-7-sonnet-20250219',
      options: availableModels,
      type: 'enum',
      onChange(modelName: string) {
        const config = { ...getGlobalConfig(), modelName }
        saveGlobalConfig(config)
        setGlobalConfig(config)
      },
    },
    // API Key setting
    {
      id: 'apiKey',
      label: 'API Key',
      value: globalConfig.apiKey ? 
        (apiKeyVisible ? globalConfig.apiKey : '•'.repeat(Math.min(20, globalConfig.apiKey.length))) : 
        'Not set',
      type: 'apikey',
      onChange(apiKey: string) {
        const config = { ...getGlobalConfig(), apiKey }
        saveGlobalConfig(config)
        setGlobalConfig(config)
        setIsEditingApiKey(false)
      },
    },
    // Global settings
    ...(process.env.ANTHROPIC_API_KEY
      ? [
          {
            id: 'customApiKey',
            label: `Use custom API key: ${chalk.bold(normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY))}`,
            value: Boolean(
              process.env.ANTHROPIC_API_KEY &&
                globalConfig.customApiKeyResponses?.approved?.includes(
                  normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY),
                ),
            ),
            type: 'boolean' as const,
            onChange(useCustomKey: boolean) {
              const config = { ...getGlobalConfig() }
              if (!config.customApiKeyResponses) {
                config.customApiKeyResponses = {
                  approved: [],
                  rejected: [],
                }
              }
              if (!config.customApiKeyResponses.approved) {
                config.customApiKeyResponses.approved = []
              }
              if (!config.customApiKeyResponses.rejected) {
                config.customApiKeyResponses.rejected = []
              }
              if (process.env.ANTHROPIC_API_KEY) {
                const truncatedKey = normalizeApiKeyForConfig(
                  process.env.ANTHROPIC_API_KEY,
                )
                if (useCustomKey) {
                  config.customApiKeyResponses.approved = [
                    ...config.customApiKeyResponses.approved.filter(
                      k => k !== truncatedKey,
                    ),
                    truncatedKey,
                  ]
                  config.customApiKeyResponses.rejected =
                    config.customApiKeyResponses.rejected.filter(
                      k => k !== truncatedKey,
                    )
                } else {
                  config.customApiKeyResponses.approved =
                    config.customApiKeyResponses.approved.filter(
                      k => k !== truncatedKey,
                    )
                  config.customApiKeyResponses.rejected = [
                    ...config.customApiKeyResponses.rejected.filter(
                      k => k !== truncatedKey,
                    ),
                    truncatedKey,
                  ]
                }
              }
              saveGlobalConfig(config)
              setGlobalConfig(config)
            },
          },
        ]
      : []),
    {
      id: 'verbose',
      label: 'Verbose output',
      value: globalConfig.verbose,
      type: 'boolean',
      onChange(verbose: boolean) {
        const config = { ...getGlobalConfig(), verbose }
        saveGlobalConfig(config)
        setGlobalConfig(config)
      },
    },
    {
      id: 'theme',
      label: 'Theme',
      value: globalConfig.theme,
      options: ['light', 'dark', 'light-daltonized', 'dark-daltonized', 'openagi'],
      type: 'enum',
      onChange(theme: GlobalConfig['theme']) {
        const config = { ...getGlobalConfig(), theme }
        saveGlobalConfig(config)
        setGlobalConfig(config)
      },
    },
    {
      id: 'notifChannel',
      label: 'Notifications',
      value: globalConfig.preferredNotifChannel,
      options: [
        'iterm2',
        'terminal_bell',
        'iterm2_with_bell',
        'notifications_disabled',
      ],
      type: 'enum',
      onChange(notifChannel: GlobalConfig['preferredNotifChannel']) {
        const config = {
          ...getGlobalConfig(),
          preferredNotifChannel: notifChannel,
        }
        saveGlobalConfig(config)
        setGlobalConfig(config)
      },
    },
  ]

  useInput((input, key) => {
    // If editing API key, handle that separately
    if (isEditingApiKey) {
      if (key.escape) {
        setIsEditingApiKey(false)
        setApiKeyInput(globalConfig.apiKey || '')
        return
      }
      return
    }
    
    if (key.escape) {
      // Log any changes that were made
      // TODO: Make these proper messages
      const changes: string[] = []
      
      // Check for model changes
      if (globalConfig.modelName !== initialConfig.current.modelName) {
        changes.push(`  ⎿  Set model to ${chalk.bold(globalConfig.modelName)}`)
      }
      
      // Check for API key changes
      if (globalConfig.apiKey !== initialConfig.current.apiKey) {
        changes.push(`  ⎿  Updated API key`)
      }
      
      // Check for API key changes
      const initialUsingCustomKey = Boolean(
        process.env.ANTHROPIC_API_KEY &&
          initialConfig.current.customApiKeyResponses?.approved?.includes(
            normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY),
          ),
      )
      const currentUsingCustomKey = Boolean(
        process.env.ANTHROPIC_API_KEY &&
          globalConfig.customApiKeyResponses?.approved?.includes(
            normalizeApiKeyForConfig(process.env.ANTHROPIC_API_KEY),
          ),
      )
      if (initialUsingCustomKey !== currentUsingCustomKey) {
        changes.push(
          `  ⎿  ${currentUsingCustomKey ? 'Enabled' : 'Disabled'} custom API key`,
        )
      }

      if (globalConfig.verbose !== initialConfig.current.verbose) {
        changes.push(`  ⎿  Set verbose to ${chalk.bold(globalConfig.verbose)}`)
      }
      if (globalConfig.theme !== initialConfig.current.theme) {
        changes.push(`  ⎿  Set theme to ${chalk.bold(globalConfig.theme)}`)
      }
      if (
        globalConfig.preferredNotifChannel !==
        initialConfig.current.preferredNotifChannel
      ) {
        changes.push(
          `  ⎿  Set notifications to ${chalk.bold(globalConfig.preferredNotifChannel)}`,
        )
      }
      if (changes.length > 0) {
        console.log(chalk.gray(changes.join('\n')))
      }
      onClose()
      return
    }

    function toggleSetting() {
      const setting = settings[selectedIndex]
      if (!setting || !setting.onChange) {
        return
      }

      if (setting.type === 'boolean') {
        setting.onChange(!setting.value)
        return
      }

      if (setting.type === 'enum') {
        const currentIndex = setting.options.indexOf(setting.value)
        const nextIndex = (currentIndex + 1) % setting.options.length
        setting.onChange(setting.options[nextIndex]!)
        return
      }
      
      if (setting.type === 'apikey') {
        // Enter API key editing mode
        setIsEditingApiKey(true)
        return
      }
    }

    if (key.return || input === ' ') {
      toggleSetting()
      return
    }

    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1))
    }

    if (key.downArrow) {
      setSelectedIndex(prev => Math.min(settings.length - 1, prev + 1))
    }
    
    // Toggle API key visibility with 'v' key
    if (input === 'v') {
      const setting = settings[selectedIndex]
      if (setting && setting.id === 'apiKey') {
        setApiKeyVisible(!apiKeyVisible)
      }
    }
  })

  function handleApiKeySubmit(value: string) {
    const setting = settings.find(s => s.id === 'apiKey') as Setting | undefined
    if (setting && setting.type === 'apikey' && setting.onChange) {
      setting.onChange(value)
    }
  }

  return (
    <>
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={getTheme().secondaryBorder}
        paddingX={1}
        marginTop={1}
      >
        <Box flexDirection="column" minHeight={2} marginBottom={1}>
          <Text bold>Settings</Text>
          <Text dimColor>Configure {PRODUCT_NAME} preferences</Text>
        </Box>

        {settings.map((setting, i) => {
          const isSelected = i === selectedIndex

          // If we're editing the API key and this is the API key setting
          if (isEditingApiKey && setting.id === 'apiKey') {
            return (
              <Box key={setting.id} height={2} minHeight={2}>
                <Box width={10}>
                  <Text color={isSelected ? 'blue' : undefined}>
                    {isSelected ? figures.pointer : ' '} {setting.label}:
                  </Text>
                </Box>
                <Box>
                  <TextInput
                    value={apiKeyInput}
                    onChange={setApiKeyInput}
                    onSubmit={handleApiKeySubmit}
                    placeholder="Enter your API key"
                    mask={apiKeyVisible ? undefined : '*'}
                    cursorOffset={apiKeyInputCursorOffset}
                    onChangeCursorOffset={setApiKeyInputCursorOffset}
                    columns={30}
                  />
                </Box>
                <Box marginLeft={2}>
                  <Text dimColor><Text bold>ESC</Text> to cancel</Text>
                </Box>
              </Box>
            )
          }

          return (
            <Box key={setting.id} height={2} minHeight={2}>
              <Box width={44}>
                <Text color={isSelected ? 'blue' : undefined}>
                  {isSelected ? figures.pointer : ' '} {setting.label}
                </Text>
              </Box>
              <Box>
                {setting.type === 'boolean' ? (
                  <Text color={isSelected ? 'blue' : undefined}>
                    {setting.value.toString()}
                  </Text>
                ) : (
                  <Text color={isSelected ? 'blue' : undefined}>
                    {setting.value.toString()}
                  </Text>
                )}
                {isSelected && setting.id === 'apiKey' && (
                  <Text dimColor> (press 'v' to {apiKeyVisible ? 'hide' : 'show'})</Text>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>
      <Box marginLeft={3}>
        <Text dimColor>
          {exitState.pending ? (
            <>Press {exitState.keyName} again to exit</>
          ) : isEditingApiKey ? (
            <>Enter to save · Esc to cancel</>
          ) : (
            <>↑/↓ to select · Enter/Space to change · Esc to close</>
          )}
        </Text>
      </Box>
    </>
  )
}
