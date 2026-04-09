const fs = require('fs')
const path = require('path')

const siteDir = path.resolve(__dirname, '..')
const siteRawDir = path.join(siteDir, 'raw')
const rootRawDir = path.resolve(siteDir, '..', 'raw')

function removeDir(dir) {
  if (fs.existsSync(dir)) {
    try {
      const stat = fs.lstatSync(dir)
      if (stat.isSymbolicLink()) {
        fs.unlinkSync(dir)
        console.log('Removed existing symlink')
      } else if (stat.isDirectory()) {
        fs.rmSync(dir, { recursive: true, force: true })
        console.log('Removed existing directory')
      }
    } catch (err) {
      console.error('Warning: Could not remove existing directory:', err.message)
    }
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Remove existing raw directory/link
removeDir(siteRawDir)

// Check if root raw directory exists
if (!fs.existsSync(rootRawDir)) {
  console.log('Warning: root raw directory not found, creating empty site/raw')
  fs.mkdirSync(siteRawDir, { recursive: true })
  console.log('Done!')
  process.exit(0)
}

// Try to create symlink
let useSymlink = false
try {
  // On Windows, use 'junction' for directories
  const linkType = process.platform === 'win32' ? 'junction' : 'dir'
  fs.symlinkSync(rootRawDir, siteRawDir, linkType)
  useSymlink = true
  console.log('Created symlink: site/raw -> ../raw')
} catch (err) {
  console.log('Symlink not available:', err.message)
}

// Fallback: copy directory
if (!useSymlink) {
  console.log('Copying directory instead...')
  try {
    copyDir(rootRawDir, siteRawDir)
    console.log('Copied raw directory to site/raw')
  } catch (err) {
    console.error('Error copying directory:', err.message)
    process.exit(1)
  }
}

console.log('Done!')
