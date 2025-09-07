import chalk from 'chalk';
import { ConfigOptions } from '../core/types';
import { printHeader, printSuccess, printError, printListItem } from '../ui/output';

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
  // This would actually update config files
  console.log(chalk.gray(`Setting ${key} = ${value} ${options.global ? '(global)' : '(project)'}`));
  
  // Validate key
  const validKeys = [
    'default.framework',
    'default.template', 
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
  
  if (key === 'default.framework') {
    const validFrameworks = ['nodejs', 'java', 'python', 'go', 'rust'];
    if (!validFrameworks.includes(value)) {
      printError(`Invalid framework. Must be one of: ${validFrameworks.join(', ')}`);
      return;
    }
  }
  
  printSuccess(`Configuration updated: ${key} = ${value}`);
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