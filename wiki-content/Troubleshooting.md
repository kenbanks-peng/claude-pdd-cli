# 🔧 故障排除

本文档收集了 Claude TDD CLI 使用过程中的常见问题和解决方案。

## 🚨 常见问题

### 1. 安装和配置问题

#### 问题：`command not found: claude-tdd`
**症状**：执行 `claude-tdd` 命令时提示命令未找到

**解决方案**：
```bash
# 1. 确认是否已全局安装
npm list -g claude-tdd-cli

# 2. 如果未安装，全局安装
npm install -g claude-tdd-cli

# 3. 如果已安装但仍无法找到，检查 PATH
echo $PATH
npm config get prefix

# 4. 重新加载 shell 配置
source ~/.bashrc  # 或 ~/.zshrc

# 5. 验证安装
claude-tdd --version
```

#### 问题：权限错误 `EACCES: permission denied`
**症状**：全局安装时出现权限错误

**解决方案**：
```bash
# 方案 1：使用 npx（推荐）
npx claude-tdd-cli init

# 方案 2：配置 npm 全局安装目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 方案 3：使用 nvm 管理 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

#### 问题：Windows 路径问题
**症状**：在 Windows 下路径相关操作失败

**解决方案**：
```bash
# 使用 PowerShell 而不是 CMD
# 或者在 WSL 中运行
wsl
claude-tdd init

# 路径使用反斜杠或双反斜杠
claude-tdd init "C:\\Users\\Username\\project"
```

### 2. 框架检测问题

#### 问题：无法检测到框架
**症状**：`claude-tdd init` 提示"未检测到支持的框架"

**诊断步骤**：
```bash
# 1. 查看当前目录内容
ls -la

# 2. 运行诊断命令
claude-tdd doctor --verbose

# 3. 手动指定框架
claude-tdd init --framework nodejs
```

**解决方案**：

1. **Node.js 项目**：确保有 `package.json`
   ```bash
   npm init -y
   claude-tdd init
   ```

2. **Python 项目**：确保有项目配置文件
   ```bash
   touch setup.py pyproject.toml
   claude-tdd init --framework python
   ```

3. **Java 项目**：确保有 `pom.xml` 或 `build.gradle`
   ```bash
   touch pom.xml
   claude-tdd init --framework java
   ```

#### 问题：检测到错误的框架
**症状**：CLI 检测到的框架与实际不符

**解决方案**：
```bash
# 强制指定正确的框架
claude-tdd init --framework python --force

# 清理冲突的配置文件
rm package.json  # 如果这是一个 Python 项目
claude-tdd init
```

### 3. Claude Code 集成问题

#### 问题：找不到 Claude Code
**症状**：`claude-tdd doctor` 报告 Claude Code 未安装

**解决方案**：
```bash
# 1. 确认 Claude Code 安装位置
which code  # 或者 where code (Windows)

# 2. 检查 Claude Code 扩展
code --list-extensions | grep claude

# 3. 如果未安装，从官网下载
# https://claude.ai/code

# 4. 验证安装
claude-tdd doctor --check-claude
```

#### 问题：Claude Code 版本不兼容
**症状**：CLI 提示 Claude Code 版本过低

**解决方案**：
```bash
# 更新 Claude Code
code --update

# 或者下载最新版本
# https://claude.ai/code

# 验证版本
claude-tdd doctor
```

### 4. 模板和配置问题

#### 问题：模板文件缺失
**症状**：初始化过程中提示找不到模板文件

**解决方案**：
```bash
# 1. 重新安装 CLI
npm uninstall -g claude-tdd-cli
npm install -g claude-tdd-cli

# 2. 验证安装
npm list -g claude-tdd-cli

# 3. 检查模板目录
npm root -g
# 查看 claude-tdd-cli/dist/templates 目录

# 4. 如果问题持续，使用本地安装
git clone https://github.com/MuziGeek/claude-tdd-cli.git
cd claude-tdd-cli
npm install
npm run build
npm link
```

#### 问题：配置文件覆盖警告
**症状**：提示配置文件已存在，询问是否覆盖

**解决方案**：
```bash
# 备份现有配置
cp -r .claude .claude.backup

# 强制覆盖
claude-tdd init --force

# 或者跳过冲突文件
claude-tdd init --skip-existing

# 查看配置差异
diff -r .claude .claude.backup
```

### 5. Git 相关问题

#### 问题：Git 仓库未初始化
**症状**：CLI 提示项目不是 Git 仓库

**解决方案**：
```bash
# 初始化 Git 仓库
git init

# 添加远程仓库（可选）
git remote add origin https://github.com/username/repo.git

