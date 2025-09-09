# 🔄 TDD Commands Guide

本文档介绍Claude Code中可用的TDD命令，以及它们与 `claude-tdd` CLI工具的区别。

## 📋 命令概览

### TDD阶段命令
- `/tdd:red` - 开始RED阶段（编写失败测试）
- `/tdd:green` - 开始GREEN阶段（实现代码）  
- `/tdd:refactor` - 开始REFACTOR阶段（重构代码）

### TDD管理命令
- `/tdd:status` - 查看当前TDD状态
- `/tdd:reset` - 重置TDD工作流状态

## 🚨 重要区别

### CLI工具 vs Claude Code命令

| 方面 | `claude-tdd` CLI | Claude Code 命令 |
|------|-----------------|------------------|
| **用途** | 环境初始化和管理 | 开发过程中的TDD操作 |
| **执行时机** | 项目开始时 | 开发过程中 |
| **作用范围** | 整个项目环境 | TDD状态和流程 |

### 命令对比

| CLI 命令 | Claude Code 命令 | 说明 |
|----------|------------------|------|
| `claude-tdd init` | `/tdd:reset` | 不同功能！init创建环境，reset重置状态 |
| `claude-tdd status` | `/tdd:status` | 类似功能，但详细程度不同 |
| `claude-tdd doctor` | - | CLI独有，诊断环境问题 |
| - | `/tdd:red` | Claude Code独有，TDD阶段控制 |
| - | `/tdd:green` | Claude Code独有，TDD阶段控制 |
| - | `/tdd:refactor` | Claude Code独有，TDD阶段控制 |

## 🛠️ 使用流程

### 1. 项目初始化（一次性）
```bash
# 在项目根目录运行
claude-tdd init
```

### 2. 开发过程中使用Claude Code命令

#### 开始TDD循环
```
/tdd:red        # 进入RED阶段，编写失败测试
```

#### 实现代码
```  
/tdd:green      # 进入GREEN阶段，实现最小可行代码
```

#### 重构优化
```
/tdd:refactor   # 进入REFACTOR阶段，优化代码质量
```

#### 状态查看
```
/tdd:status     # 查看当前TDD状态和统计信息
```

#### 重置状态（当需要开始新功能时）
```
/tdd:reset      # 重置TDD状态，准备新的开发循环
```

## 📖 详细命令说明

### `/tdd:red` - RED阶段
**目的**: 编写失败的测试用例
- 切换到RED阶段状态
- 记录阶段开始时间
- 提供测试编写指导

### `/tdd:green` - GREEN阶段  
**目的**: 编写最小可行代码让测试通过
- 切换到GREEN阶段状态
- 自动运行测试验证
- 确保测试通过

### `/tdd:refactor` - REFACTOR阶段
**目的**: 重构代码提高质量
- 切换到REFACTOR阶段状态
- 保持测试通过的前提下优化代码
- 记录重构历史

### `/tdd:status` - 状态查看
**显示信息**:
- 当前TDD阶段
- 循环统计
- 测试运行历史
- 项目配置信息

### `/tdd:reset` - 状态重置
**重置内容**:
- 清除当前阶段状态
- 重置统计信息
- 清理测试缓存
- 保留项目配置

## ⚠️ 注意事项

### 环境要求
1. 必须先运行 `claude-tdd init` 初始化环境
2. 需要在项目根目录或包含 `.claude` 目录的位置
3. 确保相关脚本有执行权限

### 状态管理
- TDD命令会修改 `tdd-state.json` 文件
- 状态在Claude Code会话之间保持
- 重置操作会清除所有历史记录

### 错误处理
如果命令执行失败：
1. 检查环境是否已初始化：`claude-tdd doctor`
2. 查看错误日志：`.claude/logs/`
3. 重置权限：`chmod +x .claude/scripts/tdd/*.sh`

## 🔧 故障排除

### 常见问题

**命令找不到**
- 确保已运行 `claude-tdd init`
- 检查 `.claude/commands/tdd/` 目录是否存在

**脚本权限错误**
```bash
chmod +x .claude/scripts/tdd/*.sh
```

**状态文件损坏**
```bash
# 使用reset命令重新创建
/tdd:reset --force
```

**环境检查**
```bash
claude-tdd doctor --verbose
```

## 🎯 最佳实践

1. **严格按照TDD循环**: RED → GREEN → REFACTOR
2. **频繁状态检查**: 使用 `/tdd:status` 了解当前状态
3. **适时重置**: 完成功能后使用 `/tdd:reset` 开始新循环
4. **保持测试绿色**: 每个阶段结束都确保测试通过
5. **记录重构**: 在REFACTOR阶段记录优化内容

## 📚 相关文档

- [Claude TDD CLI 文档](../../README.md)
- [TDD工作流指南](../../docs/tdd-workflow.md)  
- [故障排除指南](../../docs/troubleshooting.md)

---

**记住**: CLI工具用于环境管理，Claude Code命令用于开发流程！