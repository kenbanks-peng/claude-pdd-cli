---
description: 查看整体工作流状态，从PRD到代码交付的全流程进度追踪
allowed-tools: Read, Bash, Glob, Grep
---

## 📊 工作流状态总览

全面展示从PRD创建到代码交付的完整工作流状态，提供项目进度、阶段完成度、团队协作效率等关键指标。

### 执行方式

```bash
# 查看当前项目的整体工作流状态
/pm:workflow-status

# 查看特定功能的工作流状态
/pm:workflow-status --feature-id "user-authentication"

# 生成详细的工作流报告
/pm:workflow-status --detailed --output-format "markdown"

# 实时监控模式
/pm:workflow-status --watch --refresh-interval 30
```

### 状态维度

#### 1. 工作流阶段状态
```yaml
工作流阶段:
  1. PRD创建 (PRD Creation)
  2. 需求分析 (Requirements Analysis)  
  3. 技术设计 (Technical Design)
  4. 任务分解 (Task Decomposition)
  5. GitHub同步 (GitHub Sync)
  6. TDD开发 (TDD Development)
  7. 代码集成 (Code Integration)
  8. 质量验证 (Quality Verification)
  9. 发布交付 (Release Delivery)

阶段状态:
  - ⏳ 未开始 (Not Started)
  - 🔄 进行中 (In Progress)  
  - ✅ 已完成 (Completed)
  - ⚠️ 需要关注 (Needs Attention)
  - ❌ 阻塞中 (Blocked)
```

#### 2. 文档完整性状态
```yaml
必要文档检查:
  - 📋 PRD文档: docs/prd/{FEATURE_ID}.prd.md
  - 🔍 需求分析: docs/analysis/{FEATURE_ID}.requirements.md
  - 🏗️ 技术设计: docs/design/{FEATURE_ID}.design.md
  - 🧩 任务清单: docs/tasks/{FEATURE_ID}.tasks.json
  - 🧪 测试规范: docs/test-specs/{FEATURE_ID}.test-spec.md

文档状态指标:
  - 文档存在性 ✅/❌
  - 最后更新时间 📅
  - 文档完整性评分 📊
  - 版本一致性检查 🔄
```

#### 3. TDD开发进度
```yaml
TDD阶段分布:
  - 🔴 RED阶段任务数量和进度
  - 🟢 GREEN阶段任务数量和进度  
  - 🔧 REFACTOR阶段任务数量和进度
  - ✅ 已完成任务数量

代码质量指标:
  - 测试覆盖率趋势 📈
  - 通过/失败测试比例 ⚖️
  - 代码审查状态 👥
  - 技术债务指标 📉
```

### 状态显示格式

#### 概览仪表板
```
==================================================
🚀 Claude TDD Workflow 状态总览
==================================================
项目: Claude TDD Workflow Demo
时间: 2024-01-15 14:30:00 UTC
更新: 5分钟前

📊 整体进度: ████████████████████░░ 80% (8/10阶段完成)

🔄 当前活跃功能: 3个
  ├─ user-authentication    ████████████████░░░░ 70%
  ├─ payment-integration    ████████░░░░░░░░░░░░ 35%
  └─ notification-system    ██░░░░░░░░░░░░░░░░░░ 10%

⏱️  关键指标:
  • 总任务数: 47 (完成: 32, 进行中: 8, 待开始: 7)
  • 平均任务完成时间: 4.2小时
  • 团队开发效率: 85% (目标: 80%)
  • 代码质量评分: A- (测试覆盖率: 87%)

🚨 需要关注:
  • payment-integration 有2个阻塞任务
  • user-authentication 技术设计需要更新
  • 3个任务超期1天，需要重新评估工时

👥 团队状态:
  • 活跃开发者: 4人
  • 并行任务: 6个 (最大容量: 8个)
  • 代码审查队列: 3个PR等待审查
```

