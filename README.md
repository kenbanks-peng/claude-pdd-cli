# Claude PDD CLI - Project-Driven Development Platform

[![npm version](https://badge.fury.io/js/claude-pdd-cli.svg)](https://badge.fury.io/js/claude-pdd-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Claude PDD - Flexible Project-Driven Development Platform with PDD/PMD/TDD methodology support**

Transform your development workflow with the revolutionary Project-Driven Development approach! This platform supports multiple methodologies (PDD/PMD/TDD) with intelligent CCPM integration, dynamic online/offline installation, and flexible development workflows tailored to your project needs.

## 🌟 Features

### 🎯 Complete CCPM System
- **39 Project Management Commands** - Full PRD to deployment workflow
- **Epic & Task Management** - Break down features into manageable tasks
- **GitHub Issues Integration** - Seamless sync with GitHub project boards
- **"No Vibe Coding"** - Every line of code traces to a specification
- **Parallel Development** - Team coordination and conflict prevention

### 🧪 Advanced TDD Integration
- **5 TDD Commands** - Complete Red-Green-Refactor cycle automation
- **Spec-to-Test Generation** - Convert requirements into comprehensive test suites
- **Multi-Framework Support** - Node.js, Java, Python, Go, Rust
- **Test Coverage Tracking** - Integrated with GitHub Issue updates
- **Quality Gates** - Automated validation at each TDD phase

### 🌐 Revolutionary Dynamic Installation
- **Online Mode** - Automatically fetches latest CCPM from GitHub
- **Offline Mode** - Falls back to built-in templates when needed
- **Intelligent Fallback** - Seamless online-to-offline switching
- **Zero Maintenance** - Always get the latest CCPM features
- **Cross-Platform** - Windows PowerShell + Unix Bash support

### 🤖 AI Agents & Workflows
- **8 Specialized Agents** - TDD, test generation, parallel coordination
- **4 Complete Workflows** - Spec-driven TDD and Issue-to-test flows
- **Context Management** - Persistent project context across sessions
- **Automated Reporting** - Progress tracking and team visibility

## 🚀 Quick Start

### Installation
```bash
npm install -g claude-pdd-cli
```

### Initialize Your Project
```bash
# Full system (CCPM + TDD) - Recommended
cpdd init

# Quick setup with defaults
cpdd init --quick

# Specific modes
cpdd init --mode=pm      # Project management only
cpdd init --mode=tdd     # TDD tools only

# Control installation method
cpdd init --online       # Force online mode (fetch latest CCPM from GitHub)
cpdd init --offline      # Force offline mode (use built-in templates)

# With GitHub integration
cpdd init --github=owner/repo

# Combined options
cpdd init --mode=pm --online --github=owner/repo
```

### Check Status
```bash
cpdd status
```

## 📖 Documentation

### 📋 Complete Usage Guide
**👉 [View Complete Usage Guide (COMPLETE-USAGE-GUIDE.md)](COMPLETE-USAGE-GUIDE.md)**

Includes:
- 🎯 **39 Project Management Commands Explained** - Complete PRD, Epic, Issue lifecycle
- 🧪 **5 TDD Command Workflows** - Complete Red-Green-Refactor cycle
- 🌳 **Git Worktree Parallel Development** - Multi-agent collaboration mode
- 📊 **Best Practices and Troubleshooting** - Team collaboration optimization guide

### Quick Usage

After initialization, all functionality is accessed through Claude Code commands:

### Complete Feature Development Workflow

#### 1. Start with Requirements
```bash
# In Claude Code:
/pm:prd-new user-authentication
# → Interactive PRD creation
# → Comprehensive requirements gathering
```

#### 2. Create Epic & Tasks  
```bash
/pm:prd-parse user-authentication
# → Breaks PRD into Epic with tasks
# → Creates GitHub Issues automatically

/pm:epic-sync
# → Syncs to GitHub project board
# → Sets up milestones and labels
```

#### 3. TDD Development
```bash
/pm:issue-start 123
# → Loads specific task requirements
# → Sets up development context

/tdd:spec-to-test
# → Converts requirements to test cases
# → Creates comprehensive test suite

/tdd:cycle
# → Complete Red-Green-Refactor cycle
# → Updates GitHub Issue with progress
```

#### 4. Quality & Completion
```bash
/pm:issue-close 123
# → Validates completion criteria
# → Updates Epic progress

/pm:next
# → Recommends next task
# → Handles dependencies automatically
```

## 🌐 Intelligent Installation System

The CLI uses a revolutionary dynamic installation approach:

### How It Works
1. **Network Detection** - Automatically checks internet connectivity
2. **GitHub Fetch** - Downloads latest CCPM from [automazeio/ccpm](https://github.com/automazeio/ccpm) repository
3. **Smart Execution** - Runs CCPM's install script with cross-platform support
4. **TDD Enhancement** - Overlays custom TDD functionality on top of CCPM
5. **Automatic Fallback** - Switches to offline mode if network fails

### Installation Process
```bash
# Automatic mode (recommended)
cpdd init
# → Detects network → Fetches latest CCPM → Adds TDD enhancements

# Force specific behavior
cpdd init --online   # Always try GitHub (fail if no network)
cpdd init --offline  # Use built-in templates (faster, no network needed)
```

### What Gets Downloaded
- **CCPM Commands** - Complete project management system (39 commands)
- **GitHub Integration** - Issue sync, project boards, automation
- **AI Agents** - Project coordination and workflow management
- **Templates** - PRD, Epic, and task management templates

### Offline Fallback
If online installation fails, the system automatically provides:
- Core TDD workflow commands
- Basic project structure
- Essential development patterns
- Framework-specific configurations

## 🎯 Installation Modes

### PDD Mode - Project-Driven Development (Recommended)
```bash
cpdd init --mode=pdd
```
**Includes:** All CCPM commands, TDD tools, GitHub integration, complete workflows

**Perfect for:** Teams wanting complete project management + development workflow

### PM Mode - Project Management Driven
```bash
cpdd init --mode=pm
```
**Includes:** Project management, Epic/Issue handling, GitHub sync, context management

**Perfect for:** Project managers, teams focused on requirement management

### TDD Mode - Test-Driven Development
```bash
cpdd init --mode=tdd
```
**Includes:** TDD cycle commands, test generation, basic testing workflows

**Perfect for:** Developers wanting pure TDD workflow without project management

## 🛠️ Supported Frameworks

| Framework | Test Framework | Package Manager | Status |
|-----------|----------------|-----------------|---------|
| Node.js/TypeScript | Jest, Vitest, Mocha | npm, yarn, pnpm | ✅ Full Support |
| Java | JUnit 5, TestNG | Maven, Gradle | ✅ Full Support |
| Python | pytest, unittest | pip, poetry | ✅ Full Support |
| Go | go test | go modules | ✅ Full Support |
| Rust | cargo test | cargo | ✅ Full Support |
| C# | xUnit, NUnit | dotnet | 🚧 Coming Soon |
| PHP | PHPUnit | composer | 🚧 Coming Soon |

## 📁 What Gets Installed

The CLI creates a `.claude/` directory with:

```
.claude/
├── CLAUDE.md              # Unified rules and command reference
├── config.json            # System configuration
├── agents/                # AI agents (6 total)
│   ├── tdd-agent.md       # TDD workflow coordinator
│   ├── test-generator.md  # Test case generator
│   ├── parallel-worker.md # Team coordination
│   └── ...
├── commands/              # All available commands
│   ├── pm/               # Project management (39 commands)
│   ├── tdd/              # TDD workflow (5 commands)
│   ├── testing/          # Test execution
│   └── context/          # Context management
├── workflows/            # Complete workflows (2 total)
│   ├── spec-driven-tdd.md
│   └── issue-to-test.md
├── rules/                # Development rules and patterns
├── epics/                # Epic templates and storage
└── prds/                 # PRD templates and storage
```

## 🔄 Example Workflows

### Bug Fix Workflow
```bash
# In Claude Code:
/pm:issue-start 456        # Load bug report
/tdd:spec-to-test          # Create reproduction tests
/tdd:red                   # Ensure tests fail (confirming bug)
/tdd:green                 # Fix the bug
/tdd:refactor              # Improve code quality
/pm:issue-close 456        # Mark as resolved
```

### New Feature Workflow
```bash
# Complete spec-driven development:
/pm:prd-new feature-name   # Create requirements
/pm:prd-parse feature-name # Break into tasks
/pm:epic-sync              # Sync to GitHub
/pm:issue-start 789        # Start first task
/tdd:cycle                 # Implement with TDD
/pm:next                   # Move to next task
```

## 📊 Benefits

### For Development Teams
- **100% Requirement Traceability** - Every test and code line links back to specifications
- **Reduced Context Switching** - Persistent context across development sessions
- **Parallel Development** - Multiple developers work without conflicts
- **Quality Assurance** - Automated validation at every step

### For Project Managers
- **Real-time Visibility** - GitHub Issues show actual development progress
- **Specification-Driven** - No implementation without requirements
- **Team Coordination** - Built-in conflict resolution and task assignment
- **Audit Trail** - Complete history from requirement to deployment

### For Stakeholders
- **Transparency** - Clear progress tracking in familiar GitHub interface
- **Quality Metrics** - Test coverage and completion rates visible
- **Predictability** - Consistent development velocity and timelines
- **Risk Reduction** - Early detection of scope creep and blockers

## 🔧 Configuration

### GitHub Integration Setup
```bash
cpdd init --github=owner/repo
```

Then configure your GitHub token in Claude Code settings for full automation.

### Framework-Specific Configuration

The system auto-detects your framework and configures appropriate:
- Test patterns and file locations
- Build and test commands  
- Coverage reporting
- CI/CD integration points

### Custom Configuration

Edit `.claude/config.json` to customize:
- Test coverage thresholds
- GitHub label prefixes
- Workflow preferences
- Team coordination settings

## 📚 Command Reference

### CLI Commands (Terminal)
- `cpdd init` - Install/configure system
- `cpdd status` - Check installation status  
- `cpdd update` - Update to latest version

### Claude Code Commands (44 Total)

#### Project Management (39 commands)
- `/pm:prd-*` - PRD management (5 commands)
- `/pm:epic-*` - Epic handling (12 commands)
- `/pm:issue-*` - Issue management (8 commands)
- `/pm:*` - Workflow and coordination (14 commands)

#### TDD Development (5 commands)
- `/tdd:cycle` - Complete TDD cycle
- `/tdd:red` - Red phase (failing tests)
- `/tdd:green` - Green phase (implementation)
- `/tdd:refactor` - Refactor phase (quality)
- `/tdd:spec-to-test` - Requirements to tests

See `.claude/CLAUDE.md` for complete reference.

## 🤝 Contributing

We welcome contributions! This project combines:
- **CCPM** - Originally from [automazeio/ccpm](https://github.com/automazeio/ccpm)  
- **TDD Tools** - Custom-built for Claude Code integration

### Development Setup
```bash
git clone https://github.com/MuziGeek/claude-pdd-cli.git
cd claude-pdd-cli
npm install
npm run build
npm link
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **CCPM System** - Thanks to [automazeio](https://github.com/automazeio) for the amazing CCPM foundation
- **Claude Code Team** - For creating the platform that makes this integration possible
- **TDD Community** - For decades of wisdom on test-driven development practices

---

**Ready to revolutionize your development workflow?**

```bash
npm install -g claude-pdd-cli
cpdd init
```

Transform requirements into tested, production-ready code with full traceability and team coordination. 🚀