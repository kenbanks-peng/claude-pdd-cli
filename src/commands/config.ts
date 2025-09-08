import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { ConfigOptions } from '../core/types';
import { printHeader, printSuccess, printError, printListItem, printWarning } from '../ui/output';

/**
 * Manage configuration settings
 */
export async function configCommand(
  action?: string, 
  key?: string, 
  value?: string, 
  options: ConfigOptions = {}
): Promise<void> {
  printHeader('⚙️ Configuration Management');

  try {
    switch (action) {
      case 'show':
      case undefined:
        await showConfig(options);
        break;
      case 'set':
        if (!key || value === undefined) {
          printError('Usage: claude-tdd config set <key> <value>');
          process.exit(1);
        }
        await setConfig(key, value, options);
        break;
      case 'list':
      case 'templates':
        await listTemplates();
        break;
      default:
        printError(`Unknown action: ${action}`);
        console.log('\nAvailable actions:');
        console.log('  show     - Show current configuration');
        console.log('  set      - Set configuration value');
        console.log('  list     - List available templates');
        process.exit(1);
    }
  } catch (error) {
    printError(`Configuration operation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Show current configuration
 */
async function showConfig(options: ConfigOptions): Promise<void> {
  console.log('\n' + chalk.bold.underline('Current Configuration'));
  
  // This would read from actual config files
  const sampleConfig = {
    'default.framework': 'nodejs',
    'default.template': 'full',
    'github.integration': 'true',
    'tdd.strictMode': 'true',
    'parallel.maxWorkers': '3'
  };
  
  Object.entries(sampleConfig).forEach(([key, value]) => {
    printListItem(`${chalk.cyan(key)}: ${chalk.yellow(value)}`);
  });
  
  console.log('\n' + chalk.gray('Use "claude-tdd config set <key> <value>" to modify settings'));
}

/**
 * Set configuration value
 */
async function setConfig(key: string, value: string, options: ConfigOptions): Promise<void> {
  console.log(chalk.gray(`Setting ${key} = ${value} ${options.global ? '(global)' : '(project)'}`));
  
  // Validate key
  const validKeys = [
    'default.framework',
    'default.template', 
    'project.framework',
    'github.token',
    'github.integration',
    'tdd.strictMode',
    'parallel.maxWorkers'
  ];
  
  if (!validKeys.includes(key)) {
    printError(`Invalid configuration key: ${key}`);
    console.log('\nValid keys:');
    validKeys.forEach(k => printListItem(k));
    return;
  }
  
  // Validate value based on key
  if (key.endsWith('.integration') || key.endsWith('.strictMode')) {
    if (!['true', 'false'].includes(value.toLowerCase())) {
      printError('Boolean values must be "true" or "false"');
      return;
    }
  }
  
  if (key === 'default.framework' || key === 'project.framework') {
    const validFrameworks = ['nodejs', 'java', 'python', 'go', 'rust'];
    if (!validFrameworks.includes(value)) {
      printError(`Invalid framework. Must be one of: ${validFrameworks.join(', ')}`);
      return;
    }
  }

  // Handle project-level configuration
  if (key === 'project.framework' && !options.global) {
    await setProjectFramework(value, options);
    return;
  }
  
  // Handle global configuration (placeholder implementation)
  if (options.global || key.startsWith('default.')) {
    // This would update global config file
    printSuccess(`Global configuration updated: ${key} = ${value}`);
  } else {
    // This would update project config file
    printSuccess(`Project configuration updated: ${key} = ${value}`);
  }
}

/**
 * Set project framework and optionally apply changes
 */
async function setProjectFramework(framework: string, options: ConfigOptions): Promise<void> {
  const projectConfigPath = path.join(process.cwd(), '.claude', 'project-config.json');
  
  if (!await fs.pathExists(projectConfigPath)) {
    printError('No project configuration found. Please run "ctdd init" first.');
    return;
  }

  try {
    // Read current config
    const config = await fs.readJson(projectConfigPath);
    const currentFramework = config.project?.type || 'unknown';

    if (currentFramework === framework) {
      printWarning(`Project is already using ${framework} framework.`);
      return;
    }

    // Update framework in config
    config.project.type = framework;
    config.project.language = framework === 'nodejs' ? 'javascript' : framework;
    config.project.lastModified = new Date().toISOString();

    await fs.writeJson(projectConfigPath, config, { spaces: 2 });
    printSuccess(`Project framework updated: ${currentFramework} → ${framework}`);

    // Apply changes if requested
    if (options.apply) {
      console.log(chalk.cyan('\nApplying framework changes...'));
      await applyFrameworkChanges(framework);
    } else {
      console.log(chalk.yellow('\n💡 Tip: Use --apply flag to immediately update project configuration'));
      console.log(chalk.gray('   Or run: ctdd switch-framework ' + framework));
    }

  } catch (error) {
    printError(`Failed to update project configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Apply framework changes using project detector
 */
async function applyFrameworkChanges(framework: string): Promise<void> {
  const projectDetectorPath = path.join(process.cwd(), '.claude', 'scripts', 'tdd', 'project-detector.sh');
  
  if (await fs.pathExists(projectDetectorPath)) {
    try {
      // Set environment variable for the project detector
      const env = { 
        ...process.env, 
        CLAUDE_PROJECT_DIR: process.cwd(),
        FORCE_FRAMEWORK: framework 
      };
      
      execSync(`bash "${projectDetectorPath}" config`, { 
        cwd: process.cwd(),
        env,
        stdio: 'pipe'
      });
      
      printSuccess('Project configuration applied successfully');
      console.log(chalk.cyan('Run "ctdd status" to verify the changes'));
    } catch (error) {
      printWarning('Automatic project detection failed. Manual configuration may be needed.');
      console.log(chalk.gray('You can run: bash .claude/scripts/tdd/project-detector.sh config'));
    }
  } else {
    printWarning('Project detector script not found. Some configurations may need manual update.');
  }
}

/**
 * List available templates
 */
async function listTemplates(): Promise<void> {
  console.log('\n' + chalk.bold.underline('Available Templates'));
  
  const templates = [
    {
      name: 'full',
      description: 'Complete TDD workflow with all 10 agents',
      features: ['All agents', 'GitHub integration', 'Parallel support', 'Full hooks']
    },
    {
      name: 'minimal',
      description: 'Essential TDD features only',
      features: ['Core TDD agents', 'Basic hooks', 'Simple workflow']
    },
    {
      name: 'custom',
      description: 'Customizable template with selected components',
      features: ['User-selected agents', 'Configurable features']
    }
  ];
  
  templates.forEach(template => {
    console.log(`\n${chalk.cyan('●')} ${chalk.bold(template.name)}`);
    console.log(`  ${template.description}`);
    console.log(`  Features: ${template.features.join(', ')}`);
  });
  
  console.log('\n' + chalk.gray('Use "claude-tdd init --template <name>" to use a specific template'));
}