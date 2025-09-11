import chalk from 'chalk';
import boxen from 'boxen';

/**
 * Print CLI banner
 */
export function printBanner(): void {
  const banner = boxen(
    chalk.bold.cyan('🎯 Claude TDD CLI') + '\n' +
    chalk.gray('Professional Test-Driven Development Workflow') + '\n\n' +
    chalk.yellow('Initialize, configure, and manage TDD projects with ease'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#000040'
    }
  );
  
  console.log(banner);
}

/**
 * Print success message with icon
 */
export function printSuccess(message: string): void {
  console.log(chalk.green('✅'), chalk.bold(message));
}

/**
 * Print error message with icon
 */
export function printError(message: string): void {
  console.error(chalk.red('❌'), chalk.bold(message));
}

/**
 * Print warning message with icon
 */
export function printWarning(message: string): void {
  console.log(chalk.yellow('⚠️'), chalk.bold(message));
}

/**
 * Print info message with icon
 */
export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ️'), chalk.bold(message));
}

/**
 * Print step message with numbered prefix
 */
export function printStep(step: number, message: string): void {
  console.log(chalk.cyan(`${step}️⃣`), chalk.bold(message));
}

/**
 * Print section header
 */
export function printHeader(title: string): void {
  console.log('\n' + chalk.bold.underline(title));
}

/**
 * Print formatted list item
 */
export function printListItem(item: string, status?: 'success' | 'error' | 'warning'): void {
  let icon = '•';
  let color = chalk.gray;
  
  if (status === 'success') {
    icon = '✅';
    color = chalk.green;
  } else if (status === 'error') {
    icon = '❌'; 
    color = chalk.red;
  } else if (status === 'warning') {
    icon = '⚠️';
    color = chalk.yellow;
  }
  
  console.log(`  ${icon} ${color(item)}`);
}

/**
 * Print summary box
 */
export function printSummary(title: string, items: string[]): void {
  const content = title + '\n\n' + items.map(item => `• ${item}`).join('\n');
  
  const box = boxen(content, {
    padding: 1,
    margin: { top: 1, bottom: 1, left: 0, right: 0 },
    borderStyle: 'round',
    borderColor: 'green'
  });
  
  console.log(box);
}