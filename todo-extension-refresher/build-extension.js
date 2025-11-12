// Build script for Chrome extension
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build the React app
console.log('Building React app...');
// Use DISABLE_ESLINT_PLUGIN=true to bypass ESLint checks during build
execSync('DISABLE_ESLINT_PLUGIN=true npm run build', { stdio: 'inherit' });

// Copy and modify manifest.json to the build folder
console.log('Configuring extension files...');

// Ensure background.js is copied to the build folder
const backgroundSrc = path.join(__dirname, 'public', 'background.js');
const backgroundDest = path.join(__dirname, 'build', 'background.js');
fs.copyFileSync(backgroundSrc, backgroundDest);

// Ensure content.js is copied to the build folder
const contentSrc = path.join(__dirname, 'public', 'content.js');
const contentDest = path.join(__dirname, 'build', 'content.js');
fs.copyFileSync(contentSrc, contentDest);

console.log('Extension build complete!');
console.log('To load the extension in Chrome:');
console.log('1. Open Chrome and navigate to chrome://extensions');
console.log('2. Enable "Developer mode" (toggle in the top right)');
console.log('3. Click "Load unpacked" and select the build folder');
