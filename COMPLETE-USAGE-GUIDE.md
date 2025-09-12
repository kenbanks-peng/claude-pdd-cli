# Claude PDD CLI 完整使用指南

> **项目驱动开发 (Project-Driven Development) 平台完整功能说明**

[![npm version](https://badge.fury.io/js/claude-pdd-cli.svg)](https://badge.fury.io/js/claude-pdd-cli)

## 📖 目录

- [Part 1: 快速上手指南](#part-1-快速上手指南)
- [Part 2: 安装模式详解](#part-2-安装模式详解)
- [Part 3: 完整命令参考](#part-3-完整命令参考)
- [Part 4: 工作流程模式](#part-4-工作流程模式)
- [Part 5: 高级功能](#part-5-高级功能)
- [Part 6: 故障排除和FAQ](#part-6-故障排除和faq)

---

## Part 1: 快速上手指南

### 🚀 5分钟快速开始

#### 1. 安装
```bash
npm install -g claude-pdd-cli
```

#### 2. 初始化项目
```bash
# 进入你的项目目录
cd my-project

# 完整安装（推荐）- 获取最新CCPM + TDD工具
cpdd init

# 或指定模式
cpdd init --mode=pdd    # 完整项目驱动开发
cpdd init --mode=pm     # 纯项目管理
cpdd init --mode=tdd    # 纯测试驱动开发
```

#### 3. 验证安装
```bash
cpdd status
```

#### 4. 开始第一个功能开发
```bash
# 在Claude Code中运行:
/pm:prd-new user-login    # 创建需求文档
/pm:prd-parse user-login  # 生成Epic和任务
/pm:issue-start 123       # 开始具体任务
/tdd:spec-to-test         # 转换为测试用例
/tdd:cycle                # 完整TDD开发循环
```

### 🏗️ 生成的项目结构

```
.claude/
├── CLAUDE.md              # 统一规则和命令参考
├── config.json            # 系统配置
├── agents/                # AI代理 (8个)
│   ├── tdd-architect.md   # TDD架构师
│   ├── test-generator.md  # 测试生成专家
│   ├── parallel-worker.md # 并行协调器
│   └── ...
├── commands/              # 可用命令
│   ├── pm/               # 项目管理命令 (39个)
│   │   ├── prd-new.md    # 创建PRD
│   │   ├── epic-start.md # 启动Epic
│   │   └── ...
│   └── tdd/              # TDD命令 (5个)
│       ├── cycle.md      # 完整TDD循环
│       ├── red.md        # 红灯阶段
│       └── ...
├── workflows/            # 完整工作流
├── rules/                # 开发规则
├── epics/                # Epic存储
└── prds/                 # PRD存储
```

---

## Part 2: 安装模式详解

### 🎯 PDD模式 - Project-Driven Development (推荐)

```bash
cpdd init --mode=pdd
```

**包含功能:**
- ✅ 完整CCPM系统 (39个项目管理命令)
- ✅ TDD开发工具 (5个TDD命令)
- ✅ GitHub Issues集成
- ✅ 8个专业AI代理
- ✅ 并行开发支持 (Git Worktree)
- ✅ PRD/Epic/任务完整生命周期

**适用场景:**
- 团队协作开发
- 需要完整需求追溯
- 项目管理要求严格
- 质量要求高的商业项目

**工作流程:**
```
需求(PRD) → Epic分解 → Issue任务 → TDD开发 → 并行协作 → 质量保证 → 部署
```

### 📋 PM模式 - Project Management Driven

```bash
cpdd init --mode=pm
```

**包含功能:**
- ✅ CCPM项目管理功能 (39个PM命令)
- ✅ PRD和Epic管理
- ✅ GitHub Issues集成
- ✅ 团队协作工作流
- ❌ TDD开发工具

**适用场景:**
- 项目经理主导
- 需求管理重点项目
- 大型团队协调
- 非技术团队成员参与

### 🧪 TDD模式 - Test-Driven Development

```bash
cpdd init --mode=tdd
```

**包含功能:**
- ✅ TDD开发命令 (5个TDD命令)
- ✅ 智能测试生成工具
- ✅ Red-Green-Refactor循环
- ✅ 代码质量保证
- ❌ 项目管理功能

**适用场景:**
- 专注代码质量
- 个人开发项目
- 技术导向团队
- 重构现有代码

### 🌐 在线/离线安装模式

#### 在线模式（推荐）
```bash
cpdd init --online
```
- 从GitHub获取最新CCPM
- 自动集成TDD增强功能
- 始终保持最新特性
- 完整的39个PM命令

#### 离线模式
```bash
cpdd init --offline
```
- 使用内置模板
- 无需网络连接
- 快速安装
- 基础功能完整

#### 智能模式（默认）
```bash
cpdd init
```
- 自动检测网络状态
- 在线失败时自动降级到离线
- 最佳用户体验

---

## Part 3: 完整命令参考

### 📋 项目管理命令 (39个)

#### PRD管理命令 (5个)

| 命令 | 描述 | 使用示例 |
|------|------|----------|
| `/pm:prd-new <名称>` | 创建新PRD | `/pm:prd-new user-authentication` |
| `/pm:prd-list` | 列出所有PRD | `/pm:prd-list` |
| `/pm:prd-edit <名称>` | 编辑PRD | `/pm:prd-edit user-authentication` |
| `/pm:prd-parse <名称>` | 解析PRD生成Epic | `/pm:prd-parse user-authentication` |
| `/pm:prd-status <名称>` | 查看PRD状态 | `/pm:prd-status user-authentication` |

**使用流程:**
```bash
# 1. 创建需求文档
/pm:prd-new payment-system

# 2. 编辑完善需求
/pm:prd-edit payment-system

# 3. 解析生成Epic和任务
/pm:prd-parse payment-system

# 4. 查看状态
/pm:prd-status payment-system
```

#### Epic管理命令 (12个)

| 命令 | 描述 | 使用示例 |
|------|------|----------|
| `/pm:epic-list` | 列出所有Epic | `/pm:epic-list` |
| `/pm:epic-show <名称>` | 显示Epic详情 | `/pm:epic-show payment-v2` |
| `/pm:epic-edit <名称>` | 编辑Epic | `/pm:epic-edit payment-v2` |
| `/pm:epic-start <名称>` | 启动Epic开发 | `/pm:epic-start payment-v2` |
| `/pm:epic-start-worktree <名称>` | 并行Epic开发 | `/pm:epic-start-worktree payment-v2` |
| `/pm:epic-status <名称>` | Epic状态查看 | `/pm:epic-status payment-v2` |
| `/pm:epic-sync <名称>` | 同步到GitHub | `/pm:epic-sync payment-v2` |
| `/pm:epic-decompose <名称>` | 任务分解 | `/pm:epic-decompose payment-v2` |
| `/pm:epic-refresh <名称>` | 刷新Epic | `/pm:epic-refresh payment-v2` |
| `/pm:epic-merge <名称>` | 合并Epic分支 | `/pm:epic-merge payment-v2` |
| `/pm:epic-close <名称>` | 关闭Epic | `/pm:epic-close payment-v2` |
| `/pm:epic-oneshot <名称>` | 一键完成Epic | `/pm:epic-oneshot payment-v2` |

**Epic生命周期:**
```bash
# 1. 从PRD创建Epic
/pm:prd-parse payment-system

# 2. 查看生成的Epic
/pm:epic-show payment-system

# 3. 同步到GitHub
/pm:epic-sync payment-system

# 4. 启动并行开发
/pm:epic-start-worktree payment-system

# 5. 监控进度
/pm:epic-status payment-system

# 6. 合并完成
/pm:epic-merge payment-system
```

#### Issue管理命令 (8个)

| 命令 | 描述 | 使用示例 |
|------|------|----------|
| `/pm:issue-start <编号>` | 开始Issue开发 | `/pm:issue-start 123` |
| `/pm:issue-show <编号>` | 显示Issue详情 | `/pm:issue-show 123` |
| `/pm:issue-edit <编号>` | 编辑Issue | `/pm:issue-edit 123` |
| `/pm:issue-analyze <编号>` | 分析Issue | `/pm:issue-analyze 123` |
| `/pm:issue-status <编号>` | Issue状态查看 | `/pm:issue-status 123` |
| `/pm:issue-sync <编号>` | 同步Issue状态 | `/pm:issue-sync 123` |
| `/pm:issue-close <编号>` | 关闭Issue | `/pm:issue-close 123` |
| `/pm:issue-reopen <编号>` | 重新打开Issue | `/pm:issue-reopen 123` |

**Issue开发流程:**
```bash
# 1. 从Epic选择任务
/pm:next

# 2. 开始特定Issue
/pm:issue-start 123

# 3. 分析任务复杂度
/pm:issue-analyze 123

# 4. TDD开发
/tdd:spec-to-test
/tdd:cycle

# 5. 完成任务
/pm:issue-close 123
```

#### 工作流命令 (14个)

| 命令 | 描述 | 使用示例 |
|------|------|----------|
| `/pm:status` | 项目整体状态 | `/pm:status` |
| `/pm:next` | 推荐下一个任务 | `/pm:next` |
| `/pm:sync` | 同步所有数据 | `/pm:sync` |
| `/pm:validate` | 验证项目完整性 | `/pm:validate` |
| `/pm:search <关键词>` | 搜索项目内容 | `/pm:search "用户认证"` |
| `/pm:standup` | 生成站会报告 | `/pm:standup` |
| `/pm:in-progress` | 进行中的任务 | `/pm:in-progress` |
| `/pm:blocked` | 被阻塞的任务 | `/pm:blocked` |
| `/pm:clean` | 清理无效数据 | `/pm:clean` |
| `/pm:import <文件>` | 导入外部数据 | `/pm:import tasks.json` |
| `/pm:init` | 初始化项目结构 | `/pm:init` |
| `/pm:help` | 显示帮助信息 | `/pm:help` |
| `/pm:test-reference-update` | 更新测试引用 | `/pm:test-reference-update` |

### 🧪 TDD开发命令 (5个)

| 命令 | 描述 | 使用场景 |
|------|------|----------|
| `/tdd:cycle` | 完整TDD循环 | 新功能开发 |
| `/tdd:red` | 红灯阶段 | 编写失败测试 |
| `/tdd:green` | 绿灯阶段 | 最小实现 |
| `/tdd:refactor` | 重构阶段 | 质量提升 |
| `/tdd:spec-to-test` | 需求转测试 | 从规格开始 |

**TDD工作流程:**
```bash
# 完整循环
/tdd:cycle

# 或分步执行
/tdd:red      # 1. 编写失败测试
/tdd:green    # 2. 最小实现
/tdd:refactor # 3. 重构优化

# 从需求开始
/tdd:spec-to-test  # 将需求转换为测试用例
```

---

## Part 4: 工作流程模式

### 🎯 完整功能开发流程 (PDD模式)

#### 阶段1: 需求定义
```bash
# 1. 创建PRD
/pm:prd-new user-dashboard

# 2. 完善需求文档
# （在Claude Code中通过交互式会话完成）

# 3. 验证PRD
/pm:prd-status user-dashboard
```

#### 阶段2: Epic规划
```bash
# 1. 解析PRD生成Epic
/pm:prd-parse user-dashboard

# 2. 查看生成的Epic结构
/pm:epic-show user-dashboard

# 3. 同步到GitHub
/pm:epic-sync user-dashboard

# 4. 验证任务分解
/pm:validate
```

#### 阶段3: 并行开发
```bash
# 1. 启动并行开发
/pm:epic-start-worktree user-dashboard

# 2. 监控开发进度
/pm:epic-status user-dashboard

# 3. 查看团队状态
/pm:standup
```

#### 阶段4: 任务执行
```bash
# 1. 获取下一个任务
/pm:next

# 2. 开始具体任务
/pm:issue-start 234

# 3. TDD开发
/tdd:spec-to-test
/tdd:cycle

# 4. 完成任务
/pm:issue-close 234
```

#### 阶段5: Epic完成
```bash
# 1. 检查Epic状态
/pm:epic-status user-dashboard

# 2. 合并代码
/pm:epic-merge user-dashboard

# 3. 关闭Epic
/pm:epic-close user-dashboard
```

### 🐛 Bug修复流程

```bash
# 1. 创建Issue（通过GitHub或手动）
/pm:issue-start 456

# 2. 分析问题
/pm:issue-analyze 456

# 3. 编写重现测试
/tdd:red

# 4. 修复Bug
/tdd:green

# 5. 重构优化
/tdd:refactor

# 6. 关闭Issue
/pm:issue-close 456
```

### 🔄 重构现有代码流程

```bash
# 1. 创建重构PRD
/pm:prd-new code-refactor-auth

# 2. 分解为任务
/pm:prd-parse code-refactor-auth

# 3. 开始重构任务
/pm:issue-start 789

# 4. 编写保护性测试
/tdd:spec-to-test

# 5. 重构循环
/tdd:refactor

# 6. 验证完成
/pm:issue-close 789
```

### 👥 团队协作流程

#### 项目经理视角
```bash
# 每日站会准备
/pm:standup

# 检查整体进度
/pm:status

# 处理阻塞问题
/pm:blocked

# 同步GitHub状态
/pm:sync
```

#### 开发者视角
```bash
# 获取任务
/pm:next

# 开始开发
/pm:issue-start 123
/tdd:cycle

# 提交进度
/pm:issue-status 123

# 完成任务
/pm:issue-close 123
```

---

## Part 5: 高级功能

### 🌳 Git Worktree 并行开发

#### 什么是Git Worktree？
Git Worktree允许在同一个仓库中创建多个工作目录，支持真正的并行开发。

#### Worktree操作命令
```bash
# 创建Worktree
git worktree add ../epic-payment -b epic/payment

# 列出所有Worktree
git worktree list

# 删除Worktree
git worktree remove ../epic-payment
```

#### 并行开发流程
```bash
# 1. 启动Epic并行开发
/pm:epic-start-worktree payment-system

# 系统自动：
# - 创建 ../epic-payment-system worktree
# - 创建 epic/payment-system 分支
# - 分析任务依赖关系
# - 启动多个AI代理并行工作
```

#### 并行协调机制
```
Epic: payment-system
├── Issue #101: Database Schema
│   ├── Stream A: User table → Agent-1
│   └── Stream B: Payment table → Agent-2
├── Issue #102: API Endpoints  
│   ├── Stream A: User API → Agent-3 (等待 #101-A)
│   └── Stream B: Payment API → Agent-4 (等待 #101-B)
└── Issue #103: Frontend
    └── Stream A: UI Components → Agent-5 (等待 #102)
```

#### 冲突解决策略
```bash
# 文件级别隔离
Agent-1: src/models/user.js
Agent-2: src/models/payment.js
Agent-3: src/api/user.js
Agent-4: src/api/payment.js

# 如果冲突发生
# 1. 暂停相关代理
# 2. 人工解决冲突
# 3. 恢复执行
```

### 🤖 多代理协调系统

#### 代理类型和职责

1. **TDD架构师** (`tdd-architect.md`)
   - 设计测试策略
   - 制定TDD计划
   - 质量把关

2. **测试生成专家** (`test-generator.md`)
   - 生成测试用例
   - 覆盖率分析
   - 测试数据准备

3. **并行协调器** (`parallel-worker.md`)
   - 管理多代理执行
   - 依赖关系处理
   - 冲突协调

4. **产品经理代理** (`product-manager.md`)
   - 需求分析
   - 任务优先级
   - 项目协调

#### 代理启动示例
```bash
# 自动启动（通过epic-start-worktree）
/pm:epic-start-worktree user-auth

# 手动启动特定代理
# 通过Task工具在命令中指定subagent_type
```

### 🔗 GitHub集成

#### 自动同步功能
```bash
# Epic同步到GitHub Project
/pm:epic-sync user-auth

# 自动创建：
# - GitHub Issues (每个任务一个)
# - Project Board
# - Milestones
# - Labels (epic:user-auth, status:pending等)
```

#### Issue状态同步
```
Claude Code状态 → GitHub状态
pending         → open
in-progress     → open + in-progress label
blocked         → open + blocked label  
completed       → closed
```

#### 提交消息集成
```bash
# 代理自动生成提交消息格式
git commit -m "Issue #123: Add user authentication schema

- Created User model with validation
- Added password hashing middleware
- Implemented JWT token generation
- Test coverage: 95%

Co-authored-by: Claude <noreply@anthropic.com>"
```

### 📊 项目监控和报告

#### 实时状态监控
```bash
# 整体项目状态
/pm:status

# 显示：
# - Epic进度 (3/5 completed)
# - Issue分布 (12 open, 8 in-progress, 25 closed)
# - 测试覆盖率 (87%)
# - 代理活动状态
```

#### 团队协作报告
```bash
# 生成站会报告
/pm:standup

# 输出：
# 昨天完成：
# - Issue #123: 用户认证API (Agent-1)
# - Issue #124: 数据库迁移 (Agent-2)
# 
# 今天计划：
# - Issue #125: 用户界面 (Agent-3)
# - Issue #126: 集成测试 (Agent-1)
#
# 阻塞问题：
# - Issue #127: 等待第三方API文档
```

---

## Part 6: 故障排除和FAQ

### 🔧 常见问题解决

#### 安装问题

**Q: 安装失败，提示网络错误**
```bash
# 解决方案：使用离线模式
cpdd init --offline --force

# 或检查网络后重试
cpdd init --online --force
```

**Q: 权限错误**
```bash
# Linux/Mac: 使用sudo
sudo npm install -g claude-pdd-cli

# Windows: 以管理员身份运行
# 或配置npm全局路径
```

#### 项目初始化问题

**Q: `.claude` 目录已存在**
```bash
# 强制覆盖
cpdd init --force

# 或手动清理
rm -rf .claude
cpdd init
```

**Q: GitHub集成失败**
```bash
# 重新配置GitHub集成
cpdd init --github=owner/repo --force

# 检查GitHub token配置
# 确保在Claude Code设置中配置了正确的token
```

#### 命令执行问题

**Q: `/pm:prd-new` 命令无效**
```bash
# 确认是在Claude Code中执行，不是终端
# 确认已经运行过 cpdd init
# 检查 .claude/commands/pm/ 目录是否存在
```

**Q: Epic创建失败**
```bash
# 检查PRD是否存在
ls -la .claude/prds/

# 验证PRD格式
/pm:prd-status <prd-name>

# 重新解析PRD
/pm:prd-parse <prd-name>
```

#### Git Worktree问题

**Q: Worktree创建失败**
```bash
# 检查现有worktree
git worktree list

# 清理无效worktree
git worktree prune

# 确保主分支干净
git checkout main
git pull origin main
```

**Q: 代理冲突**
```bash
# 查看冲突状态
cd ../epic-<name>
git status

# 停止所有代理
/pm:epic-stop <epic-name>

# 手动解决冲突后重启
/pm:epic-start-worktree <epic-name>
```

### 📋 最佳实践

#### 1. 项目启动最佳实践
```bash
# 推荐的完整启动流程
cd my-project
cpdd init --mode=pdd --online --github=owner/repo
cpdd status
/pm:init  # 如果需要额外配置
```

#### 2. 团队协作最佳实践
- **每日同步**: 使用 `/pm:sync` 保持状态同步
- **清晰命名**: PRD和Epic使用描述性名称
- **依赖管理**: 明确标识任务间依赖关系
- **定期清理**: 使用 `/pm:clean` 清理无效数据

#### 3. 代码质量最佳实践
- **测试先行**: 总是使用 `/tdd:spec-to-test` 开始
- **小步迭代**: 使用 `/tdd:cycle` 进行小步改进
- **持续重构**: 定期运行 `/tdd:refactor`
- **覆盖率监控**: 关注测试覆盖率报告

#### 4. 项目管理最佳实践
- **需求追溯**: 每个Issue都应能追溯到PRD
- **状态更新**: 及时更新Issue状态
- **文档维护**: 保持PRD和Epic文档的更新
- **定期审查**: 使用 `/pm:validate` 验证项目完整性

### 📞 获取帮助

#### 命令行帮助
```bash
cpdd --help
cpdd init --help
cpdd status --help
```

#### 项目内帮助
```bash
# 在Claude Code中
/pm:help
```

#### 在线资源
- **GitHub Issues**: [问题反馈](https://github.com/MuziGeek/claude-pdd-cli/issues)
- **项目文档**: [README](https://github.com/MuziGeek/claude-pdd-cli#readme)
- **使用指南**: [USAGE.md](docs/USAGE.md)

#### 诊断信息收集
```bash
# 收集诊断信息
cpdd status --verbose
cat .claude/config.json
git worktree list
ls -la .claude/commands/
```

### 🎯 性能优化建议

#### 1. 大型项目优化
- 使用 `--quick` 参数快速安装
- 定期使用 `/pm:clean` 清理
- 合理控制并行代理数量（建议不超过5个）

#### 2. 网络优化
- 优先使用 `--online` 获取最新功能
- 网络不稳定时使用 `--offline` 备选
- 配置GitHub token以避免API限制

#### 3. 存储优化
- 定期清理无效的Epic和PRD
- 使用 `.gitignore` 排除临时文件
- 合理管理worktree数量

---

## 🎉 结语

Claude PDD CLI 是一个强大的项目驱动开发平台，集成了先进的项目管理、测试驱动开发和团队协作功能。通过本指南，你应该能够：

✅ 理解所有三种安装模式的特点和适用场景  
✅ 掌握39个项目管理命令的使用方法  
✅ 熟练运用5个TDD命令进行开发  
✅ 利用Git Worktree进行高效并行开发  
✅ 配置和使用GitHub集成功能  
✅ 解决常见问题和优化性能  

**立即开始你的高效开发之旅：**

```bash
npm install -g claude-pdd-cli
cpdd init --mode=pdd --online
/pm:prd-new my-awesome-feature
```

体验从需求到测试、从开发到部署的完整自动化工作流程！🚀

---

*本文档持续更新中，如有问题或建议，欢迎提交Issue或PR。*