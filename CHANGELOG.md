# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### 💫 Stay tuned for exciting updates in the next release...

## [1.0.0] - 2025-09-11 🎉 Claude PDD CLI First Official Release

### 🎯 A New Project-Driven Development Platform
- **Project Philosophy**: Project-Driven Development (PDD) - Project requirements first, flexible integration of multiple development methodologies
- **Core Command**: `cpdd` - Simple and memorable CLI tool
- **Multi-Methodology Support**: Flexible support for PDD, PMD, TDD, and other development approaches

### ✨ Three Flexible Development Modes
- **PDD Mode** - Project-Driven Development: Complete project-driven development, flexible support for multiple methodologies
- **PM Mode** - Project Management Driven: Focus on project management and team collaboration
- **TDD Mode** - Test-Driven Development: Traditional test-driven development

### 📋 Installation Modes Redefined

#### PDD Mode (Recommended)
```bash
cpdd init --mode=pdd
```
- **Methodology**: Project-Driven Development - Project requirements first, flexible integration of multiple development methods
- **Includes**: Complete CCPM system (39 PM commands) + TDD tools (5 commands) + Support for hybrid PDD/BDD/TDD development
- **Suitable for**: Complete project development process, from requirements to delivery

#### PM Mode
```bash
cpdd init --mode=pm
```
- **Methodology**: Project Management Driven - Focus on project management and team collaboration
- **Includes**: CCPM project management features (39 PM commands) + GitHub integration + Team collaboration workflows
- **Suitable for**: Project managers, team collaboration, requirements management

#### TDD Mode
```bash
cpdd init --mode=tdd
```
- **Methodology**: Test-Driven Development - Traditional TDD red-green-refactor cycle
- **Includes**: TDD development commands (5) + Intelligent test generation + Red-Green-Refactor cycle
- **Suitable for**: Technology-driven development, unit testing first

### 🔄 Completely Innovative User Experience
- **Core Philosophy**: "Plan First, Code Later"
- **Methodology Agnostic**: Supports PDD, PMD, TDD, and other development methodologies
- **Goal Driven**: "Methodology Agnostic, Goal Driven"

### 📚 Comprehensive Documentation
- **Complete README**: Highlights PDD philosophy and methodology descriptions for all three modes
- **USAGE Documentation**: Detailed command and mode descriptions
- **API Documentation**: Complete type definitions and interfaces
- **Contribution Guide**: Development workflow and standards

### 🛠️ Technical Features
- **Type System**: Complete TypeScript type definitions
- **Configuration Logic**: Intelligent mode detection and processing logic
- **Interactive Installation**: Friendly option text and user guidance
- **Error Handling**: Comprehensive error messages and help information

### 🧹 Architecture Design
- **Layered Architecture**: Complete separation of templates (CCPM backup) and tdd-enhancements (TDD enhancement layer)
- **Dynamic Integration**: Intelligent online/offline modes both achieve full functionality through tdd-enhancements overlay
- **Modular Design**: Components evolve independently

### 🚀 Quick Start
```bash
# Install Claude PDD CLI
npm install -g claude-pdd-cli

# Initialize project (PDD mode recommended)
cpdd init --mode=pdd

# Other mode options
cpdd init --mode=pm   # Project management mode
cpdd init --mode=tdd  # Traditional TDD mode
```

---

## Version Specification

### Version Number Format
Follows Semantic Versioning `MAJOR.MINOR.PATCH`:

- **MAJOR** (Major version): Incompatible API changes
- **MINOR** (Minor version): Backwards-compatible new features
- **PATCH** (Patch version): Backwards-compatible bug fixes

### Change Types
- **Added** - New features and capabilities
- **Improved** - Enhancements to existing functionality
- **Fixed** - Bug fixes and issue resolutions
- **Removed** - Removed features (breaking changes)
- **Security** - Security-related fixes

### Release Cadence
- **Major versions**: Significant architectural changes or incompatible updates
- **Minor versions**: Regular feature updates (typically monthly)
- **Patch versions**: Emergency fixes and minor improvements (as needed)

---

**Install latest version**: `npm install -g claude-pdd-cli@latest`

**Project homepage**: https://github.com/MuziGeek/claude-pdd-cli
