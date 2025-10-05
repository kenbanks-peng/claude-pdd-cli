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
 * CCPM Online Installer - Dynamically fetches latest CCPM and integrates TDD features
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
   * Execute complete CCPM + TDD installation
   */
  async install(options: CCPMInstallOptions = {}): Promise<InstallResult> {
    const spinner = ora('Installing CCPM + TDD system...').start();

    try {
      // 1. Detect installation mode
      const shouldTryOnline = options.online !== false && await this.checkNetworkConnection();

      let result: InstallResult;

      if (shouldTryOnline) {
        // Try online installation
        spinner.text = 'Installing CCPM from remote (online mode)...';
        result = await this.installOnline();
      } else {
        // Offline installation
        spinner.text = 'Installing CCPM from local templates (offline mode)...';
        result = await this.installOffline();
      }

      if (result.success) {
        // 2. Add TDD enhancement layer
        spinner.text = 'Adding TDD enhancements...';
        await this.addTDDEnhancements();

        // 3. Configure integration
        spinner.text = 'Configuring integration...';
        await this.configureIntegration();

        spinner.succeed(`CCPM + TDD system installed successfully! (${result.source} mode)`);
        return result;
      } else {
        // If online fails, try offline fallback
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
   * Online installation - Clone CCPM repository, copy ccpm directory contents, auto-process path references
   * Optimized approach: Avoid running install scripts, extract needed files directly
   */
  private async installOnline(): Promise<InstallResult> {
    try {
      // 1. Get latest version info
      const version = await this.getLatestCCPMVersion();

      // 2. Clone repository and extract ccpm directory contents
      const platform = process.platform;
      let installCommand: string;

      if (platform === 'win32') {
        // Windows PowerShell: Clone repo, copy ccpm directory, replace paths, cleanup
        installCommand = `powershell -Command "
          Write-Host 'Cloning CCPM repository...';

          # Clone CCPM repository to temp directory
          git clone https://github.com/automazeio/ccpm.git temp_ccpm;

          if (Test-Path './temp_ccpm/ccpm') {
            Write-Host 'Installing CCPM files...';

            # Create .claude directory
            New-Item -ItemType Directory -Path './.claude' -Force | Out-Null;

            # Copy ccpm directory contents to .claude
            Copy-Item './temp_ccpm/ccpm/*' -Destination './.claude' -Recurse -Force;

            Write-Host 'Updating path references...';

            # Batch replace ccpm/scripts with .claude/scripts
            Get-ChildItem './.claude' -Recurse -Filter '*.md' -File | ForEach-Object {
              $content = Get-Content $_.FullName -Raw;
              $newContent = $content -replace 'ccpm/scripts', '.claude/scripts';
              if ($content -ne $newContent) {
                Set-Content -Path $_.FullName -Value $newContent -NoNewline;
              }
            };

            Write-Host 'Cleaning up...';

            # Clean up temp files
            Remove-Item './temp_ccpm' -Recurse -Force -ErrorAction SilentlyContinue;

            Write-Host 'CCPM installation completed successfully!';
          } else {
            Write-Error 'CCPM directory not found in repository';
            exit 1;
          }
        "`;
      } else {
        // Unix/Linux/macOS: Clone repo, copy ccpm directory, replace paths, cleanup
        installCommand = `
          echo "Cloning CCPM repository...";

          # Clone CCPM repository to temp directory
          git clone https://github.com/automazeio/ccpm.git temp_ccpm;

          if [ -d ./temp_ccpm/ccpm ]; then
            echo "Installing CCPM files...";

            # Create .claude directory
            mkdir -p .claude;

            # Copy ccpm directory contents to .claude
            cp -r ./temp_ccpm/ccpm/* ./.claude/;

            echo "Updating path references...";

            # Batch replace ccpm/scripts with .claude/scripts
            find ./.claude -name '*.md' -type f -exec sed -i 's|ccpm/scripts|.claude/scripts|g' {} \; 2>/dev/null || true;

            echo "Cleaning up...";

            # Clean up temp files
            rm -rf ./temp_ccpm;

            echo "CCPM installation completed successfully!";
          else
            echo "Error: CCPM directory not found in repository" >&2;
            rm -rf ./temp_ccpm;
            exit 1;
          fi
        `;
      }

      // 3. Execute installation command
      const { stdout, stderr } = await this.execWithTimeout(installCommand, this.timeout);

      // 4. Verify installation result
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
   * Offline installation - Use built-in templates
   */
  private async installOffline(): Promise<InstallResult> {
    try {
      // Use existing template installation logic
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
   * Add TDD enhancement layer
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

    // Copy TDD enhancement files
    for (const [category, files] of Object.entries(tddComponents)) {
      const categoryPath = path.join(this.targetPath, category);
      await fs.ensureDir(categoryPath);

      for (const file of files) {
        const sourcePath = path.join(this.tddEnhancementsPath, category, file);
        const targetPath = path.join(categoryPath, file);

        // Ensure subdirectory exists
        await fs.ensureDir(path.dirname(targetPath));

        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, targetPath);
        }
      }
    }

    // Update CLAUDE.md to add TDD command descriptions
    await this.updateClaudeMD();
  }

  /**
   * Configure integration settings
   */
  private async configureIntegration(): Promise<void> {
    const configPath = path.join(this.targetPath, 'config.json');

    let config: any = {};
    if (await fs.pathExists(configPath)) {
      config = await fs.readJSON(configPath);
    }

    // Enable TDD features
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

    // Add installation info
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
   * Update CLAUDE.md to add TDD command descriptions
   */
  private async updateClaudeMD(): Promise<void> {
    const claudePath = path.join(this.targetPath, 'CLAUDE.md');

    if (!await fs.pathExists(claudePath)) {
      return;
    }

    let content = await fs.readFile(claudePath, 'utf-8');

    // Add TDD command section
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

    // Check if TDD section already exists
    if (!content.includes('TDD Development Commands')) {
      content += tddSection;
      await fs.writeFile(claudePath, content);
    }
  }

  /**
   * Get latest CCPM version
   */
  private async getLatestCCPMVersion(): Promise<string> {
    try {
      const response = await axios.get(
        'https://api.github.com/repos/automazeio/ccpm/commits/main',
        { timeout: this.timeout }
      );
      return response.data.sha.substring(0, 7);
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Check network connection
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
   * Execute command with timeout
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
   * Get installation status
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