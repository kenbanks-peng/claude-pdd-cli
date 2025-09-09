# Claude TDD CLI

🚀 **Professional CLI tool for initializing and managing Claude TDD Workflow projects**

[![npm version](https://badge.fury.io/js/claude-tdd-cli.svg)](https://badge.fury.io/js/claude-tdd-cli)
[![CI/CD Pipeline](https://github.com/MuziGeek/claude-tdd-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/MuziGeek/claude-tdd-cli/actions/workflows/ci.yml)
[![CodeQL](https://github.com/MuziGeek/claude-tdd-cli/actions/workflows/codeql.yml/badge.svg)](https://github.com/MuziGeek/claude-tdd-cli/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/MuziGeek/claude-tdd-cli/branch/main/graph/badge.svg)](https://codecov.io/gh/MuziGeek/claude-tdd-cli)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 What is Claude TDD CLI?

Claude TDD CLI transforms the complex process of setting up a professional Test-Driven Development workflow into a single command. Instead of manually copying configuration files and setting up agents, hooks, and templates, you can now initialize a complete TDD environment with intelligent framework detection and interactive configuration.

## ✨ Key Features

- 🔍 **Smart Detection**: Automatically detects your project's language, framework, and testing setup
- 🎛️ **Interactive Setup**: Guided configuration wizard for customized workflow
- 🚀 **One-Command Init**: Complete TDD environment in seconds
- 🧠 **10 Specialized Agents**: Pre-configured AI assistants for every aspect of TDD
- 🛡️ **Quality Gates**: Automated testing, hooks, and validation
- 📦 **Multi-Framework**: Support for Node.js, Java, Python, Go, and Rust
- 🔄 **Template Management**: Keep your workflow up-to-date with latest best practices
- 🔀 **Framework Switching**: Seamlessly switch between frameworks while preserving configurations
- 🛠️ **Configuration Backup**: Automatic backup mechanism for safe configuration changes
- 🚀 **CI/CD Ready**: Pre-configured GitHub Actions for cross-platform testing and automated releases
- 📊 **Quality Assurance**: Built-in code coverage, security scanning, and multi-platform testing

## 🚀 Quick Start

### 安装

```bash
npm install -g claude-tdd-cli
```

### Initialize TDD Workflow

```bash
# Navigate to your project
cd my-project

# Initialize with intelligent detection and interactive setup
claude-tdd init

# Or use quick mode with defaults
claude-tdd init --quick

# Force initialization in existing projects
claude-tdd init --force
```

> **重要说明**: `claude-tdd init` 与 Claude Code 中的 `/tdd:reset` 命令不同：
> - `claude-tdd init` - CLI 工具，用于首次初始化完整的 TDD 环境
> - `/tdd:reset` - Claude Code 命令，用于重置 TDD 状态（需要先运行 `claude-tdd init`）

### Check Your Setup

```bash
# Diagnose environment and configuration
claude-tdd doctor

# Show current TDD status
claude-tdd status
```

## 📋 Commands

### Core Commands

| Command | Description | Options |
|---------|-------------|---------|
| `claude-tdd init` | Initialize TDD workflow | `--quick`, `--force`, `--framework <type>`, `--template <type>` |
| `claude-tdd doctor` | Diagnose environment | `--verbose`, `--check-project`, `--check-claude` |
| `claude-tdd status` | Show workflow status | `--json` |
| `claude-tdd config` | Manage configuration | `show`, `set <key> <value>`, `list`, `--apply` |
| `claude-tdd update` | Update templates | `--check`, `--force` |
| `claude-tdd switch-framework` | Switch project framework | `[framework]`, `--yes`, `--skip-backup` |
| `claude-tdd migrate` | Advanced framework migration | `--from <type>`, `--to <type>`, `--interactive` |

### Examples

```bash
# Quick setup for Node.js project
claude-tdd init --quick --framework nodejs

# Interactive setup with full template
claude-tdd init --template full

# Check what updates are available
claude-tdd update --check

# Diagnose issues with verbose output
claude-tdd doctor --verbose

# Show status in JSON format for scripts
claude-tdd status --json

# Switch project from Node.js to Python
claude-tdd switch-framework python

# Quick framework switch without confirmation
claude-tdd switch-framework java --yes

# Advanced migration from Java to Rust
claude-tdd migrate --from java --to rust

# Set project framework configuration
claude-tdd config set project.framework nodejs --apply
```

## 🛠️ Supported Frameworks

### Languages & Frameworks

| Language | Frameworks | Test Frameworks | Build Tools |
|----------|------------|-----------------|-------------|
| **Node.js/TypeScript** | React, Vue, Express | Jest, Mocha, Cypress | npm, yarn, pnpm |
| **Java** | Spring Boot, Maven, Gradle | JUnit 5, TestNG, Mockito | Maven, Gradle |
| **Python** | FastAPI, Django, Flask | pytest, unittest | pip, poetry |
| **Go** | Gin, Echo, Standard Library | testing, testify | go mod |
| **Rust** | Axum, Actix, Standard Library | built-in testing | Cargo |

### Auto-Detection Features

- **Smart Framework Recognition**: Analyzes `package.json`, `pom.xml`, `setup.py`, etc.
- **Test Directory Discovery**: Finds existing test folders and patterns
- **Build Tool Detection**: Identifies npm/yarn, Maven/Gradle, etc.
- **Git Integration**: Detects repository status and remote configuration

## 🎯 What Gets Created

When you run `claude-tdd init`, the CLI creates a complete TDD workflow:

```
your-project/
├── .claude/                     # TDD workflow configuration
│   ├── project-config.json    # Main project configuration
│   ├── tdd-state.json         # TDD phase tracking state
│   ├── example.tasks.json     # Example task structure
│   ├── agents/                # 10 specialized AI agents
│   │   ├── tdd-architect.md       # Test design & architecture
│   │   ├── test-case-generator.md # Concrete test creation
│   │   ├── product-manager.md     # Requirements management
│   │   ├── security-auditor.md    # Security assessment
│   │   └── ... (6 more agents)
│   ├── commands/              # TDD and PM commands
│   │   ├── tdd/              # RED, GREEN, REFACTOR commands
│   │   ├── pm/               # Project management commands
│   │   └── commit.md         # Smart commit command
│   ├── hooks/                # Quality control hooks
│   │   ├── tdd-guard.sh         # Phase permission enforcement
│   │   ├── test-runner.sh       # Automatic test execution
│   │   └── commit-validator.sh  # Commit validation
│   ├── scripts/              # Shell scripts for automation
│   │   ├── tdd/             # TDD management scripts
│   │   │   ├── state-manager.sh   # TDD state management
│   │   │   ├── init.sh           # TDD environment setup
│   │   │   └── project-detector.sh # Project type detection
│   │   └── pm/              # Project management scripts
│   │       ├── next-task.sh      # Smart task recommendation
│   │       ├── sync-to-github.sh # GitHub Issues sync
│   │       └── validate-task-decomposition.sh # Task quality check
│   ├── bin/                  # Utility tools
│   │   └── json-tool.js         # JSON manipulation utility
│   ├── framework-configs/     # Language-specific configurations
│   ├── rules/                # TDD workflow rules
│   └── schemas/              # JSON validation schemas
└── .gitignore                # Updated with TDD entries
```

## 🎛️ Configuration Templates

### Template Types

**🚀 Full Template** (Recommended)
- All 10 specialized agents
- Complete project management integration
- GitHub Issues synchronization
- Parallel development support
- Comprehensive quality gates

**⚡ Minimal Template**
- Essential TDD agents only
- Core RED-GREEN-REFACTOR workflow
- Basic testing automation
- Lighter footprint

**🎨 Custom Template**
- Interactive component selection
- Tailored to specific needs
- Flexible agent configuration

## 🧠 10 Specialized Agents

The CLI sets up 10 AI agents, each specialized for different aspects of TDD:

### Core Development
- **🏗️ TDD Architect**: Test design and code architecture
- **🧪 Test Case Generator**: Concrete test case creation  
- **📊 Test Strategist**: Testing strategy and frameworks

### Project Management
- **📋 Product Manager**: Requirements and PRD creation
- **🎯 PRD Analyzer**: Technical requirement analysis
- **✂️ Task Decomposer**: Smart task breakdown

### Quality Assurance
- **🛡️ Security Auditor**: Security assessment and compliance
- **⚡ Performance Analyzer**: Performance optimization
- **👁️ Code Reviewer**: Code quality and best practices

### Team Collaboration
- **🔄 Parallel Worker**: Multi-developer coordination

## 🔧 Advanced Usage

### Environment Configuration

```bash
# Set global defaults
claude-tdd config set default.framework nodejs
claude-tdd config set default.template full
claude-tdd config set github.integration true

# Show current configuration
claude-tdd config show

# List available templates
claude-tdd config list
```

### Framework-Specific Setup

```bash
# Java project with Maven
claude-tdd init --framework java --quick

# Python project with pytest
claude-tdd init --framework python --template minimal

# Rust project with full features
claude-tdd init --framework rust --template full
```

### Framework Switching

```bash
# Switch existing project from Node.js to Python
claude-tdd switch-framework python

# Quick switch without confirmation prompts
claude-tdd switch-framework java --yes

# Skip configuration backup during switch
claude-tdd switch-framework go --skip-backup

# Advanced migration with guidance
claude-tdd migrate --from nodejs --to rust --interactive

# Update framework configuration
claude-tdd config set project.framework python --apply
```

### Update Management

```bash
# Check for template updates
claude-tdd update --check

# Apply all available updates
claude-tdd update

# Force update even if current
claude-tdd update --force
```

## 🩺 Troubleshooting

### Common Issues

**"Claude Code not found"**
```bash
# Ensure Claude Code is installed
claude-tdd doctor --check-claude

# Install from: https://claude.ai/code
```

**"Permission denied on hooks"**
```bash
# Fix hook permissions
chmod +x .claude/hooks/*.sh
```

**"Tests failing after init"**
```bash
# Run diagnosis
claude-tdd doctor --verbose

# Check test configuration
claude-tdd status
```

### Getting Help

```bash
# General help
claude-tdd --help

# Command-specific help  
claude-tdd init --help
claude-tdd doctor --help
```

## 🚧 Development

### Building from Source

```bash
git clone https://github.com/MuziGeek/claude-tdd-cli.git
cd claude-tdd-cli
npm install
npm run build
npm link
```

### Running Tests

```bash
npm test
npm run test:watch
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔧 CI/CD & Development

### 🚀 Automated Workflows

This project includes comprehensive CI/CD workflows:

- **🔄 Cross-Platform Testing**: Automated testing on Ubuntu, Windows, and macOS
- **📦 Multi-Version Support**: Tests on Node.js 18.x, 20.x, and 22.x
- **🔒 Security Scanning**: CodeQL analysis and dependency vulnerability checks
- **📊 Code Coverage**: Automatic coverage reporting via Codecov
- **🚀 Automated Releases**: Smart release notes generation and npm publishing

### 📋 Quality Gates

All pull requests must pass:
- ✅ Unit tests across all platforms
- ✅ TypeScript compilation checks
- ✅ Security vulnerability scans
- ✅ Code coverage requirements
- ✅ CLI functionality tests

### 🛠️ Development Setup

```bash
# Clone and setup
git clone https://github.com/MuziGeek/claude-tdd-cli.git
cd claude-tdd-cli
npm install

# Development workflow
npm run build    # Build TypeScript
npm test         # Run tests
npm run dev      # Watch mode
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for detailed information on:
- Development environment setup
- Code standards and conventions  
- Testing requirements
- Pull request process

Our automated CI/CD ensures code quality:
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes with tests
4. **Submit** a pull request

All contributions automatically go through:
- Multi-platform testing
- Code quality checks
- Security scans
- Automated reviews

## 📖 Documentation

### 📋 Main Documentation
- **🚀 Quick Start**: Right here in README
- **🤝 Contributing**: [Contributing Guide](CONTRIBUTING.md)
- **📝 Usage Guide**: [Usage Examples](docs/USAGE.md)
- **💼 Examples**: [Example Projects](examples/)

### 📚 Detailed Documentation (GitHub Wiki)
For comprehensive documentation, visit our [**GitHub Wiki**](https://github.com/MuziGeek/claude-tdd-cli/wiki):

- **🏗️ [System Architecture](https://github.com/MuziGeek/claude-tdd-cli/wiki/Architecture)** - Technical architecture and design principles
- **🛠️ [Development Guide](https://github.com/MuziGeek/claude-tdd-cli/wiki/Development-Guide)** - Complete development environment setup
- **🌿 [Branch Management](https://github.com/MuziGeek/claude-tdd-cli/wiki/Branch-Management)** - Git workflow and version control
- **📦 [Release Process](https://github.com/MuziGeek/claude-tdd-cli/wiki/Release-Process)** - Automated release and publishing
- **🔧 [Troubleshooting](https://github.com/MuziGeek/claude-tdd-cli/wiki/Troubleshooting)** - Common issues and solutions

## 💬 Support

- **📖 Documentation**: [GitHub Wiki](https://github.com/MuziGeek/claude-tdd-cli/wiki) | [Usage Guide](docs/USAGE.md) | [Examples](examples/)
- **💬 Issues**: [GitHub Issues](https://github.com/MuziGeek/claude-tdd-cli/issues)
- **🚀 Discussions**: [GitHub Discussions](https://github.com/MuziGeek/claude-tdd-cli/discussions)  
- **🔍 CI Status**: [GitHub Actions](https://github.com/MuziGeek/claude-tdd-cli/actions)
- **🌟 Claude Code**: [Official Site](https://claude.ai/code)
- **✉️ Email**: mz@easymuzi.cn

---

**🎉 Start your professional TDD journey today!**

Transform any project into a TDD powerhouse with `claude-tdd init`