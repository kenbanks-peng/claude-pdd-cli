import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { StatusOptions } from '../core/types';
import { printHeader, printListItem, printError, printSuccess } from '../ui/output';

/**
 * Show current TDD workflow status
 */
export async function statusCommand(options: StatusOptions): Promise<void> {
  if (!options.json) {
    printHeader('📊 TDD Workflow Status');
  }

  try {
    const cwd = process.cwd();
    const claudeDir = path.join(cwd, '.claude');
    
    if (!await fs.pathExists(claudeDir)) {
      if (options.json) {
        console.log(JSON.stringify({ configured: false, error: 'TDD workflow not initialized' }, null, 2));
      } else {
        printError('TDD workflow not initialized in this project');
        console.log('\n' + chalk.cyan('Run'), chalk.yellow('claude-tdd init'), chalk.cyan('to initialize'));
      }
      return;
    }

    const status = await gatherStatus(claudeDir);
    
    if (options.json) {
      console.log(JSON.stringify(status, null, 2));
    } else {
      await printStatus(status);
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    if (options.json) {
      console.log(JSON.stringify({ error: errorMsg }, null, 2));
    } else {
      printError(`Status check failed: ${errorMsg}`);
    }
    process.exit(1);
  }
}

/**
 * Gather status information
 */
async function gatherStatus(claudeDir: string) {
  const status = {
    configured: true,
    project: await getProjectInfo(claudeDir),
    agents: await getAgentsInfo(claudeDir),
    commands: await getCommandsInfo(claudeDir),
    hooks: await getHooksInfo(claudeDir),
    currentPhase: await getCurrentPhase(claudeDir),
    lastActivity: await getLastActivity(claudeDir)
  };

  return status;
}

/**
 * Get project information
 */
async function getProjectInfo(claudeDir: string) {
  try {
    const settingsPath = path.join(claudeDir, 'settings.json');
    if (await fs.pathExists(settingsPath)) {
      const settings = await fs.readJson(settingsPath);
      return {
        name: settings.project?.name || 'Unknown',
        version: settings.project?.version || '1.0.0',
        framework: settings.tdd?.framework || 'Unknown',
        strictMode: settings.tdd?.strictMode || false,
        githubIntegration: settings.github?.integration || false
      };
    }
  } catch (error) {
    // Ignore errors, return defaults
  }

  return {
    name: 'Unknown',
    version: '1.0.0',
    framework: 'Unknown',
    strictMode: false,
    githubIntegration: false
  };
}

/**
 * Get agents information
 */
async function getAgentsInfo(claudeDir: string) {
  try {
    const agentsDir = path.join(claudeDir, 'agents');
    if (await fs.pathExists(agentsDir)) {
      const agents = await fs.readdir(agentsDir);
      return {
        total: agents.filter(f => f.endsWith('.md')).length,
        available: agents.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
      };
    }
  } catch (error) {
    // Ignore errors
  }

  return { total: 0, available: [] };
}

/**
 * Get commands information
 */
async function getCommandsInfo(claudeDir: string) {
  try {
    const commandsDir = path.join(claudeDir, 'commands');
    if (await fs.pathExists(commandsDir)) {
      const tddDir = path.join(commandsDir, 'tdd');
      const pmDir = path.join(commandsDir, 'pm');
      
      const tddCommands = await fs.pathExists(tddDir) 
        ? (await fs.readdir(tddDir)).filter(f => f.endsWith('.md')).length
        : 0;
      
      const pmCommands = await fs.pathExists(pmDir)
        ? (await fs.readdir(pmDir)).filter(f => f.endsWith('.md')).length
        : 0;
      
      return {
        tdd: tddCommands,
        pm: pmCommands,
        total: tddCommands + pmCommands
      };
    }
  } catch (error) {
    // Ignore errors
  }

  return { tdd: 0, pm: 0, total: 0 };
}

/**
 * Get hooks information
 */
async function getHooksInfo(claudeDir: string) {
  try {
    const hooksDir = path.join(claudeDir, 'hooks');
    if (await fs.pathExists(hooksDir)) {
      const hooks = await fs.readdir(hooksDir);
      return {
        total: hooks.filter(f => f.endsWith('.sh')).length,
        available: hooks.filter(f => f.endsWith('.sh')).map(f => f.replace('.sh', ''))
      };
    }
  } catch (error) {
    // Ignore errors
  }

  return { total: 0, available: [] };
}

/**
 * Get current TDD phase
 */
async function getCurrentPhase(claudeDir: string) {
  try {
    const statePath = path.join(claudeDir, 'tdd-state.json');
    if (await fs.pathExists(statePath)) {
      const state = await fs.readJson(statePath);
      return {
        current: state.currentPhase || 'READY',
        history: state.history || []
      };
    }
  } catch (error) {
    // Ignore errors
  }

  return { current: 'READY', history: [] };
}

/**
 * Get last activity
 */
async function getLastActivity(claudeDir: string) {
  try {
    const statePath = path.join(claudeDir, 'tdd-state.json');
    if (await fs.pathExists(statePath)) {
      const stats = await fs.stat(statePath);
      return {
        lastModified: stats.mtime.toISOString(),
        daysAgo: Math.floor((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24))
      };
    }
  } catch (error) {
    // Ignore errors
  }

  return { lastModified: null, daysAgo: null };
}

/**
 * Print formatted status
 */
async function printStatus(status: any) {
  console.log('\n' + chalk.bold.underline('Project Information'));
  printListItem(`Name: ${chalk.cyan(status.project.name)}`);
  printListItem(`Version: ${chalk.cyan(status.project.version)}`);
  printListItem(`Framework: ${chalk.cyan(status.project.framework)}`);
  printListItem(`Strict Mode: ${status.project.strictMode ? chalk.green('Enabled') : chalk.yellow('Disabled')}`);
  printListItem(`GitHub Integration: ${status.project.githubIntegration ? chalk.green('Enabled') : chalk.yellow('Disabled')}`);

  console.log('\n' + chalk.bold.underline('TDD Workflow'));
  const phaseColor = getPhaseColor(status.currentPhase.current);
  printListItem(`Current Phase: ${phaseColor(status.currentPhase.current)}`);
  
  if (status.lastActivity.lastModified) {
    printListItem(`Last Activity: ${status.lastActivity.daysAgo === 0 ? 'Today' : `${status.lastActivity.daysAgo} days ago`}`);
  }

  console.log('\n' + chalk.bold.underline('Components'));
  printListItem(`Agents: ${chalk.cyan(status.agents.total)} configured`);
  printListItem(`Commands: ${chalk.cyan(status.commands.total)} (TDD: ${status.commands.tdd}, PM: ${status.commands.pm})`);
  printListItem(`Hooks: ${chalk.cyan(status.hooks.total)} configured`);

  if (status.agents.total > 0) {
    console.log('\n' + chalk.bold.underline('Available Agents'));
    status.agents.available.forEach((agent: string) => {
      printListItem(chalk.gray(agent));
    });
  }

  if (status.currentPhase.history.length > 0) {
    console.log('\n' + chalk.bold.underline('Recent Phase History'));
    status.currentPhase.history.slice(-5).forEach((entry: any) => {
      const color = getPhaseColor(entry.phase);
      printListItem(`${color(entry.phase)} - ${new Date(entry.timestamp).toLocaleString()}`);
    });
  }

  // Status summary
  console.log('\n' + chalk.bold.underline('Status Summary'));
  if (status.agents.total > 0 && status.commands.total > 0) {
    printSuccess('TDD workflow fully configured and ready!');
  } else {
    printError('TDD workflow configuration incomplete');
  }
}

/**
 * Get color for TDD phase
 */
function getPhaseColor(phase: string) {
  switch (phase) {
    case 'RED': return chalk.red;
    case 'GREEN': return chalk.green;
    case 'REFACTOR': return chalk.blue;
    case 'READY': return chalk.cyan;
    default: return chalk.gray;
  }
}