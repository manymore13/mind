const fs = require('fs')
const path = require('path')

const siteDir = path.resolve(__dirname, '..')
const siteRawDir = path.join(siteDir, 'raw')
const rootRawDir = path.resolve(siteDir, '../raw')

// Remove existing raw directory/link if exists
if (fs.existsSync(siteRawDir)) {
  const stat = fs.lstatSync(siteRawDir)
  if (stat.isSymbolicLink() || stat.isDirectory()) {
    fs.rmSync(siteRawDir, { recursive: true, force: true })
    console.log('Removed existing raw directory/link')
  }
}

// Try to create symlink first (Linux/macOS/Windows with symlink support)
try {
  fs.symlinkSync(rootRawDir, siteRawDir, 'junction')
  console.log('Created symlink: site/raw -> ../raw')
} catch (err) {
  // Fallback: copy directory (for Windows without symlink permission)
  console.log('Symlink not supported, copying directory instead...')
  fs.cpSync(rootRawDir, siteRawDir, { recursive: true })
  console.log('Copied raw directory to site/raw')
}

console.log('Done!')
