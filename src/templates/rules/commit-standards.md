# TDD 提交规范

## 提交原则

TDD开发中的每次提交都应该记录一个有意义的进展，遵循"小步快跑"的原则。

## 提交消息格式

### 基本格式
```
[阶段] 功能ID: 简要描述

详细说明：
- 具体变更内容
- TDD循环进展
- 测试状态

技术细节：
- 实现方法
- 重构措施

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 阶段标识
- `[RED]`: 红色阶段 - 新增失败测试
- `[GREEN]`: 绿色阶段 - 实现代码通过测试  
- `[REFACTOR]`: 重构阶段 - 改善代码质量
- `[SETUP]`: 环境搭建 - 项目初始化和配置
- `[DOCS]`: 文档更新 - 不涉及功能代码

### 功能ID格式
- 使用GitHub Issue编号：`#123`
- 或使用功能标识：`USER_AUTH`, `PAYMENT_FLOW`
- 格式：`[阶段] #Issue号: 描述` 或 `[阶段] 功能ID: 描述`

## 各阶段提交标准

### 🔴 RED阶段提交
**目标**: 记录新的失败测试

**提交内容**:
- ✅ 新增的测试用例
- ✅ 测试辅助代码
- ✅ 测试数据和mock

**提交示例**:
```
[RED] #123: 添加用户认证失败测试

详细说明：
- 新增用户名密码验证测试用例
- 测试覆盖无效凭据场景
- 期望抛出AuthenticationException

测试状态：❌ 1个测试失败（符合预期）
下一步：实现Authentication.validate()方法

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**验证标准**:
- 至少有一个测试失败
- 失败原因符合预期
- 测试代码质量良好

### 🟢 GREEN阶段提交
**目标**: 记录让测试通过的最小实现

**提交内容**:
- ✅ 新增的实现代码
- ✅ 必要的类和方法
- ✅ 最简可行方案

**提交示例**:
```
[GREEN] #123: 实现基础用户认证逻辑

详细说明：
- 实现Authentication.validate()方法
- 添加用户名密码匹配逻辑
- 创建AuthenticationException异常类

实现策略：
- 硬编码验证逻辑（最简实现）
- 后续REFACTOR阶段优化

测试状态：✅ 所有测试通过
下一步：重构认证逻辑抽象

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**验证标准**:
- 所有测试通过
- 实现是最简可行方案
- 没有过度设计

### 🔧 REFACTOR阶段提交
**目标**: 记录代码质量改善

**提交内容**:
- ✅ 重构的生产代码
- ✅ 提取的方法和类
- ✅ 性能和设计优化

**提交示例**:
```
[REFACTOR] #123: 重构认证逻辑提取抽象层

详细说明：
- 提取AuthenticationService接口
- 创建DatabaseAuthService实现
- 重构硬编码逻辑为配置驱动

重构成果：
- 代码可测试性提升
- 支持多种认证策略
- 降低类间耦合度

测试状态：✅ 所有测试保持绿色
代码质量：提升可维护性和扩展性

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**验证标准**:
- 所有测试保持绿色
- 代码质量确实改善
- 没有破坏现有功能

## 提交频率

### 推荐频率
- **RED阶段**: 每个新测试提交一次
- **GREEN阶段**: 实现通过后立即提交
- **REFACTOR阶段**: 每次重构改善后提交

### 最小提交单元
- 一个完整的TDD循环
- 一个独立的测试用例
- 一次有意义的重构

### 最大提交间隔
- 不超过30分钟
- 不超过100行代码变更
- 不跨越TDD阶段边界

## 提交验证

### 自动检查
```bash
# Pre-commit hooks
.claude/hooks/tdd-guard.sh     # TDD阶段权限检查
.claude/hooks/test-runner.sh   # 自动运行测试
.claude/hooks/commit-validator.sh # 提交信息验证
```

### 人工检查清单
- [ ] 提交信息格式正确
- [ ] TDD阶段标识准确
- [ ] 功能ID对应正确
- [ ] 测试状态符合阶段要求
- [ ] 代码变更范围合理

## 特殊场景

### 多人协作
```
[GREEN] #123: 实现用户认证核心逻辑

协作信息：
- 基于Alice的测试用例实现
- 与Bob讨论了异常处理策略
- 复用了Carol的密码加密方法

Co-Authored-By: Alice <alice@example.com>
Co-Authored-By: Bob <bob@example.com>
Co-Authored-By: Claude <noreply@anthropic.com>
```

### 紧急修复
```
[HOTFIX] #456: 修复生产环境认证服务崩溃

紧急修复：
- 空指针异常处理
- 数据库连接超时处理
- 增加异常日志记录

影响范围：仅限异常处理逻辑
测试状态：✅ 所有测试通过
部署状态：已热部署到生产环境

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 实验性功能
```
[EXPERIMENT] #789: 尝试新的认证算法实现

实验目的：
- 评估OAuth 2.0集成可行性
- 性能对比测试
- 兼容性验证

实验结果：
- 性能提升15%
- 兼容性良好
- 建议正式采用

状态：实验分支，待团队评审
```

## 提交历史管理

### 分支策略
```
main                    # 稳定版本
├── feature/user-auth   # 功能分支
│   ├── [RED] 添加测试
│   ├── [GREEN] 基础实现  
│   ├── [REFACTOR] 优化设计
│   └── [RED] 扩展测试
└── hotfix/auth-bug     # 紧急修复分支
```

### 合并策略
- **Feature分支**: Squash merge保持历史清晰
- **Hotfix分支**: Fast-forward merge保持提交历史
- **实验分支**: 根据结果决定合并方式

### 历史清理
```bash
# 交互式rebase整理提交历史
git rebase -i HEAD~10

# 压缩相关的小提交
pick f7f3f6d [RED] 添加用户测试
squash 310154e [RED] 修复测试语法错误  
squash a5f4a0d [RED] 完善测试断言
pick c3e7ca8 [GREEN] 实现用户认证
```

## 最佳实践

### DO
✅ 频繁小提交
✅ 清晰的提交信息
✅ 遵循TDD阶段规范
✅ 包含测试状态信息
✅ 说明下一步计划

### DON'T  
❌ 大而全的提交
❌ 无意义的提交信息
❌ 跨阶段的提交
❌ 破坏测试的提交
❌ 忽略代码审查