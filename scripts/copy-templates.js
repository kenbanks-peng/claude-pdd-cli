#!/usr/bin/env node

/**
 * 跨平台模板复制脚本
 * 替代 PowerShell 命令，确保在所有平台上都能正常工作
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
    // 复制主模板
    if (await fs.pathExists(sourceDir)) {
      console.log('📁 Copying templates from', sourceDir, 'to', targetDir);
      
      // 确保目标目录存在
      await fs.ensureDir(targetDir);
      
      // 复制文件
      await fs.copy(sourceDir, targetDir, {
        overwrite: true,
        errorOnExist: false
      });
      
      console.log('✅ Templates copied successfully');
    } else {
      console.log('⚠️  Templates directory not found, skipping...');
    }
    
    // 复制 TDD 增强文件
    if (await fs.pathExists(sourceTddDir)) {
      console.log('📁 Copying TDD enhancements from', sourceTddDir, 'to', targetTddDir);
      
      // 确保目标目录存在
      await fs.ensureDir(targetTddDir);
      
      // 复制文件
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

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  copyTemplates();
}

export default copyTemplates;