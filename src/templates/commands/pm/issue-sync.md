---
description: 同步任务到GitHub Issues进行项目管理
allowed-tools: Bash, Read, Write
---

## 🔄 GitHub Issues 高级同步

智能化的任务同步系统，支持批量创建、依赖管理、自动化工作流，实现从PRD到代码交付的完整项目管理。

### 核心功能

#### 基础同步功能
- 将本地TDD任务推送到GitHub Issues
- 从GitHub Issues拉取最新任务状态
- 双向状态同步和冲突解决
- 支持标签管理和任务分配

#### 高级功能增强
- **批量任务创建**: 一次性创建整个功能模块的所有Issues
- **智能依赖链接**: 自动建立任务间的依赖关系和阻塞关系
- **任务模板引擎**: 基于任务类型自动生成标准化Issue内容
- **里程碑自动管理**: 根据功能和时间线自动创建和分配里程碑
- **工作流自动化**: 集成GitHub Actions实现状态自动流转
- **进度可视化**: 生成项目看板和进度报表

### 前置条件

#### GitHub CLI配置
确保已安装并配置GitHub CLI：

```bash
# 检查gh命令是否可用
gh --version

# 如果未登录，先进行认证
gh auth login
```

#### 项目配置
确保项目已关联GitHub仓库：

```bash
# 检查GitHub仓库配置
git remote -v

# 如果未配置，添加远程仓库
git remote add origin https://github.com/username/repository.git
```

### 同步命令

#### 批量任务创建
基于任务清单JSON文件批量创建Issues：

```bash
# 批量创建整个功能模块的所有任务
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh batch-create \
  --tasks-file "docs/tasks/user-auth.tasks.json"

# 批量创建并建立依赖关系
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh batch-create \
  --tasks-file "docs/tasks/user-auth.tasks.json" \
  --with-dependencies

# 批量创建指定优先级的任务
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh batch-create \
  --tasks-file "docs/tasks/user-auth.tasks.json" \
  --priority "P0,P1"
```

#### 智能依赖链接
自动建立和管理任务间依赖关系：

```bash
# 根据任务JSON自动建立依赖链接
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh link-dependencies \
  --tasks-file "docs/tasks/user-auth.tasks.json"

# 建立特定任务间的阻塞关系
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh link-blocking \
  --blocker-issue 123 \
  --blocked-issues "124,125,126"

# 更新依赖关系（当任务完成时）
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh update-dependencies \
  --completed-issue 123
```

#### 基础单任务同步
将单个或少量任务推送到GitHub：

```bash
# 同步所有待处理任务
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh push

# 同步特定功能的任务
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh push --feature "user-auth"

# 同步特定任务ID
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh push --task-ids "T001,T002,T003"
```

#### 状态同步和拉取
获取GitHub Issues的最新状态：

```bash
# 拉取所有相关Issues状态
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh pull

# 拉取特定Issue状态并更新依赖
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh pull \
  --issue 123 \
  --update-dependencies

# 批量拉取多个Issue状态
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh pull \
  --issues "123,124,125"
```

#### 全量双向同步
同时推送和拉取，保持本地和远程一致：

```bash
# 标准双向同步
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh sync

# 包含依赖关系的完整同步
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh sync \
  --with-dependencies \
  --update-milestones

# 强制同步（解决冲突时使用）
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/sync-to-github.sh sync \
  --force \
  --conflict-resolution "github-priority"
```

### Issue映射规则

#### 标签规范
- `tdd:red` - RED阶段任务
- `tdd:green` - GREEN阶段任务  
- `tdd:refactor` - REFACTOR阶段任务
- `priority:P0` / `priority:P1` / `priority:P2` / `priority:P3` - 优先级标签
- `type:feature` - 功能开发
- `type:bug` - 缺陷修复
- `type:refactor` - 重构任务
- `type:infrastructure` - 基础设施
- `status:blocked` - 被阻塞任务
- `status:ready` - 准备开始
- `status:in-progress` - 进行中
- `complexity:low` / `complexity:medium` / `complexity:high` - 复杂度标签
- `epic:{EPIC_NAME}` - Epic标签，用于分组
- `dependency:blocks` - 阻塞其他任务
- `dependency:depends-on` - 依赖其他任务

#### 批量创建映射规则

##### 任务JSON到Issue的映射
```json
{
  "taskMapping": {
    "id": "issue.title前缀",
    "title": "issue.title主体",
    "description": "issue.body描述部分",
    "priority": "priority:{value}标签",
    "type": "type:{value}标签",
    "complexity": "complexity:{value}标签",
    "epic": "epic:{value}标签",
    "labels": "附加标签数组",
    "assignee": "issue.assignee",
    "milestone": "issue.milestone",
    "estimatedHours": "issue.body估时部分",
    "tdd.testStrategy": "issue.body测试策略部分",
    "dependencies.blocks": "依赖关系链接",
    "dependencies.dependsOn": "依赖关系链接"
  }
}
```

