# 📚 GitHub 分支管理与版本管理完整指南

## 一、🌳 分支管理策略（Git Flow）

### 1. 核心分支结构
```
main (生产分支)
  ├── 最稳定的代码
  ├── 所有发布版本的代码
  └── 只接受来自 release 和 hotfix 的合并

develop (开发分支)  
  ├── 最新的开发代码
  ├── 所有功能开发的基础
  └── 定期同步到 main

feature/* (功能分支)
  ├── 新功能开发
  ├── 从 develop 创建
  └── 完成后合并回 develop

hotfix/* (紧急修复分支)
  ├── 生产环境紧急修复
  ├── 从 main 创建
  └── 修复后同时合并到 main 和 develop

release/* (发布分支)
  ├── 版本发布准备
  ├── 从 develop 创建
  └── 完成后合并到 main 和 develop
```

## 二、📊 版本号管理规范

### 语义化版本 (Semantic Versioning)
格式：`MAJOR.MINOR.PATCH` (例如：0.2.5)

- **MAJOR (主版本)**: 不兼容的 API 变更
  - 0.x.x → 1.0.0：首个稳定版本
  - 1.x.x → 2.0.0：重大架构调整
  
- **MINOR (次版本)**: 向后兼容的功能新增
  - 0.2.x → 0.3.0：添加新功能
  - 1.0.x → 1.1.0：新增 API
  
- **PATCH (修订版)**: 向后兼容的问题修复
  - 0.2.5 → 0.2.6：Bug 修复
  - 1.0.0 → 1.0.1：性能优化

### 预发布版本
- `alpha`: 内部测试版本 (0.3.0-alpha.1)
- `beta`: 公开测试版本 (0.3.0-beta.1)
- `rc`: 候选发布版本 (0.3.0-rc.1)

## 三、📝 提交信息规范（Conventional Commits）

### 标准格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型前缀说明
| 类型 | 说明 | 示例 | 版本影响 |
|------|------|------|----------|
| `feat` | 新功能 | feat(auth): 添加用户登录功能 | MINOR ↑ |
| `fix` | Bug 修复 | fix(api): 修复数据解析错误 | PATCH ↑ |
| `docs` | 文档更新 | docs: 更新 README 安装说明 | - |
| `style` | 代码格式 | style: 格式化代码 | - |
| `refactor` | 重构 | refactor: 优化性能 | - |
| `perf` | 性能优化 | perf: 提升查询速度 | PATCH ↑ |
| `test` | 测试相关 | test: 添加单元测试 | - |
| `chore` | 构建/工具 | chore: 升级依赖包 | - |
| `ci` | CI/CD 配置 | ci: 更新工作流 | - |
| `build` | 构建系统 | build: 修改打包配置 | - |

### 提交示例
```bash
# 功能类
feat(auth): 实现 OAuth2.0 登录
feat(api): 添加批量导入接口

# 修复类
fix(ui): 解决移动端布局问题
fix: 修复内存泄漏问题

# 文档类
docs: 添加 API 使用示例
docs(README): 更新安装指南

# 其他
chore: 升级到 Node.js 20
refactor: 分离业务逻辑到 service 层
```

## 四、🔧 具体操作流程

### 1. 日常功能开发
```bash
# 1. 更新本地 develop 分支
git checkout develop
git pull origin develop

# 2. 创建功能分支
git checkout -b feature/user-authentication
# 分支命名规范：feature/功能简述（使用短横线连接）

# 3. 开发过程中的提交
git add src/auth/
git commit -m "feat(auth): 实现用户注册接口"

git add tests/auth/
git commit -m "test(auth): 添加注册接口单元测试"

git add docs/
git commit -m "docs(auth): 添加认证 API 文档"

# 4. 推送到远程
git push origin feature/user-authentication

# 5. 创建 Pull Request
# 在 GitHub 上创建 PR: feature/user-authentication → develop
# PR 标题：[Feature] 用户认证功能
# PR 描述：详细说明功能内容、测试情况、注意事项

# 6. 代码审查通过后合并
git checkout develop
git merge --no-ff feature/user-authentication
git push origin develop

# 7. 清理分支
git branch -d feature/user-authentication
git push origin --delete feature/user-authentication
```

