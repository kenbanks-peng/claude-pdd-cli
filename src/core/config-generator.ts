import fs from 'fs-extra';
import path from 'path';
import { TDDConfig } from './types.js';

/**
 * Configuration generator for TDD workflow
 */
export class ConfigGenerator {
  /**
   * Generate TDD configuration files
   */
  async generate(config: any, targetDir: string): Promise<void> {
    const claudeDir = path.join(targetDir, '.claude');
    await fs.ensureDir(claudeDir);

    // Generate main settings.json
    await this.generateSettings(config, claudeDir);
    
    // Generate TDD state file
    await this.generateTddState(claudeDir);
    
    // Generate gitignore entries
    await this.updateGitignore(targetDir);
  }

  /**
   * Generate settings.json configuration
   */
  private async generateSettings(config: any, claudeDir: string): Promise<void> {
    const settings: TDDConfig = {
      project: {
        name: config.projectName || path.basename(process.cwd()),
        description: `Claude TDD Workflow project - ${config.framework}`,
        version: '1.0.0',
        author: 'Claude TDD Team'
      },
      tdd: {
        enabled: true,
        strictMode: config.strictMode !== false,
        phases: ['RED', 'GREEN', 'REFACTOR'],
        defaultPhase: 'READY',
        testPatterns: config.testPatterns || ['**/*.test.*', '**/*.spec.*'],
        sourcePatterns: config.sourcePatterns || ['src/**/*'],
        configPatterns: ['.claude/**/*', '*.config.*']
      },
      hooks: {
        PreToolUse: [
          {
            matcher: 'Write|Edit',
            hooks: [
              {
                type: 'command',
                command: '$CLAUDE_PROJECT_DIR/.claude/hooks/tdd-guard.sh'
              }
            ]
          }
        ],
        PostToolUse: [
          {
            matcher: 'Write|Edit',
            hooks: [
              {
                type: 'command',
                command: '$CLAUDE_PROJECT_DIR/.claude/hooks/test-runner.sh'
              }
            ]
          },
          {
            matcher: 'Bash.*commit',
            hooks: [
              {
                type: 'command',
                command: '$CLAUDE_PROJECT_DIR/.claude/hooks/commit-validator.sh'
              }
            ]
          }
        ]
      }
    };

    // Add GitHub integration if enabled
    if (config.githubIntegration) {
      settings.github = {
        integration: true,
        autoSync: true,
        labelPrefix: 'tdd:',
        milestonePrefix: 'TDD-'
      };
    }

    // Add parallel support if enabled
    if (config.parallelSupport) {
      settings.parallel = {
        maxWorkers: 3,
        isolationMode: 'worktree',
        coordinationFile: '.claude/parallel-state.json'
      };
    }

    const settingsPath = path.join(claudeDir, 'settings.json');
    await fs.writeJson(settingsPath, settings, { spaces: 2 });
  }

  /**
   * Generate initial TDD state file
   */
  private async generateTddState(claudeDir: string): Promise<void> {
    const initialState = {
      currentPhase: 'READY',
      strictMode: true,
      startTime: new Date().toISOString(),
      history: [
        {
          phase: 'READY',
          timestamp: new Date().toISOString(),
          action: 'initialized',
          user: 'claude-tdd-cli'
        }
      ],
      stats: {
        redPhases: 0,
        greenPhases: 0,
        refactorPhases: 0,
        totalCycles: 0
      }
    };

    const statePath = path.join(claudeDir, 'tdd-state.json');
    await fs.writeJson(statePath, initialState, { spaces: 2 });
  }

  /**
   * Update .gitignore with TDD-specific entries
   */
  private async updateGitignore(targetDir: string): Promise<void> {
    const gitignorePath = path.join(targetDir, '.gitignore');
    const tddEntries = [
      '',
      '# Claude TDD Workflow',
      '.claude/tdd-state.json',
      '.claude/parallel-state.json',
      '.tdd-temp/',
      ''
    ];

    try {
      let gitignoreContent = '';
      if (await fs.pathExists(gitignorePath)) {
        gitignoreContent = await fs.readFile(gitignorePath, 'utf8');
      }

      // Check if TDD entries already exist
      if (!gitignoreContent.includes('# Claude TDD Workflow')) {
        gitignoreContent += tddEntries.join('\n');
        await fs.writeFile(gitignorePath, gitignoreContent);
      }
    } catch (error) {
      // If .gitignore update fails, it's not critical
      console.warn('Warning: Could not update .gitignore file');
    }
  }
}