import fs from 'fs-extra';
import path from 'path';

/**
 * Template manager for TDD workflow components
 */
export class TemplateManager {
  private templateDir: string;

  constructor() {
    // Point to bundled templates directory
    this.templateDir = path.join(__dirname, '../templates');
  }

  /**
   * Setup workflow templates based on configuration
   */
  async setup(config: any, targetDir: string): Promise<void> {
    const claudeDir = path.join(targetDir, '.claude');
    
    // Copy agents
    await this.copyAgents(config, claudeDir);
    
    // Copy commands
    await this.copyCommands(config, claudeDir);
    
    // Copy hooks
    await this.copyHooks(config, claudeDir);
    
    // Copy framework-specific configurations
    await this.copyFrameworkConfigs(config, claudeDir);
    
    // Copy rules and schemas
    await this.copyRulesAndSchemas(claudeDir);
  }

  /**
   * Copy agent templates based on selected template type
   */
  private async copyAgents(config: any, claudeDir: string): Promise<void> {
    const agentsDir = path.join(claudeDir, 'agents');
    await fs.ensureDir(agentsDir);

    const agentNames = this.getAgentNamesForTemplate(config.template);
    
    for (const agentName of agentNames) {
      await this.copyAgentWithVariableReplacement(agentName, agentsDir, config);
    }
  }

  /**
   * Get agents to include based on template type
   */
  private getAgentNamesForTemplate(templateType: string): string[] {
    switch (templateType) {
      case 'minimal':
        return [
          'tdd-architect',
          'test-case-generator', 
          'product-manager'
        ];
      case 'full':
        return [
          'product-manager',
          'prd-analyzer-designer',
          'task-decomposer',
          'tdd-architect',
          'test-case-generator',
          'test-strategist',
          'parallel-worker',
          'security-auditor',
          'performance-analyzer',
          'code-reviewer'
        ];
      default:
        return ['tdd-architect', 'test-case-generator'];
    }
  }

  /**
   * Copy individual agent template with variable replacement
   */
  private async copyAgentWithVariableReplacement(agentName: string, agentsDir: string, config: any): Promise<void> {
    const templatePath = path.join(this.templateDir, 'agents', `${agentName}.md`);
    const targetPath = path.join(agentsDir, `${agentName}.md`);
    
    try {
      // Read the original template file
      let content = await fs.readFile(templatePath, 'utf8');
      
      // Perform variable replacement
      content = this.replaceTemplateVariables(content, config);
      
      // Write to target location
      await fs.writeFile(targetPath, content);
    } catch (error) {
      // If template file doesn't exist, generate a basic one
      console.warn(`Template file not found for agent: ${agentName}, generating basic template`);
      const basicContent = this.generateBasicAgentTemplate(agentName, config);
      await fs.writeFile(targetPath, basicContent);
    }
  }

