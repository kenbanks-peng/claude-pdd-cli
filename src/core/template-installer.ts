import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export interface InstallOptions {
  force?: boolean;
  mode?: 'pdd' | 'pm' | 'tdd';
  githubRepo?: string;
  framework?: string;
}

/**
 * Template installer for CCPM + TDD integration
 */
export class TemplateInstaller {
  private templatesPath: string;
  private targetPath: string;

  constructor() {
    // Get __dirname equivalent for ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    
    // Templates are bundled with the CLI package
    this.templatesPath = path.join(__dirname, '../templates');
    this.targetPath = path.join(process.cwd(), '.claude');
  }

  /**
   * Install complete CCPM + TDD system
   */
  async install(options: InstallOptions = {}): Promise<void> {
    const spinner = ora('Installing CCPM + TDD system...').start();

    try {
      // Check if .claude directory exists
      if (await fs.pathExists(this.targetPath) && !options.force) {
        spinner.fail('.claude directory already exists. Use --force to overwrite.');
        throw new Error('.claude directory already exists');
      }

      // Create or clean target directory
      if (options.force) {
        await fs.remove(this.targetPath);
      }
      await fs.ensureDir(this.targetPath);

      // Install based on mode
      switch (options.mode) {
        case 'pm':
          await this.installCCPMOnly();
          break;
        case 'tdd':
          await this.installTDDOnly();
          break;
        case 'pdd':
        default:
          await this.installComplete(options);
          break;
      }

      spinner.succeed('CCPM + TDD system installed successfully!');
    } catch (error) {
      spinner.fail('Installation failed');
      throw error;
    }
  }

  /**
   * Install only CCPM components
   */
  private async installCCPMOnly(): Promise<void> {
    const ccpmComponents = [
      'agents',
      'commands/pm',
      'commands/context',
      'commands/testing',
      'rules',
      'epics',
      'prds',
      'scripts',
      'CLAUDE.md'
    ];

    for (const component of ccpmComponents) {
      const sourcePath = path.join(this.templatesPath, '.claude', component);
      const targetPath = path.join(this.targetPath, component);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
      }
    }

