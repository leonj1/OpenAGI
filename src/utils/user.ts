import { getGlobalConfig, getOrCreateUserID } from './config.js'
import { memoize } from 'lodash-es'
import { env } from './env.js'
import { type StatsigUser } from '@statsig/js-client'
import { execFileNoThrow } from './execFileNoThrow.js'
import { logError, SESSION_ID } from './log.js'

export const getGitEmail = memoize(async (): Promise<string | undefined> => {
  const result = await execFileNoThrow('git', ['config', 'user.email'])
  if (result.code !== 0) {
    logError(`Failed to get git email: ${result.stdout} ${result.stderr}`)
    return undefined
  }
  return result.stdout.trim() || undefined
})

export const getUser = memoize(async (): Promise<StatsigUser> => {
  const userID = getOrCreateUserID()
  const config = getGlobalConfig()
  
  // Provide a default email if none is available
  const email = process.env.ANTHROPIC_API_KEY 
    ? 'default@example.com'
    : (await getGitEmail()) || 'default@example.com';

  return {
    customIDs: {
      // for session level tests
      sessionId: SESSION_ID,
    },
    userID,
    appVersion: "1.0.0", // Hard-coded version to avoid MACRO reference
    userAgent: env.platform,
    email,
    custom: {
      nodeVersion: env.nodeVersion,
      userType: process.env.USER_TYPE || 'ant', // Default to 'ant' if not set
      organizationUuid: 'default-org-uuid',
      accountUuid: 'default-account-uuid',
    },
  }
})
