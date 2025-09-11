import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export interface FrameworkDetection {
  framework: string;
  testFramework: string;
  packageManager: string;
  testPatterns: string[];
  buildCommands: {
    test: string;
    coverage?: string;
    build?: string;
  };
  configFiles: string[];
}

/**
 * Detect project framework and testing setup
 */
export class FrameworkDetector {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Auto-detect project framework and configuration
   */
  async detect(): Promise<FrameworkDetection> {
    const framework = await this.detectFramework();
    const testFramework = await this.detectTestFramework(framework);
    const packageManager = await this.detectPackageManager();
    
    return {
      framework,
      testFramework,
      packageManager,
      testPatterns: this.getTestPatterns(framework, testFramework),
      buildCommands: this.getBuildCommands(framework, testFramework, packageManager),
      configFiles: await this.getConfigFiles(framework)
    };
  }

  /**
   * Detect primary project framework
   */
  private async detectFramework(): Promise<string> {
    // Node.js project
    if (await this.fileExists('package.json')) {
      const packageJson = await fs.readJSON(path.join(this.projectRoot, 'package.json'));
      
      // Check for framework-specific dependencies
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps.react || deps['@types/react']) return 'react';
      if (deps.vue || deps['@vue/cli']) return 'vue';
      if (deps.angular || deps['@angular/core']) return 'angular';
      if (deps.next || deps['next']) return 'nextjs';
      if (deps.express || deps.fastify || deps.koa) return 'nodejs-backend';
      
      return 'nodejs';
    }

    // Java project
    if (await this.fileExists('pom.xml')) {
      return 'java-maven';
    }
    if (await this.fileExists('build.gradle') || await this.fileExists('build.gradle.kts')) {
      return 'java-gradle';
    }

    // Python project
    if (await this.fileExists('requirements.txt') || 
        await this.fileExists('pyproject.toml') || 
        await this.fileExists('setup.py')) {
      return 'python';
    }

    // Go project
    if (await this.fileExists('go.mod') || await this.fileExists('go.sum')) {
      return 'go';
    }

    // Rust project
    if (await this.fileExists('Cargo.toml')) {
      return 'rust';
    }

    // C# project
    if (await this.filesExist(['*.csproj', '*.sln'])) {
      return 'dotnet';
    }

    // PHP project
    if (await this.fileExists('composer.json')) {
      return 'php';
    }

    // Ruby project
    if (await this.fileExists('Gemfile')) {
      return 'ruby';
    }

