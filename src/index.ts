#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { initCommand } from './commands/init.js';
import { doctorCommand } from './commands/doctor.js';
import { configCommand } from './commands/config.js';
import { statusCommand } from './commands/status.js';
import { updateCommand } from './commands/update.js';
import { switchFrameworkCommand, migrateCommand } from './commands/switch-framework.js';
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
    .name('claude-tdd')
    .description('CLI tool for initializing and managing Claude TDD Workflow projects')
    .version(getVersion(), '-v, --version', 'output the current version')
    .helpOption('-h, --help', 'display help for command');

  // Init command
  program
    .command('init')
    .description('Initialize TDD workflow in current project')
    .option('-f, --framework <type>', 'specify framework type (nodejs/java/python/go/rust)')
    .option('-q, --quick', 'quick setup with defaults')
    .option('--force', 'overwrite existing configuration')
    .option('--template <type>', 'use specific template (full/minimal/custom)')
    .action(initCommand);

  // Doctor command
  program
    .command('doctor')
    .description('Diagnose environment and project status')
    .option('-v, --verbose', 'detailed diagnostic output')
    .option('--check-project', 'only check project configuration')
    .option('--check-claude', 'only check Claude Code environment')
    .action(doctorCommand);

  // Config command
  program
    .command('config')
    .description('Manage configuration settings')
    .argument('[action]', 'action to perform (show/set/list)')
    .argument('[key]', 'configuration key')
    .argument('[value]', 'configuration value')
    .option('--global', 'apply to global configuration')
    .option('--apply', 'immediately apply project-level changes (for framework switching)')
    .action(configCommand);

  // Status command
  program
    .command('status')
    .description('Show current TDD workflow status')
    .option('--json', 'output in JSON format')
    .action(statusCommand);

  // Update command
  program
    .command('update')
    .description('Update configuration templates to latest version')
    .option('--check', 'only check for updates without applying')
    .option('--force', 'force update even if version is current')
    .action(updateCommand);

  // Switch Framework command
  program
    .command('switch-framework [framework]')
    .description('Switch project framework while preserving other configurations')
    .option('-y, --yes', 'skip confirmation prompts')
    .option('--skip-backup', 'skip configuration backup')
    .action(switchFrameworkCommand);

  // Migrate command
  program
    .command('migrate')
    .description('Migrate project between frameworks (advanced)')
    .option('--from <framework>', 'source framework')
    .option('--to <framework>', 'target framework')
    .option('--interactive', 'run interactive migration wizard')
    .action(migrateCommand);

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