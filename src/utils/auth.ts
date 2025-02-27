import { USE_BEDROCK, USE_VERTEX } from './model.js'
import { getGlobalConfig } from './config.js'

export function isAnthropicAuthEnabled(): boolean {
  // Always return false to disable authentication requirement
  return false;
}

export function isLoggedInToAnthropic(): boolean {
  // Always return true to appear logged in
  return true;
}
