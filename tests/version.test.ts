import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * 版本号工具函数测试
 */

// 从 src/index.ts 复制的版本读取函数
function getVersion(): string {
  try {
    const packageJsonPath = join(__dirname, '../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch (error) {
    console.warn('Warning: Could not read version from package.json');
    return '1.0.0'; // 降级到默认版本
  }
}

describe('版本号管理', () => {
  describe('getVersion', () => {
    it('应该能够从package.json读取版本号', () => {
      const version = getVersion();
      
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      expect(version.length).toBeGreaterThan(0);
    });

    it('版本号应该符合语义版本格式', () => {
      const version = getVersion();
      
      // 语义版本的基本格式：x.y.z 或 x.y.z-prerelease
      const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
      
      expect(version).toMatch(semverRegex);
    });

    it('应该与package.json中的版本一致', () => {
      const version = getVersion();
      const packageJsonPath = join(__dirname, '../package.json');
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      
      expect(version).toBe(packageJson.version);
    });
  });

  describe('错误处理', () => {
    it('应该在package.json不存在时返回默认版本', () => {
      // 模拟文件读取错误
      const originalReadFileSync = require('fs').readFileSync;
      require('fs').readFileSync = jest.fn(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      const version = getVersion();
      
      expect(version).toBe('1.0.0');
      
      // 恢复原函数
      require('fs').readFileSync = originalReadFileSync;
    });

    it('应该在JSON解析失败时返回默认版本', () => {
      const originalReadFileSync = require('fs').readFileSync;
      require('fs').readFileSync = jest.fn(() => 'invalid json content');

      const version = getVersion();
      
      expect(version).toBe('1.0.0');
      
      // 恢复原函数
      require('fs').readFileSync = originalReadFileSync;
    });
  });

  describe('版本号格式验证', () => {
    it('应该是有效的npm版本号', () => {
      const version = getVersion();
      
      // 版本号不应该包含无效字符
      expect(version).not.toMatch(/[<>]/);
      expect(version).not.toMatch(/\s/);
      
      // 版本号应该以数字开头
      expect(version).toMatch(/^\d/);
    });

    it('预发布版本应该有正确的格式', () => {
      const version = getVersion();
      
      // 如果是预发布版本，应该包含破折号
      if (version.includes('-')) {
        expect(version).toMatch(/^\d+\.\d+\.\d+-[a-zA-Z0-9.-]+$/);
      }
    });
  });
});