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
├── .claude/                     # TDD工作流配置
│   ├── project-config.json     # 主项目配置
│   ├── tdd-state.json          # TDD状态跟踪
│   ├── example.tasks.json      # 任务示例结构
│   ├── agents/                 # 10个专业化AI agents
│   │   ├── tdd-architect.md        # TDD架构师
│   │   ├── test-case-generator.md  # 测试用例生成器
│   │   ├── test-strategist.md      # 测试策略师
│   │   ├── product-manager.md      # 产品经理
│   │   ├── prd-analyzer.md         # PRD分析师
│   │   ├── task-decomposer.md      # 任务分解器
│   │   ├── security-auditor.md     # 安全审计师
│   │   ├── performance-analyzer.md # 性能分析师
│   │   ├── code-reviewer.md        # 代码审查师
│   │   └── parallel-worker.md      # 并行工作器
│   ├── commands/               # TDD和PM命令
│   │   ├── tdd/               # RED, GREEN, REFACTOR命令
│   │   │   ├── red.md             # 编写失败测试
│   │   │   ├── green.md           # 实现最小代码
│   │   │   ├── refactor.md        # 重构改进
│   │   │   └── status.md          # TDD状态查询
│   │   ├── pm/                # 项目管理命令
│   │   │   ├── prd-new.md         # 创建新需求
│   │   │   ├── task-next.md       # 下一个任务
│   │   │   ├── milestone.md       # 里程碑管理
│   │   │   └── sync-github.md     # GitHub同步
│   │   └── commit.md          # 智能提交命令
│   ├── hooks/                 # 质量控制hooks
│   │   ├── tdd-guard.sh          # 阶段权限控制
│   │   ├── test-runner.sh        # 自动测试运行
│   │   └── commit-validator.sh   # 提交验证
│   ├── scripts/               # Shell脚本自动化
│   │   ├── tdd/              # TDD管理脚本
│   │   │   ├── state-manager.sh     # TDD状态管理
│   │   │   ├── init.sh             # TDD环境初始化
│   │   │   └── project-detector.sh # 项目类型检测
│   │   └── pm/               # 项目管理脚本
│   │       ├── next-task.sh        # 智能任务推荐
│   │       ├── sync-to-github.sh   # GitHub Issues同步
│   │       └── validate-task-decomposition.sh # 任务质量检查
│   ├── bin/                   # 工具程序
│   │   └── json-tool.js          # JSON操作工具
│   ├── framework-configs/      # 框架特定配置
│   ├── rules/                 # TDD工作流规则
│   └── schemas/               # JSON验证模式
└── .gitignore                 # 更新的Git忽略规则
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

### 常见问题及解决方案

#### 环境配置问题

**1. "Claude Code not found"**
```bash
# 详细检查Claude Code安装状态
claude-tdd doctor --check-claude

# 解决方案：
# - 访问 https://claude.ai/code 下载安装
# - 确保Claude Code在系统PATH中
# - 重启终端后再次尝试
```

**2. "Node.js version not supported"**
```bash
# 检查Node.js版本（需要>=14.0.0）
node --version

# 解决方案：
# - 升级Node.js: https://nodejs.org/
# - 使用nvm管理版本: nvm install 18
```

**3. TDD工作流未正确配置**
```bash
# 检查配置完整性
claude-tdd status

# 解决方案：
claude-tdd init --force  # 强制重新初始化
claude-tdd config show   # 检查配置是否正确
```

#### 权限和文件问题

**4. 权限错误（Linux/macOS）**
```bash
# 问题：hooks脚本没有执行权限
# 解决方案：
chmod +x .claude/hooks/*.sh
chmod +x .claude/scripts/**/*.sh

# 检查权限是否正确
ls -la .claude/hooks/
```

**5. 配置文件损坏**
```bash
# 症状：JSON解析错误或格式错误
# 解决方案：
claude-tdd doctor --verbose  # 找出具体问题
claude-tdd init --force      # 重新生成配置

# 或手动修复：
# 检查 .claude/*.json 文件的JSON格式
```

**6. 模板文件缺失**
```bash
# 症状：初始化后某些文件或目录缺失
# 解决方案：
claude-tdd update --force    # 更新到最新模板
claude-tdd init --template full --force  # 重新完整初始化
```

#### 框架特定问题

**7. 测试框架未检测到**
```bash
# 症状：claude-tdd doctor显示"No testing framework detected"
# Node.js解决方案：
npm install --save-dev jest  # 或其他测试框架

# Java解决方案：
# 确保pom.xml或build.gradle包含测试依赖

# Python解决方案：  
pip install pytest  # 或使用poetry/pipenv

# 重新检测：
claude-tdd doctor --verbose
```

**8. 框架切换失败**
```bash
# 症状：switch-framework命令报错
# 解决方案：
claude-tdd doctor             # 检查当前环境
claude-tdd config show        # 查看当前配置
claude-tdd switch-framework python --yes  # 强制切换

# 如果仍然失败：
claude-tdd migrate --from nodejs --to python --interactive
```

#### Claude Code集成问题

**9. 命令在Claude Code中不可用**
```bash
# 症状：输入/tdd等命令无响应
# 检查.claude/commands/目录结构：
ls -la .claude/commands/

# 解决方案：
claude-tdd init --force       # 重新生成命令文件
claude-tdd status            # 验证CLI工具正常工作
```

**10. Agent调用失败**
```bash
# 症状：@agent-name 无响应或报错
# 检查agents目录：
ls -la .claude/agents/

# 解决方案：
claude-tdd init --template full --force  # 重新生成所有agents
claude-tdd config set default.template full --apply
```

