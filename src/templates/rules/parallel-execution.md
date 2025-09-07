# 并行执行规则

## 核心概念

Claude TDD Workflow 支持多个TDD循环并行执行，通过Git worktrees和GitHub Issues实现任务隔离和协调。

## 隔离策略

### Git Worktrees
```bash
# 为每个功能创建独立的worktree
git worktree add ../feature-user-auth feature/user-auth
git worktree add ../feature-payment feature/payment
```

### 独立TDD状态
每个worktree维护自己的TDD状态：
```
project/
├── .claude/tdd-state.json           # 主分支TDD状态
├── ../feature-user-auth/
│   └── .claude/tdd-state.json       # 用户认证功能TDD状态
└── ../feature-payment/
    └── .claude/tdd-state.json       # 支付功能TDD状态
```

## 并行协调机制

### 1. 功能隔离
- **文件隔离**: 不同功能修改不同文件，避免冲突
- **测试隔离**: 独立的测试套件，可并行运行
- **数据库隔离**: 使用不同的测试数据库或schema

### 2. 依赖管理
- **依赖声明**: 在tdd-state.json中声明功能依赖
- **依赖检查**: 自动检测依赖冲突和循环依赖
- **阻塞处理**: 依赖未完成时自动阻塞相关任务

### 3. 集成协调
- **定期合并**: 主分支定期合并已完成功能
- **冲突预警**: 提前发现潜在合并冲突
- **集成测试**: 合并后运行完整测试套件

## 工作流程

### 启动并行任务
```bash
# 1. 从GitHub Issues选择任务
/pm:next

# 2. 创建功能分支和worktree
/pm:issue-start 123

# 3. 在新worktree中初始化TDD
cd ../issue-123
/tdd:init
```

### 并行开发
```bash
# 每个开发者/Agent在各自的worktree中工作
worktree-1/$ /tdd:red    # 编写测试
worktree-1/$ /tdd:green  # 实现代码
worktree-1/$ /tdd:refactor # 重构

worktree-2/$ /tdd:red    # 同时进行另一个功能
worktree-2/$ /tdd:green
```

### 完成与集成
```bash
# 1. 功能完成
/tdd:done

# 2. 创建Pull Request
/pm:issue-close 123

# 3. 代码审查通过后合并
# 4. 清理worktree
git worktree remove ../issue-123
```

## 冲突处理

### 文件冲突
1. **预防**: 功能设计时避免修改相同文件
2. **检测**: 定期检查主分支变更
3. **解决**: 及时rebase或merge最新变更

### 测试冲突
1. **命名冲突**: 使用唯一的测试类和方法名
2. **数据冲突**: 测试使用独立的测试数据
3. **资源冲突**: 避免共享外部资源

### 依赖冲突
1. **接口变更**: 通过抽象层减少接口依赖
2. **版本冲突**: 使用语义化版本控制
3. **配置冲突**: 环境特定的配置文件

## 质量保证

### 持续集成
```yaml
# GitHub Actions 示例
name: Parallel TDD CI
on: [push, pull_request]
jobs:
  test-matrix:
    strategy:
      matrix:
        feature: [user-auth, payment, inventory]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run TDD tests for ${{ matrix.feature }}
        run: |
          cd features/${{ matrix.feature }}
          npm test
```

### 代码质量门控
- **测试覆盖率**: 每个功能独立计算覆盖率
- **代码审查**: PR必须通过代码审查
- **自动化检查**: ESLint, SonarQube等

## 最佳实践

### 功能分解
- **小而完整**: 每个功能应该小而完整，便于并行开发
- **低耦合**: 减少功能间的依赖关系
- **独立测试**: 功能测试应该能独立运行

### 沟通协调
- **GitHub Issues**: 使用Issues追踪任务状态
- **PR Comments**: 通过PR评论进行技术讨论
- **定期同步**: 团队定期同步进度和依赖关系

### 工具配置
```json
{
  "parallel": {
    "maxWorkers": 3,
    "isolationMode": "worktree", 
    "coordinationFile": ".claude/parallel-state.json",
    "autoSync": true,
    "conflictStrategy": "rebase"
  }
}
```

## 监控和度量

### 并行效率指标
- **并行度**: 同时进行的TDD循环数量
- **冲突率**: 合并时的冲突比例
- **完成时间**: 功能开发的平均时间

### 质量指标
- **测试覆盖率**: 各功能的测试覆盖情况
- **缺陷率**: 并行开发引入的缺陷数量
- **重构频率**: 代码质量改善的频率

## 故障排除

### 常见问题
1. **Worktree同步问题**: 使用`git worktree list`检查状态
2. **TDD状态混乱**: 删除并重新创建tdd-state.json
3. **测试冲突**: 检查测试命名和数据独立性
4. **性能问题**: 限制并行worker数量

### 恢复策略
```bash
# 重置TDD状态
/tdd:init --force

# 清理损坏的worktree
git worktree remove --force ../broken-feature
git branch -D feature/broken

# 从最新主分支重新开始
git checkout main
git pull origin main
/pm:issue-start 123 --fresh
```