---
description: 显示TDD开发状态
allowed-tools: Bash, Read
---

## 📊 TDD状态查看

显示详细的TDD开发状态、进度和建议操作。

### 查看当前状态

运行状态管理器获取完整的TDD状态信息：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh status
```

### 状态信息包含

#### 基本状态信息
- **当前阶段**: RED/GREEN/REFACTOR/READY
- **功能ID**: 当前开发的功能标识
- **迭代次数**: TDD循环的次数
- **测试状态**: 通过/失败/未知
- **最后更新**: 状态变更时间

#### 阶段说明
- 🔴 **RED**: 编写失败测试阶段
- 🟢 **GREEN**: 实现代码阶段  
- 🔧 **REFACTOR**: 重构优化阶段
- 🔵 **READY**: 准备开始阶段

#### 建议操作
系统会根据当前状态和测试结果提供下一步操作建议：

- **READY阶段**: 建议使用 `/tdd:red` 开始编写测试
- **RED阶段**: 根据测试结果建议进入GREEN阶段或修复测试
- **GREEN阶段**: 根据测试通过情况建议进入REFACTOR或继续实现
- **REFACTOR阶段**: 建议下一个循环或提交代码

### 快速状态检查

#### 检查当前阶段
```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh get-state
```

#### 检查测试状态
```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh get-tests
```

#### 获取功能ID
```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh get-feature
```

### 项目配置信息

查看项目类型和测试配置：

```bash
cat $CLAUDE_PROJECT_DIR/.claude/project-config.json | jq '.'
```

### TDD命令参考

#### 核心TDD命令
- `/tdd:init` - 初始化TDD环境
- `/tdd:red` - 进入RED阶段编写失败测试
- `/tdd:green` - 进入GREEN阶段实现代码
- `/tdd:refactor` - 进入REFACTOR阶段重构代码
- `/tdd:status` - 查看当前状态

#### 项目管理命令（如果已集成）
- `/pm:prd-new` - 创建新的产品需求文档
- `/pm:issue-sync` - 同步GitHub Issues
- `/commit` - 智能提交代码

### 工作流程示例

```bash
# 1. 初始化TDD环境
/tdd:init

# 2. 查看状态
/tdd:status

# 3. 开始TDD循环
/tdd:red        # 编写失败测试
/tdd:status     # 查看状态
/tdd:green      # 实现代码
/tdd:status     # 确认测试通过
/tdd:refactor   # 重构代码
/tdd:status     # 确认重构安全

# 4. 重复循环或提交
```

### 状态文件说明

#### TDD状态文件位置
```
.claude/tdd-state.json      # TDD状态跟踪
.claude/project-config.json # 项目配置信息
.claude/settings.json       # Claude Code设置
```

#### 查看状态文件内容
```bash
# TDD状态
cat .claude/tdd-state.json | jq '.'

# 项目配置
cat .claude/project-config.json | jq '.'
```

### 故障排除

#### 常见问题
1. **TDD状态文件不存在**
   ```bash
   /tdd:init  # 重新初始化
   ```

2. **状态显示异常**
   ```bash
   bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh reset
   ```

3. **测试命令无法识别**
   ```bash
   bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/project-detector.sh config
   ```

#### 重置TDD状态
如果状态混乱，可以重置到初始状态：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh reset
```

### 开发进度跟踪

TDD状态系统会自动跟踪：
- 每个阶段的进入和完成时间
- TDD循环的迭代次数
- 测试通过/失败的历史
- 主要命令执行记录

查看历史记录：
```bash
cat .claude/tdd-state.json | jq '.history'
```

---
**提示**: 定期使用 `/tdd:status` 检查开发进度，确保遵循正确的TDD流程！