#### 性能问题

**11. 初始化速度慢**
```bash
# 可能原因：网络问题或磁盘IO慢
# 解决方案：
claude-tdd init --quick       # 使用快速模式
claude-tdd update --check     # 检查是否有更新
```

**12. Git操作失败**
```bash
# 症状：GitHub同步或Git hooks失败
# 解决方案：
git status                    # 检查仓库状态
chmod +x .claude/hooks/*.sh   # 修复hook权限
claude-tdd config set github.integration false  # 临时禁用GitHub集成
```

### 高级调试

#### 详细诊断信息
```bash
# 获取完整环境信息
claude-tdd doctor --verbose

# 导出诊断报告
claude-tdd status --json > debug-info.json

# 检查模板更新
claude-tdd update --check

# 验证配置文件
claude-tdd config show
```

#### 日志和调试
```bash
# 启用详细日志（如果支持）
export DEBUG=claude-tdd:*
claude-tdd init

# 检查系统环境
echo $PATH
which node
which git
which claude-code
```

#### 手动修复步骤
```bash
# 1. 备份现有配置
cp -r .claude .claude.backup

# 2. 清理并重新初始化
rm -rf .claude
claude-tdd init --template full

# 3. 验证配置
claude-tdd doctor
claude-tdd status

# 4. 测试命令
# 在Claude Code中测试: /tdd
```

### 获取帮助

#### 社区支持
- **GitHub Issues**: [提交问题](https://github.com/MuziGeek/claude-tdd-cli/issues)
- **文档**: [在线文档](https://github.com/MuziGeek/claude-tdd-cli#readme)

#### 诊断信息收集
提交问题时，请包含以下信息：
```bash
# 基本环境信息
claude-tdd doctor --verbose
node --version
npm --version
git --version

# 配置信息
claude-tdd config show
claude-tdd status --json

# 系统信息
uname -a  # Linux/macOS
# 或在Windows中: systeminfo
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

## 🎨 Claude Code 集成使用

初始化完成后，在 Claude Code 中使用专业化命令：

### TDD 核心工作流
```bash
# 查看当前TDD状态和下一步建议
/tdd

# 🔴 RED 阶段：编写失败测试
/red

# 🟢 GREEN 阶段：实现最小代码使测试通过
/green

# 🔵 REFACTOR 阶段：重构改进代码质量
/refactor
```

### 项目管理命令
```bash
# 创建新的产品需求文档
/prd

# 获取下一个应该工作的任务
/tasks --next

# 管理项目里程碑
/status --milestone

# 同步任务到GitHub Issues
/update --sync-github

# 智能提交代码
/commit
```

### 使用专业化Agent
每个agent都有特定用途，可以通过 `@agent-name` 调用：
```bash
# 调用TDD架构师设计测试结构
@tdd-architect 帮我设计用户认证模块的测试架构

# 使用测试用例生成器创建具体测试
@test-case-generator 为用户登录功能生成边界测试用例

# 产品经理协助需求分析
@product-manager 分析这个功能的用户故事和验收条件

# 安全审计师检查代码安全性
@security-auditor 审查这个API接口的安全实现

# 性能分析师优化代码性能
@performance-analyzer 分析这个查询函数的性能瓶颈
```

### 完整TDD工作流示例

#### 1. 项目启动阶段
```bash
# 步骤1：检查环境和配置
claude-tdd doctor

# 步骤2：查看TDD状态
/tdd

# 步骤3：创建产品需求
/prd
# 然后调用: @product-manager 帮我编写用户认证系统的PRD

# 步骤4：任务分解
@task-decomposer 将用户认证系统分解为可测试的小任务
```

#### 2. TDD开发循环
```bash
# 🔴 RED 阶段
/red
# 然后调用: @tdd-architect 设计用户注册功能的测试结构
# 再调用: @test-case-generator 生成用户注册的具体测试用例

# 🟢 GREEN 阶段  
/green
# 实现最小可工作代码，确保测试通过

# 🔵 REFACTOR 阶段
/refactor
# 然后调用: @code-reviewer 审查代码质量
# 再调用: @performance-analyzer 检查性能优化机会
```

#### 3. 质量保证阶段
```bash
# 安全审查
@security-auditor 审查整个认证流程的安全性

# 代码审查
@code-reviewer 进行最终代码质量检查

# 智能提交
/commit
# 自动生成详细的提交信息并提交代码
```

#### 4. 项目管理集成
```bash
# 更新任务状态
/tasks --next

# 同步到GitHub
/update --sync-github

# 里程碑管理
/status --milestone
```

### Agent协作模式

不同agent可以协同工作，形成完整的开发流程：

```bash
# 需求 → 设计 → 实现 → 测试 → 审查
@product-manager → @tdd-architect → @test-case-generator → @code-reviewer → @security-auditor

# 性能优化流程  
@performance-analyzer → @code-reviewer → /refactor

# 并行开发协调
@parallel-worker 协调多个开发任务的依赖关系
```

## 🚀 下一步

初始化完成后：

1. 运行 `/tdd` 检查工作流状态
2. 使用 `/prd` 创建第一个任务  
3. 开始TDD开发循环：`/red` → `/green` → `/refactor`
4. 利用专业化agents提高开发效率

## 💡 提示

- 使用 `claude-tdd --help` 获取命令帮助
- 对于特定命令帮助：`claude-tdd init --help`
- 支持短命令别名：`ctdd` = `claude-tdd`
- 在Claude Code中，输入 `/` 可看到所有可用命令
- 输入 `@` 可看到所有可用的专业化agents