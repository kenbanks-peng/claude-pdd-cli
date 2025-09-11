import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);

export interface CCPMInstallOptions {
  targetPath?: string;
  online?: boolean;
  timeout?: number;
  retries?: number;
}

export interface InstallResult {
  success: boolean;
  version?: string;
  source: 'online' | 'offline';
  error?: string;
}

/**
 * CCPM 在线安装器 - 动态获取最新 CCPM 并集成 TDD 功能
 */
export class CCPMInstaller {
  private targetPath: string;
  private tddEnhancementsPath: string;
  private timeout: number;
  private maxRetries: number;

  constructor(options: CCPMInstallOptions = {}) {
    this.targetPath = options.targetPath || path.join(process.cwd(), '.claude');
    this.timeout = options.timeout || 30000;
    this.maxRetries = options.retries || 3;
    
    // Get TDD enhancements path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    this.tddEnhancementsPath = path.join(__dirname, '../tdd-enhancements');
  }

  /**
   * 执行完整的 CCPM + TDD 安装
   */
  async install(options: CCPMInstallOptions = {}): Promise<InstallResult> {
    const spinner = ora('Installing CCPM + TDD system...').start();

    try {
      // 1. 检测安装模式
      const shouldTryOnline = options.online !== false && await this.checkNetworkConnection();
      
      let result: InstallResult;
      
      if (shouldTryOnline) {
        // 尝试在线安装
        spinner.text = 'Installing CCPM from remote (online mode)...';
        result = await this.installOnline();
      } else {
        // 离线安装
        spinner.text = 'Installing CCPM from local templates (offline mode)...';
        result = await this.installOffline();
      }

      if (result.success) {
        // 2. 添加 TDD 增强层
        spinner.text = 'Adding TDD enhancements...';
        await this.addTDDEnhancements();
        
        // 3. 配置集成
        spinner.text = 'Configuring integration...';
        await this.configureIntegration();

        spinner.succeed(`CCPM + TDD system installed successfully! (${result.source} mode)`);
        return result;
      } else {
        // 如果在线失败，尝试离线降级
        if (shouldTryOnline && result.source === 'online') {
          spinner.text = 'Online install failed, falling back to offline mode...';
          const fallbackResult = await this.installOffline();
          
          if (fallbackResult.success) {
            await this.addTDDEnhancements();
            await this.configureIntegration();
            spinner.succeed('CCPM + TDD system installed successfully! (offline fallback)');
            return { ...fallbackResult, source: 'offline' };
          }
        }
        
        spinner.fail(`Installation failed: ${result.error}`);
        return result;
      }
    } catch (error) {
      spinner.fail('Installation failed with unexpected error');
      return {
        success: false,
        source: 'offline',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 在线安装 - 从 CCPM GitHub 仓库下载并执行安装脚本
   */
  private async installOnline(): Promise<InstallResult> {
    try {
      // 1. 获取最新版本信息
      const version = await this.getLatestCCPMVersion();
      
      // 2. 下载并执行安装脚本
      const platform = process.platform;
      let installCommand: string;
      
      if (platform === 'win32') {
        // Windows PowerShell 命令
        installCommand = `powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process; iwr -useb https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/install.ps1 | iex"`;
      } else {
        // Unix-like bash 命令
        installCommand = `curl -sSL https://raw.githubusercontent.com/Agentic-Insights/codebase-context-spec/main/install.sh | bash`;
      }

      // 执行安装命令
      const { stdout, stderr } = await this.execWithTimeout(installCommand, this.timeout);
      
      // 验证安装结果
      const installed = await fs.pathExists(this.targetPath);
      if (!installed) {
        throw new Error('CCPM installation failed - .claude directory not created');
      }

      return {
        success: true,
        version,
        source: 'online'
      };
      
    } catch (error) {
      return {
        success: false,
        source: 'online',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 离线安装 - 使用内置模板
   */
  private async installOffline(): Promise<InstallResult> {
    try {
      // 使用现有的模板安装逻辑
      const { TemplateInstaller } = await import('./template-installer.js');
      const templateInstaller = new TemplateInstaller();
      
      await templateInstaller.install({ mode: 'pm', force: true });
      
      return {
        success: true,
        version: 'builtin',
        source: 'offline'
      };
    } catch (error) {
      return {
        success: false,
        source: 'offline',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 添加 TDD 增强层
   */
  private async addTDDEnhancements(): Promise<void> {
    const tddComponents = {
      commands: [
        'tdd/cycle.md',
        'tdd/red.md',
        'tdd/green.md', 
        'tdd/refactor.md',
        'tdd/spec-to-test.md'
      ],
      agents: [
        'tdd-agent.md',
        'test-generator.md'
      ],
      workflows: [
        'spec-driven-tdd.md',
        'issue-to-test.md'
      ]
    };

    // 复制 TDD 增强文件
    for (const [category, files] of Object.entries(tddComponents)) {
      const categoryPath = path.join(this.targetPath, category);
      await fs.ensureDir(categoryPath);
      
      for (const file of files) {
        const sourcePath = path.join(this.tddEnhancementsPath, category, file);
        const targetPath = path.join(categoryPath, file);
        
        // 确保子目录存在
        await fs.ensureDir(path.dirname(targetPath));
        
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, targetPath);
        }
      }
    }

    // 更新 CLAUDE.md 添加 TDD 命令说明
    await this.updateClaudeMD();
  }

  /**
   * 配置集成设置
   */
  private async configureIntegration(): Promise<void> {
    const configPath = path.join(this.targetPath, 'config.json');
    
    let config: any = {};
    if (await fs.pathExists(configPath)) {
      config = await fs.readJSON(configPath);
    }

    // 启用 TDD 功能
    config.tdd = {
      enabled: true,
      autoGenerateTests: true,
      coverageThreshold: 80,
      phases: {
        red: { enforceFailure: true },
        green: { minimalCode: true },
        refactor: { maintainCoverage: true }
      },
      ...config.tdd
    };

    // 添加安装信息
    config.installation = {
      ...config.installation,
      ccpm_integration: true,
      tdd_enhanced: true,
      install_method: 'dynamic',
      install_date: new Date().toISOString()
    };

    await fs.writeJSON(configPath, config, { spaces: 2 });
  }

  /**
   * 更新 CLAUDE.md 添加 TDD 命令说明
   */
  private async updateClaudeMD(): Promise<void> {
    const claudePath = path.join(this.targetPath, 'CLAUDE.md');
    
    if (!await fs.pathExists(claudePath)) {
      return;
    }

    let content = await fs.readFile(claudePath, 'utf-8');
    
    // 添加 TDD 命令部分
    const tddSection = `

## TDD Development Commands

### Core TDD Workflow
- \`/tdd:cycle\` - Complete TDD cycle (Red-Green-Refactor)
- \`/tdd:red\` - Write failing tests (Red phase)
- \`/tdd:green\` - Implement solution (Green phase) 
- \`/tdd:refactor\` - Improve code quality (Refactor phase)
- \`/tdd:spec-to-test\` - Convert requirements to comprehensive tests

### TDD Integration with CCPM
The TDD commands integrate seamlessly with CCPM workflow:
1. Use \`/pm:issue-start\` to load requirements
2. Use \`/tdd:spec-to-test\` to generate test cases from requirements
3. Follow \`/tdd:cycle\` for implementation
4. Use \`/pm:issue-close\` when complete

### TDD Principles
- **Red**: Write failing tests first
- **Green**: Write minimal code to pass tests  
- **Refactor**: Improve code quality while maintaining tests
- **Coverage**: Maintain minimum coverage threshold
- **Traceability**: Link tests to specifications
`;

    // 检查是否已经包含 TDD 部分
    if (!content.includes('TDD Development Commands')) {
      content += tddSection;
      await fs.writeFile(claudePath, content);
    }
  }

  /**
   * 获取最新 CCPM 版本
   */
  private async getLatestCCPMVersion(): Promise<string> {
    try {
      const response = await axios.get(
        'https://api.github.com/repos/Agentic-Insights/codebase-context-spec/commits/main',
        { timeout: this.timeout }
      );
      return response.data.sha.substring(0, 7);
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * 检查网络连接
   */
  private async checkNetworkConnection(): Promise<boolean> {
    try {
      await axios.head('https://github.com', { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 带超时的命令执行
   */
  private async execWithTimeout(command: string, timeout: number): Promise<{ stdout: string; stderr: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const result = await execAsync(command, { 
        signal: controller.signal,
        cwd: process.cwd()
      });
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 获取安装状态
   */
  async getInstallationStatus(): Promise<{
    installed: boolean;
    ccpm_version?: string;
    tdd_enhanced: boolean;
    install_method?: string;
  }> {
    try {
      const configPath = path.join(this.targetPath, 'config.json');
      
      if (!await fs.pathExists(this.targetPath) || !await fs.pathExists(configPath)) {
        return { installed: false, tdd_enhanced: false };
      }

      const config = await fs.readJSON(configPath);
      
      return {
        installed: true,
        ccpm_version: config.installation?.ccpm_version,
        tdd_enhanced: config.installation?.tdd_enhanced || false,
        install_method: config.installation?.install_method
      };
    } catch (error) {
      return { installed: false, tdd_enhanced: false };
    }
  }
}