  /**
   * Replace variables in template content
   */
  private replaceTemplateVariables(content: string, config: any): string {
    // Define variable mappings
    const variables: Record<string, string> = {
      '${framework}': config.framework || 'nodejs',
      '${testFramework}': config.testFramework || 'jest',
      '${buildTool}': config.buildTool || 'npm',
      '${testPatterns}': config.testPatterns?.join(', ') || '**/*.test.*',
      '${sourcePatterns}': config.sourcePatterns?.join(', ') || 'src/**/*',
      '${strictMode}': config.strictMode ? 'STRICT' : 'FLEXIBLE',
      '${githubIntegration}': config.githubIntegration ? 'enabled' : 'disabled',
      '${testCommand}': this.getTestCommand(config),
      '${buildCommand}': this.getBuildCommand(config)
    };

    // Replace all variables
    let result = content;
    for (const [placeholder, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    }

    return result;
  }

  /**
   * Generate basic agent template if original doesn't exist
   */
  private generateBasicAgentTemplate(agentName: string, config: any): string {
    const displayName = agentName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return `# ${displayName} Agent

You are a ${displayName} specializing in ${config.framework} development.

## Framework Configuration
- **Language:** ${config.framework}
- **Test Framework:** ${config.testFramework}
- **Build Tool:** ${config.buildTool}

## Core Responsibilities

Provide specialized assistance for ${displayName.toLowerCase()} tasks in ${config.framework} projects.

## Best Practices

- Follow ${config.framework} conventions
- Use ${config.testFramework} for testing
- Maintain high code quality standards
`;
  }

  /**
   * Copy command templates
   */
  private async copyCommands(config: any, claudeDir: string): Promise<void> {
    const commandsDir = path.join(claudeDir, 'commands');
    const templateCommandsDir = path.join(this.templateDir, 'commands');
    
    // Check if template commands directory exists
    if (await fs.pathExists(templateCommandsDir)) {
      // Copy all command files with variable replacement
      await this.copyDirectoryWithVariableReplacement(templateCommandsDir, commandsDir, config);
    } else {
      // Generate basic commands if templates don't exist
      await this.generateBasicCommands(config, commandsDir);
    }
  }

  /**
   * Copy directory with variable replacement
   */
  private async copyDirectoryWithVariableReplacement(sourceDir: string, targetDir: string, config: any): Promise<void> {
    await fs.ensureDir(targetDir);
    
    const items = await fs.readdir(sourceDir);
    
    for (const item of items) {
      const sourcePath = path.join(sourceDir, item);
      const targetPath = path.join(targetDir, item);
      
      const stat = await fs.stat(sourcePath);
      
      if (stat.isDirectory()) {
        // Recursively copy subdirectories
        await this.copyDirectoryWithVariableReplacement(sourcePath, targetPath, config);
      } else if (item.endsWith('.md')) {
        // Copy and replace variables in markdown files
        let content = await fs.readFile(sourcePath, 'utf8');
        content = this.replaceTemplateVariables(content, config);
        await fs.writeFile(targetPath, content);
      } else {
        // Copy other files as-is
        await fs.copy(sourcePath, targetPath);
      }
    }
  }

  /**
   * Generate basic commands if templates don't exist
   */
  private async generateBasicCommands(config: any, commandsDir: string): Promise<void> {
    await fs.ensureDir(path.join(commandsDir, 'tdd'));
    await fs.ensureDir(path.join(commandsDir, 'pm'));

    // Basic TDD commands
    const tddCommands = ['init', 'red', 'green', 'refactor', 'status'];
    for (const cmd of tddCommands) {
      const content = `# TDD ${cmd.toUpperCase()} Command

Execute the ${cmd.toUpperCase()} phase of Test-Driven Development for ${config.framework} projects.

**Framework:** ${config.framework}
**Test Framework:** ${config.testFramework}
**Build Tool:** ${config.buildTool}

## Usage

This command is part of the TDD cycle for ${config.framework} development.
`;
      await fs.writeFile(path.join(commandsDir, 'tdd', `${cmd}.md`), content);
    }

    // PM commands (if full template)
    if (config.template === 'full') {
      const pmCommands = ['prd-new', 'prd-parse', 'task-decompose', 'next', 'workflow-status'];
      for (const cmd of pmCommands) {
        const content = `# ${cmd.toUpperCase().replace('-', ' ')} Command

Project management command for ${config.framework} projects.

**GitHub Integration:** ${config.githubIntegration ? 'Enabled' : 'Disabled'}

## Purpose

This command supports project management workflows for ${config.framework} development.
`;
        await fs.writeFile(path.join(commandsDir, 'pm', `${cmd}.md`), content);
      }
    }

    // Commit command
    const commitContent = `# Smart Commit Command

Intelligent commit with TDD-aware validation for ${config.framework} projects.

**Test Command:** ${this.getTestCommand(config)}
**Build Command:** ${this.getBuildCommand(config)}

## Process

1. Validate current TDD phase allows commits
2. Run tests: ${this.getTestCommand(config)}
3. Generate descriptive commit message
4. Perform commit with TDD metadata
`;
    await fs.writeFile(path.join(commandsDir, 'commit.md'), commitContent);
  }

  /**
   * Copy hook scripts
   */
  private async copyHooks(config: any, claudeDir: string): Promise<void> {
    const hooksDir = path.join(claudeDir, 'hooks');
    const templateHooksDir = path.join(this.templateDir, 'hooks');
    
    if (await fs.pathExists(templateHooksDir)) {
      // Copy existing hook templates with variable replacement
      await this.copyDirectoryWithVariableReplacement(templateHooksDir, hooksDir, config);
      
      // Make all shell scripts executable
      const hookFiles = await fs.readdir(hooksDir);
      for (const file of hookFiles) {
        if (file.endsWith('.sh')) {
          await fs.chmod(path.join(hooksDir, file), '755');
        }
      }
    } else {
      // Generate basic hooks
      await this.generateBasicHooks(config, hooksDir);
    }
  }

  /**
   * Generate basic hooks if templates don't exist
   */
  private async generateBasicHooks(config: any, hooksDir: string): Promise<void> {
    await fs.ensureDir(hooksDir);

    const hooks = {
      'tdd-guard.sh': `#!/bin/bash
# TDD Phase Guard - Enforce phase-based file editing restrictions for ${config.framework}

set -e

echo "🛡️ TDD Guard: Validating file operations for ${config.framework} project..."

# Get current TDD phase
PHASE_FILE="\${CLAUDE_PROJECT_DIR}/.claude/tdd-state.json"
CURRENT_PHASE="READY"

if [[ -f "\$PHASE_FILE" ]]; then
    CURRENT_PHASE=\$(jq -r '.currentPhase' "\$PHASE_FILE" 2>/dev/null || echo "READY")
fi

echo "Current phase: \$CURRENT_PHASE"

# Phase-based restrictions for ${config.framework} projects
case \$CURRENT_PHASE in
    "RED")
        echo "RED phase: Only test file edits allowed"
        ;;
    "GREEN")
        echo "GREEN phase: Only source file edits allowed"
        ;;
    "REFACTOR")
        echo "REFACTOR phase: Source and test file edits allowed"
        ;;
    *)
        echo "READY phase: All file operations allowed"
        ;;
esac

exit 0`,

      'test-runner.sh': `#!/bin/bash
# Auto Test Runner - Run tests after code changes for ${config.framework}

set -e

echo "🧪 Running tests for ${config.framework} project..."

# Framework-specific test command
${this.getTestCommand(config)}

echo "✅ Tests completed for ${config.framework}"`,

      'commit-validator.sh': `#!/bin/bash
# Commit Validator - Ensure commits comply with TDD rules for ${config.framework}

set -e

echo "🔍 Validating commit for ${config.framework} project..."

# Run tests before allowing commit
${this.getTestCommand(config)}

echo "✅ Commit validation passed for ${config.framework}"`
    };

    for (const [filename, content] of Object.entries(hooks)) {
      const hookPath = path.join(hooksDir, filename);
      await fs.writeFile(hookPath, content);
      await fs.chmod(hookPath, '755'); // Make executable
    }
  }

  /**
   * Copy framework-specific configurations
   */
  private async copyFrameworkConfigs(config: any, claudeDir: string): Promise<void> {
    const frameworkConfigsDir = path.join(claudeDir, 'framework-configs');
    const templateFrameworksDir = path.join(this.templateDir, 'frameworks');
    
    await fs.ensureDir(frameworkConfigsDir);
    
    if (await fs.pathExists(templateFrameworksDir)) {
      // Copy specific framework config if it exists
      const frameworkConfigFile = `${config.framework}.json`;
      const templatePath = path.join(templateFrameworksDir, frameworkConfigFile);
      const targetPath = path.join(frameworkConfigsDir, frameworkConfigFile);
      
      if (await fs.pathExists(templatePath)) {
        let content = await fs.readFile(templatePath, 'utf8');
        content = this.replaceTemplateVariables(content, config);
        await fs.writeFile(targetPath, content);
      } else {
        // Generate basic framework config
        await this.generateBasicFrameworkConfig(config, frameworkConfigsDir);
      }
    } else {
      await this.generateBasicFrameworkConfig(config, frameworkConfigsDir);
    }
  }

  /**
   * Generate basic framework configuration
   */
  private async generateBasicFrameworkConfig(config: any, frameworkConfigsDir: string): Promise<void> {
    const frameworkConfig = {
      framework: config.framework,
      testFramework: config.testFramework,
      buildTool: config.buildTool,
      testPatterns: config.testPatterns,
      sourcePatterns: config.sourcePatterns,
      testCommands: {
        run: this.getTestCommand(config),
        watch: this.getTestWatchCommand(config),
        coverage: this.getTestCoverageCommand(config)
      },
      buildCommands: {
        build: this.getBuildCommand(config),
        clean: this.getCleanCommand(config),
        lint: this.getLintCommand(config)
      }
    };

    const configPath = path.join(frameworkConfigsDir, `${config.framework}.json`);
    await fs.writeJson(configPath, frameworkConfig, { spaces: 2 });
  }

  /**
   * Copy rules and schemas
   */
  private async copyRulesAndSchemas(claudeDir: string): Promise<void> {
    // Copy rules
    const rulesDir = path.join(claudeDir, 'rules');
    const templateRulesDir = path.join(this.templateDir, 'rules');
    
    if (await fs.pathExists(templateRulesDir)) {
      await fs.copy(templateRulesDir, rulesDir);
    } else {
      await fs.ensureDir(rulesDir);
      // Create basic rule files
      const rules = {
        'tdd-phases.md': '# TDD Phase Rules\n\nDefines the rules and restrictions for each TDD phase.',
        'commit-standards.md': '# Commit Standards\n\nGuidelines for TDD-compliant commit messages.'
      };
      
      for (const [filename, content] of Object.entries(rules)) {
        await fs.writeFile(path.join(rulesDir, filename), content);
      }
    }

    // Copy schemas
    const schemasDir = path.join(claudeDir, 'schemas');
    const templateSchemasDir = path.join(this.templateDir, 'schemas');
    
    if (await fs.pathExists(templateSchemasDir)) {
      await fs.copy(templateSchemasDir, schemasDir);
    } else {
      await fs.ensureDir(schemasDir);
      // Create basic schema files
      const schemas = {
        'tdd-state.schema.json': {
          type: 'object',
          properties: {
            currentPhase: { type: 'string', enum: ['READY', 'RED', 'GREEN', 'REFACTOR'] },
            strictMode: { type: 'boolean' },
            history: { type: 'array' }
          },
          required: ['currentPhase']
        }
      };
      
      for (const [filename, schema] of Object.entries(schemas)) {
        await fs.writeJson(path.join(schemasDir, filename), schema, { spaces: 2 });
      }
    }
  }

  // Helper methods for generating framework-specific commands
  private getTestCommand(config: any): string {
    switch (config.framework) {
      case 'nodejs': return config.buildTool === 'yarn' ? 'yarn test' : 'npm test';
      case 'java': return config.buildTool === 'maven' ? 'mvn test' : 'gradle test';
      case 'python': return 'pytest';
      case 'go': return 'go test ./...';
      case 'rust': return 'cargo test';
      default: return 'echo "Tests for ' + config.framework + '"';
    }
  }

  private getTestWatchCommand(config: any): string {
    switch (config.framework) {
      case 'nodejs': return config.buildTool === 'yarn' ? 'yarn test --watch' : 'npm test -- --watch';
      case 'python': return 'pytest --watch';
      default: return this.getTestCommand(config);
    }
  }

  private getTestCoverageCommand(config: any): string {
    switch (config.framework) {
      case 'nodejs': return config.buildTool === 'yarn' ? 'yarn test --coverage' : 'npm test -- --coverage';
      case 'python': return 'pytest --cov';
      case 'java': return config.buildTool === 'maven' ? 'mvn test jacoco:report' : 'gradle test jacocoTestReport';
      default: return this.getTestCommand(config);
    }
  }

  private getBuildCommand(config: any): string {
    switch (config.framework) {
      case 'nodejs': return config.buildTool === 'yarn' ? 'yarn build' : 'npm run build';
      case 'java': return config.buildTool === 'maven' ? 'mvn compile' : 'gradle build';
      case 'python': return 'python setup.py build';
      case 'go': return 'go build';
      case 'rust': return 'cargo build';
      default: return 'echo "Build for ' + config.framework + '"';
    }
  }

  private getCleanCommand(config: any): string {
    switch (config.framework) {
      case 'java': return config.buildTool === 'maven' ? 'mvn clean' : 'gradle clean';
      case 'rust': return 'cargo clean';
      default: return 'echo "Clean for ' + config.framework + '"';
    }
  }

  private getLintCommand(config: any): string {
    switch (config.framework) {
      case 'nodejs': return config.buildTool === 'yarn' ? 'yarn lint' : 'npm run lint';
      case 'python': return 'flake8 . && black --check .';
      default: return 'echo "Lint for ' + config.framework + '"';
    }
  }
}