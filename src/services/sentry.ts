/**
 * Stub implementation for Sentry service
 * This removes the dependency on the @sentry/node package
 */

// Remove original Sentry import
// import * as Sentry from '@sentry/node'
import { getUser } from '../utils/user.js'
import { env } from '../utils/env.js'
import { getCwd } from '../utils/state.js'
// import { SENTRY_DSN } from '../constants/keys.js'
import { getGateValues } from './statsig.js'
import { SESSION_ID } from '../utils/log.js'
import { getIsGit } from '../utils/git.js'
import { MACRO } from '../constants/version.js'

/**
 * Stub function that replaces Sentry initialization
 * Does nothing but logs a message to console in development
 */
export function initSentry(): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('Sentry initialization skipped (stub implementation)')
  }
  // No actual initialization of Sentry
}

/**
 * Stub function that replaces Sentry exception capturing
 * Logs the error to console in development but doesn't send to Sentry
 */
export async function captureException(error: unknown): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured (not sent to Sentry):', error)
      
      // Just collect the same data that would have been sent, but don't send it
      const [isGit, user] = await Promise.all([getIsGit(), getUser()])
      const extras = {
        nodeVersion: env.nodeVersion,
        platform: env.platform,
        cwd: getCwd(),
        isCI: env.isCI,
        isGit,
        isTest: process.env.NODE_ENV === 'test',
        packageVersion: MACRO.VERSION,
        sessionId: SESSION_ID,
        statsigGates: getGateValues(),
        terminal: env.terminal,
        userType: process.env.USER_TYPE,
      }
      
      // Log detailed info only in verbose mode
      if (process.env.DEBUG === '1') {
        console.debug('Error context:', extras)
        console.debug('User:', {
          id: user.userID,
          email: user.email,
        })
      }
    }
  } catch (err) {
    // Ignore errors in the error handler
    if (process.env.NODE_ENV === 'development') {
      console.error('Error in captureException:', err)
    }
  }
}
