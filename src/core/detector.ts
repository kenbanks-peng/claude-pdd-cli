import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import which from 'which';
import { DetectionResult, FrameworkType, TestFramework, BuildTool, ConflictType, Recommendation } from './types.js';

/**
 * Environment and project detector
 */
export class EnvironmentDetector {
  private cwd: string;

  constructor(cwd: string = process.cwd()) {
    this.cwd = cwd;
  }

  /**
   * Run complete environment detection
   */
  async detect(): Promise<DetectionResult> {
    const [claudeCode, project, git] = await Promise.all([
      this.detectClaudeCode(),
      this.detectProject(), 
      this.detectGit()
    ]);

    const conflicts = this.detectConflicts({ claudeCode, project, git });
    const recommendations = this.generateRecommendations({ claudeCode, project, git }, conflicts);

    return {
      claudeCode,
      project,
      git,
      conflicts,
      recommendations
    };
  }

  /**
   * Detect Claude Code environment
   */
  private async detectClaudeCode() {
    const result = {
      installed: false,
      version: undefined as string | undefined,
      configPath: undefined as string | undefined,
      globalConfigExists: false
    };

    try {
      // Check if claude command exists
      const claudePath = await which('claude').catch(() => null);
      if (claudePath) {
        result.installed = true;
        
        // Try to get version
        try {
          const version = execSync('claude --version', { encoding: 'utf8', timeout: 5000 }).trim();
          result.version = version.replace(/^claude\s+/, '');
        } catch {
          // Version detection failed, but claude exists
        }
      }

      // Check global config
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      if (homeDir) {
        const globalConfigPath = path.join(homeDir, '.claude');
        result.configPath = globalConfigPath;
        result.globalConfigExists = await fs.pathExists(globalConfigPath);
      }
    } catch (error) {
      // Claude Code not found
    }

    return result;
  }

  /**
   * Detect project configuration and framework
   */
  private async detectProject() {
    const result = {
      hasClaudeConfig: false,
      framework: 'unknown' as FrameworkType,
      testFramework: undefined as TestFramework | undefined,
      buildTool: undefined as BuildTool | undefined,
      packageManager: undefined as BuildTool | undefined,
      testDirectories: [] as string[],
      sourceDirectories: [] as string[],
      configFiles: [] as string[]
    };

    // Check for existing .claude directory
    const claudeConfigPath = path.join(this.cwd, '.claude');
    result.hasClaudeConfig = await fs.pathExists(claudeConfigPath);

    // Detect framework and build tools
    const detectionResults = await Promise.all([
      this.detectNodejs(),
      this.detectJava(),
      this.detectPython(),
      this.detectGo(),
      this.detectRust()
    ]);

    // Find first detected framework
    const detectedFramework = detectionResults.find(r => r.framework !== 'unknown');
    if (detectedFramework) {
      Object.assign(result, detectedFramework);
    }

    // Detect common test and source directories
    result.testDirectories = await this.findTestDirectories();
    result.sourceDirectories = await this.findSourceDirectories();
    result.configFiles = await this.findConfigFiles();

    return result;
  }

  /**
   * Detect Git configuration
   */
  private async detectGit() {
    const result = {
      initialized: false,
      hasRemote: false,
      defaultBranch: undefined as string | undefined,
      hasGitHooks: false
    };

    const gitDir = path.join(this.cwd, '.git');
    result.initialized = await fs.pathExists(gitDir);

    if (result.initialized) {
      try {
        // Check for remote
        const remotes = execSync('git remote', { cwd: this.cwd, encoding: 'utf8' }).trim();
        result.hasRemote = remotes.length > 0;

        // Get default branch
        try {
          result.defaultBranch = execSync('git branch --show-current', { 
            cwd: this.cwd, 
            encoding: 'utf8' 
          }).trim();
        } catch {
          result.defaultBranch = 'main';
        }

        // Check for Git hooks
        const hooksDir = path.join(gitDir, 'hooks');
        if (await fs.pathExists(hooksDir)) {
          const hooks = await fs.readdir(hooksDir);
          result.hasGitHooks = hooks.some(file => !file.endsWith('.sample'));
        }
      } catch (error) {
        // Git commands failed
      }
    }

    return result;
  }

  /**
   * Detect Node.js project
   */
  private async detectNodejs() {
    const result = { framework: 'unknown' as FrameworkType, testFramework: undefined as TestFramework | undefined, buildTool: undefined as BuildTool | undefined };

    const packageJsonPath = path.join(this.cwd, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      result.framework = 'nodejs';
      
      try {
        const packageJson = await fs.readJson(packageJsonPath);
        
        // Detect test framework
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        if (deps.jest) result.testFramework = 'jest';
        else if (deps.mocha) result.testFramework = 'mocha';

        // Detect package manager
        if (await fs.pathExists(path.join(this.cwd, 'yarn.lock'))) {
          result.buildTool = 'yarn';
        } else if (await fs.pathExists(path.join(this.cwd, 'pnpm-lock.yaml'))) {
          result.buildTool = 'pnpm';
        } else {
          result.buildTool = 'npm';
        }
      } catch {
        // Failed to read package.json
      }
    }

    return result;
  }

