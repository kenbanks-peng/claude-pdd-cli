# Claude TDD CLI 使用指南

## 🚀 快速上手

### 安装
```bash
npm install -g claude-tdd-cli
```

### 初始化新项目
```bash
# 进入你的项目目录
cd my-project

# 智能初始化（推荐）
claude-tdd init

# 快速初始化
claude-tdd init --quick --framework nodejs
```

## 📋 完整命令列表

### 核心命令

| 命令 | 描述 | 示例 |
|------|------|------|
| `claude-tdd init` | 初始化TDD工作流 | `claude-tdd init --quick` |
| `claude-tdd doctor` | 环境诊断 | `claude-tdd doctor --verbose` |
| `claude-tdd status` | 工作流状态 | `claude-tdd status --json` |
| `claude-tdd config` | 配置管理 | `claude-tdd config show` |
| `claude-tdd update` | 更新模板 | `claude-tdd update --check` |
| `claude-tdd switch-framework` | 切换项目框架 | `claude-tdd switch-framework python` |
| `claude-tdd migrate` | 高级框架迁移 | `claude-tdd migrate --from java --to rust` |

### 命令详细选项

#### Init 命令选项
```bash
claude-tdd init [options]

Options:
  -f, --framework <type>   指定框架 (nodejs/java/python/go/rust)
  -q, --quick             快速设置，使用默认配置
  --force                 强制覆盖现有配置
  --template <type>       使用特定模板 (full/minimal/custom)
```

#### Switch-Framework 命令选项
```bash
claude-tdd switch-framework [framework] [options]

Arguments:
  framework               目标框架 (nodejs/java/python/go/rust)

Options:
  --yes                   跳过确认提示
  --skip-backup          跳过配置备份
```

#### Migrate 命令选项
```bash
claude-tdd migrate [options]

Options:
  --from <type>          源框架类型
  --to <type>            目标框架类型
  --interactive          交互式迁移指导
```

#### Config 命令选项
```bash
claude-tdd config <action> [key] [value] [options]

Actions:
  show                    显示当前配置
  set <key> <value>       设置配置项
  list                    列出可用模板

Options:
  --apply                立即应用配置更改
```

### 使用场景示例

#### 1. Node.js项目
```bash
# 检测环境
claude-tdd doctor

# 快速初始化
claude-tdd init --quick --framework nodejs

# 查看状态
claude-tdd status
```

#### 2. Java项目
```bash
# 完整初始化向导
claude-tdd init --framework java

# 检查生成的配置
claude-tdd config show
```

#### 3. 现有项目添加TDD
```bash
# 诊断现有项目
claude-tdd doctor --verbose

# 强制初始化（覆盖现有配置）
claude-tdd init --force --template full
```

#### 4. 框架切换场景
```bash
# 从Node.js切换到Python
claude-tdd switch-framework python

# 快速切换到Java（跳过确认）
claude-tdd switch-framework java --yes

# 从Go迁移到Rust（高级迁移）
claude-tdd migrate --from go --to rust --interactive

# 检查切换后的配置
claude-tdd config show
claude-tdd status
```

## 🎯 生成的项目结构

运行 `claude-tdd init` 后，会在你的项目中创建：

```
your-project/
├── .claude/                    # TDD工作流配置
│   ├── settings.json          # 核心设置
│   ├── tdd-state.json        # TDD状态跟踪
│   ├── agents/               # 10个专业化AI agents
│   │   ├── tdd-architect.md      # TDD架构师
│   │   ├── test-case-generator.md # 测试用例生成器
│   │   ├── product-manager.md    # 产品经理
│   │   └── ... (7个更多agents)
│   ├── commands/             # TDD和PM命令
│   │   ├── tdd/             # RED, GREEN, REFACTOR命令
│   │   └── pm/              # 项目管理命令
│   ├── hooks/               # 质量控制hooks
│   │   ├── tdd-guard.sh        # 阶段权限控制
│   │   ├── test-runner.sh      # 自动测试运行
│   │   └── commit-validator.sh # 提交验证
│   ├── framework-configs/    # 框架特定配置
│   └── rules/               # TDD工作流规则
└── .gitignore               # 更新的Git忽略规则
```