# 重新运行初始化
claude-tdd init
```

#### 问题：Git hooks 权限错误
**症状**：Git hooks 无法执行，提示权限被拒绝

**解决方案**：
```bash
# 修复 hooks 权限
chmod +x .claude/hooks/*.sh

# 或者重新安装 hooks
claude-tdd init --reinstall-hooks

# 验证 hooks
ls -la .claude/hooks/
```

## 🔍 诊断工具

### 基本诊断命令

```bash
# 完整诊断报告
claude-tdd doctor

# 详细诊断信息
claude-tdd doctor --verbose

# 仅检查特定组件
claude-tdd doctor --check-claude
claude-tdd doctor --check-project
claude-tdd doctor --check-git
```

### 系统信息收集

当需要报告问题时，请收集以下信息：

```bash
# 1. 系统信息
uname -a                    # Linux/macOS
systeminfo                 # Windows

# 2. Node.js 版本
node --version
npm --version

# 3. CLI 版本
claude-tdd --version

# 4. 安装位置
npm list -g claude-tdd-cli
which claude-tdd

# 5. 项目信息
pwd
ls -la
git status

# 6. 详细诊断
claude-tdd doctor --verbose > diagnosis.txt
```

## 🐛 调试模式

### 启用调试输出

```bash
# 设置调试环境变量
export DEBUG=claude-tdd:*

# 运行命令查看详细日志
claude-tdd init

# 或者临时启用
DEBUG=claude-tdd:* claude-tdd init
```

### 日志级别

```bash
# 错误日志
export LOG_LEVEL=error

# 警告日志
export LOG_LEVEL=warn

# 信息日志
export LOG_LEVEL=info

# 调试日志
export LOG_LEVEL=debug
```

## 🔧 高级故障排除

### 网络相关问题

#### 问题：下载模板失败
**症状**：初始化时网络超时或连接失败

**解决方案**：
```bash
# 1. 检查网络连接
ping github.com

# 2. 配置代理（如果需要）
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy https://proxy.company.com:8080

# 3. 使用淘宝镜像
npm config set registry https://registry.npmmirror.com

# 4. 离线安装
# 下载项目源码并本地构建
```

### 性能问题

#### 问题：初始化过程很慢
**症状**：`claude-tdd init` 执行时间过长

**诊断**：
```bash
# 启用性能分析
time claude-tdd init

# 检查系统资源
top    # Linux/macOS
tasklist    # Windows
```

**优化**：
```bash
# 1. 清理 npm 缓存
npm cache clean --force

# 2. 使用快速模式
claude-tdd init --quick

# 3. 跳过可选步骤
claude-tdd init --minimal
```

### 兼容性问题

#### 问题：Node.js 版本不兼容
**症状**：提示 Node.js 版本过低或过高

**解决方案**：
```bash
# 1. 检查当前版本
node --version

# 2. 使用 nvm 切换版本
nvm install 20
nvm use 20

# 3. 验证兼容性
claude-tdd doctor

# 支持的版本：18.x, 20.x, 22.x
```

## 📞 获取帮助

### 自助资源

1. **文档**：查看完整的 [项目文档](Home)
2. **示例**：参考 [示例项目](https://github.com/MuziGeek/claude-tdd-cli/tree/main/examples)
3. **源码**：查看 [源代码](https://github.com/MuziGeek/claude-tdd-cli)

### 社区支持

1. **GitHub Issues**：[报告问题](https://github.com/MuziGeek/claude-tdd-cli/issues)
   - 使用问题模板
   - 提供详细的复现步骤
   - 包含诊断信息

2. **GitHub Discussions**：[参与讨论](https://github.com/MuziGeek/claude-tdd-cli/discussions)
   - 功能建议
   - 使用问题讨论
   - 分享经验

3. **邮件支持**：mz@easymuzi.cn
   - 紧急问题
   - 企业支持

### 报告问题模板

```markdown
## 问题描述
简要描述遇到的问题

## 复现步骤
1. 执行 `command`
2. 看到错误 `error message`
3. ...

## 期望行为
描述期望的正确行为

## 环境信息
- 操作系统：[Windows 10 / macOS 12 / Ubuntu 20.04]
- Node.js 版本：[例如 20.9.0]
- CLI 版本：[例如 0.2.5]
- 项目框架：[例如 Node.js / Python]

## 诊断信息
```bash
claude-tdd doctor --verbose
```

## 其他信息
任何其他相关信息
```

## 🎯 常见解决方案总结

| 问题类型 | 快速解决 | 详细解决方案 |
|---------|---------|-------------|
| 命令未找到 | `npm install -g claude-tdd-cli` | [安装问题](#问题command-not-found-claude-tdd) |
| 权限错误 | `npx claude-tdd-cli init` | [权限问题](#问题权限错误-eacces-permission-denied) |
| 框架检测失败 | `claude-tdd init --framework xxx` | [框架检测](#问题无法检测到框架) |
| 配置冲突 | `claude-tdd init --force` | [配置问题](#问题配置文件覆盖警告) |
| 网络问题 | 配置镜像或代理 | [网络问题](#问题下载模板失败) |

---

**如果问题仍未解决**，请通过 [GitHub Issues](https://github.com/MuziGeek/claude-tdd-cli/issues) 联系我们，我们会尽快提供帮助！

**文档最后更新**：2025-09-08