##### 依赖关系处理
- **阻塞关系(blocks)**: 在被阻塞任务的Issue中添加"Blocked by #123"注释
- **依赖关系(dependsOn)**: 在当前任务的Issue中添加"Depends on #123"注释  
- **软依赖(softDependencies)**: 在Issue中添加"Related to #123"注释
- **关键路径**: 使用特殊标签`critical-path`标记

#### Issue模板
```markdown
# [RED] 用户注册基础功能

## 📋 任务描述
实现用户注册的核心功能，包括邮箱验证和基本信息保存。

## 🔴 TDD阶段：RED
编写失败测试用例验证：
- 有效邮箱注册成功
- 重复邮箱注册失败  
- 无效邮箱格式拒绝

## ✅ 验收标准
- [ ] 注册API接受有效邮箱和密码
- [ ] 重复邮箱注册返回409错误
- [ ] 无效邮箱格式返回400错误
- [ ] 密码符合安全规范

## 🔗 相关文档
- PRD: docs/prd/user-auth.prd.md
- 设计: docs/design/user-auth.design.md
- 测试规范: docs/test-specs/user-auth.test-spec.md

## 📊 TDD状态
- 当前阶段: RED
- 预估工时: 4小时
- 依赖任务: 无

---
🤖 Generated by Claude TDD Workflow
```

#### 批量Issue模板
用于批量创建时的增强模板：

```markdown
# [T{{task.id}}] {{task.title}}

## 📋 任务信息
- **任务ID**: {{task.id}}
- **Epic**: {{task.epic}}
- **用户故事**: {{task.userStoryId}}
- **优先级**: {{task.priority}}
- **复杂度**: {{task.complexity}}
- **预估工时**: {{task.estimatedHours}}小时

## 📖 任务描述
{{task.description}}

## 🎯 验收标准
{{#each task.acceptanceCriteria}}
- [ ] {{this}}
{{/each}}

## 🔴 TDD策略
**测试范围**: {{task.tdd.testScope}}

**测试策略**: {{task.tdd.testStrategy}}

**测试文件**:
{{#each task.tdd.testFiles}}
- `{{this}}`
{{/each}}

**实现文件**:
{{#each task.tdd.implementationFiles}}
- `{{this}}`
{{/each}}

## 🔗 依赖关系
{{#if task.dependencies.dependsOn}}
**依赖任务**: 
{{#each task.dependencies.dependsOn}}
- Depends on #{{this}} 
{{/each}}
{{/if}}

{{#if task.dependencies.blocks}}
**阻塞任务**:
{{#each task.dependencies.blocks}}  
- Blocks #{{this}}
{{/each}}
{{/if}}

{{#if task.dependencies.softDependencies}}
**相关任务**:
{{#each task.dependencies.softDependencies}}
- Related to #{{this}}
{{/each}}
{{/if}}

## 🏷️ 技术标签
{{#each task.labels}}
- {{this}}
{{/each}}

## 📊 质量门禁
- **单元测试覆盖率**: {{task.qualityGates.unitTestCoverage}}
- **集成测试**: {{task.qualityGates.integrationTests}}
- **代码审查**: {{task.qualityGates.codeReview}}
- **性能测试**: {{task.qualityGates.performanceTest}}

## 🔧 工作环境
- **Worktree**: {{task.workEnvironment.worktree}}
- **分支**: {{task.workEnvironment.branch}}
- **隔离级别**: {{task.workEnvironment.isolationLevel}}

## 📚 相关文档
- PRD: docs/prd/{{featureId}}.prd.md
- 需求分析: docs/analysis/{{featureId}}.requirements.md  
- 技术设计: docs/design/{{featureId}}.design.md
- 测试规范: docs/test-specs/{{featureId}}.test-spec.md

---
🤖 Auto-generated from {{task.sourceFile}} | TDD Workflow v{{version}}
```

## 批量操作详解

### 批量创建工作流

#### 1. 任务解析阶段
```bash
# 解析任务文件，生成创建计划
parse_tasks() {
    local tasks_file="$1"
    local parsed_tasks="/tmp/parsed-tasks-$(date +%s).json"
    
    jq '.tasks[] | {
        id: .id,
        title: .title,
        description: .description,
        priority: .priority,
        type: .type,
        epic: .epic,
        labels: .labels,
        dependencies: .dependencies,
        estimatedHours: .estimatedHours,
        tdd: .tdd,
        milestone: .milestone
    }' "$tasks_file" > "$parsed_tasks"
    
    echo "$parsed_tasks"
}
```

