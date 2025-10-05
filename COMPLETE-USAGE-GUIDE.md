# Claude PDD CLI Complete Usage Guide

> **Project-Driven Development (PDD) Platform Complete Feature Documentation**

[![npm version](https://badge.fury.io/js/claude-pdd-cli.svg)](https://badge.fury.io/js/claude-pdd-cli)

## 📖 Table of Contents

- [Part 1: Quick Start Guide](#part-1-quick-start-guide)
- [Part 2: Installation Modes Explained](#part-2-installation-modes-explained)
- [Part 3: Complete Command Reference](#part-3-complete-command-reference)
- [Part 4: Workflow Patterns](#part-4-workflow-patterns)
- [Part 5: Advanced Features](#part-5-advanced-features)
- [Part 6: Troubleshooting and FAQ](#part-6-troubleshooting-and-faq)

---

## Part 1: Quick Start Guide

### 🚀 Get Started in 5 Minutes

#### 1. Installation
```bash
npm install -g claude-pdd-cli
```

#### 2. Initialize Project
```bash
# Navigate to your project directory
cd my-project

# Full installation (recommended) - Get the latest CCPM + TDD tools
cpdd init

# Or specify mode
cpdd init --mode=pdd    # Full project-driven development
cpdd init --mode=pm     # Pure project management
cpdd init --mode=tdd    # Pure test-driven development
```

#### 3. Verify Installation
```bash
cpdd status
```

#### 4. Start Your First Feature Development
```bash
# Run in Claude Code:
/pm:prd-new user-login    # Create requirements document
/pm:prd-parse user-login  # Generate Epic and tasks
/pm:issue-start 123       # Start specific task
/tdd:spec-to-test         # Convert to test cases
/tdd:cycle                # Complete TDD development cycle
```

### 🏗️ Generated Project Structure

```
.claude/
├── CLAUDE.md              # Unified rules and command reference
├── config.json            # System configuration
├── agents/                # AI agents (8 total)
│   ├── tdd-architect.md   # TDD architect
│   ├── test-generator.md  # Test generation expert
│   ├── parallel-worker.md # Parallel coordinator
│   └── ...
├── commands/              # Available commands
│   ├── pm/               # Project management commands (39 total)
│   │   ├── prd-new.md    # Create PRD
│   │   ├── epic-start.md # Start Epic
│   │   └── ...
│   └── tdd/              # TDD commands (5 total)
│       ├── cycle.md      # Complete TDD cycle
│       ├── red.md        # Red phase
│       └── ...
├── workflows/            # Complete workflows
├── rules/                # Development rules
├── epics/                # Epic storage
└── prds/                 # PRD storage
```

---

## Part 2: Installation Modes Explained

### 🎯 PDD Mode - Project-Driven Development (Recommended)

```bash
cpdd init --mode=pdd
```

**Included Features:**
- ✅ Complete CCPM system (39 project management commands)
- ✅ TDD development tools (5 TDD commands)
- ✅ GitHub Issues integration
- ✅ 8 professional AI agents
- ✅ Parallel development support (Git Worktree)
- ✅ Complete PRD/Epic/task lifecycle

**Use Cases:**
- Team collaborative development
- Projects requiring complete requirements traceability
- Projects with strict project management requirements
- Commercial projects with high quality requirements

**Workflow:**
```
Requirements(PRD) → Epic Decomposition → Issue Tasks → TDD Development → Parallel Collaboration → Quality Assurance → Deployment
```

### 📋 PM Mode - Project Management Driven

```bash
cpdd init --mode=pm
```

**Included Features:**
- ✅ CCPM project management features (39 PM commands)
- ✅ PRD and Epic management
- ✅ GitHub Issues integration
- ✅ Team collaboration workflows
- ❌ TDD development tools

**Use Cases:**
- Project manager-led projects
- Projects focused on requirements management
- Large team coordination
- Non-technical team member participation

### 🧪 TDD Mode - Test-Driven Development

```bash
cpdd init --mode=tdd
```

**Included Features:**
- ✅ TDD development commands (5 TDD commands)
- ✅ Intelligent test generation tools
- ✅ Red-Green-Refactor cycle
- ✅ Code quality assurance
- ❌ Project management features

**Use Cases:**
- Focus on code quality
- Individual development projects
- Technology-oriented teams
- Refactoring existing code

### 🌐 Online/Offline Installation Modes

#### Online Mode (Recommended)
```bash
cpdd init --online
```
- Fetch latest CCPM from GitHub
- Automatically integrate TDD enhancement features
- Always keep up with latest features
- Complete 39 PM commands

#### Offline Mode
```bash
cpdd init --offline
```
- Use built-in templates
- No network connection required
- Quick installation
- Complete basic features

#### Smart Mode (Default)
```bash
cpdd init
```
- Automatically detect network status
- Automatically fallback to offline when online fails
- Best user experience

---

## Part 3: Complete Command Reference

### 📋 Project Management Commands (39 total)

#### PRD Management Commands (5 total)

| Command | Description | Usage Example |
|------|------|----------|
| `/pm:prd-new <name>` | Create new PRD | `/pm:prd-new user-authentication` |
| `/pm:prd-list` | List all PRDs | `/pm:prd-list` |
| `/pm:prd-edit <name>` | Edit PRD | `/pm:prd-edit user-authentication` |
| `/pm:prd-parse <name>` | Parse PRD to generate Epic | `/pm:prd-parse user-authentication` |
| `/pm:prd-status <name>` | View PRD status | `/pm:prd-status user-authentication` |

**Usage Flow:**
```bash
# 1. Create requirements document
/pm:prd-new payment-system

# 2. Edit and refine requirements
/pm:prd-edit payment-system

# 3. Parse to generate Epic and tasks
/pm:prd-parse payment-system

# 4. Check status
/pm:prd-status payment-system
```

#### Epic Management Commands (12 total)

| Command | Description | Usage Example |
|------|------|----------|
| `/pm:epic-list` | List all Epics | `/pm:epic-list` |
| `/pm:epic-show <name>` | Show Epic details | `/pm:epic-show payment-v2` |
| `/pm:epic-edit <name>` | Edit Epic | `/pm:epic-edit payment-v2` |
| `/pm:epic-start <name>` | Start Epic development | `/pm:epic-start payment-v2` |
| `/pm:epic-start-worktree <name>` | Parallel Epic development | `/pm:epic-start-worktree payment-v2` |
| `/pm:epic-status <name>` | View Epic status | `/pm:epic-status payment-v2` |
| `/pm:epic-sync <name>` | Sync to GitHub | `/pm:epic-sync payment-v2` |
| `/pm:epic-decompose <name>` | Task decomposition | `/pm:epic-decompose payment-v2` |
| `/pm:epic-refresh <name>` | Refresh Epic | `/pm:epic-refresh payment-v2` |
| `/pm:epic-merge <name>` | Merge Epic branch | `/pm:epic-merge payment-v2` |
| `/pm:epic-close <name>` | Close Epic | `/pm:epic-close payment-v2` |
| `/pm:epic-oneshot <name>` | Complete Epic in one shot | `/pm:epic-oneshot payment-v2` |

**Epic Lifecycle:**
```bash
# 1. Create Epic from PRD
/pm:prd-parse payment-system

# 2. View generated Epic
/pm:epic-show payment-system

# 3. Sync to GitHub
/pm:epic-sync payment-system

# 4. Start parallel development
/pm:epic-start-worktree payment-system

# 5. Monitor progress
/pm:epic-status payment-system

# 6. Merge when complete
/pm:epic-merge payment-system
```

#### Issue Management Commands (8 total)

| Command | Description | Usage Example |
|------|------|----------|
| `/pm:issue-start <number>` | Start Issue development | `/pm:issue-start 123` |
| `/pm:issue-show <number>` | Show Issue details | `/pm:issue-show 123` |
| `/pm:issue-edit <number>` | Edit Issue | `/pm:issue-edit 123` |
| `/pm:issue-analyze <number>` | Analyze Issue | `/pm:issue-analyze 123` |
| `/pm:issue-status <number>` | View Issue status | `/pm:issue-status 123` |
| `/pm:issue-sync <number>` | Sync Issue status | `/pm:issue-sync 123` |
| `/pm:issue-close <number>` | Close Issue | `/pm:issue-close 123` |
| `/pm:issue-reopen <number>` | Reopen Issue | `/pm:issue-reopen 123` |

**Issue Development Flow:**
```bash
# 1. Select task from Epic
/pm:next

# 2. Start specific Issue
/pm:issue-start 123

# 3. Analyze task complexity
/pm:issue-analyze 123

# 4. TDD development
/tdd:spec-to-test
/tdd:cycle

# 5. Complete task
/pm:issue-close 123
```

#### Workflow Commands (14 total)

| Command | Description | Usage Example |
|------|------|----------|
| `/pm:status` | Overall project status | `/pm:status` |
| `/pm:next` | Recommend next task | `/pm:next` |
| `/pm:sync` | Sync all data | `/pm:sync` |
| `/pm:validate` | Validate project integrity | `/pm:validate` |
| `/pm:search <keyword>` | Search project content | `/pm:search "user authentication"` |
| `/pm:standup` | Generate standup report | `/pm:standup` |
| `/pm:in-progress` | Tasks in progress | `/pm:in-progress` |
| `/pm:blocked` | Blocked tasks | `/pm:blocked` |
| `/pm:clean` | Clean invalid data | `/pm:clean` |
| `/pm:import <file>` | Import external data | `/pm:import tasks.json` |
| `/pm:init` | Initialize project structure | `/pm:init` |
| `/pm:help` | Show help information | `/pm:help` |
| `/pm:test-reference-update` | Update test references | `/pm:test-reference-update` |

### 🧪 TDD Development Commands (5 total)

| Command | Description | Use Case |
|------|------|----------|
| `/tdd:cycle` | Complete TDD cycle | New feature development |
| `/tdd:red` | Red phase | Write failing tests |
| `/tdd:green` | Green phase | Minimal implementation |
| `/tdd:refactor` | Refactor phase | Quality improvement |
| `/tdd:spec-to-test` | Spec to test | Start from specification |

**TDD Workflow:**
```bash
# Complete cycle
/tdd:cycle

# Or step-by-step execution
/tdd:red      # 1. Write failing test
/tdd:green    # 2. Minimal implementation
/tdd:refactor # 3. Refactor optimization

# Start from requirements
/tdd:spec-to-test  # Convert requirements to test cases
```

---

## Part 4: Workflow Patterns

### 🎯 Complete Feature Development Flow (PDD Mode)

#### Phase 1: Requirements Definition
```bash
# 1. Create PRD
/pm:prd-new user-dashboard

# 2. Refine requirements document
# (Complete through interactive session in Claude Code)

# 3. Validate PRD
/pm:prd-status user-dashboard
```

#### Phase 2: Epic Planning
```bash
# 1. Parse PRD to generate Epic
/pm:prd-parse user-dashboard

# 2. View generated Epic structure
/pm:epic-show user-dashboard

# 3. Sync to GitHub
/pm:epic-sync user-dashboard

# 4. Validate task decomposition
/pm:validate
```

#### Phase 3: Parallel Development
```bash
# 1. Start parallel development
/pm:epic-start-worktree user-dashboard

# 2. Monitor development progress
/pm:epic-status user-dashboard

# 3. Check team status
/pm:standup
```

#### Phase 4: Task Execution
```bash
# 1. Get next task
/pm:next

# 2. Start specific task
/pm:issue-start 234

# 3. TDD development
/tdd:spec-to-test
/tdd:cycle

# 4. Complete task
/pm:issue-close 234
```

#### Phase 5: Epic Completion
```bash
# 1. Check Epic status
/pm:epic-status user-dashboard

# 2. Merge code
/pm:epic-merge user-dashboard

# 3. Close Epic
/pm:epic-close user-dashboard
```

### 🐛 Bug Fix Flow

```bash
# 1. Create Issue (via GitHub or manually)
/pm:issue-start 456

# 2. Analyze problem
/pm:issue-analyze 456

# 3. Write reproduction test
/tdd:red

# 4. Fix bug
/tdd:green

# 5. Refactor optimization
/tdd:refactor

# 6. Close Issue
/pm:issue-close 456
```

### 🔄 Refactoring Existing Code Flow

```bash
# 1. Create refactoring PRD
/pm:prd-new code-refactor-auth

# 2. Decompose into tasks
/pm:prd-parse code-refactor-auth

# 3. Start refactoring task
/pm:issue-start 789

# 4. Write protective tests
/tdd:spec-to-test

# 5. Refactoring cycle
/tdd:refactor

# 6. Verify completion
/pm:issue-close 789
```

### 👥 Team Collaboration Flow

#### Project Manager Perspective
```bash
# Daily standup preparation
/pm:standup

# Check overall progress
/pm:status

# Handle blocked issues
/pm:blocked

# Sync GitHub status
/pm:sync
```

#### Developer Perspective
```bash
# Get task
/pm:next

# Start development
/pm:issue-start 123
/tdd:cycle

# Submit progress
/pm:issue-status 123

# Complete task
/pm:issue-close 123
```

---

## Part 5: Advanced Features

### 🌳 Git Worktree Parallel Development

#### What is Git Worktree?
Git Worktree allows creating multiple working directories in the same repository, supporting true parallel development.

#### Worktree Operation Commands
```bash
# Create Worktree
git worktree add ../epic-payment -b epic/payment

# List all Worktrees
git worktree list

# Remove Worktree
git worktree remove ../epic-payment
```

#### Parallel Development Flow
```bash
# 1. Start Epic parallel development
/pm:epic-start-worktree payment-system

# System automatically:
# - Creates ../epic-payment-system worktree
# - Creates epic/payment-system branch
# - Analyzes task dependencies
# - Starts multiple AI agents working in parallel
```

#### Parallel Coordination Mechanism
```
Epic: payment-system
├── Issue #101: Database Schema
│   ├── Stream A: User table → Agent-1
│   └── Stream B: Payment table → Agent-2
├── Issue #102: API Endpoints
│   ├── Stream A: User API → Agent-3 (waiting for #101-A)
│   └── Stream B: Payment API → Agent-4 (waiting for #101-B)
└── Issue #103: Frontend
    └── Stream A: UI Components → Agent-5 (waiting for #102)
```

#### Conflict Resolution Strategy
```bash
# File-level isolation
Agent-1: src/models/user.js
Agent-2: src/models/payment.js
Agent-3: src/api/user.js
Agent-4: src/api/payment.js

# If conflicts occur
# 1. Pause related agents
# 2. Manually resolve conflicts
# 3. Resume execution
```

### 🤖 Multi-Agent Coordination System

#### Agent Types and Responsibilities

1. **TDD Architect** (`tdd-architect.md`)
   - Design test strategy
   - Develop TDD plan
   - Quality gatekeeper

2. **Test Generation Expert** (`test-generator.md`)
   - Generate test cases
   - Coverage analysis
   - Test data preparation

3. **Parallel Coordinator** (`parallel-worker.md`)
   - Manage multi-agent execution
   - Dependency handling
   - Conflict coordination

4. **Product Manager Agent** (`product-manager.md`)
   - Requirements analysis
   - Task prioritization
   - Project coordination

#### Agent Startup Example
```bash
# Automatic startup (via epic-start-worktree)
/pm:epic-start-worktree user-auth

# Manual startup of specific agent
# Specify subagent_type in command via Task tool
```

### 🔗 GitHub Integration

#### Auto-Sync Features
```bash
# Epic sync to GitHub Project
/pm:epic-sync user-auth

# Automatically creates:
# - GitHub Issues (one per task)
# - Project Board
# - Milestones
# - Labels (epic:user-auth, status:pending, etc.)
```

#### Issue Status Sync
```
Claude Code Status → GitHub Status
pending            → open
in-progress        → open + in-progress label
blocked            → open + blocked label
completed          → closed
```

#### Commit Message Integration
```bash
# Agent auto-generates commit message format
git commit -m "Issue #123: Add user authentication schema

- Created User model with validation
- Added password hashing middleware
- Implemented JWT token generation
- Test coverage: 95%

Co-authored-by: Claude <noreply@anthropic.com>"
```

### 📊 Project Monitoring and Reporting

#### Real-time Status Monitoring
```bash
# Overall project status
/pm:status

# Displays:
# - Epic progress (3/5 completed)
# - Issue distribution (12 open, 8 in-progress, 25 closed)
# - Test coverage (87%)
# - Agent activity status
```

#### Team Collaboration Reports
```bash
# Generate standup report
/pm:standup

# Output:
# Completed yesterday:
# - Issue #123: User authentication API (Agent-1)
# - Issue #124: Database migration (Agent-2)
#
# Planned for today:
# - Issue #125: User interface (Agent-3)
# - Issue #126: Integration tests (Agent-1)
#
# Blocked issues:
# - Issue #127: Waiting for third-party API documentation
```

---

## Part 6: Troubleshooting and FAQ

### 🔧 Common Problem Solutions

#### Installation Issues

**Q: Installation fails with network error**
```bash
# Solution: Use offline mode
cpdd init --offline --force

# Or retry after checking network
cpdd init --online --force
```

**Q: Permission error**
```bash
# Linux/Mac: Use sudo
sudo npm install -g claude-pdd-cli

# Windows: Run as administrator
# Or configure npm global path
```

#### Project Initialization Issues

**Q: `.claude` directory already exists**
```bash
# Force overwrite
cpdd init --force

# Or manually clean
rm -rf .claude
cpdd init
```

**Q: GitHub integration failed**
```bash
# Reconfigure GitHub integration
cpdd init --github=owner/repo --force

# Check GitHub token configuration
# Ensure correct token is configured in Claude Code settings
```

#### Command Execution Issues

**Q: `/pm:prd-new` command not working**
```bash
# Confirm executing in Claude Code, not terminal
# Confirm cpdd init has been run
# Check if .claude/commands/pm/ directory exists
```

**Q: Epic creation failed**
```bash
# Check if PRD exists
ls -la .claude/prds/

# Validate PRD format
/pm:prd-status <prd-name>

# Re-parse PRD
/pm:prd-parse <prd-name>
```

#### Git Worktree Issues

**Q: Worktree creation failed**
```bash
# Check existing worktrees
git worktree list

# Clean invalid worktrees
git worktree prune

# Ensure main branch is clean
git checkout main
git pull origin main
```

**Q: Agent conflicts**
```bash
# View conflict status
cd ../epic-<name>
git status

# Stop all agents
/pm:epic-stop <epic-name>

# Restart after manually resolving conflicts
/pm:epic-start-worktree <epic-name>
```

### 📋 Best Practices

#### 1. Project Startup Best Practices
```bash
# Recommended complete startup flow
cd my-project
cpdd init --mode=pdd --online --github=owner/repo
cpdd status
/pm:init  # If additional configuration needed
```

#### 2. Team Collaboration Best Practices
- **Daily sync**: Use `/pm:sync` to keep status synchronized
- **Clear naming**: Use descriptive names for PRDs and Epics
- **Dependency management**: Clearly identify dependencies between tasks
- **Regular cleanup**: Use `/pm:clean` to clean invalid data

#### 3. Code Quality Best Practices
- **Test first**: Always start with `/tdd:spec-to-test`
- **Small iterations**: Use `/tdd:cycle` for incremental improvements
- **Continuous refactoring**: Regularly run `/tdd:refactor`
- **Coverage monitoring**: Pay attention to test coverage reports

#### 4. Project Management Best Practices
- **Requirements traceability**: Every Issue should trace back to PRD
- **Status updates**: Update Issue status promptly
- **Documentation maintenance**: Keep PRD and Epic documentation updated
- **Regular reviews**: Use `/pm:validate` to verify project integrity

### 📞 Getting Help

#### Command Line Help
```bash
cpdd --help
cpdd init --help
cpdd status --help
```

#### In-Project Help
```bash
# In Claude Code
/pm:help
```

#### Online Resources
- **GitHub Issues**: [Issue Reporting](https://github.com/MuziGeek/claude-pdd-cli/issues)
- **Project Documentation**: [README](https://github.com/MuziGeek/claude-pdd-cli#readme)
- **Usage Guide**: [USAGE.md](docs/USAGE.md)

#### Diagnostic Information Collection
```bash
# Collect diagnostic information
cpdd status --verbose
cat .claude/config.json
git worktree list
ls -la .claude/commands/
```

### 🎯 Performance Optimization Recommendations

#### 1. Large Project Optimization
- Use `--quick` parameter for fast installation
- Regularly use `/pm:clean` to clean up
- Reasonably control parallel agent count (recommend no more than 5)

#### 2. Network Optimization
- Prefer `--online` to get latest features
- Use `--offline` fallback when network is unstable
- Configure GitHub token to avoid API limits

#### 3. Storage Optimization
- Regularly clean invalid Epics and PRDs
- Use `.gitignore` to exclude temporary files
- Reasonably manage worktree count

---

## 🎉 Conclusion

Claude PDD CLI is a powerful project-driven development platform that integrates advanced project management, test-driven development, and team collaboration features. Through this guide, you should be able to:

✅ Understand the characteristics and applicable scenarios of all three installation modes
✅ Master the usage of 39 project management commands
✅ Proficiently use 5 TDD commands for development
✅ Utilize Git Worktree for efficient parallel development
✅ Configure and use GitHub integration features
✅ Solve common problems and optimize performance

**Start your efficient development journey now:**

```bash
npm install -g claude-pdd-cli
cpdd init --mode=pdd --online
/pm:prd-new my-awesome-feature
```

Experience the complete automated workflow from requirements to testing, from development to deployment! 🚀

---

*This document is continuously updated. If you have questions or suggestions, please submit an Issue or PR.*
