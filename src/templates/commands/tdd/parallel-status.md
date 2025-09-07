---
description: 监控并行TDD开发状态，显示多任务协调、资源使用和冲突检测信息
allowed-tools: Bash, Read, Glob
---

## 🔄 并行TDD开发状态监控

实时监控多个TDD循环的并行执行状态，提供任务协调、资源使用、冲突检测和性能优化建议。

### 执行方式

```bash
# 查看当前并行开发状态
/tdd:parallel-status

# 实时监控模式（30秒刷新）
/tdd:parallel-status --watch

# 查看特定worktree的详细状态
/tdd:parallel-status --worktree "task-T001"

# 生成并行开发效率报告
/tdd:parallel-status --report --output-file "reports/parallel-efficiency.md"

# 检测和分析冲突
/tdd:parallel-status --conflict-analysis --suggest-resolution
```

### 监控维度

#### 1. Worktree状态总览
```yaml
Worktree管理:
  - 活跃Worktrees数量
  - 每个Worktree的当前TDD阶段
  - 任务进度和预估完成时间
  - 资源占用情况

状态指标:
  - 🟢 健康运行 (Healthy)
  - 🟡 需要关注 (Attention)  
  - 🔴 存在问题 (Issues)
  - ⚫ 暂停/空闲 (Paused/Idle)
```

#### 2. 任务协调状态
```yaml
依赖管理:
  - 阻塞关系链
  - 等待依赖的任务
  - 关键路径分析
  - 依赖解除通知

并行度分析:
  - 实际并行任务数
  - 最大并行能力
  - 并行效率百分比
  - 负载均衡状态
```

#### 3. 资源冲突检测
```yaml
冲突类型:
  - 文件修改冲突 📁
  - API接口变更冲突 🔌
  - 数据库模式冲突 🗄️
  - 测试数据冲突 🧪
  - 配置文件冲突 ⚙️

冲突级别:
  - 🟢 无冲突 (No Conflicts)
  - 🟡 潜在冲突 (Potential Conflicts)
  - 🟠 需要协调 (Coordination Needed)
  - 🔴 严重冲突 (Critical Conflicts)
```

### 状态显示格式

#### 概览仪表板
```
===============================================================
🔄 并行TDD开发状态监控
===============================================================
更新时间: 2024-01-15 14:30:00 UTC
刷新间隔: 30秒

📊 并行开发总览:
  • 活跃Worktrees: 4/8 (50% 利用率)
  • 并行任务: 4个正在进行
  • 完成任务: 12个
  • 平均TDD循环时间: 45分钟

🚀 性能指标:
  • 并行效率: 85% (良好)
  • 代码合并频率: 每2小时
  • 冲突解决时间: 平均8分钟
  • 团队协作效率: A级

⚡ 当前活跃任务:
┌─────────────┬──────────────────┬─────────┬─────────┬─────────────┬────────────┐
│ Worktree    │ 任务标题         │ TDD阶段 │ 进度    │ 开发者      │ 状态       │
├─────────────┼──────────────────┼─────────┼─────────┼─────────────┼────────────┤
│ task-T001   │ 用户注册API      │ 🟢GREEN │ 80%     │ Alice       │ 🟢 正常    │
│ task-T003   │ 密码验证Service  │ 🔴RED   │ 25%     │ Bob         │ 🟢 正常    │
│ task-T006   │ 邮件通知模块     │ 🔧REFAC │ 95%     │ Charlie     │ 🟡 待合并  │
│ task-T008   │ 用户权限检查     │ 🟢GREEN │ 60%     │ David       │ 🟢 正常    │
└─────────────┴──────────────────┴─────────┴─────────┴─────────────┴────────────┘

⚠️  需要关注:
  • task-T006 已完成重构，等待代码合并
  • task-T003 与 task-T001 存在潜在API接口冲突
  • 2个任务等待依赖解除，预计1小时后可开始

🔗 依赖关系状态:
  • T001 → T002, T003 (已解除)
  • T003 ← T001 (等待T001完成)  
  • T006 → T007, T008 (部分解除)
  • 关键路径: T001 → T003 → T005 (预计完成: 3小时)
```

