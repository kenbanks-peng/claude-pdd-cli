import { EnvironmentDetector } from '../detector';
import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import which from 'which';
import path from 'path';

// Mock external dependencies
jest.mock('fs', () => ({
  promises: {
    pathExists: jest.fn(),
    readJson: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn()
  }
}));

jest.mock('child_process', () => ({
  execSync: jest.fn()
}));

jest.mock('which', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('fs-extra', () => ({
  pathExists: jest.fn(),
  readJson: jest.fn(),
  readdir: jest.fn(),
  stat: jest.fn()
}));

describe('EnvironmentDetector', () => {
  let detector: EnvironmentDetector;
  const mockFs = fs as jest.Mocked<typeof fs>;
  const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
  const mockWhich = which as jest.MockedFunction<typeof which>;

  // Import fs-extra mock
  const fsExtra = require('fs-extra');

  beforeEach(() => {
    detector = new EnvironmentDetector();
    jest.clearAllMocks();
    
    // Set platform-appropriate environment variables
    const isWindows = process.platform === 'win32';
    const homeDir = isWindows ? 'C:\\Users\\test' : '/home/test';
    
    if (isWindows) {
      process.env.USERPROFILE = homeDir;
      delete process.env.HOME;
    } else {
      process.env.HOME = homeDir;
      delete process.env.USERPROFILE;
    }
  });

  describe('detectClaudeCode', () => {
    it('应该检测到已安装的Claude Code', async () => {
      // 模拟 which 命令成功
      mockWhich.mockResolvedValue('/usr/local/bin/claude');
      
      // 模拟版本命令成功
      mockExecSync.mockReturnValue('claude 1.0.0');
      
      // 构建平台适配的路径
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const expectedConfigPath = path.join(homeDir!, '.claude');
      
      // 模拟全局配置目录存在
      fsExtra.pathExists.mockImplementation((pathToCheck: string) => {
        return Promise.resolve(pathToCheck === expectedConfigPath);
      });

      const result = await detector.detect();

      expect(result.claudeCode.installed).toBe(true);
      expect(result.claudeCode.version).toBe('1.0.0');
      expect(result.claudeCode.globalConfigExists).toBe(true);
      expect(result.claudeCode.configPath).toBe(expectedConfigPath);
    });

    it('应该处理Claude Code未安装的情况', async () => {
      // 模拟 which 命令失败
      mockWhich.mockRejectedValue(new Error('not found'));
      
      // 确保全局配置目录不存在
      fsExtra.pathExists.mockResolvedValue(false);
      
      const result = await detector.detect();

      expect(result.claudeCode.installed).toBe(false);
      expect(result.claudeCode.version).toBeUndefined();
      expect(result.claudeCode.globalConfigExists).toBe(false);
    });

    it('应该处理版本获取失败的情况', async () => {
      mockWhich.mockResolvedValue('/usr/local/bin/claude');
      mockExecSync.mockImplementation(() => {
        throw new Error('version failed');
      });
      
      fsExtra.pathExists.mockResolvedValue(false);

      const result = await detector.detect();

      expect(result.claudeCode.installed).toBe(true);
      expect(result.claudeCode.version).toBeUndefined();
    });
  });

  describe('detectProject', () => {
    it('应该检测Node.js项目', async () => {
      // 模拟package.json存在
      fsExtra.pathExists.mockImplementation((path: string) => {
        if (typeof path === 'string') {
          return Promise.resolve(path.includes('package.json'));
        }
        return Promise.resolve(false);
      });

      // 模拟package.json内容
      fsExtra.readJson.mockResolvedValue({
        name: 'test-project',
        dependencies: {
          'react': '^18.0.0'
        },
        devDependencies: {
          'jest': '^29.0.0'
        }
      });

      const result = await detector.detect();

      expect(result.project.framework).toBe('nodejs');
      expect(result.project.testFramework).toBe('jest');
      expect(result.project.buildTool).toBe('npm');
    });

    it('应该检测Java Maven项目', async () => {
      fsExtra.pathExists.mockImplementation((path: string) => {
        if (typeof path === 'string') {
          return Promise.resolve(path.includes('pom.xml'));
        }
        return Promise.resolve(false);
      });

      const result = await detector.detect();

      expect(result.project.framework).toBe('java');
      expect(result.project.buildTool).toBe('maven');
      expect(result.project.testFramework).toBe('junit');
    });

    it('应该检测Python项目', async () => {
      fsExtra.pathExists.mockImplementation((path: string) => {
        if (typeof path === 'string') {
          return Promise.resolve(path.includes('setup.py'));
        }
        return Promise.resolve(false);
      });

      const result = await detector.detect();

      expect(result.project.framework).toBe('python');
      expect(result.project.buildTool).toBe('pip');
      expect(result.project.testFramework).toBe('pytest');
    });

    it('应该处理未知框架', async () => {
      fsExtra.pathExists.mockResolvedValue(false);

      const result = await detector.detect();

      expect(result.project.framework).toBe('unknown');
      expect(result.project.testFramework).toBeUndefined();
      expect(result.project.buildTool).toBeUndefined();
    });
  });

  describe('detectGit', () => {
    it('应该检测已初始化的Git仓库', async () => {
      fsExtra.pathExists.mockImplementation((path: string) => {
        if (typeof path === 'string') {
          return Promise.resolve(path.includes('.git'));
        }
        return Promise.resolve(false);
      });

      mockExecSync
        .mockReturnValueOnce('origin') // git remote
        .mockReturnValueOnce('main'); // git branch --show-current

      fsExtra.readdir.mockResolvedValue(['pre-commit', 'post-commit']);

      const result = await detector.detect();

      expect(result.git.initialized).toBe(true);
      expect(result.git.hasRemote).toBe(true);
      expect(result.git.defaultBranch).toBe('main');
      expect(result.git.hasGitHooks).toBe(true);
    });

    it('应该处理未初始化的Git仓库', async () => {
      fsExtra.pathExists.mockResolvedValue(false);

      const result = await detector.detect();

      expect(result.git.initialized).toBe(false);
      expect(result.git.hasRemote).toBe(false);
      expect(result.git.hasGitHooks).toBe(false);
    });

    it('应该处理Git命令失败的情况', async () => {
      fsExtra.pathExists.mockResolvedValue(true);
      mockExecSync.mockImplementation(() => {
        throw new Error('git command failed');
      });

      const result = await detector.detect();

      expect(result.git.initialized).toBe(true);
      expect(result.git.hasRemote).toBe(false);
    });
  });

  describe('generateRecommendations', () => {
    it('应该为未安装Claude Code生成推荐', async () => {
      mockWhich.mockRejectedValue(new Error('not found'));
      fsExtra.pathExists.mockResolvedValue(false);

      const result = await detector.detect();

      expect(result.recommendations).toContainEqual(
        expect.objectContaining({
          type: 'framework',
          title: 'Install Claude Code',
          priority: 'high',
          actionRequired: true
        })
      );
    });

    it('应该为未初始化的Git生成推荐', async () => {
      mockWhich.mockResolvedValue('/usr/local/bin/claude');
      fsExtra.pathExists.mockResolvedValue(false);

      const result = await detector.detect();

      expect(result.recommendations).toContainEqual(
        expect.objectContaining({
          type: 'framework',
          title: 'Initialize Git Repository',
          priority: 'medium',
          actionRequired: false
        })
      );
    });
  });

  describe('detectConflicts', () => {
    it('应该检测现有的.claude配置冲突', async () => {
      mockWhich.mockResolvedValue('/usr/local/bin/claude');
      
      // 模拟项目本地的.claude目录存在（用于detectProject）
      // 以及全局配置目录不存在（用于detectClaudeCode）
      fsExtra.pathExists.mockImplementation((pathToCheck: string) => {
        if (typeof pathToCheck === 'string') {
          // 精确匹配项目本地的.claude目录
          const projectClaudePath = path.join(process.cwd(), '.claude');
          if (pathToCheck === projectClaudePath) {
            return Promise.resolve(true);
          }
          // 其他路径不存在
          return Promise.resolve(false);
        }
        return Promise.resolve(false);
      });

      const result = await detector.detect();

      expect(result.conflicts).toContain('claude-config-exists');
    });

    it('应该检测现有的Git hooks冲突', async () => {
      mockWhich.mockResolvedValue('/usr/local/bin/claude');
      fsExtra.pathExists.mockResolvedValue(true);
      mockExecSync.mockReturnValue('');
      fsExtra.readdir.mockResolvedValue(['pre-commit', 'post-commit']);

      const result = await detector.detect();

      expect(result.conflicts).toContain('git-hooks-exist');
    });
  });
});