#### 详细功能状态
```
==================================================
🔍 功能详细状态: user-authentication
==================================================

📋 文档状态:
  ✅ PRD文档          (docs/prd/user-auth.prd.md)
     └─ 最后更新: 2024-01-12, 版本: v1.2
  ✅ 需求分析        (docs/analysis/user-auth.requirements.md)  
     └─ 最后更新: 2024-01-13, 版本: v1.1
  ✅ 技术设计        (docs/design/user-auth.design.md)
     └─ 最后更新: 2024-01-13, 版本: v1.1
  ⚠️  任务清单        (docs/tasks/user-auth.tasks.json)
     └─ 最后更新: 2024-01-10, 版本: v1.0 (需要更新)

🏗️ 工作流阶段进度:
  ✅ 1. PRD创建           (2024-01-12 完成)
  ✅ 2. 需求分析         (2024-01-13 完成)
  ✅ 3. 技术设计         (2024-01-13 完成)  
  ⚠️  4. 任务分解         (需要基于最新设计重新分解)
  ✅ 5. GitHub同步       (2024-01-14 完成)
  🔄 6. TDD开发          (进行中, 70% 完成)
  ⏳ 7. 代码集成         (等待开发完成)
  ⏳ 8. 质量验证         (等待集成完成)

🧩 任务执行状态:
  📊 总任务: 12个
    ├─ ✅ 已完成: 8个 (67%)
    ├─ 🔄 进行中: 2个 (T009: 登录API, T011: 密码重置)  
    ├─ ⏳ 待开始: 2个
    └─ 🚫 阻塞中: 0个

  🎯 TDD阶段分布:
    ├─ 🔴 RED: 1个任务
    ├─ 🟢 GREEN: 1个任务
    ├─ 🔧 REFACTOR: 0个任务
    └─ ✅ DONE: 8个任务

💻 GitHub集成状态:
  🔗 Issues: 12个 (关闭: 8, 进行中: 2, 待开始: 2)  
  📊 里程碑: "用户认证系统" (70% 完成)
  🌿 活跃分支: 2个 (feature/login-api, feature/password-reset)
  📝 待审查PR: 1个 (#23: 用户注册功能)

⚡ 性能指标:
  📈 完成速度: 1.2任务/天 (预期: 1.0任务/天)
  🎯 质量指标: 
    ├─ 测试覆盖率: 89% (目标: ≥85%)
    ├─ 代码审查通过率: 95%  
    └─ 构建成功率: 98%

⏰ 时间线:
  📅 开始时间: 2024-01-12
  📅 预计完成: 2024-01-18 (剩余3天)
  📈 进度: 提前1天 (良好)
```

### 状态数据源

#### 1. 文件系统扫描
```bash
# 扫描文档完整性
scan_documentation_status() {
    local feature_id="$1"
    
    # 检查必要文档
    local prd_file="docs/prd/${feature_id}.prd.md"
    local req_file="docs/analysis/${feature_id}.requirements.md"
    local design_file="docs/design/${feature_id}.design.md"
    local tasks_file="docs/tasks/${feature_id}.tasks.json"
    
    for file in "$prd_file" "$req_file" "$design_file" "$tasks_file"; do
        if [[ -f "$file" ]]; then
            echo "✅ $(basename "$file"): $(stat -f "%Sm" "$file")"
        else
            echo "❌ $(basename "$file"): 缺失"
        fi
    done
}
```

#### 2. GitHub API集成
```bash
# 获取GitHub Issues状态
get_github_status() {
    local feature_id="$1"
    
    # 查询相关Issues
    gh issue list --search "label:feature:${feature_id}" --json number,title,state,labels |
        jq '.[] | {
            number: .number,
            title: .title, 
            state: .state,
            tdd_phase: (.labels[] | select(.name | startswith("tdd:")) | .name)
        }'
}
```

#### 3. Git状态分析
```bash
# 分析Git开发状态
analyze_git_status() {
    local feature_id="$1"
    
    # 查找相关分支
    git branch -a | grep -i "$feature_id" | while read branch; do
        echo "🌿 $branch: $(git log --oneline "$branch" | wc -l) commits"
    done
    
    # 查找待审查PR
    gh pr list --search "label:feature:${feature_id}" --json number,title,state
}
```

