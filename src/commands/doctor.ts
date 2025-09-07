import chalk from 'chalk';
import { EnvironmentDetector } from '../core/detector';
import { DoctorOptions } from '../core/types';
import { printHeader, printListItem, printSuccess, printError, printWarning, printSummary } from '../ui/output';

/**
 * Diagnose environment and project status
 */
export async function doctorCommand(options: DoctorOptions): Promise<void> {
  printHeader('🩺 Claude TDD Environment Diagnostics');

  try {
    const detector = new EnvironmentDetector();
    const detection = await detector.detect();

    // Claude Code Environment
    if (!options.checkProject) {
      console.log('\n' + chalk.bold.underline('Claude Code Environment'));
      
      if (detection.claudeCode.installed) {
        printListItem(`Claude Code installed ${detection.claudeCode.version ? `(${detection.claudeCode.version})` : ''}`, 'success');
      } else {
        printListItem('Claude Code not found', 'error');
      }
      
      if (detection.claudeCode.globalConfigExists) {
        printListItem(`Global config found: ${detection.claudeCode.configPath}`, 'success');
      } else {
        printListItem('Global config not found', 'warning');
      }
    }

    // Git Environment
    if (!options.checkProject) {
      console.log('\n' + chalk.bold.underline('Git Environment'));
      
      if (detection.git.initialized) {
        printListItem('Git repository initialized', 'success');
        
        if (detection.git.hasRemote) {
          printListItem('Remote repository configured', 'success');
        } else {
          printListItem('No remote repository', 'warning');
        }
        
        if (detection.git.defaultBranch) {
          printListItem(`Default branch: ${detection.git.defaultBranch}`, 'success');
        }
        
        if (detection.git.hasGitHooks) {
          printListItem('Git hooks present', 'warning');
        }
      } else {
        printListItem('Git not initialized', 'error');
      }
    }

    // Project Configuration
    if (!options.checkClaude) {
      console.log('\n' + chalk.bold.underline('Project Configuration'));
      
      if (detection.project.hasClaudeConfig) {
        printListItem('TDD workflow configured', 'success');
      } else {
        printListItem('TDD workflow not configured', 'warning');
      }
      
      if (detection.project.framework !== 'unknown') {
        printListItem(`Framework: ${detection.project.framework}`, 'success');
        
        if (detection.project.testFramework) {
          printListItem(`Test framework: ${detection.project.testFramework}`, 'success');
        }
        
        if (detection.project.buildTool) {
          printListItem(`Build tool: ${detection.project.buildTool}`, 'success');
        }
      } else {
        printListItem('Framework not detected', 'warning');
      }
      
      // Test directories
      if (detection.project.testDirectories.length > 0) {
        printListItem(`Test directories: ${detection.project.testDirectories.join(', ')}`, 'success');
      } else {
        printListItem('No test directories found', 'warning');
      }
      
      // Source directories  
      if (detection.project.sourceDirectories.length > 0) {
        printListItem(`Source directories: ${detection.project.sourceDirectories.join(', ')}`, 'success');
      } else {
        printListItem('No source directories found', 'warning');
      }
      
      // Configuration files
      if (detection.project.configFiles.length > 0 && options.verbose) {
        printListItem(`Config files: ${detection.project.configFiles.join(', ')}`, 'success');
      }
    }

    // Conflicts
    if (detection.conflicts.length > 0) {
      console.log('\n' + chalk.bold.underline.red('⚠️ Conflicts Detected'));
      detection.conflicts.forEach(conflict => {
        switch (conflict) {
          case 'claude-config-exists':
            printListItem('Existing Claude configuration may be overwritten', 'warning');
            break;
          case 'git-hooks-exist':
            printListItem('Existing Git hooks may conflict with TDD hooks', 'warning');
            break;
          case 'test-config-conflict':
            printListItem('Test configuration conflicts detected', 'error');
            break;
          default:
            printListItem(`Unknown conflict: ${conflict}`, 'warning');
        }
      });
    }

    // Recommendations
    if (detection.recommendations.length > 0) {
      console.log('\n' + chalk.bold.underline.yellow('💡 Recommendations'));
      detection.recommendations.forEach(rec => {
        const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
        printListItem(`${icon} ${rec.title}: ${rec.description}`, 
          rec.actionRequired ? 'error' : 'warning');
      });
    }

    // Overall Status
    const hasErrors = !detection.claudeCode.installed || 
                     detection.conflicts.some(c => c === 'test-config-conflict') ||
                     detection.recommendations.some(r => r.actionRequired);
    
    const hasWarnings = detection.conflicts.length > 0 || 
                       detection.recommendations.length > 0 ||
                       !detection.git.initialized ||
                       !detection.project.hasClaudeConfig;

    console.log('\n' + chalk.bold.underline('📊 Overall Status'));
    
    if (hasErrors) {
      printError('Issues found that require attention');
    } else if (hasWarnings) {
      printWarning('Environment ready with minor recommendations');
    } else {
      printSuccess('Environment fully configured and ready!');
    }

    // Verbose output
    if (options.verbose) {
      console.log('\n' + chalk.bold.underline('🔍 Detailed Information'));
      console.log(JSON.stringify(detection, null, 2));
    }

    // Action suggestions
    if (hasErrors || hasWarnings) {
      console.log('\n' + chalk.cyan('📖 Suggested actions:'));
      
      if (!detection.claudeCode.installed) {
        console.log('  1. Install Claude Code: https://claude.ai/code');
      }
      
      if (!detection.project.hasClaudeConfig) {
        console.log('  2. Run', chalk.yellow('claude-tdd init'), 'to set up TDD workflow');
      }
      
      if (!detection.git.initialized) {
        console.log('  3. Initialize Git with', chalk.yellow('git init'));
      }
      
      if (detection.conflicts.length > 0) {
        console.log('  4. Review conflicts and run', chalk.yellow('claude-tdd init --force'), 'if needed');
      }
    }

  } catch (error) {
    printError(`Diagnosis failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}