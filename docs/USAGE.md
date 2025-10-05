# Claude PDD CLI Usage Guide

## 🚀 Quick Start

### Installation
```bash
npm install -g claude-pdd-cli
```

### Initialize New Project
```bash
# Enter your project directory
cd my-project

# Full installation (recommended) - Dynamically fetch latest CCPM
cpdd init

# Quick installation
cpdd init --quick

# Offline installation
cpdd init --offline
```

## 📋 Available Commands

### Core Commands

| Command | Description | Example |
|------|------|------|
| `cpdd init` | Initialize CCPM + TDD system | `cpdd init --online` |
| `cpdd status` | Show installation status | `cpdd status` |
| `cpdd update` | Update existing installation | `cpdd update --force` |

### init Command Options

```bash
cpdd init [options]
```

**Available Options**:
- `--mode <mode>` - Installation mode (full/ccpm/tdd)
- `--online` - Force online mode (fetch latest CCPM from GitHub)
- `--offline` - Force offline mode (use built-in templates)
- `--quick` - Quick installation, use detected default settings
- `--force` - Overwrite existing installation
- `--github <repo>` - GitHub repository integration (owner/repo format)
- `--framework <type>` - Specify framework type

## 🎯 Installation Modes

### PDD Mode - Project-Driven Development (Recommended)
```bash
cpdd init --mode=pdd
```
**Methodology**: Project-Driven Development - Project requirements first, flexible integration of multiple development methods
- ✅ Complete CCPM system (39 project management commands)
- ✅ TDD development tools (5 TDD commands)
- ✅ GitHub Issues integration
- ✅ 8 professional AI agents
- ✅ Supports PDD/BDD/TDD hybrid development

### PM Mode - Project Management Driven
```bash
cpdd init --mode=pm
```
**Methodology**: Project Management Driven - Focus on project management and team collaboration
- ✅ CCPM project management features (39 PM commands)
- ✅ PRD and Epic management
- ✅ GitHub Issues integration
- ✅ Team collaboration workflows
- ❌ TDD development tools

### TDD Mode - Test-Driven Development
```bash
cpdd init --mode=tdd
```
**Methodology**: Test-Driven Development - Traditional TDD red-green-refactor cycle
- ✅ TDD development commands (5 TDD commands)
- ✅ Intelligent test generation tools
- ✅ Red-Green-Refactor cycle
- ✅ Code quality assurance
- ❌ Project management features

## 🌐 Online/Offline Installation

### Online Mode (Recommended)
```bash
cpdd init --online
```
- Fetch latest CCPM from GitHub
- Automatically integrate TDD enhancements
- Always stay up-to-date with latest features

### Offline Mode
```bash
cpdd init --offline
```
- Use built-in CCPM templates
- No network connection required
- Fast installation

### Smart Mode (Default)
```bash
cpdd init
```
- Automatically detect network status
- Automatically fallback to offline when online fails
- Best user experience

## 🛠️ Usage Scenarios

### 1. New Team Project
```bash
# Full installation with GitHub integration
cpdd init --mode=pdd --github=myorg/project

# Check installation status
cpdd status
```

### 2. Personal Development Project
```bash
# Quick TDD development environment
cpdd init --mode=tdd --quick

# View generated structure
cpdd status
```

### 3. Add Features to Existing Project
```bash
# Force overwrite existing configuration
cpdd init --force --online

# Update to latest version
cpdd update --force
```

## 🎯 Generated Project Structure

After running `cpdd init`, the following will be created in your project:

```
.claude/
├── CLAUDE.md              # Unified rules and command reference
├── config.json            # System configuration
├── agents/                # AI agents (depends on mode)
├── commands/              # Available commands
│   ├── pm/               # Project management commands (39 commands, ccpm/full mode)
│   └── tdd/              # TDD commands (5 commands, tdd/full mode)
├── workflows/            # Complete workflows
├── rules/                # Development rules and best practices
├── epics/                # Epic templates and storage
└── prds/                 # PRD templates and storage
```

## 📊 Workflows

### Full Development Workflow (full mode)
```bash
# 1. Initialize
cpdd init --mode=pdd --github=owner/repo

# 2. Use project management commands in Claude Code
/pm:prd-new feature-name
/pm:prd-parse feature-name
/pm:issue-start 123

# 3. Use TDD development commands
/tdd:spec-to-test
/tdd:cycle

# 4. Complete development
/pm:issue-close 123
/pm:next
```

### Pure TDD Development Workflow (tdd mode)
```bash
# 1. Initialize
cpdd init --mode=tdd

# 2. Use TDD commands in Claude Code
/tdd:red          # Write failing test
/tdd:green        # Minimal implementation
/tdd:refactor     # Refactor optimization
/tdd:cycle        # Complete cycle
```

## 📚 Command Reference

After installation, all features are accessed through commands in Claude Code:

### Project Management Commands (ccpm/full mode)
- `/pm:prd-*` - PRD management (5 commands)
- `/pm:epic-*` - Epic processing (12 commands)
- `/pm:issue-*` - Issue management (8 commands)
- `/pm:*` - Workflows and coordination (14 commands)

### TDD Development Commands (tdd/full mode)
- `/tdd:cycle` - Complete TDD cycle
- `/tdd:red` - Red phase (failing test)
- `/tdd:green` - Green phase (minimal implementation)
- `/tdd:refactor` - Refactor phase (quality improvement)
- `/tdd:spec-to-test` - Requirements to test cases

See the generated `.claude/CLAUDE.md` file for the complete command list.

## 🔧 Troubleshooting

### Installation Failed
```bash
# Check installation status
cpdd status

# Force reinstall
cpdd init --force --offline

# Update to latest version
cpdd update --force
```

### GitHub Integration Issues
```bash
# Reconfigure GitHub integration
cpdd init --github=owner/repo --force
```

### Online Installation Failed
```bash
# Use offline mode as fallback
cpdd init --offline --force
```

## 📞 Getting Help

- **Command Help**: `cpdd --help` or `cpdd init --help`
- **GitHub Issues**: [Submit an issue](https://github.com/MuziGeek/claude-pdd-cli/issues)
- **Documentation**: [Project documentation](https://github.com/MuziGeek/claude-pdd-cli#readme)

## 💡 Best Practices

1. **Recommended to use full mode**: `cpdd init --mode=pdd` for the best experience
2. **Enable GitHub integration**: Facilitates team collaboration and progress tracking
3. **Regular updates**: Use `cpdd update` to stay current with latest features
4. **Online first**: Let the system automatically fetch latest CCPM features

---

**Start your efficient development journey!**

```bash
npm install -g claude-pdd-cli
cpdd init --mode=pdd --online
```

Experience the complete workflow from requirements to testing, from development to deployment. 🚀
