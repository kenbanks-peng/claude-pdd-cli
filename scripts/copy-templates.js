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

  try {
    // 检查源目录是否存在
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
  } catch (error) {
    console.error('❌ Error copying templates:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  copyTemplates();
}

export default copyTemplates;