#### 详细Worktree状态
```
===============================================================
🔍 Worktree详细状态: task-T001
===============================================================

📋 基本信息:
  • 任务ID: T001
  • 标题: 用户注册API实现
  • 开发者: Alice Smith
  • 分支: feature/user-registration-api
  • 创建时间: 2024-01-15 09:00:00
  • 当前阶段: 🟢 GREEN (实现阶段)

📊 TDD进度详情:
  ✅ RED阶段   (09:00-09:30) - 30分钟
     ├─ 失败测试编写: 5个测试用例
     ├─ 测试运行确认: 5/5失败 ✓
     └─ 测试覆盖场景: 注册成功、重复邮箱、无效格式、密码强度、边界条件

  🔄 GREEN阶段  (09:30-现在) - 进行中 (1小时)
     ├─ 实现进度: 80% (4/5功能完成)
     ├─ 当前测试状态: 4/5通过 ✅
     ├─ 剩余工作: 密码强度验证
     └─ 预计完成: 14:45 (15分钟后)

  ⏳ REFACTOR阶段 (计划: 14:45-15:15) - 30分钟预估

💻 代码状态:
  • 修改文件: 3个
    ├─ UserRegistrationController.java (新建, 156行)
    ├─ UserService.java (修改, +45行)
    └─ UserRepository.java (修改, +23行)
  • 测试文件: 2个  
    ├─ UserRegistrationControllerTest.java (新建, 234行)
    └─ UserServiceTest.java (修改, +67行)

🧪 测试执行状态:
  📈 单元测试: 17/20 通过 (85%)
    ├─ 通过: UserRegistrationControllerTest (4/4)
    ├─ 通过: UserServiceTest (8/8)  
    ├─ 通过: UserValidationTest (3/4) ⚠️ 1个失败
    └─ 失败: PasswordStrengthTest (2/4) ❌ 2个失败

  🔍 集成测试: 3/3 通过 (100%)
    └─ UserRegistrationIntegrationTest: 全部通过 ✅

  📊 覆盖率: 87% (目标: ≥85%) ✅

🔗 依赖和协调:
  🚧 阻塞任务: T002 (用户登录), T003 (密码重置)
     └─ 预计解除: 14:45 (T001完成后)

  ⚠️  潜在冲突检测:
     • UserService.java: task-T003也在修改此文件
     • 冲突类型: 方法签名可能重叠 
     • 建议: 与task-T003协调接口设计

  🤝 协作状态:
     • 最近同步: 30分钟前
     • 待推送提交: 5个
     • 待合并变更: 无

⚡ 性能指标:
  • 开发效率: 95% (高于平均)
  • TDD循环时间: 42分钟 (目标: 45分钟) ✅
  • 代码质量: A+ (测试覆盖率高，无技术债务)
  • 估时准确度: 98% (实际vs预估)

🔄 环境状态:
  • CPU使用率: 45%
  • 内存使用: 2.1GB/8GB
  • 磁盘使用: 156MB
  • 网络: 正常
  • 工具链: 全部正常 ✅
```

### 冲突检测和分析

#### 文件冲突检测
```bash
# 检测跨worktree的文件修改冲突
detect_file_conflicts() {
    echo "🔍 文件冲突检测结果:"
    
    for worktree in ../task-*; do
        local task_id=$(basename "$worktree" | sed 's/task-//')
        local modified_files=$(git -C "$worktree" diff --name-only)
        
        echo "$modified_files" | while read -r file; do
            # 检查其他worktree是否也在修改同一文件
            local conflicts=$(find ../task-* -name ".git" -prune -o -type f -exec \
                sh -c 'git -C "$(dirname "{}")" diff --name-only | grep -q "^'$file'$" && echo "$(dirname "{}")"' \;)
            
            if [[ $(echo "$conflicts" | wc -l) -gt 1 ]]; then
                echo "⚠️  文件冲突: $file"
                echo "$conflicts" | while read -r conflict_worktree; do
                    echo "   └─ $(basename "$conflict_worktree")"
                done
            fi
        done
    done
}
```