#### 2. 依赖关系预处理
```bash
# 分析依赖关系，确定创建顺序
analyze_dependencies() {
    local tasks_file="$1"
    local dependency_graph="/tmp/dependency-graph-$(date +%s).json"
    
    # 构建依赖图
    jq '.dependencies.graph' "$tasks_file" > "$dependency_graph"
    
    # 拓扑排序，确定创建顺序
    python3 -c "
import json, sys
from collections import defaultdict, deque

with open('$dependency_graph') as f:
    graph = json.load(f)

def topological_sort(graph):
    in_degree = defaultdict(int)
    adj_list = defaultdict(list)
    
    for node, deps in graph.items():
        for dep in deps:
            adj_list[dep].append(node)
            in_degree[node] += 1
    
    queue = deque([node for node in graph if in_degree[node] == 0])
    result = []
    
    while queue:
        current = queue.popleft()
        result.append(current)
        
        for neighbor in adj_list[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    return result

sorted_tasks = topological_sort(graph)
print(','.join(sorted_tasks))
    "
}
```

#### 3. 批量创建执行
```bash
# 按依赖顺序批量创建Issues
batch_create_issues() {
    local tasks_file="$1"
    local creation_order="$2"
    local created_issues="/tmp/created-issues-$(date +%s).json"
    
    # 初始化Issue映射表
    echo '{}' > "$created_issues"
    
    IFS=',' read -ra TASK_IDS <<< "$creation_order"
    
    for task_id in "${TASK_IDS[@]}"; do
        echo "Creating issue for task: $task_id"
        
        # 提取任务信息
        local task_data=$(jq -r --arg id "$task_id" '.tasks[] | select(.id == $id)' "$tasks_file")
        
        # 生成Issue内容
        local issue_title="[${task_id}] $(echo "$task_data" | jq -r '.title')"
        local issue_body=$(generate_issue_body "$task_data" "$created_issues")
        local issue_labels=$(echo "$task_data" | jq -r '.labels | join(",")')
        local issue_milestone=$(echo "$task_data" | jq -r '.milestone')
        
        # 创建Issue
        local issue_url=$(gh issue create \
            --title "$issue_title" \
            --body "$issue_body" \
            --label "$issue_labels" \
            --milestone "$issue_milestone" \
            --json url -q .url)
        
        local issue_number=$(echo "$issue_url" | grep -o '[0-9]*$')
        
        # 记录创建的Issue
        jq --arg task_id "$task_id" --arg issue_number "$issue_number" --arg issue_url "$issue_url" \
            '.[$task_id] = {number: $issue_number, url: $issue_url}' \
            "$created_issues" > "${created_issues}.tmp" && mv "${created_issues}.tmp" "$created_issues"
        
        echo "Created issue #$issue_number for task $task_id"
    done
    
    echo "$created_issues"
}
```

### 智能依赖管理

#### 1. 依赖关系建立
```bash
# 建立Issue间的依赖关系
establish_dependencies() {
    local tasks_file="$1"  
    local created_issues="$2"
    
    jq -r '.tasks[] | select(.dependencies.dependsOn | length > 0) | 
        {id: .id, depends: .dependencies.dependsOn}' "$tasks_file" |
    while IFS= read -r task_info; do
        local task_id=$(echo "$task_info" | jq -r '.id')
        local current_issue=$(jq -r --arg id "$task_id" '.[$id].number' "$created_issues")
        
        echo "$task_info" | jq -r '.depends[]' |
        while read -r dep_task_id; do
            local dep_issue=$(jq -r --arg id "$dep_task_id" '.[$id].number' "$created_issues")
            
            if [[ "$dep_issue" != "null" && "$current_issue" != "null" ]]; then
                # 在当前Issue中添加依赖注释
                gh issue comment "$current_issue" --body "⛓️ **Depends on**: #$dep_issue"
                
                # 在依赖Issue中添加阻塞注释  
                gh issue comment "$dep_issue" --body "🚧 **Blocks**: #$current_issue"
                
                # 添加依赖标签
                gh issue edit "$current_issue" --add-label "dependency:depends-on"
                gh issue edit "$dep_issue" --add-label "dependency:blocks"
                
                echo "Linked dependency: #$current_issue depends on #$dep_issue"
            fi
        done
    done
}
```

