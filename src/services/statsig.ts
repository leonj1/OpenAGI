/**
 * Stub implementation for Statsig service
 * This removes the dependency on the @statsig/js-client package
 */

import React from 'react'
import { memoize } from 'lodash-es'
import { SESSION_ID } from '../utils/log.js'

// Removed imports
// import {
//   StatsigClient,
//   StatsigOptions,
//   StatsigEvent,
//   LogLevel,
// } from '@statsig/js-client'
// import './browserMocks.js' // Initialize browser mocks
// import { FileSystemStorageProvider } from './statsigStorage.js'
// import { STATSIG_CLIENT_KEY } from '../constants/keys.js'

// Track gate values locally
const gateValues: Record<string, boolean> = {}

// Stub client
export const initializeStatsig = memoize(
  async (): Promise<null> => {
    // Just return null to indicate no Statsig client
    return null
  },
)

/**
 * Stub for logging events - does nothing in production
 * In development mode with debug flag, logs to console
 */
export function logEvent(
  eventName: string,
  metadata: { [key: string]: string | undefined },
): void {
  // Debug logging when debug mode is enabled
  if (
    process.env.USER_TYPE === 'ant' &&
    (process.argv.includes('--debug') || process.argv.includes('-d'))
  ) {
    console.log(
      `[DEBUG-ONLY] Statsig event stub: ${eventName}`,
      metadata
    )
  }
}

/**
 * Stub for checking feature gates - always returns default (false)
 */
export const checkGate = memoize(async (gateName: string): Promise<boolean> => {
  // Always return false (disabled) for gates
  return false
})

/**
 * React hook for feature gates - always uses default value
 */
export const useStatsigGate = (gateName: string, defaultValue = false) => {
  // Always return the default value
  return defaultValue
}

/**
 * Return tracked gate values (empty in stub)
 */
export function getGateValues(): Record<string, boolean> {
  return { ...gateValues }
}

/**
 * Stub for experiment values - always returns default
 */
export const getExperimentValue = memoize(
  async <T>(experimentName: string, defaultValue: T): Promise<T> => {
    return defaultValue
  },
)

/**
 * Stub for dynamic config - always returns default
 */
export const getDynamicConfig = async <T>(
  configName: string,
  defaultValue: T,
): Promise<T> => {
  return defaultValue
}