## 🧠 专业化Agents

CLI会根据你选择的模板创建对应的agents：

### Full模板（推荐）
包含全部10个agents：
- **🏗️ TDD架构师**: 测试设计和代码架构
- **🧪 测试用例生成器**: 具体测试用例创建
- **📊 测试策略师**: 测试策略和框架选择
- **📋 产品经理**: PRD编写和需求分析
- **🎯 PRD分析师**: 技术需求分析
- **✂️ 任务分解器**: 智能任务分解
- **🛡️ 安全审计师**: 安全评估和漏洞检测
- **⚡ 性能分析师**: 性能优化分析
- **👁️ 代码审查师**: 代码质量审查
- **🔄 并行工作器**: 多任务协调

### Minimal模板
包含核心agents：
- TDD架构师
- 测试用例生成器
- 产品经理

## 🔧 配置管理

### 查看配置
```bash
claude-tdd config show
```

### 设置配置
```bash
# 设置默认框架
claude-tdd config set default.framework nodejs

# 设置项目框架（立即应用）
claude-tdd config set project.framework python --apply

# 启用GitHub集成
claude-tdd config set github.integration true

# 设置并行工作数量
claude-tdd config set parallel.maxWorkers 3
```

### 列出可用模板
```bash
claude-tdd config list
```

## 🛠️ 支持的框架

| 语言 | 框架检测 | 测试框架 | 构建工具 |
|------|----------|----------|----------|
| Node.js | package.json | Jest, Mocha | npm, yarn, pnpm |
| Java | pom.xml, build.gradle | JUnit, TestNG | Maven, Gradle |
| Python | setup.py, pyproject.toml | pytest, unittest | pip, poetry |
| Go | go.mod | testing | go mod |
| Rust | Cargo.toml | built-in | Cargo |

## 🩺 故障排除

### 常见问题

**1. "Claude Code not found"**
```bash
# 检查Claude Code安装
claude-tdd doctor --check-claude

# 安装Claude Code: https://claude.ai/code
```

**2. TDD工作流未配置**
```bash
# 运行初始化
claude-tdd init

# 或强制重新初始化
claude-tdd init --force
```

**3. 权限错误**
```bash
# 修复hooks权限
chmod +x .claude/hooks/*.sh
```

### 调试命令
```bash
# 详细诊断
claude-tdd doctor --verbose

# JSON格式状态（便于脚本处理）
claude-tdd status --json

# 检查可用更新
claude-tdd update --check
```

## 📈 最佳实践

### 1. 项目初始化流程
```bash
# 1. 进入项目目录
cd your-project

# 2. 诊断环境
claude-tdd doctor

# 3. 初始化TDD工作流
claude-tdd init

# 4. 验证配置
claude-tdd status
```

### 2. 团队使用建议
- 使用 `claude-tdd init --quick` 快速统一配置
- 定期运行 `claude-tdd update` 保持模板最新
- 使用 `claude-tdd doctor` 诊断环境问题

### 3. 框架切换最佳实践
- 在切换前运行 `claude-tdd doctor` 确保环境健康
- 使用默认配置备份（不使用 `--skip-backup`）
- 切换后运行 `claude-tdd status` 验证配置
- 对于复杂项目，优先使用 `migrate` 而非 `switch-framework`
- 切换后重新配置项目特定的测试和构建命令

### 4. CI/CD集成
```bash
# 在CI脚本中检查TDD配置
claude-tdd status --json | jq '.configured' 

# 自动更新模板
claude-tdd update --force

# 自动验证框架配置
claude-tdd config show | jq '.project.framework'
```

## 🚀 下一步

初始化完成后：

1. 运行 `/tdd:status` 检查工作流状态
2. 使用 `/pm:prd-new` 创建第一个任务
3. 开始TDD开发循环：`/tdd:red` → `/tdd:green` → `/tdd:refactor`

## 💡 提示

- 使用 `claude-tdd --help` 获取命令帮助
- 对于特定命令帮助：`claude-tdd init --help`
- 支持短命令别名：`ctdd` = `claude-tdd`