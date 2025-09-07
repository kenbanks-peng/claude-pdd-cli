---
description: 初始化TDD项目环境
allowed-tools: Bash, Read, Write
---

## 🚀 初始化TDD项目

初始化完整的TDD开发环境，包括项目检测、配置文件创建、质量门控设置等。

### 执行命令

运行TDD初始化脚本：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/init.sh
```

### 初始化内容

1. **依赖检查**: 验证必要工具（jq, git）
2. **目录结构**: 创建完整的.claude目录体系
3. **项目检测**: 自动识别项目类型（Java/Node.js/Python/Go/Rust/C++）
4. **配置文件**: 创建settings.json和tdd-state.json
5. **质量门控**: 设置TDD Guard、Test Runner、Commit Validator
6. **Git Hooks**: 配置pre-commit和post-commit hooks
7. **示例文件**: 创建README.md和.gitignore

### 强制重新初始化

如果需要重新初始化（覆盖现有配置）：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/init.sh --force
```

### 智能识别的项目类型

- **Java**: Maven (pom.xml) / Gradle (build.gradle)
- **JavaScript/TypeScript**: Node.js (package.json)
- **Python**: setup.py / pyproject.toml / requirements.txt
- **Go**: go.mod
- **Rust**: Cargo.toml
- **C/C++**: CMakeLists.txt / Makefile

### 初始化后的TDD命令

- `/tdd:red` - 开始RED阶段（编写失败测试）
- `/tdd:green` - 开始GREEN阶段（实现代码）
- `/tdd:refactor` - 开始REFACTOR阶段（重构代码）
- `/tdd:status` - 查看TDD状态

### 质量保证特性

- **阶段权限控制**: 根据TDD阶段限制文件编辑
- **自动测试运行**: 代码变更后自动运行测试
- **提交验证**: 确保提交符合TDD规范
- **状态跟踪**: 完整的TDD历史记录

---
**下一步**: 使用 `/tdd:status` 查看状态，然后用 `/tdd:red` 开始第一个TDD循环