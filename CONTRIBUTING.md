# 🤝 Contributing Guide

Thank you for your interest in the Claude PDD CLI project! We welcome contributions of all kinds.

## 🌟 How to Contribute

### Reporting Issues

If you've found a bug or have a feature suggestion:

1. **Search Existing Issues**: Make sure the issue hasn't been reported already
2. **Use Issue Templates**: Provide as much detail as possible
3. **Include Environment Information**:
   - Node.js version
   - Operating system
   - claude-pdd-cli version
   - Error stack trace

### Submitting Code

#### Development Environment Setup

```bash
# 1. Fork the project and clone
git clone https://github.com/your-username/claude-pdd-cli.git
cd claude-pdd-cli

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 5. Link locally (for testing)
npm link
```

#### Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Follow Commit Conventions**
   ```bash
   # Format: <type>(<scope>): <subject>
   git commit -m "feat(init): add Rust framework support"
   git commit -m "fix(doctor): fix environment detection issue"
   git commit -m "docs: update API documentation"
   ```

3. **Ensure Code Quality**
   ```bash
   # Code checking and formatting
   npm run lint

   # Build verification
   npm run build
   ```

4. **Submit Pull Request**
   - Create PR based on `develop` branch
   - Use clear PR title and description
   - Link related Issues
   - Ensure CI checks pass

## 📋 Code Standards

### TypeScript Standards

- Use TypeScript strict mode
- Provide complete type annotations for public APIs
- Use interfaces to define data structures
- Prefer `const` assertions

```typescript
// ✅ Good practice
interface FrameworkConfig {
  name: string;
  testCommand: string;
  buildCommand?: string;
}

const frameworks: readonly FrameworkConfig[] = [
  { name: 'nodejs', testCommand: 'npm test' },
  { name: 'python', testCommand: 'pytest' }
] as const;

// ❌ Avoid this
const frameworks = [
  { name: 'nodejs', testCommand: 'npm test' },
  { name: 'python', testCommand: 'pytest' }
];
```

### Naming Conventions

- **File names**: kebab-case (`framework-detector.ts`)
- **Class names**: PascalCase (`FrameworkDetector`)
- **Function names**: camelCase (`detectFramework`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_CONFIG`)

### Error Handling

- Use specific error types
- Provide meaningful error messages
- Include error recovery suggestions

```typescript
// ✅ Good error handling
class FrameworkNotFoundError extends Error {
  constructor(projectPath: string) {
    super(
      `Unable to detect supported framework in path: ${projectPath}\n` +
      `Suggestion: Ensure the project contains package.json, pom.xml, or other framework configuration files`
    );
    this.name = 'FrameworkNotFoundError';
  }
}
```

### Testing Standards

- Write tests for every public function
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

```typescript
describe('FrameworkDetector', () => {
  describe('detectFramework', () => {
    it('should detect Node.js project when package.json exists', () => {
      // Arrange
      const detector = new FrameworkDetector();

      // Act
      const result = detector.detectFramework('/path/to/nodejs/project');

      // Assert
      expect(result.name).toBe('nodejs');
    });
  });
});
```

## 🔄 Branching Strategy

We use Git Flow workflow:

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New feature development
- `hotfix/*`: Emergency fixes
- `release/*`: Release preparation

For detailed branch management strategy, please refer to [Wiki - Branch Management](https://github.com/MuziGeek/claude-pdd-cli/wiki/Branch-Management).

## 📝 Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting
- `refactor`: Refactoring
- `test`: Test-related
- `chore`: Build tools or auxiliary tool changes

### Scopes

- `init`: Project initialization
- `doctor`: Environment diagnostics
- `config`: Configuration management
- `template`: Template system
- `ui`: User interface
- `cli`: Command line interface

### Examples

```bash
feat(init): add Go framework support
fix(doctor): fix Windows path detection issue
docs(readme): update installation instructions
refactor(template): refactor template loading mechanism
test(detector): add framework detection unit tests
```

## ✅ Pull Request Checklist

Before submitting a PR, please confirm:

### Code Quality
- [ ] Code checks pass (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Feature implementation is complete

### Feature Completeness
- [ ] New feature documentation is complete
- [ ] Updated relevant documentation
- [ ] Command line help information is correct
- [ ] Error handling is appropriate

### Compatibility
- [ ] Cross-platform compatible (Windows, macOS, Linux)
- [ ] Node.js multi-version compatible (18.x, 20.x, 22.x)
- [ ] Backward compatible with existing APIs

### Documentation
- [ ] README updated (if necessary)
- [ ] API documentation updated
- [ ] CHANGELOG entry added
- [ ] Example code is valid

## 🎯 Development Focus

### Current Priorities

1. **Framework Support Expansion**
   - Add new programming language support
   - Improve framework detection accuracy

2. **User Experience Improvements**
   - Better error messages
   - Interactive configuration wizard
   - Progress indicators

3. **Performance Optimization**
   - Reduce startup time
   - Caching mechanisms
   - Parallel processing

4. **Test Coverage**
   - Add boundary condition tests
   - Integration tests
   - Performance tests

### Technical Debt

- Refactor outdated modules
- Improve error handling
- Unify configuration format
- Optimize dependency management

## 🛡️ Security Considerations

- **Don't commit sensitive information**: API keys, passwords, tokens
- **Validate user input**: Prevent path traversal, injection attacks
- **Secure file operations**: Use secure file path handling
- **Dependency security**: Regularly check for dependency vulnerabilities

## 📚 Learning Resources

### Project-Related
- [Claude Code Documentation](https://claude.ai/code)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [CLI Design Guidelines](https://clig.dev/)

### Technology Stack
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Node.js API Documentation](https://nodejs.org/api/)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

## 💬 Getting Help

- **GitHub Issues**: Report issues or feature requests
- **GitHub Discussions**: Discuss ideas and get help
- **Wiki**: View detailed documentation
- **Email**: For urgent issues, email mz@easymuzi.cn

## 🎉 Contributors

Thanks to all the people who have contributed to the project!

<!-- Contributor avatars will be displayed here automatically -->
<a href="https://github.com/MuziGeek/claude-pdd-cli/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MuziGeek/claude-pdd-cli" />
</a>

## 📄 Code of Conduct

We are committed to creating an open and friendly community environment. By participating in this project, you agree to abide by our code of conduct:

### Our Pledge

- **Inclusiveness**: Welcome people from different backgrounds and perspectives
- **Respect**: Respect different opinions and experiences
- **Collaboration**: Resolve disagreements constructively
- **Learning**: Learn from each other and grow together

### Unacceptable Behavior

The following behaviors are not acceptable:

- Using sexualized language or imagery
- Personal attacks or insults
- Harassment
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Project maintainers have the right to remove, edit, or reject comments, commits, code, issues, etc. that violate the code of conduct.

---

Thank you again for your contribution! Every contribution makes Claude PDD CLI better. 🚀
