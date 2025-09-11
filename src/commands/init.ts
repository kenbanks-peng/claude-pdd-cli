import inquirer from 'inquirer';
import chalk from 'chalk';
import { TemplateInstaller } from '../core/template-installer.js';
import { CCPMInstaller } from '../core/ccpm-installer.js';
import { FrameworkDetector } from '../core/framework-detector.js';
import { InitOptions } from '../core/types.js';
import { printStep, printSuccess, printError, printHeader, printSummary } from '../ui/output.js';

/**
 * Initialize CCPM + TDD system in current project
 */
export async function initCommand(options: InitOptions): Promise<void> {
  printHeader('🚀 Initializing CCPM + TDD System');

  try {
    // Step 1: Check for existing installation
    const ccpmInstaller = new CCPMInstaller();
    const status = await ccpmInstaller.getInstallationStatus();
    
    if (status.installed && !options.force) {
      console.log(chalk.yellow('⚠️  CCPM + TDD system already installed'));
      console.log(`TDD Enhanced: ${status.tdd_enhanced ? 'Yes' : 'No'}`);
      console.log(`Install Method: ${status.install_method || 'unknown'}`);
      console.log('\nUse --force to reinstall or run update command');
      return;
    }

    // Step 2: Framework Detection
    printStep(1, 'Detecting project framework and configuration...');
    const detector = new FrameworkDetector();
    const detection = await detector.detect();
    
    console.log(chalk.dim(`  Framework: ${detection.framework}`));
    console.log(chalk.dim(`  Test Framework: ${detection.testFramework}`));
    console.log(chalk.dim(`  Package Manager: ${detection.packageManager}`));

    // Step 3: Interactive configuration (if not quick mode)
    let config;
    if (options.quick) {
      printStep(2, 'Using quick setup with detected defaults...');
      config = generateQuickConfig(detection, options);
    } else {
      printStep(2, 'Interactive configuration...');
      config = await interactiveConfiguration(detection, options);
    }

    // Step 4: Dynamic CCPM + TDD installation
    printStep(3, `Installing ${config.mode.toUpperCase()} system...`);
    
    let installResult;
    if (config.mode === 'tdd') {
      // TDD-only mode: use traditional installer
      const templateInstaller = new TemplateInstaller();
      await templateInstaller.install({
        mode: 'tdd',
        force: options.force,
        framework: detection.framework,
        githubRepo: config.githubRepo
      });
      installResult = { success: true, source: 'builtin', version: 'tdd-only' };
    } else {
      // Full or CCPM mode: use dynamic CCPM installer
      installResult = await ccpmInstaller.install({
        online: !options.offline,
        timeout: 60000
      });
      
      if (!installResult.success) {
        throw new Error(`CCPM installation failed: ${installResult.error}`);
      }
    }
    
    // Step 5: Validate installation
    printStep(4, 'Validating installation...');
    const finalStatus = await ccpmInstaller.getInstallationStatus();
    if (!finalStatus.installed) {
      throw new Error('Installation validation failed');
    }

    // Step 6: Success summary
    const modeDisplay = config.mode.toUpperCase();
    const sourceDisplay = installResult.source === 'online' ? '(Latest from CCPM)' : '(Built-in Templates)';
    printSuccess(`${modeDisplay} system initialized successfully! ${sourceDisplay}`);
    
    const summary = [
      `Mode: ${config.mode}`,
      `Framework: ${detection.framework}`,
      `Test Framework: ${detection.testFramework}`,
      `GitHub Integration: ${config.githubRepo ? 'Enabled' : 'Disabled'}`,
      `Install Source: ${installResult.source}`,
      `CCPM Version: ${installResult.version || 'builtin'}`,
      `TDD Enhanced: ${finalStatus.tdd_enhanced ? 'Yes' : 'No'}`,
      `Components: ${getComponentsList(config.mode, finalStatus.tdd_enhanced)}`
    ];
    
    printSummary('🎉 Installation Summary', summary);
    
    // Display next steps based on mode
    printNextSteps(config.mode, installResult.source);

  } catch (error) {
    printError(`Initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Generate quick configuration with detected defaults
 */
function generateQuickConfig(detection: any, options: InitOptions): any {
  return {
    mode: options.mode || (options.withPm !== false ? 'pdd' : 'tdd'),
    framework: detection.framework,
    testFramework: detection.testFramework,
    githubRepo: options.github || '',
    enableGithub: !!options.github
  };
}

/**
 * Interactive configuration setup
 */
async function interactiveConfiguration(detection: any, options: InitOptions): Promise<any> {
  console.log('\n' + chalk.cyan('🔧 Configuration Setup'));
  
  const modeAnswer = await inquirer.prompt([{
    type: 'list',
    name: 'mode',
    message: 'What would you like to install?',
    choices: [
      'PDD - Project-Driven Development (CCPM + TDD) - Recommended',
      'PM - Project Management Only',
      'TDD - Test-Driven Development Only'
    ],
    default: 0
  }]);
  
  const mode = modeAnswer.mode.includes('PDD') ? 'pdd' : 
               modeAnswer.mode.includes('PM') ? 'pm' : 'tdd';
  
  let enableGithub = false;
  let githubRepo = '';
  
  if (mode !== 'tdd') {
    const githubAnswer = await inquirer.prompt([{
      type: 'confirm',
      name: 'enableGithub',
      message: 'Enable GitHub Issues integration?',
      default: true
    }]);
    enableGithub = githubAnswer.enableGithub;
    
    if (enableGithub) {
      const repoAnswer = await inquirer.prompt([{
        type: 'input',
        name: 'githubRepo',
        message: 'GitHub repository (owner/repo):'
      }]);
      githubRepo = repoAnswer.githubRepo?.trim() || '';
    }
  }
  
  const frameworkAnswer = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirmFramework',
    message: `Detected framework: ${detection.framework}. Is this correct?`,
    default: true
  }]);

  return {
    mode,
    framework: frameworkAnswer.confirmFramework ? detection.framework : 'nodejs',
    testFramework: detection.testFramework,
    githubRepo,
    enableGithub
  };
}

/**
 * Get components list based on installation mode
 */
function getComponentsList(mode: string, tddEnhanced: boolean = false): string {
  const components: { [key: string]: string } = {
    pdd: tddEnhanced 
      ? 'PM Commands (39), TDD Commands (5), Agents (8), Workflows (4)' 
      : 'PM Commands (39), TDD Commands (5), Agents (6), Workflows (2)',
    pm: tddEnhanced
      ? 'PM Commands (39), TDD Commands (5), Context Commands, Testing Commands'
      : 'PM Commands (39), Context Commands, Testing Commands',
    tdd: 'TDD Commands (5), Test Generator, Basic Workflows'
  };
  
  return components[mode] || 'Unknown';
}

/**
 * Print next steps based on installation mode
 */
function printNextSteps(mode: string, source: string = 'builtin'): void {
  console.log('\n' + chalk.cyan('📖 Next Steps:'));
  
  switch (mode) {
    case 'pdd':
      console.log('  1. Open this project in Claude Code');
      console.log('  2. Create your first PRD:', chalk.yellow('/pm:prd-new my-feature'));
      console.log('  3. Parse PRD to Epic:', chalk.yellow('/pm:prd-parse my-feature'));
      console.log('  4. Start TDD development:', chalk.yellow('/pm:issue-start 123'));
      console.log('  5. Execute TDD cycle:', chalk.yellow('/tdd:cycle'));
      if (source === 'online') {
        console.log('\n' + chalk.green('✨ Latest CCPM features available from online installation!'));
      }
      break;
      
    case 'pm':
      console.log('  1. Open this project in Claude Code');
      console.log('  2. Initialize context:', chalk.yellow('/context:prime'));
      console.log('  3. Create PRD:', chalk.yellow('/pm:prd-new my-feature'));
      console.log('  4. Start Epic:', chalk.yellow('/pm:epic-start my-feature'));
      console.log('  5. Manage issues:', chalk.yellow('/pm:issue-start 123'));
      if (source === 'online') {
        console.log('\n' + chalk.green('✨ Latest CCPM features available from online installation!'));
      }
      break;
      
    case 'tdd':
      console.log('  1. Open this project in Claude Code');
      console.log('  2. Configure testing:', chalk.yellow('/testing:prime'));
      console.log('  3. Start TDD cycle:', chalk.yellow('/tdd:red'));
      console.log('  4. Or run full cycle:', chalk.yellow('/tdd:cycle'));
      console.log('  5. Check test status:', chalk.yellow('/testing:run'));
      break;
  }
  
  console.log('\n' + chalk.dim('💡 All commands are executed within Claude Code, not in terminal'));
  console.log(chalk.dim('📚 See .claude/CLAUDE.md for complete command reference'));
  
  if (source === 'offline') {
    console.log('\n' + chalk.yellow('ℹ️  Installed in offline mode. Run with --online to get latest CCPM features.'));
  }
}