#### API接口冲突分析
```bash
# 分析API接口变更冲突
analyze_api_conflicts() {
    echo "🔌 API接口冲突分析:"
    
    # 提取所有worktree中的API定义变更
    for worktree in ../task-*; do
        local task_id=$(basename "$worktree" | sed 's/task-//')
        
        # 查找Controller类的变更
        find "$worktree" -name "*Controller.java" -exec \
            sh -c 'echo "=== $(basename "{}") in '"$task_id"' ==="; grep -n "@.*Mapping" "{}" || true' \;
    done | \
    
    # 分析潜在的接口冲突
    awk '/^===/ {current_file=$2; current_task=$4} 
         /@.*Mapping/ {api_map[current_task][current_file]++; print current_task, current_file, $0}'
}
```

### 性能优化建议

#### 并行度优化
```bash
# 分析并行开发效率
analyze_parallelization_efficiency() {
    local total_worktrees=$(ls -1d ../task-* 2>/dev/null | wc -l)
    local active_worktrees=$(ps aux | grep -c "worktree.*task-")
    local max_capacity=8
    
    local utilization=$((active_worktrees * 100 / max_capacity))
    local efficiency=$((active_worktrees * 100 / total_worktrees))
    
    echo "📊 并行度分析:"
    echo "   • 资源利用率: $utilization% ($active_worktrees/$max_capacity)"
    echo "   • 任务执行效率: $efficiency% ($active_worktrees/$total_worktrees)"
    
    if [[ $utilization -lt 60 ]]; then
        echo "💡 建议: 可以启动更多并行任务以提高资源利用率"
    elif [[ $utilization -gt 90 ]]; then
        echo "⚠️  警告: 资源使用率过高，可能影响性能"
    fi
}
```

#### 任务调度优化
```bash
# 智能任务调度建议
suggest_task_scheduling() {
    echo "🎯 任务调度优化建议:"
    
    # 分析关键路径
    local critical_path=$(jq -r '.dependencies.criticalPath[]' docs/tasks/*.json)
    echo "关键路径任务: $critical_path"
    
    # 识别可并行任务
    local parallel_candidates=$(jq -r '.dependencies.parallelGroups[].tasks[]' docs/tasks/*.json)
    echo "可并行任务组: $parallel_candidates"
    
    # 检查阻塞任务
    local blocked_tasks=$(gh issue list --label "status:blocked" --json number,title)
    if [[ -n "$blocked_tasks" ]]; then
        echo "🚫 当前阻塞任务:"
        echo "$blocked_tasks" | jq -r '.[] | "   • #\(.number): \(.title)"'
    fi
}
```

### 自动化监控

#### 监控脚本
```bash
#!/bin/bash
# parallel-monitor.sh - 并行开发自动监控脚本

MONITOR_INTERVAL=30
LOG_FILE="/tmp/parallel-tdd-monitor.log"

monitor_loop() {
    while true; do
        timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        
        echo "[$timestamp] Monitoring parallel TDD development..." >> "$LOG_FILE"
        
        # 检测严重冲突
        conflicts=$(detect_critical_conflicts)
        if [[ -n "$conflicts" ]]; then
            echo "🚨 严重冲突检测到！" | tee -a "$LOG_FILE"
            echo "$conflicts" | tee -a "$LOG_FILE"
            
            # 发送通知
            send_alert "Critical conflicts detected in parallel development"
        fi
        
        # 检查资源使用
        check_resource_usage
        
        # 更新状态缓存
        update_status_cache
        
        sleep $MONITOR_INTERVAL
    done
}

send_alert() {
    local message="$1"
    
    # Slack通知
    if [[ -n "$SLACK_WEBHOOK" ]]; then
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"'"$message"'"}' \
            "$SLACK_WEBHOOK"
    fi
    
    # 邮件通知
    if [[ -n "$ALERT_EMAIL" ]]; then
        echo "$message" | mail -s "TDD Parallel Development Alert" "$ALERT_EMAIL"
    fi
}
```

