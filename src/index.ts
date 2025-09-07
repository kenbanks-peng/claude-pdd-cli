#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { doctorCommand } from './commands/doctor';
import { configCommand } from './commands/config';
import { statusCommand } from './commands/status';
import { updateCommand } from './commands/update';
import { printBanner } from './ui/output';

const program = new Command();

async function main() {
  printBanner();

  program
    .name('claude-tdd')
    .description('CLI tool for initializing and managing Claude TDD Workflow projects')
    .version('1.0.0', '-v, --version', 'output the current version')
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