  /**
   * Detect Java project
   */
  private async detectJava() {
    const result = { framework: 'unknown' as FrameworkType, testFramework: undefined as TestFramework | undefined, buildTool: undefined as BuildTool | undefined };

    const pomXmlPath = path.join(this.cwd, 'pom.xml');
    const buildGradlePath = path.join(this.cwd, 'build.gradle');
    const buildGradleKtsPath = path.join(this.cwd, 'build.gradle.kts');

    if (await fs.pathExists(pomXmlPath)) {
      result.framework = 'java';
      result.buildTool = 'maven';
      result.testFramework = 'junit'; // Default assumption
    } else if (await fs.pathExists(buildGradlePath) || await fs.pathExists(buildGradleKtsPath)) {
      result.framework = 'java';
      result.buildTool = 'gradle';
      result.testFramework = 'junit'; // Default assumption
    }

    return result;
  }

  /**
   * Detect Python project
   */
  private async detectPython() {
    const result = { framework: 'unknown' as FrameworkType, testFramework: undefined as TestFramework | undefined, buildTool: undefined as BuildTool | undefined };

    const setupPyPath = path.join(this.cwd, 'setup.py');
    const pyprojectTomlPath = path.join(this.cwd, 'pyproject.toml');
    const requirementsPath = path.join(this.cwd, 'requirements.txt');

    if (await fs.pathExists(pyprojectTomlPath)) {
      result.framework = 'python';
      result.buildTool = 'poetry';
      result.testFramework = 'pytest'; // Common with poetry
    } else if (await fs.pathExists(setupPyPath) || await fs.pathExists(requirementsPath)) {
      result.framework = 'python';
      result.buildTool = 'pip';
      result.testFramework = 'pytest'; // Most common
    }

    return result;
  }

  /**
   * Detect Go project
   */
  private async detectGo() {
    const result = { framework: 'unknown' as FrameworkType, testFramework: undefined as TestFramework | undefined, buildTool: undefined as BuildTool | undefined };

    const goModPath = path.join(this.cwd, 'go.mod');
    if (await fs.pathExists(goModPath)) {
      result.framework = 'go';
      result.buildTool = 'go-mod';
      result.testFramework = 'go-test';
    }

    return result;
  }

  /**
   * Detect Rust project
   */
  private async detectRust() {
    const result = { framework: 'unknown' as FrameworkType, testFramework: undefined as TestFramework | undefined, buildTool: undefined as BuildTool | undefined };

    const cargoTomlPath = path.join(this.cwd, 'Cargo.toml');
    if (await fs.pathExists(cargoTomlPath)) {
      result.framework = 'rust';
      result.buildTool = 'cargo';
      result.testFramework = 'cargo-test';
    }

    return result;
  }

  /**
   * Find test directories
   */
  private async findTestDirectories(): Promise<string[]> {
    const commonTestDirs = [
      'tests', 'test', '__tests__', 'spec',
      'src/test/java', 'src/test/kotlin',
      'src/test', 'test/unit', 'test/integration'
    ];

    const found = [];
    for (const dir of commonTestDirs) {
      if (await fs.pathExists(path.join(this.cwd, dir))) {
        found.push(dir);
      }
    }

    return found;
  }

  /**
   * Find source directories
   */
  private async findSourceDirectories(): Promise<string[]> {
    const commonSourceDirs = [
      'src', 'lib', 'app', 'source',
      'src/main/java', 'src/main/kotlin',
      'src/main', 'main'
    ];

    const found = [];
    for (const dir of commonSourceDirs) {
      if (await fs.pathExists(path.join(this.cwd, dir))) {
        found.push(dir);
      }
    }

    return found;
  }

  /**
   * Find configuration files
   */
  private async findConfigFiles(): Promise<string[]> {
    const configFiles = [
      'package.json', 'tsconfig.json', 'jest.config.js',
      'pom.xml', 'build.gradle', 'settings.gradle',
      'setup.py', 'pyproject.toml', 'requirements.txt',
      'go.mod', 'go.sum',
      'Cargo.toml', 'Cargo.lock'
    ];

    const found = [];
    for (const file of configFiles) {
      if (await fs.pathExists(path.join(this.cwd, file))) {
        found.push(file);
      }
    }

    return found;
  }

  /**
   * Detect configuration conflicts
   */
  private detectConflicts(detection: Omit<DetectionResult, 'conflicts' | 'recommendations'>): ConflictType[] {
    const conflicts: ConflictType[] = [];

    // Check if project local .claude config already exists
    if (detection.project.hasClaudeConfig) {
      conflicts.push('claude-config-exists');
    }

    // Check for existing Git hooks
    if (detection.git.hasGitHooks) {
      conflicts.push('git-hooks-exist');
    }

    return conflicts;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    detection: Omit<DetectionResult, 'conflicts' | 'recommendations'>,
    conflicts: ConflictType[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Claude Code not installed
    if (!detection.claudeCode.installed) {
      recommendations.push({
        type: 'framework',
        title: 'Install Claude Code',
        description: 'Claude Code is required for TDD workflow functionality',
        priority: 'high',
        actionRequired: true
      });
    }

    // No Git repository
    if (!detection.git.initialized) {
      recommendations.push({
        type: 'framework',
        title: 'Initialize Git Repository',
        description: 'Git is recommended for version control and TDD workflow integration',
        priority: 'medium',
        actionRequired: false
      });
    }

    // Framework-specific recommendations
    if (detection.project.framework !== 'unknown') {
      recommendations.push({
        type: 'optimization',
        title: `Optimize for ${detection.project.framework.charAt(0).toUpperCase() + detection.project.framework.slice(1)}`,
        description: `Use ${detection.project.framework}-specific TDD configuration template`,
        priority: 'medium',
        actionRequired: false
      });
    }

    return recommendations;
  }
}