    return 'unknown';
  }

  /**
   * Detect test framework based on project framework
   */
  private async detectTestFramework(framework: string): Promise<string> {
    switch (framework) {
      case 'nodejs':
      case 'react':
      case 'vue':
      case 'nextjs':
        return await this.detectNodeTestFramework();
      
      case 'java-maven':
      case 'java-gradle':
        return await this.detectJavaTestFramework();
      
      case 'python':
        return await this.detectPythonTestFramework();
      
      case 'go':
        return 'go-test';
      
      case 'rust':
        return 'cargo-test';
      
      case 'dotnet':
        return await this.detectDotnetTestFramework();
      
      default:
        return 'unknown';
    }
  }

  /**
   * Detect Node.js test framework
   */
  private async detectNodeTestFramework(): Promise<string> {
    if (await this.fileExists('package.json')) {
      const packageJson = await fs.readJSON(path.join(this.projectRoot, 'package.json'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps.jest || deps['@types/jest']) return 'jest';
      if (deps.vitest) return 'vitest';
      if (deps.mocha) return 'mocha';
      if (deps.jasmine) return 'jasmine';
      if (deps.ava) return 'ava';
      if (deps.tape) return 'tape';
    }

    // Check for config files
    const configFiles = [
      'jest.config.js', 'jest.config.ts', 'jest.config.json',
      'vitest.config.js', 'vitest.config.ts',
      'mocha.opts', '.mocharc.json',
      'jasmine.json'
    ];

    for (const file of configFiles) {
      if (await this.fileExists(file)) {
        if (file.includes('jest')) return 'jest';
        if (file.includes('vitest')) return 'vitest';
        if (file.includes('mocha')) return 'mocha';
        if (file.includes('jasmine')) return 'jasmine';
      }
    }

    return 'jest'; // Default for Node.js projects
  }

  /**
   * Detect Java test framework
   */
  private async detectJavaTestFramework(): Promise<string> {
    // Check Maven pom.xml
    if (await this.fileExists('pom.xml')) {
      const pomContent = await fs.readFile(path.join(this.projectRoot, 'pom.xml'), 'utf-8');
      if (pomContent.includes('junit-jupiter') || pomContent.includes('junit-platform')) {
        return 'junit5';
      }
      if (pomContent.includes('junit') && pomContent.includes('4.')) {
        return 'junit4';
      }
      if (pomContent.includes('testng')) {
        return 'testng';
      }
    }

    // Check Gradle build files
    const gradleFiles = ['build.gradle', 'build.gradle.kts'];
    for (const file of gradleFiles) {
      if (await this.fileExists(file)) {
        const content = await fs.readFile(path.join(this.projectRoot, file), 'utf-8');
        if (content.includes('junit-jupiter') || content.includes('junit-platform')) {
          return 'junit5';
        }
        if (content.includes('junit:junit:4')) {
          return 'junit4';
        }
        if (content.includes('testng')) {
          return 'testng';
        }
      }
    }

    return 'junit5'; // Default for Java projects
  }

  /**
   * Detect Python test framework
   */
  private async detectPythonTestFramework(): Promise<string> {
    // Check for pytest
    if (await this.fileExists('pytest.ini') || 
        await this.fileExists('pyproject.toml') ||
        await this.directoryExists('tests')) {
      return 'pytest';
    }

    // Check requirements files
    const reqFiles = ['requirements.txt', 'requirements-dev.txt', 'test-requirements.txt'];
    for (const file of reqFiles) {
      if (await this.fileExists(file)) {
        const content = await fs.readFile(path.join(this.projectRoot, file), 'utf-8');
        if (content.includes('pytest')) return 'pytest';
        if (content.includes('nose')) return 'nose2';
      }
    }

    return 'unittest'; // Python standard library default
  }

  /**
   * Detect .NET test framework
   */
  private async detectDotnetTestFramework(): Promise<string> {
    const csprojFiles = await glob('*.csproj', { cwd: this.projectRoot });
    
    for (const file of csprojFiles) {
      const content = await fs.readFile(path.join(this.projectRoot, file), 'utf-8');
      if (content.includes('xunit')) return 'xunit';
      if (content.includes('nunit')) return 'nunit';
      if (content.includes('MSTest')) return 'mstest';
    }

    return 'xunit'; // Default for .NET projects
  }

  /**
   * Detect package manager
   */
  private async detectPackageManager(): Promise<string> {
    if (await this.fileExists('pnpm-lock.yaml')) return 'pnpm';
    if (await this.fileExists('yarn.lock')) return 'yarn';
    if (await this.fileExists('package-lock.json')) return 'npm';
    if (await this.fileExists('bun.lockb')) return 'bun';
    
    // For other languages
    if (await this.fileExists('pom.xml')) return 'maven';
    if (await this.fileExists('build.gradle')) return 'gradle';
    if (await this.fileExists('requirements.txt')) return 'pip';
    if (await this.fileExists('Pipfile')) return 'pipenv';
    if (await this.fileExists('poetry.lock')) return 'poetry';
    if (await this.fileExists('go.mod')) return 'go';
    if (await this.fileExists('Cargo.toml')) return 'cargo';
    if (await this.fileExists('composer.json')) return 'composer';
    if (await this.fileExists('Gemfile')) return 'bundler';

    return 'unknown';
  }

  /**
   * Get test patterns for framework and test framework combination
   */
  private getTestPatterns(framework: string, testFramework: string): string[] {
    const patterns: { [key: string]: { [key: string]: string[] } } = {
      nodejs: {
        jest: ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'],
        vitest: ['**/*.test.js', '**/*.test.ts', '**/*.spec.js', '**/*.spec.ts'],
        mocha: ['test/**/*.js', 'test/**/*.ts', '**/*.test.js'],
        jasmine: ['spec/**/*.js', '**/*.spec.js'],
        default: ['**/*.test.js', '**/*.spec.js']
      },
      java: {
        junit5: ['src/test/java/**/*Test.java', 'src/test/java/**/*Tests.java'],
        junit4: ['src/test/java/**/*Test.java'],
        testng: ['src/test/java/**/*Test.java', 'src/test/java/**/*Tests.java'],
        default: ['src/test/java/**/*Test.java']
      },
      python: {
        pytest: ['test_*.py', '*_test.py', 'tests/**/*.py'],
        unittest: ['test_*.py', '*_test.py', 'tests/test_*.py'],
        nose2: ['test_*.py', '*_test.py'],
        default: ['test_*.py', '*_test.py']
      },
      go: {
        'go-test': ['*_test.go', '**/*_test.go'],
        default: ['*_test.go']
      },
      rust: {
        'cargo-test': ['src/**/*.rs', 'tests/**/*.rs'],
        default: ['tests/**/*.rs']
      }
    };

    const frameworkPatterns = patterns[framework] || patterns.nodejs;
    return frameworkPatterns?.[testFramework] || frameworkPatterns?.default || ['**/*.test.*'];
  }

  /**
   * Get build commands for framework combination
   */
  private getBuildCommands(framework: string, testFramework: string, packageManager: string): {
    test: string;
    coverage?: string;
    build?: string;
  } {
    const commands: { [key: string]: any } = {
      nodejs: {
        npm: {
          test: 'npm test',
          coverage: 'npm run test:coverage || npm run coverage',
          build: 'npm run build'
        },
        yarn: {
          test: 'yarn test',
          coverage: 'yarn test:coverage || yarn coverage',
          build: 'yarn build'
        },
        pnpm: {
          test: 'pnpm test',
          coverage: 'pnpm test:coverage || pnpm coverage',
          build: 'pnpm build'
        }
      },
      'java-maven': {
        maven: {
          test: 'mvn test',
          coverage: 'mvn test jacoco:report',
          build: 'mvn compile'
        }
      },
      'java-gradle': {
        gradle: {
          test: './gradlew test',
          coverage: './gradlew test jacocoTestReport',
          build: './gradlew build'
        }
      },
      python: {
        pip: {
          test: 'python -m pytest',
          coverage: 'python -m pytest --cov',
          build: 'python -m build'
        },
        poetry: {
          test: 'poetry run pytest',
          coverage: 'poetry run pytest --cov',
          build: 'poetry build'
        }
      },
      go: {
        go: {
          test: 'go test ./...',
          coverage: 'go test -cover ./...',
          build: 'go build'
        }
      },
      rust: {
        cargo: {
          test: 'cargo test',
          coverage: 'cargo tarpaulin',
          build: 'cargo build'
        }
      }
    };

    const frameworkCommands = commands[framework];
    if (!frameworkCommands) {
      return { test: 'echo "No test command configured"' };
    }

    const packageManagerCommands = frameworkCommands[packageManager] || Object.values(frameworkCommands)[0];
    return packageManagerCommands;
  }

  /**
   * Get configuration files for framework
   */
  private async getConfigFiles(framework: string): Promise<string[]> {
    const configFiles: { [key: string]: string[] } = {
      nodejs: [
        'package.json', 'tsconfig.json', 'jest.config.js', 'jest.config.ts',
        'vitest.config.js', 'vitest.config.ts', '.mocharc.json', 'babel.config.js'
      ],
      'java-maven': ['pom.xml', 'src/main/resources/application.properties'],
      'java-gradle': ['build.gradle', 'build.gradle.kts', 'gradle.properties'],
      python: ['requirements.txt', 'pyproject.toml', 'setup.py', 'pytest.ini', 'tox.ini'],
      go: ['go.mod', 'go.sum'],
      rust: ['Cargo.toml', 'Cargo.lock'],
      dotnet: ['*.csproj', '*.sln', 'appsettings.json']
    };

    const possibleFiles = configFiles[framework] || [];
    const existingFiles: string[] = [];

    for (const file of possibleFiles) {
      if (file.includes('*')) {
        const matches = await glob(file, { cwd: this.projectRoot });
        existingFiles.push(...matches);
      } else if (await this.fileExists(file)) {
        existingFiles.push(file);
      }
    }

    return existingFiles;
  }

  /**
   * Check if file exists
   */
  private async fileExists(filename: string): Promise<boolean> {
    try {
      const filePath = path.join(this.projectRoot, filename);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if multiple files exist (with glob patterns)
   */
  private async filesExist(patterns: string[]): Promise<boolean> {
    for (const pattern of patterns) {
      const matches = await glob(pattern, { cwd: this.projectRoot });
      if (matches.length > 0) return true;
    }
    return false;
  }

  /**
   * Check if directory exists
   */
  private async directoryExists(dirname: string): Promise<boolean> {
    try {
      const dirPath = path.join(this.projectRoot, dirname);
      const stat = await fs.stat(dirPath);
      return stat.isDirectory();
    } catch {
      return false;
    }
  }
}