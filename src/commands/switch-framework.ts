import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { EnvironmentDetector } from '../core/detector';
import { SwitchFrameworkOptions, FrameworkType } from '../core/types';
import { printStep, printSuccess, printError, printWarning, printHeader, printInfo } from '../ui/output';

/**
 * Switch project framework while preserving other configurations
 */
export async function switchFrameworkCommand(
  targetFramework?: FrameworkType,
  options: SwitchFrameworkOptions = {}
): Promise<void> {
  printHeader('🔄 Switch Project Framework');

  try {
    // Step 1: Validate environment
    printStep(1, 'Validating project environment...');
    await validateEnvironment();

    // Step 2: Detect current state
    printStep(2, 'Detecting current project configuration...');
    const spinner = ora('Analyzing project structure...').start();
    
    const detector = new EnvironmentDetector();
    const detection = await detector.detect();
    
    spinner.succeed('Project analysis completed');

    // Step 3: Confirm framework switch
    const currentFramework = await getCurrentFramework();
    const newFramework = await confirmFrameworkSwitch(targetFramework, currentFramework, options);

    if (!newFramework) {
      printInfo('Framework switch cancelled.');
      return;
    }

    // Step 4: Backup current configuration
    if (!options.skipBackup) {
      printStep(3, 'Creating configuration backup...');
      await backupConfiguration();
    }

    // Step 5: Update framework configuration
    printStep(4, 'Updating framework configuration...');
    await updateFrameworkConfig(currentFramework, newFramework, detection);

    // Step 6: Update project scripts and commands
    printStep(5, 'Updating project scripts and commands...');
    await updateProjectScripts(newFramework);

    // Step 7: Re-detect and validate
    printStep(6, 'Validating configuration...');
    await validateNewConfiguration(newFramework);

    // Success
    printSuccess(`Framework successfully switched from ${currentFramework} to ${newFramework}!`);
    
    console.log('\n' + chalk.cyan('📖 Next steps:'));
    console.log('  1. Update your project dependencies if needed');
    console.log('  2. Run', chalk.yellow('ctdd status'), 'to verify configuration');
    console.log('  3. Test your workflow with', chalk.yellow('ctdd doctor'));

  } catch (error) {
    printError(`Framework switch failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Validate that the project environment is ready for framework switch
 */
async function validateEnvironment(): Promise<void> {
  const claudeDir = path.join(process.cwd(), '.claude');
  
  if (!await fs.pathExists(claudeDir)) {
    printError('No Claude TDD configuration found. Please run "ctdd init" first.');
    process.exit(1);
  }

  const configFile = path.join(claudeDir, 'project-config.json');
  if (!await fs.pathExists(configFile)) {
    printError('Project configuration not found. The project may not be properly initialized.');
    process.exit(1);
  }
}

/**
 * Get current framework from project configuration
 */
async function getCurrentFramework(): Promise<string> {
  const configPath = path.join(process.cwd(), '.claude', 'project-config.json');
  
  try {
    const config = await fs.readJson(configPath);
    return config.project?.type || config.project?.language || 'unknown';
  } catch (error) {
    throw new Error('Unable to read current project configuration');
  }
}

/**
 * Confirm framework switch with user
 */
async function confirmFrameworkSwitch(
  targetFramework?: FrameworkType,
  currentFramework?: string,
  options: SwitchFrameworkOptions = {}
): Promise<string | null> {
  
  if (currentFramework === targetFramework) {
    printWarning(`Project is already using ${currentFramework} framework.`);
    return null;
  }

  let newFramework = targetFramework;

  // If no target framework specified, prompt user
  if (!newFramework) {
    const availableFrameworks = ['nodejs', 'java', 'python', 'go', 'rust'];
    
    const { selectedFramework } = await inquirer.prompt([{
      type: 'list',
      name: 'selectedFramework',
      message: 'Select target framework:',
      choices: availableFrameworks.filter(f => f !== currentFramework),
      default: 'nodejs'
    }]);
    
    newFramework = selectedFramework;
  }

  // Confirm the switch
  if (!options.yes) {
    console.log(`\n${chalk.bold('Framework Switch Summary:')}`);
    console.log(`  Current: ${chalk.red(currentFramework || 'unknown')}`);
    console.log(`  Target:  ${chalk.green(newFramework)}`);
    
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with framework switch?',
      default: false
    }]);

    if (!confirm) {
      return null;
    }
  }

  return newFramework || null;
}

/**
 * Backup current configuration
 */
async function backupConfiguration(): Promise<void> {
  const claudeDir = path.join(process.cwd(), '.claude');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(claudeDir, 'backups', `framework-switch-${timestamp}`);
  
  await fs.ensureDir(backupDir);
  
  const filesToBackup = [
    'project-config.json',
    'tdd-state.json'
  ];

  for (const file of filesToBackup) {
    const srcPath = path.join(claudeDir, file);
    const destPath = path.join(backupDir, file);
    
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
    }
  }

  console.log(chalk.gray(`  Configuration backed up to: .claude/backups/framework-switch-${timestamp}`));
}

/**
 * Update framework configuration
 */
async function updateFrameworkConfig(
  currentFramework: string,
  newFramework: string,
  detection: any
): Promise<void> {
  const configPath = path.join(process.cwd(), '.claude', 'project-config.json');
  const config = await fs.readJson(configPath);

  // Update project framework information
  config.project.type = newFramework;
  config.project.language = newFramework === 'nodejs' ? 'javascript' : newFramework;
  config.project.lastModified = new Date().toISOString();

  // Reset framework-specific configurations that need re-detection
  config.project.testFramework = 'unknown';
  config.project.buildTool = 'unknown';
  config.commands = {
    test: "echo 'Please run project detection to configure test command'",
    build: "echo 'Please run project detection to configure build command'",
    lint: "echo 'Please run project detection to configure lint command'",
    coverage: "echo 'Please run project detection to configure coverage command'"
  };

  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * Update project scripts and commands using project detector
 */
async function updateProjectScripts(newFramework: string): Promise<void> {
  const projectDetectorPath = path.join(process.cwd(), '.claude', 'scripts', 'tdd', 'project-detector.sh');
  
  if (await fs.pathExists(projectDetectorPath)) {
    try {
      // Set environment variable for the project detector
      const env = { 
        ...process.env, 
        CLAUDE_PROJECT_DIR: process.cwd(),
        FORCE_FRAMEWORK: newFramework 
      };
      
      execSync(`bash "${projectDetectorPath}" config`, { 
        cwd: process.cwd(),
        env,
        stdio: 'pipe'
      });
      
      console.log(chalk.gray('  Project configuration updated automatically'));
    } catch (error) {
      printWarning('Automatic project detection failed. Please run manual configuration.');
      console.log(chalk.gray('  Run: bash .claude/scripts/tdd/project-detector.sh config'));
    }
  } else {
    printWarning('Project detector script not found. Some configurations may need manual update.');
  }
}

/**
 * Validate new configuration
 */
async function validateNewConfiguration(newFramework: string): Promise<void> {
  const configPath = path.join(process.cwd(), '.claude', 'project-config.json');
  const config = await fs.readJson(configPath);

  // Check if configuration was properly updated
  if (config.project.type !== newFramework) {
    throw new Error('Framework configuration was not properly updated');
  }

  // Check if essential commands are configured
  const hasValidCommands = config.commands.test !== "echo 'Please configure test command'" ||
                           config.commands.test !== "echo 'Please run project detection to configure test command'";
  
  if (!hasValidCommands) {
    printWarning('Test commands may need manual configuration for the new framework.');
  }

  console.log(chalk.gray('  Configuration validation completed'));
}

/**
 * Create a migrate command that handles more complex framework migrations
 */
export async function migrateCommand(
  options: { from?: string; to?: string; interactive?: boolean } = {}
): Promise<void> {
  printHeader('🚀 Project Framework Migration');

  console.log(chalk.yellow('⚠️  This is an advanced operation that may require manual adjustments.'));
  console.log(chalk.gray('Consider creating a full project backup before proceeding.\n'));

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: 'Continue with framework migration?',
    default: false
  }]);

  if (!confirm) {
    printInfo('Migration cancelled.');
    return;
  }

  // For now, delegate to switch-framework with additional warnings
  const switchOptions: SwitchFrameworkOptions = {
    skipBackup: false,
    yes: false
  };

  await switchFrameworkCommand(options.to as FrameworkType, switchOptions);

  // Additional migration guidance
  console.log('\n' + chalk.bold.underline('Migration Checklist'));
  console.log('  ' + chalk.gray('□ Update package.json/requirements.txt/Cargo.toml dependencies'));
  console.log('  ' + chalk.gray('□ Migrate existing test files to new framework conventions'));
  console.log('  ' + chalk.gray('□ Update build scripts and CI/CD configuration'));
  console.log('  ' + chalk.gray('□ Review and update project documentation'));
  console.log('  ' + chalk.gray('□ Test the complete workflow with sample code'));
}