    // Create basic config for CCPM only
    await this.createConfig({
      mode: 'pm',
      tdd: { enabled: false }
    });
  }

  /**
   * Install only TDD components (basic)
   */
  private async installTDDOnly(): Promise<void> {
    const tddComponents = [
      'agents/tdd-agent.md',
      'agents/test-generator.md',
      'commands/tdd',
      'commands/testing',
      'workflows'
    ];

    // Create minimal structure
    await fs.ensureDir(path.join(this.targetPath, 'agents'));
    await fs.ensureDir(path.join(this.targetPath, 'commands'));
    await fs.ensureDir(path.join(this.targetPath, 'context'));

    for (const component of tddComponents) {
      const sourcePath = path.join(this.templatesPath, '.claude', component);
      const targetPath = path.join(this.targetPath, component);

      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
      }
    }

    // Create minimal CLAUDE.md for TDD only
    await this.createTDDOnlyClaude();
    
    // Create basic config for TDD only
    await this.createConfig({
      mode: 'tdd',
      pm: { enabled: false }
    });
  }

  /**
   * Install complete system (CCPM + TDD)
   */
  private async installComplete(options: InstallOptions): Promise<void> {
    // Copy entire .claude template
    await fs.copy(
      path.join(this.templatesPath, '.claude'),
      this.targetPath
    );

    // Create comprehensive configuration
    await this.createConfig({
      mode: 'pdd',
      framework: options.framework || 'nodejs',
      github: {
        repo: options.githubRepo || ''
      }
    });

    // Update CLAUDE.md with complete rules
    await this.enhanceClaude(options);
  }

  /**
   * Create configuration file
   */
  private async createConfig(config: any): Promise<void> {
    const configPath = path.join(this.targetPath, 'config.json');
    
    const defaultConfig = {
      version: '1.0.0',
      installedAt: new Date().toISOString(),
      mode: config.mode || 'pdd',
      project: {
        name: path.basename(process.cwd()),
        framework: config.framework || 'nodejs'
      },
      pm: {
        enabled: config.mode !== 'tdd',
        github: {
          repo: config.github?.repo || config.github || '',
          useIssues: true,
          syncTests: true,
          labelPrefix: 'tdd'
        },
        workflow: {
          type: 'spec-driven',
          autoSync: true,
          parallelAgents: false,
          maxAgents: 3
        },
        rules: {
          noVibeCode: true,
          specRequired: true,
          traceability: true
        }
      },
      tdd: {
        enabled: config.mode !== 'pm',
        autoGenerateTests: true,
        coverageThreshold: 80,
        linkToIssues: config.mode === 'pdd',
        testPatterns: this.getTestPatterns(config.framework || 'nodejs'),
        phases: {
          red: { enforceFailure: true },
          green: { minimalCode: true },
          refactor: { maintainCoverage: true }
        }
      },
      integration: {
        issueToTest: config.mode === 'pdd',
        testResultsInPR: config.mode === 'pdd',
        coverageReports: true
      }
    };

    await fs.writeJSON(configPath, defaultConfig, { spaces: 2 });
  }

  /**
   * Get test patterns for different frameworks
   */
  private getTestPatterns(framework: string): string[] {
    const patterns: { [key: string]: string[] } = {
      nodejs: ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'],
      java: ['src/test/**/*Test.java', 'src/test/**/*Tests.java'],
      python: ['test_*.py', '*_test.py', 'tests/**/*.py'],
      go: ['*_test.go'],
      rust: ['tests/**/*.rs', 'src/**/*_test.rs']
    };

    return patterns[framework] || patterns.nodejs || ['**/*.test.js'];
  }

  /**
   * Create minimal CLAUDE.md for TDD-only mode
   */
  private async createTDDOnlyClaude(): Promise<void> {
    const content = `# TDD Development Configuration

## Available Commands

### TDD Workflow Commands
- \`/tdd:cycle\` - Complete TDD cycle (Red-Green-Refactor)
- \`/tdd:red\` - Write failing tests
- \`/tdd:green\` - Implement solution
- \`/tdd:refactor\` - Improve code quality
- \`/tdd:spec-to-test\` - Convert requirements to tests

### Testing Commands
- \`/testing:prime\` - Configure test framework
- \`/testing:run\` - Execute tests

## TDD Principles
1. **Red**: Write failing tests first
2. **Green**: Write minimal code to pass tests
3. **Refactor**: Improve code quality while maintaining tests
4. **Test Coverage**: Maintain minimum coverage threshold
5. **Traceability**: Link tests to requirements where possible

## Rules
- Never implement without failing tests first
- Keep tests simple and focused
- Refactor only when tests are green
- Maintain or improve test coverage
`;

    await fs.writeFile(
      path.join(this.targetPath, 'CLAUDE.md'),
      content
    );
  }

  /**
   * Enhance CLAUDE.md with framework-specific rules
   */
  private async enhanceClaude(options: InstallOptions): Promise<void> {
    const claudePath = path.join(this.targetPath, 'CLAUDE.md');
    let content = await fs.readFile(claudePath, 'utf-8');

    // Add framework-specific configuration
    if (options.framework) {
      const frameworkRules = this.getFrameworkRules(options.framework);
      content += `\n\n## Framework Configuration: ${options.framework}\n${frameworkRules}`;
    }

    // Add GitHub integration info if repo provided
    if (options.githubRepo) {
      content += `\n\n## GitHub Integration\n- Repository: ${options.githubRepo}\n- Issues: Enabled\n- Automated sync: Enabled`;
    }

    await fs.writeFile(claudePath, content);
  }

  /**
   * Get framework-specific rules and configuration
   */
  private getFrameworkRules(framework: string): string {
    const rules: { [key: string]: string } = {
      nodejs: `
### Node.js Specific Rules
- Use Jest or Mocha for testing
- Test files: *.test.js, *.spec.js
- Coverage: Use nyc or Jest coverage
- Commands: npm test, npm run test:watch, npm run test:coverage`,
      
      java: `
### Java Specific Rules  
- Use JUnit 5 or TestNG for testing
- Test files: *Test.java, *Tests.java
- Coverage: Use JaCoCo
- Commands: mvn test, gradle test`,
      
      python: `
### Python Specific Rules
- Use pytest or unittest for testing
- Test files: test_*.py, *_test.py
- Coverage: Use coverage.py
- Commands: pytest, python -m pytest, coverage run`,
      
      go: `
### Go Specific Rules
- Use built-in testing package
- Test files: *_test.go
- Coverage: go test -cover
- Commands: go test, go test ./..., go test -v`,
      
      rust: `
### Rust Specific Rules
- Use built-in test framework
- Test files: tests/*.rs, src/*_test.rs
- Coverage: Use tarpaulin
- Commands: cargo test, cargo test --verbose`
    };

    return rules[framework] || rules.nodejs || '';
  }

  /**
   * Validate installation
   */
  async validate(): Promise<boolean> {
    try {
      const configPath = path.join(this.targetPath, 'config.json');
      const claudePath = path.join(this.targetPath, 'CLAUDE.md');

      // Check required files exist
      const requiredFiles = [configPath, claudePath];
      for (const file of requiredFiles) {
        if (!await fs.pathExists(file)) {
          console.error(chalk.red(`Missing required file: ${file}`));
          return false;
        }
      }

      // Validate config structure
      const config = await fs.readJSON(configPath);
      if (!config.version || !config.mode) {
        console.error(chalk.red('Invalid configuration file'));
        return false;
      }

      console.log(chalk.green('✅ Installation validation passed'));
      return true;
    } catch (error) {
      console.error(chalk.red('Installation validation failed:'), error);
      return false;
    }
  }

  /**
   * Get installation status
   */
  async getStatus(): Promise<{
    installed: boolean;
    mode?: string;
    version?: string;
    components: string[];
  }> {
    try {
      if (!await fs.pathExists(this.targetPath)) {
        return { installed: false, components: [] };
      }

      const configPath = path.join(this.targetPath, 'config.json');
      if (!await fs.pathExists(configPath)) {
        return { installed: false, components: [] };
      }

      const config = await fs.readJSON(configPath);
      const components = await fs.readdir(this.targetPath);

      return {
        installed: true,
        mode: config.mode,
        version: config.version,
        components: components.filter(item => !item.startsWith('.'))
      };
    } catch (error) {
      return { installed: false, components: [] };
    }
  }

  /**
   * Update existing installation
   */
  async update(options: InstallOptions = {}): Promise<void> {
    const spinner = ora('Updating CCPM + TDD system...').start();

    try {
      const status = await this.getStatus();
      if (!status.installed) {
        spinner.fail('No existing installation found');
        throw new Error('No installation to update');
      }

      // Backup current configuration
      const backupPath = path.join(this.targetPath, '.backup');
      await fs.copy(this.targetPath, backupPath);

      try {
        // Reinstall with force
        await this.install({ ...options, force: true });
        
        // Remove backup on success
        await fs.remove(backupPath);
        
        spinner.succeed('System updated successfully!');
      } catch (error) {
        // Restore backup on failure
        await fs.remove(this.targetPath);
        await fs.move(backupPath, this.targetPath);
        throw error;
      }
    } catch (error) {
      spinner.fail('Update failed');
      throw error;
    }
  }
}