#### 2. 阻塞关系管理
```bash
# 管理任务阻塞状态
manage_blocking_status() {
    local completed_issue="$1"
    
    # 获取被该Issue阻塞的所有任务
    local blocked_issues=$(gh issue view "$completed_issue" --json comments |
        jq -r '.comments[] | select(.body | contains("🚧 **Blocks**")) | 
            .body | match("#([0-9]+)"; "g") | .captures[0].string')
    
    echo "$blocked_issues" | while read -r blocked_issue; do
        if [[ -n "$blocked_issue" ]]; then
            # 检查被阻塞任务的其他依赖是否都已完成
            local remaining_deps=$(gh issue view "$blocked_issue" --json comments |
                jq -r '.comments[] | select(.body | contains("⛓️ **Depends on**")) | 
                    .body | match("#([0-9]+)"; "g") | .captures[0].string')
            
            local all_completed=true
            echo "$remaining_deps" | while read -r dep_issue; do
                if [[ -n "$dep_issue" ]]; then
                    local dep_state=$(gh issue view "$dep_issue" --json state -q .state)
                    if [[ "$dep_state" != "CLOSED" ]]; then
                        all_completed=false
                        break
                    fi
                fi
            done
            
            if [[ "$all_completed" == "true" ]]; then
                # 移除阻塞状态
                gh issue edit "$blocked_issue" --remove-label "status:blocked"
                gh issue edit "$blocked_issue" --add-label "status:ready"
                
                gh issue comment "$blocked_issue" --body "✅ **Unblocked**: All dependencies completed. Ready to start!"
                
                echo "Unblocked issue #$blocked_issue"
            fi
        fi
    done
}

### 里程碑管理

#### 创建里程碑
根据功能模块自动创建里程碑：

```bash
# 为功能创建里程碑
gh api repos/:owner/:repo/milestones \
  --method POST \
  --field title="用户认证系统" \
  --field description="完整的用户认证功能实现" \
  --field due_on="2024-02-28T09:00:00Z"
```

#### 任务分配
自动将任务分配到对应里程碑：

```bash
# 将Issue分配到里程碑
gh issue edit 123 --milestone "用户认证系统"
```

### 状态映射

#### TDD阶段 → GitHub状态
```
RED → Open (draft)
GREEN → In Progress
REFACTOR → Review Required  
DONE → Closed
BLOCKED → Blocked
```

#### GitHub状态 → 本地同步
```json
{
  "open": "pending",
  "in_progress": "active", 
  "closed": "completed",
  "blocked": "blocked"
}
```

### 协作工作流

#### 团队开发流程
1. **PM创建PRD** → 解析为任务 → 同步到GitHub
2. **开发者选择任务** → 更新Issue状态 → 开始TDD
3. **完成阶段** → 自动更新Issue → 推送代码
4. **代码审查** → Issue评论讨论 → 合并或修改
5. **任务完成** → 关闭Issue → 更新里程碑进度

#### 状态自动化
```bash
# Git hooks自动更新Issue状态
# .git/hooks/post-commit
#!/bin/bash
if [[ $COMMIT_MSG =~ \[GREEN\] ]]; then
    gh issue edit $ISSUE_NUMBER --add-label "tdd:green"
fi
```

### 报表和度量

#### 进度报表
```bash
# 生成项目进度报告
gh api repos/:owner/:repo/issues \
  --jq '.[] | select(.labels[].name | contains("tdd:")) | {number, title, state, labels}'
```

#### TDD度量指标
- RED/GREEN/REFACTOR阶段分布
- 任务完成速度
- 阻塞任务数量
- 代码质量趋势

### 配置选项

#### 同步配置
```json
{
  "github": {
    "autoSync": true,
    "syncInterval": "30m",
    "labelPrefix": "tdd:",
    "milestonePrefix": "TDD-",
    "assignees": ["@me"],
    "defaultLabels": ["tdd", "auto-generated"]
  }
}
```

#### 通知设置
```json
{
  "notifications": {
    "issueCreated": true,
    "statusChanged": true,
    "assignmentChanged": true,
    "commentAdded": false
  }
}
```

### 故障排除

#### 常见问题
1. **认证失败**
   ```bash
   gh auth refresh
   ```

2. **权限不足**
   - 确保有repo的write权限
   - 检查GitHub token权限

3. **同步冲突**
   ```bash
   # 强制从GitHub拉取最新状态
   bash sync-to-github.sh pull --force
   ```

#### 冲突解决
当本地状态与GitHub不一致时：
1. 优先采用GitHub的状态
2. 记录冲突日志供审查
3. 提示手动解决需要人工判断的冲突

### 安全注意事项

- GitHub token安全存储
- 敏感信息不同步到公开仓库
- 访问权限最小化原则
- 定期轮换访问token

---
**下一步**: 使用 `/pm:next` 选择下一个要处理的任务，开始TDD开发