#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('Building with no type checking...');

try {
  // Create temporary tsconfig that completely disables type checking
  const tempTsConfigPath = join(rootDir, 'tsconfig.temp.json');
  const tsConfig = {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "noEmit": false,
      "allowJs": true,
      "checkJs": false,
      "skipLibCheck": true,
      "noImplicitAny": false,
      "noImplicitThis": false,
      "noUnusedLocals": false,
      "noUnusedParameters": false,
      "noImplicitReturns": false,
      "noFallthroughCasesInSwitch": false,
      "noImplicitOverride": false,
      "strict": false,
      "strictNullChecks": false,
      "strictFunctionTypes": false,
      "strictBindCallApply": false,
      "strictPropertyInitialization": false,
      "noErrorTruncation": false,
      "typeRoots": ["./node_modules/@types", "./src/types"],
      "emitDeclarationOnly": false,
      "declaration": false
    }
  };

  fs.writeFileSync(tempTsConfigPath, JSON.stringify(tsConfig, null, 2));

  // Use Babel to transpile TypeScript to JavaScript without type checking
  console.log('Running Babel to transpile TypeScript without type checking...');
  execSync(`npx babel src --out-dir dist --extensions ".ts,.tsx" --copy-files`, {
    cwd: rootDir,
    stdio: 'inherit'
  });

  // Clean up the temporary tsconfig
  fs.unlinkSync(tempTsConfigPath);

  console.log('Build completed successfully without type checking!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 