### 预警和建议

#### 自动预警规则
```yaml
文档一致性预警:
  - 任务清单版本落后于设计文档 > 2天 ⚠️
  - PRD与需求分析版本不一致 ⚠️
  - 设计文档超过1周未更新 ⚠️

进度预警:  
  - 任务超期 > 2天 ⚠️
  - 阻塞任务 > 3个 🚨
  - 团队并行度 < 50% ⚠️
  - 代码审查积压 > 5个 ⚠️

质量预警:
  - 测试覆盖率下降 > 5% ⚠️
  - 构建失败率 > 10% 🚨  
  - 技术债务增长 > 20% ⚠️
```

#### 智能建议系统
```bash
# 基于状态数据生成建议
generate_recommendations() {
    local status_data="$1"
    
    # 分析瓶颈
    if [[ $(jq '.blocked_tasks' "$status_data") -gt 2 ]]; then
        echo "💡 建议: 优先解决阻塞任务，恢复开发流程"
    fi
    
    # 分析并行度
    if [[ $(jq '.parallel_efficiency' "$status_data") -lt 0.6 ]]; then
        echo "💡 建议: 当前并行度较低，考虑重新分解任务以提高并行性"
    fi
    
    # 分析代码质量
    if [[ $(jq '.test_coverage' "$status_data") -lt 0.8 ]]; then
        echo "💡 建议: 测试覆盖率偏低，建议加强单元测试编写"
    fi
}
```

### 报告导出

#### 支持的导出格式
```bash
# Markdown报告
/pm:workflow-status --output-format markdown --output-file "reports/workflow-status.md"

# JSON数据导出  
/pm:workflow-status --output-format json --output-file "reports/workflow-data.json"

# HTML仪表板
/pm:workflow-status --output-format html --output-file "reports/dashboard.html"

# CSV数据(用于Excel分析)
/pm:workflow-status --output-format csv --output-file "reports/metrics.csv"
```

#### 定期报告自动生成
```bash
# 配置定期报告
cron_schedule="0 9 * * 1-5"  # 工作日早上9点
report_command="/pm:workflow-status --detailed --output-format markdown --email-to team@example.com"

# 添加到crontab
echo "$cron_schedule $report_command" | crontab -
```

### 集成配置

#### 与其他工具集成
```json
{
  "integrations": {
    "slack": {
      "enabled": true,
      "webhook": "https://hooks.slack.com/...",
      "channel": "#development",
      "alertThresholds": {
        "blockedTasks": 2,
        "overdueHours": 48,
        "testCoverageDropPercent": 5
      }
    },
    "email": {
      "enabled": true,
      "recipients": ["team-lead@example.com"],
      "schedule": "daily",
      "format": "html"
    },
    "dashboard": {
      "enabled": true,
      "refreshInterval": 300,
      "port": 3000
    }
  }
}
```

### 使用场景

#### 1. 日常开发监控
```bash
# 团队晨会前查看状态
/pm:workflow-status

# 检查特定功能进度  
/pm:workflow-status --feature-id "payment-system"
```

#### 2. 项目管理报告
```bash
# 生成周报
/pm:workflow-status --detailed --date-range "last-week" --output-format markdown

# 生成里程碑报告
/pm:workflow-status --milestone "v2.0-release" --output-format html
```

#### 3. 问题诊断
```bash
# 查看阻塞任务详情
/pm:workflow-status --filter "blocked" --detailed

# 分析性能瓶颈
/pm:workflow-status --performance-analysis --team-breakdown
```

### 最佳实践

#### 监控频率建议
- **开发期间**: 每天查看1-2次
- **冲刺阶段**: 每半天查看一次  
- **发布前**: 每小时查看一次
- **自动监控**: 每15分钟更新状态数据

#### 团队协作
- **站会使用**: 在每日站会中展示整体状态
- **问题追踪**: 及时发现和处理阻塞问题
- **进度同步**: 保持团队对项目状态的一致认识

---
**下一步**: 根据状态报告中的建议，使用相应的命令优化工作流程