### 2. 版本发布流程
```bash
# 1. 从 develop 创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/0.3.0

# 2. 版本准备（在发布分支上）
# 更新版本号
npm version minor --no-git-tag-version
git add package.json
git commit -m "chore: 更新版本号到 0.3.0"

# 更新文档
# 编辑 CHANGELOG.md，将 [未发布] 内容移到新版本
git add CHANGELOG.md
git commit -m "docs: 更新 CHANGELOG for v0.3.0"

# 最后的 bug 修复
git commit -m "fix: 修复发布前发现的问题"

# 3. 合并到 main 并打标签
git checkout main
git pull origin main
git merge --no-ff release/0.3.0 -m "chore: Release version 0.3.0"
git tag -a v0.3.0 -m "Release version 0.3.0

主要更新：
- 新增用户认证功能
- 优化性能
- 修复已知问题"
git push origin main --tags

# 4. 合并回 develop
git checkout develop
git merge --no-ff release/0.3.0 -m "chore: Merge release/0.3.0 back to develop"
git push origin develop

# 5. 删除发布分支
git branch -d release/0.3.0
git push origin --delete release/0.3.0
```

### 3. 紧急修复流程
```bash
# 1. 从 main 创建修复分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-issue

# 2. 进行修复
git add src/security/
git commit -m "fix(security): 修复 XSS 漏洞"

# 3. 更新版本号（修订版本）
npm version patch --no-git-tag-version
git add package.json
git commit -m "chore: 更新版本号到 0.2.6"

# 4. 合并到 main 并打标签
git checkout main
git merge --no-ff hotfix/critical-security-issue -m "chore: Hotfix version 0.2.6"
git tag -a v0.2.6 -m "Hotfix: 修复严重安全漏洞"
git push origin main --tags

# 5. 同步到 develop
git checkout develop
git pull origin develop
git merge --no-ff hotfix/critical-security-issue -m "chore: Merge hotfix/critical-security-issue to develop"
git push origin develop

# 6. 删除修复分支
git branch -d hotfix/critical-security-issue
git push origin --delete hotfix/critical-security-issue
```

### 4. 处理合并冲突
```bash
# 场景：将 feature 分支合并到 develop 时出现冲突

# 1. 尝试合并
git checkout develop
git merge feature/new-feature

# 2. 解决冲突
# Git 会提示哪些文件有冲突
# 编辑冲突文件，查找 <<<<<<< ======= >>>>>>> 标记
# 手动解决冲突

# 3. 标记冲突已解决
git add .
git commit -m "merge: 解决 feature/new-feature 合并冲突"

# 4. 推送
git push origin develop
```

## 五、🚀 自动化版本发布

### 1. GitHub Actions 手动触发
```yaml
# 访问 GitHub Actions 页面
https://github.com/MuziGeek/claude-tdd-cli/actions/workflows/release.yml

# 点击 "Run workflow"
# 选择版本类型：
#   - patch: 修订版本 (0.2.5 → 0.2.6)
#   - minor: 次版本 (0.2.5 → 0.3.0)
#   - major: 主版本 (0.2.5 → 1.0.0)
#   - prerelease: 预发布 (0.2.5 → 0.2.6-beta.0)
```

### 2. 自动化流程包含
- ✅ 运行测试套件
- ✅ 构建项目
- ✅ 自动更新版本号
- ✅ 创建 Git 标签
- ✅ 生成 Release Notes
- ✅ 创建 GitHub Release
- ✅ 发布到 NPM
- ✅ 发布到 GitHub Packages

## 六、🛡️ 分支保护规则

### main 分支保护
```yaml
设置路径: Settings → Branches → Add rule

规则配置:
- Branch name pattern: main
- ✅ Require pull request reviews before merging
  - Required approving reviews: 1
  - ✅ Dismiss stale pull request approvals
- ✅ Require status checks to pass before merging
  - ✅ Require branches to be up to date
  - Status checks: CI/CD Pipeline
- ✅ Require conversation resolution before merging
- ✅ Include administrators
- ❌ Allow force pushes (禁止强制推送)
- ❌ Allow deletions (禁止删除分支)
```

### develop 分支保护
```yaml
规则配置:
- Branch name pattern: develop
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ❌ Allow force pushes
```

## 七、📋 版本发布检查清单

