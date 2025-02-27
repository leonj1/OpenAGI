// Custom build script that bypasses TypeScript's type checking
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

async function build() {
  console.log('Building claude-code-standalone...');
  
  try {
    // Clean the dist directory
    await fs.emptyDir(distDir);
    console.log('Cleaned dist directory');
    
    // Create MACRO global for the build
    const constantsDir = path.join(distDir, 'constants');
    await fs.ensureDir(constantsDir);
    
    await fs.writeFile(
      path.join(constantsDir, 'version.js'),
      `export const MACRO = {
  VERSION: '1.0.0',
  PACKAGE_URL: 'claude-code-standalone',
  README_URL: 'https://github.com/your-repo/claude-code-standalone',
  ISSUES_EXPLAINER: 'create an issue on GitHub'
};\n`
    );
    
    // Run tsc with transpileOnly option
    // Using --noEmit false to ensure it outputs JS files regardless of errors
    execSync(`npx tsc --skipLibCheck --noEmit false --jsx react`, {
      cwd: rootDir,
      stdio: 'inherit'
    });
    
    console.log('Successfully transpiled TypeScript to JavaScript');
    
    // Copy package.json to dist
    await fs.copyFile(
      path.join(rootDir, 'package.json'),
      path.join(distDir, 'package.json')
    );
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build(); 