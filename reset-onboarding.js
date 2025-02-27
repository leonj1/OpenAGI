#!/usr/bin/env node

/**
 * Reset OpenAGI onboarding status to show onboarding screens again
 */

// Import the necessary functions from the config module
import { resetOnboardingStatus, enableConfigs } from './dist/utils/config.js';

console.log('Resetting OpenAGI onboarding status...');

// Enable configs before attempting to access configuration
enableConfigs();

// Reset the onboarding status
resetOnboardingStatus();

console.log('✅ Onboarding status has been reset.');
console.log('You will now see the onboarding screens again when you restart OpenAGI.');
console.log('🚀 Run "openagi" or "npm run cli" to see the startup animation and onboarding screens.'); 