### 发布前检查
- [ ] 所有计划功能已完成
- [ ] 所有测试通过 (单元测试、集成测试)
- [ ] 代码审查已完成
- [ ] 文档已更新 (README, API 文档)
- [ ] CHANGELOG.md 已更新
- [ ] 性能测试通过
- [ ] 安全扫描无严重问题
- [ ] 依赖包已更新到稳定版本

### 发布时检查
- [ ] 版本号符合语义化规范
- [ ] Git 标签已创建
- [ ] Release Notes 准确完整
- [ ] CI/CD 流程全部通过

### 发布后验证
- [ ] NPM 包可正常安装
- [ ] CLI 命令正常工作
- [ ] 关键功能测试通过
- [ ] 监控无异常

## 八、💡 最佳实践建议

### 1. 提交原则
- **原子性提交**: 每个提交只做一件事
- **频繁提交**: 小步快走，便于回滚
- **清晰信息**: 提交信息要说明 what 和 why
- **引用 Issue**: 提交信息中引用相关 Issue 编号

### 2. 分支管理
- **短生命周期**: feature 分支尽快合并
- **及时更新**: 定期从上游分支拉取最新代码
- **清理分支**: 合并后立即删除分支
- **命名规范**: 使用统一的命名约定

### 3. 代码审查
- **小 PR 原则**: PR 尽量小，便于审查
- **自审查**: 提交 PR 前自己先审查一遍
- **响应及时**: 及时响应审查意见
- **学习机会**: 把代码审查当作学习机会

### 4. 版本管理
- **定期发布**: 建立固定的发布节奏
- **向后兼容**: 尽量保持向后兼容
- **弃用通知**: 提前通知弃用的功能
- **版本规划**: 提前规划大版本的功能

## 九、🔧 常用 Git 命令

### 分支操作
```bash
# 查看所有分支
git branch -a

# 创建并切换分支
git checkout -b feature/new-feature

# 删除本地分支
git branch -d feature/old-feature

# 删除远程分支
git push origin --delete feature/old-feature

# 重命名分支
git branch -m old-name new-name
```

### 标签操作
```bash
# 查看所有标签
git tag -l

# 创建带注释的标签
git tag -a v1.0.0 -m "Release version 1.0.0"

# 推送标签到远程
git push origin v1.0.0
git push origin --tags  # 推送所有标签

# 删除标签
git tag -d v1.0.0
git push origin --delete v1.0.0
```

### 查看历史
```bash
# 查看提交历史
git log --oneline --graph --all

# 查看某个文件的修改历史
git log -p path/to/file

# 查看某个作者的提交
git log --author="作者名"

# 查看指定时间范围的提交
git log --since="2025-01-01" --until="2025-12-31"
```

### 撤销操作
```bash
# 撤销工作区的修改
git checkout -- file.txt

# 撤销暂存区的修改
git reset HEAD file.txt

# 撤销最近的提交（保留修改）
git reset --soft HEAD~1

# 撤销最近的提交（丢弃修改）
git reset --hard HEAD~1
```

## 十、🎯 针对 Claude TDD CLI 项目的具体建议

### 当前项目状态
- **当前版本**: 0.2.5
- **主分支**: main (生产)
- **开发分支**: develop
- **发布方式**: GitHub Actions 自动化

### 下一步版本规划
```
0.2.x (修订版) - Bug 修复和小改进
  ├── 0.2.6: 修复紧急问题
  └── 0.2.7: 性能优化

0.3.0 (次版本) - 新功能发布
  ├── 添加新的框架支持
  ├── 改进 CLI 交互体验
  └── 增强错误处理

1.0.0 (主版本) - 稳定版发布
  ├── API 稳定
  ├── 完整的文档
  └── 生产就绪
```

### 日常工作流程示例
```bash
# 周一：开始新的开发周期
git checkout develop
git pull origin develop

# 开发新功能
git checkout -b feature/add-vue-support
# ... 开发工作 ...
git push origin feature/add-vue-support
# 创建 PR 并等待审查

# 周五：准备发布
git checkout develop
git checkout -b release/0.3.0
# 更新版本和文档
# 通过 GitHub Actions 发布

# 紧急修复（任何时候）
git checkout main
git checkout -b hotfix/critical-fix
# 修复并快速发布
```

---

**最后更新**: 2025-09-08
**文档版本**: 1.0.0

> 💡 这份指南是活文档，会根据项目发展和团队反馈持续更新。