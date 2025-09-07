/**
 * Supported project frameworks
 */
export type FrameworkType = 'nodejs' | 'java' | 'python' | 'go' | 'rust' | 'unknown';

/**
 * Test frameworks by language
 */
export type TestFramework = 'jest' | 'mocha' | 'junit' | 'testng' | 'pytest' | 'unittest' | 'go-test' | 'cargo-test' | 'unknown';

/**
 * Build tools
 */
export type BuildTool = 'npm' | 'yarn' | 'pnpm' | 'maven' | 'gradle' | 'pip' | 'poetry' | 'go-mod' | 'cargo' | 'unknown';

/**
 * TDD template types
 */
export type TemplateType = 'full' | 'minimal' | 'custom';

/**
 * Environment detection result
 */
export interface DetectionResult {
  claudeCode: {
    installed: boolean;
    version?: string;
    configPath?: string;
    globalConfigExists: boolean;
  };
  project: {
    hasClaudeConfig: boolean;
    framework: FrameworkType;
    testFramework?: TestFramework;
    buildTool?: BuildTool;
    packageManager?: BuildTool;
    testDirectories: string[];
    sourceDirectories: string[];
    configFiles: string[];
  };
  git: {
    initialized: boolean;
    hasRemote: boolean;
    defaultBranch?: string;
    hasGitHooks: boolean;
  };
  conflicts: ConflictType[];
  recommendations: Recommendation[];
}

/**
 * Configuration conflict types
 */
export type ConflictType = 
  | 'claude-config-exists'
  | 'git-hooks-exist'
  | 'test-config-conflict'
  | 'package-script-conflict'
  | 'incompatible-version';

/**
 * Conflict details
 */
export interface Conflict {
  type: ConflictType;
  description: string;
  severity: 'high' | 'medium' | 'low';
  resolution: string[];
}

/**
 * Recommendation types
 */
export interface Recommendation {
  type: 'framework' | 'template' | 'feature' | 'optimization';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
}

/**
 * CLI command options
 */
export interface InitOptions {
  framework?: FrameworkType;
  quick?: boolean;
  force?: boolean;
  template?: TemplateType;
}

export interface DoctorOptions {
  verbose?: boolean;
  checkProject?: boolean;
  checkClaude?: boolean;
}

export interface ConfigOptions {
  global?: boolean;
}

export interface StatusOptions {
  json?: boolean;
}

export interface UpdateOptions {
  check?: boolean;
  force?: boolean;
}

/**
 * TDD configuration structure
 */
export interface TDDConfig {
  project: {
    name: string;
    description: string;
    version: string;
    author: string;
  };
  tdd: {
    enabled: boolean;
    strictMode: boolean;
    phases: string[];
    defaultPhase: string;
    testPatterns: string[];
    sourcePatterns: string[];
    configPatterns: string[];
  };
  github?: {
    integration: boolean;
    autoSync: boolean;
    labelPrefix: string;
    milestonePrefix: string;
  };
  parallel?: {
    maxWorkers: number;
    isolationMode: string;
    coordinationFile: string;
  };
  hooks: {
    PreToolUse?: HookConfig[];
    PostToolUse?: HookConfig[];
  };
}

/**
 * Hook configuration
 */
export interface HookConfig {
  matcher: string;
  hooks: {
    type: string;
    command: string;
  }[];
}

/**
 * Framework template configuration
 */
export interface FrameworkTemplate {
  framework: FrameworkType;
  testFramework: TestFramework;
  buildTool: BuildTool;
  testPatterns: string[];
  sourcePatterns: string[];
  testCommands: {
    run: string;
    watch?: string;
    coverage?: string;
  };
  buildCommands: {
    build: string;
    clean?: string;
    lint?: string;
  };
  dependencies?: {
    test: string[];
    build: string[];
  };
}