### 协调机制

#### 任务协调流程
```yaml
协调事件类型:
  1. 任务开始: 检查依赖和冲突
  2. 阶段完成: 通知下游任务
  3. 文件修改: 检测并发修改
  4. 代码提交: 触发集成检查
  5. 任务完成: 解除阻塞关系

自动协调规则:
  - 检测到冲突时暂停相关任务
  - 依赖完成时自动通知等待任务
  - 关键文件修改时发送协调通知
  - 集成失败时回滚并重新协调
```

#### 冲突解决建议
```bash
# 生成冲突解决建议
generate_conflict_resolution() {
    local conflict_type="$1"
    
    case "$conflict_type" in
        "file_conflict")
            echo "💡 文件冲突解决建议:"
            echo "   1. 协调修改时间，避免同时编辑"
            echo "   2. 将共享逻辑提取为独立模块"
            echo "   3. 使用feature toggle隔离变更"
            ;;
        "api_conflict")
            echo "💡 API冲突解决建议:"
            echo "   1. 先完成接口定义，再并行实现"
            echo "   2. 使用API版本控制处理变更"
            echo "   3. 建立接口变更审查流程"
            ;;
        "database_conflict")
            echo "💡 数据库冲突解决建议:"
            echo "   1. 设计数据库变更兼容策略"
            echo "   2. 使用数据库迁移工具管理变更"
            echo "   3. 协调数据模型变更时序"
            ;;
    esac
}
```

### 集成配置

#### 监控配置
```json
{
  "parallelMonitoring": {
    "refreshInterval": 30,
    "maxWorktrees": 8,
    "conflictDetection": {
      "fileConflicts": true,
      "apiConflicts": true,
      "databaseConflicts": true,
      "testDataConflicts": true
    },
    "alerts": {
      "slack": {
        "webhook": "${SLACK_WEBHOOK}",
        "channel": "#development"
      },
      "email": {
        "recipients": ["team-lead@example.com"],
        "urgentThreshold": "critical"
      }
    },
    "performance": {
      "utilizationTarget": 75,
      "efficiencyThreshold": 80,
      "cycleTimeTarget": 45
    }
  }
}
```

### 使用场景

#### 1. 实时开发监控
```bash
# 开启实时监控
/tdd:parallel-status --watch

# 在另一个终端检查特定问题
/tdd:parallel-status --conflict-analysis
```

#### 2. 团队协调会议
```bash
# 生成协调报告
/tdd:parallel-status --report --conflict-summary --team-status

# 展示依赖关系状态
/tdd:parallel-status --dependency-analysis --critical-path
```

#### 3. 性能优化
```bash
# 分析并行效率
/tdd:parallel-status --efficiency-analysis --optimization-suggestions

# 资源使用分析  
/tdd:parallel-status --resource-analysis --capacity-planning
```

### 最佳实践

#### 监控建议
- **持续监控**: 开发期间保持实时监控
- **主动协调**: 发现潜在冲突时及时协调
- **定期回顾**: 分析并行开发效率和改进空间

#### 团队协作
- **冲突预防**: 提前沟通可能的冲突点
- **状态同步**: 及时更新任务状态和依赖关系
- **知识共享**: 分享并行开发的经验和最佳实践

---
**下一步**: 根据监控结果优化并行开发策略，提高团队协作效率