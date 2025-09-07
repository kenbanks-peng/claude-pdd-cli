---
description: 智能选择下一个最优TDD任务
allowed-tools: Bash, Read
---

## 🎯 选择下一个任务

智能分析任务依赖、优先级和当前状态，推荐最适合开始的TDD任务。

### 快速选择

运行任务选择算法，获得下一个最优任务：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/next-task.sh
```

### 选择策略

#### 优先级评分算法
任务选择基于以下因素综合评分：

1. **依赖就绪度** (40%权重)
   - 所有依赖任务已完成：+40分
   - 部分依赖完成：+20分  
   - 依赖未完成：0分

2. **业务优先级** (30%权重)
   - High：+30分
   - Medium：+20分
   - Low：+10分

3. **TDD阶段连续性** (20%权重)
   - 同功能模块的下一阶段：+20分
   - 相关功能：+10分
   - 无关任务：0分

4. **工作量估算** (10%权重)
   - 小任务(1-4小时)：+10分
   - 中等任务(4-8小时)：+8分
   - 大任务(8+小时)：+5分

### 任务信息显示

#### 推荐任务详情
```
🎯 推荐任务: #123 用户注册基础功能

📋 基本信息:
- 功能模块: 用户认证系统
- TDD阶段: RED
- 优先级: High
- 预估时间: 4小时
- 当前状态: Ready

🔗 依赖状态:
- 所有依赖任务已完成 ✅

📝 任务描述:
实现用户注册的核心功能，包括邮箱验证和基本信息保存。

✅ 验收标准:
- [ ] 注册API接受有效邮箱和密码
- [ ] 重复邮箱注册返回409错误
- [ ] 无效邮箱格式返回400错误
- [ ] 密码符合安全规范

📚 相关文档:
- PRD: docs/prd/user-auth.prd.md
- 设计: docs/design/user-auth.design.md
- 测试规范: docs/test-specs/user-auth.test-spec.md

🚀 开始命令:
/tdd:red --feature user-auth --task 123
```

### 任务过滤选项

#### 按模块过滤
```bash
# 只显示用户认证相关任务
bash next-task.sh --module "user-auth"

# 只显示支付相关任务  
bash next-task.sh --module "payment"
```

#### 按阶段过滤
```bash
# 只显示RED阶段任务
bash next-task.sh --phase "RED"

# 只显示REFACTOR阶段任务
bash next-task.sh --phase "REFACTOR"
```

#### 按工作量过滤
```bash
# 只显示小任务(1-4小时)
bash next-task.sh --size "small"

# 只显示中等任务(4-8小时)
bash next-task.sh --size "medium"
```

### 多任务展示

#### 显示前N个候选任务
```bash
# 显示前3个最佳候选
bash next-task.sh --top 3

# 显示所有可执行任务
bash next-task.sh --all
```

#### 任务列表格式
```
排名 | 任务ID | 标题 | 模块 | 阶段 | 优先级 | 评分
1    | #123   | 用户注册基础功能 | user-auth | RED | High | 95
2    | #124   | 登录验证逻辑     | user-auth | RED | High | 90  
3    | #125   | 密码安全检查     | user-auth | RED | Med  | 85
```

### 状态检查

#### 任务可执行性验证
选择前检查任务是否可以开始：

- ✅ 所有依赖任务已完成
- ✅ 没有阻塞问题
- ✅ 相关文档已准备
- ✅ 开发环境已就绪

#### 阻塞任务处理
如果发现阻塞任务：
```
⚠️  任务 #126 被阻塞

🚫 阻塞原因:
- 依赖任务 #123 未完成
- 等待API设计评审
- 缺少测试数据

📋 解决建议:
1. 先完成任务 #123
2. 联系产品团队确认API设计
3. 准备测试数据集

🔄 其他可选任务:
- #127 数据库模型设计
- #128 错误处理机制
```

### 工作流集成

#### 自动任务切换
完成当前任务后自动推荐下一任务：

```bash
# TDD完成后自动调用
# 在.claude/hooks/commit-validator.sh中
if [[ "$current_phase" == "REFACTOR" && "$tests_passing" == "true" ]]; then
    echo "🎉 任务完成！正在推荐下一个任务..."
    bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/next-task.sh
fi
```

#### 工作时间优化
根据预估工作时间智能推荐：

```bash
# 显示适合当前时间段的任务
bash next-task.sh --time-available "2h"  # 还有2小时工作时间
bash next-task.sh --time-available "30m" # 还有30分钟，推荐小任务
```

### 团队协作模式

#### 避免任务冲突
```bash
# 检查任务是否已被其他人认领
bash next-task.sh --check-assignment

# 自动分配给当前用户
bash next-task.sh --assign-to-me
```

#### 负载均衡
```bash
# 考虑团队成员工作负载
bash next-task.sh --load-balance

# 显示团队任务分布
bash next-task.sh --team-status
```

### 配置选项

#### 个人偏好设置
```json
{
  "taskSelection": {
    "preferredModules": ["user-auth", "core-api"],
    "avoidModules": ["ui-components"],
    "maxTaskSize": "medium",
    "preferredPhases": ["RED", "GREEN"],
    "workingHours": {
      "start": "09:00",
      "end": "17:00"
    }
  }
}
```

#### 团队设置
```json
{
  "teamSettings": {
    "autoAssignment": true,
    "loadBalancing": true,
    "skillMatching": true,
    "pairProgramming": false
  }
}
```

### 指标和报告

#### 任务选择统计
- 平均任务完成时间
- 依赖阻塞频率  
- 优先级调整历史
- 团队效率指标

#### 优化建议
```bash
# 生成任务流优化报告
bash next-task.sh --analyze-flow

# 输出：
# - 经常被阻塞的依赖链
# - 优先级设置建议
# - 任务分解建议
# - 团队分工优化
```

### 与其他命令集成

#### 直接开始TDD
选择任务后直接进入TDD流程：

```bash
# 选择并开始任务
bash next-task.sh --start-immediately

# 等同于:
# 1. bash next-task.sh
# 2. /tdd:red --task {selected_task_id}
```

#### GitHub同步
选择任务时自动更新GitHub Issue状态：

```bash
# 选择任务并更新GitHub状态
bash next-task.sh --sync-github
```

---
**下一步**: 选定任务后，使用 `/tdd:red` 开始TDD开发循环