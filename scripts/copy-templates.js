#!/usr/bin/env node

/**
 * Cross-platform template copying script
 * Replaces PowerShell commands to ensure compatibility on all platforms
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyTemplates() {
  const sourceDir = path.join(__dirname, '..', 'src', 'templates');
  const targetDir = path.join(__dirname, '..', 'dist', 'templates');
  
  const sourceTddDir = path.join(__dirname, '..', 'src', 'tdd-enhancements');
  const targetTddDir = path.join(__dirname, '..', 'dist', 'tdd-enhancements');

  try {
    // Copy main templates
    if (await fs.pathExists(sourceDir)) {
      console.log('📁 Copying templates from', sourceDir, 'to', targetDir);

      // Ensure target directory exists
      await fs.ensureDir(targetDir);

      // Copy files
      await fs.copy(sourceDir, targetDir, {
        overwrite: true,
        errorOnExist: false
      });

      console.log('✅ Templates copied successfully');
    } else {
      console.log('⚠️  Templates directory not found, skipping...');
    }

    // Copy TDD enhancement files
    if (await fs.pathExists(sourceTddDir)) {
      console.log('📁 Copying TDD enhancements from', sourceTddDir, 'to', targetTddDir);

      // Ensure target directory exists
      await fs.ensureDir(targetTddDir);

      // Copy files
      await fs.copy(sourceTddDir, targetTddDir, {
        overwrite: true,
        errorOnExist: false
      });

      console.log('✅ TDD enhancements copied successfully');
    } else {
      console.log('⚠️  TDD enhancements directory not found, skipping...');
    }
  } catch (error) {
    console.error('❌ Error copying files:', error.message);
    process.exit(1);
  }
}

// Run this script if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  copyTemplates();
}

export default copyTemplates;