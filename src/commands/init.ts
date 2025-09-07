import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { EnvironmentDetector } from '../core/detector';
import { InitOptions, TemplateType } from '../core/types';
import { printStep, printSuccess, printError, printWarning, printHeader, printSummary } from '../ui/output';
import { TemplateManager } from '../core/template-manager';
import { ConfigGenerator } from '../core/config-generator';

/**
 * Initialize TDD workflow in current project
 */
export async function initCommand(options: InitOptions): Promise<void> {
  printHeader('🎯 Initializing Claude TDD Workflow');

  try {
    // Step 1: Environment Detection
    printStep(1, 'Detecting environment and project configuration...');
    const spinner = ora('Analyzing project structure...').start();
    
    const detector = new EnvironmentDetector();
    const detection = await detector.detect();
    
    spinner.succeed('Environment detection completed');

    // Step 2: Handle conflicts and prerequisites  
    await handlePrerequisites(detection, options);

    // Step 3: Interactive configuration (if not quick mode)
    let config;
    if (options.quick) {
      printStep(2, 'Using quick setup with detected defaults...');
      config = await generateDefaultConfig(detection, options);
    } else {
      printStep(2, 'Interactive configuration...');
      config = await interactiveConfiguration(detection, options);
    }

    // Step 4: Generate TDD configuration
    printStep(3, 'Generating TDD configuration...');
    const configGenerator = new ConfigGenerator();
    await configGenerator.generate(config, process.cwd());
    
    // Step 5: Setup templates and files
    printStep(4, 'Setting up workflow templates...');
    const templateManager = new TemplateManager();
    await templateManager.setup(config, process.cwd());

    // Step 6: Success summary
    printSuccess('TDD workflow initialized successfully!');
    
    const summary = [
      `Framework: ${config.framework}`,
      `Template: ${config.template}`,
      `Test patterns: ${config.testPatterns.join(', ')}`,
      `GitHub integration: ${config.githubIntegration ? 'Enabled' : 'Disabled'}`
    ];
    
    printSummary('🎉 Configuration Summary', summary);
    
    console.log('\n' + chalk.cyan('📖 Next steps:'));
    console.log('  1. Run', chalk.yellow('/tdd:status'), 'to check workflow status');
    console.log('  2. Create your first task with', chalk.yellow('/pm:prd-new'));
    console.log('  3. Start TDD development with', chalk.yellow('/tdd:red'));

  } catch (error) {
    printError(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Handle prerequisites and conflicts
 */
async function handlePrerequisites(detection: any, options: InitOptions): Promise<void> {
  // Check Claude Code installation
  if (!detection.claudeCode.installed) {
    printError('Claude Code is not installed or not accessible');
    console.log('\n' + chalk.yellow('Please install Claude Code first:'));
    console.log('  Visit: https://claude.ai/code');
    process.exit(1);
  }

  // Handle existing .claude directory
  if (detection.project.hasClaudeConfig && !options.force) {
    printWarning('Existing .claude configuration found');
    
    const { overwrite } = await inquirer.prompt([{
      type: 'confirm',
      name: 'overwrite',
      message: 'Overwrite existing configuration?',
      default: false
    }]);
    
    if (!overwrite) {
      printError('Initialization cancelled by user');
      process.exit(0);
    }
  }

  // Check Git repository
  if (!detection.git.initialized) {
    const { initGit } = await inquirer.prompt([{
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize Git repository?',
      default: true
    }]);
    
    if (initGit) {
      const { execSync } = require('child_process');
      execSync('git init', { cwd: process.cwd() });
      printSuccess('Git repository initialized');
    }
  }
}

/**
 * Generate default configuration for quick mode
 */
async function generateDefaultConfig(detection: any, options: InitOptions) {
  return {
    framework: options.framework || detection.project.framework || 'nodejs',
    template: (options.template as TemplateType) || 'full',
    testFramework: detection.project.testFramework || 'jest',
    buildTool: detection.project.buildTool || 'npm',
    testPatterns: detection.project.testDirectories.length > 0 
      ? detection.project.testDirectories.map((dir: string) => `${dir}/**/*`)
      : ['**/*.test.*', '**/*.spec.*'],
    sourcePatterns: detection.project.sourceDirectories.length > 0
      ? detection.project.sourceDirectories.map((dir: string) => `${dir}/**/*`)
      : ['src/**/*'],
    githubIntegration: detection.git.hasRemote,
    strictMode: true,
    parallelSupport: false
  };
}

/**
 * Interactive configuration wizard
 */
async function interactiveConfiguration(detection: any, options: InitOptions) {
  console.log('\n' + chalk.bold('🎛️ Configuration Wizard'));
  console.log(chalk.gray('Answer a few questions to customize your TDD workflow:\n'));

  // Framework selection
  let framework = options.framework;
  if (!framework) {
    if (detection.project.framework !== 'unknown') {
      const { useDetected } = await inquirer.prompt([{
        type: 'confirm',
        name: 'useDetected',
        message: `Use detected framework: ${chalk.cyan(detection.project.framework)}?`,
        default: true
      }]);
      
      if (useDetected) {
        framework = detection.project.framework;
      }
    }
    
    if (!framework) {
      const { selectedFramework } = await inquirer.prompt([{
        type: 'list',
        name: 'selectedFramework',
        message: 'Select project framework:',
        choices: [
          { name: '🟨 Node.js/TypeScript', value: 'nodejs' },
          { name: '☕ Java (Maven/Gradle)', value: 'java' },
          { name: '🐍 Python', value: 'python' },
          { name: '🐹 Go', value: 'go' },
          { name: '🦀 Rust', value: 'rust' }
        ]
      }]);
      framework = selectedFramework;
    }
  }

  // Template selection
  const { template } = await inquirer.prompt([{
    type: 'list',
    name: 'template',
    message: 'Choose TDD template:',
    choices: [
      { 
        name: '🚀 Full - Complete TDD workflow with all agents', 
        value: 'full' 
      },
      { 
        name: '⚡ Minimal - Essential TDD features only', 
        value: 'minimal' 
      },
      { 
        name: '🎨 Custom - Select specific components', 
        value: 'custom' 
      }
    ],
    default: 'full'
  }]);

  // GitHub integration
  const { githubIntegration } = await inquirer.prompt([{
    type: 'confirm',
    name: 'githubIntegration',
    message: 'Enable GitHub integration?',
    default: detection.git.hasRemote
  }]);

  // TDD settings
  const { strictMode } = await inquirer.prompt([{
    type: 'confirm',
    name: 'strictMode',
    message: 'Enable strict TDD mode? (Enforces RED-GREEN-REFACTOR cycle)',
    default: true
  }]);

  const { parallelSupport } = await inquirer.prompt([{
    type: 'confirm',
    name: 'parallelSupport',
    message: 'Enable parallel development support? (Git worktrees)',
    default: false
  }]);

  return {
    framework,
    template,
    testFramework: detection.project.testFramework || getDefaultTestFramework(framework || 'nodejs'),
    buildTool: detection.project.buildTool || getDefaultBuildTool(framework || 'nodejs'),
    testPatterns: detection.project.testDirectories.length > 0 
      ? detection.project.testDirectories.map((dir: string) => `${dir}/**/*`)
      : getDefaultTestPatterns(framework || 'nodejs'),
    sourcePatterns: detection.project.sourceDirectories.length > 0
      ? detection.project.sourceDirectories.map((dir: string) => `${dir}/**/*`)
      : getDefaultSourcePatterns(framework || 'nodejs'),
    githubIntegration,
    strictMode,
    parallelSupport
  };
}

/**
 * Get default test framework for language
 */
function getDefaultTestFramework(framework: string): string {
  const defaults: Record<string, string> = {
    nodejs: 'jest',
    java: 'junit',
    python: 'pytest',
    go: 'go-test',
    rust: 'cargo-test'
  };
  return defaults[framework] || 'unknown';
}

/**
 * Get default build tool for language
 */
function getDefaultBuildTool(framework: string): string {
  const defaults: Record<string, string> = {
    nodejs: 'npm',
    java: 'maven',
    python: 'pip',
    go: 'go-mod',
    rust: 'cargo'
  };
  return defaults[framework] || 'unknown';
}

/**
 * Get default test patterns for framework
 */
function getDefaultTestPatterns(framework: string): string[] {
  const patterns: Record<string, string[]> = {
    nodejs: ['**/*.test.*', '**/*.spec.*', 'tests/**/*'],
    java: ['src/test/**/*', 'test/**/*'],
    python: ['tests/**/*', 'test/**/*', '**/*_test.py'],
    go: ['**/*_test.go'],
    rust: ['tests/**/*', 'src/**/*.rs']
  };
  return patterns[framework] || ['tests/**/*'];
}

/**
 * Get default source patterns for framework
 */
function getDefaultSourcePatterns(framework: string): string[] {
  const patterns: Record<string, string[]> = {
    nodejs: ['src/**/*', 'lib/**/*'],
    java: ['src/main/**/*'],
    python: ['src/**/*', '*.py'],
    go: ['**/*.go', '!**/*_test.go'],
    rust: ['src/**/*', '!src/**/*.rs.test']
  };
  return patterns[framework] || ['src/**/*'];
}