#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initCommand } from './commands/init.js';
import { printBanner } from './ui/output.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 从 package.json 读取版本号
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

const program = new Command();

async function main() {
  printBanner();

  program
    .name('claude-pdd')
    .description('Claude PDD - Project-Driven Development Platform with flexible methodology support')
    .version(getVersion(), '-v, --version', 'output the current version')
    .helpOption('-h, --help', 'display help for command');

  // Init command - The only command needed
  program
    .command('init')
    .description('Initialize CCPM + TDD system in current project')
    .option('-f, --framework <type>', 'specify framework type (nodejs/java/python/go/rust)')
    .option('-q, --quick', 'quick setup with detected defaults')
    .option('--force', 'overwrite existing installation')
    .option('--with-pm', 'include project management features (default: true)')
    .option('--github <repo>', 'GitHub repository (owner/repo) for integration')
    .option('--mode <mode>', 'installation mode (pdd/pm/tdd)', 'pdd')
    .option('--offline', 'use offline installation (built-in templates only)')
    .action(initCommand);

  // Status command for checking installation
  program
    .command('status')
    .description('Show installation status')
    .action(async () => {
      const { TemplateInstaller } = await import('./core/template-installer.js');
      const installer = new TemplateInstaller();
      const status = await installer.getStatus();
      
      if (status.installed) {
        console.log(chalk.green('✅ CCPM + TDD system is installed'));
        console.log(`Mode: ${status.mode}`);
        console.log(`Version: ${status.version}`);
        console.log(`Components: ${status.components.join(', ')}`);
      } else {
        console.log(chalk.yellow('⚠️  System not installed'));
        console.log('Run', chalk.cyan('cpdd init'), 'to install');
      }
    });

  // Update command
  program
    .command('update')
    .description('Update existing installation')
    .option('--force', 'force reinstallation')
    .action(async (options) => {
      const { TemplateInstaller } = await import('./core/template-installer.js');
      const installer = new TemplateInstaller();
      
      try {
        await installer.update(options);
        console.log(chalk.green('✅ System updated successfully'));
      } catch (error) {
        console.error(chalk.red('❌ Update failed:'), error);
        process.exit(1);
      }
    });

  // Show help if no command provided
  if (process.argv.length <= 2) {
    program.help();
  }
  
  // Parse command line arguments
  await program.parseAsync(process.argv);
}

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled error:'), reason);
  process.exit(1);
});

// Run main
main().catch((error) => {
  console.error(chalk.red('❌ Fatal error:'), error);
  process.exit(1);
});