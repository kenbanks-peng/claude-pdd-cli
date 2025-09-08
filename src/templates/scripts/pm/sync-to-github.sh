#!/bin/bash

# GitHub Issues同步脚本
# 双向同步任务文件与GitHub Issues，管理依赖关系

set -euo pipefail

readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly LOG_FILE="${PROJECT_ROOT}/.claude/logs/github-sync.log"
readonly CACHE_DIR="${PROJECT_ROOT}/.claude/cache"

# GitHub API配置
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
GITHUB_REPO="${GITHUB_REPO:-}"
GITHUB_API_BASE="https://api.github.com"

# 日志记录
log() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 错误处理
error() {
    log "错误: $1"
    exit 1
}

# 检查GitHub配置
check_github_config() {
    if [[ -z "$GITHUB_TOKEN" ]]; then
        error "GITHUB_TOKEN环境变量未设置"
    fi
    
    if [[ -z "$GITHUB_REPO" ]]; then
        # 尝试从git远程获取仓库信息
        if command -v git >/dev/null && git rev-parse --git-dir >/dev/null 2>&1; then
            local remote_url
            remote_url=$(git remote get-url origin 2>/dev/null || echo "")
            if [[ "$remote_url" =~ github\.com[:/]([^/]+)/([^/.]+) ]]; then
                GITHUB_REPO="${BASH_REMATCH[1]}/${BASH_REMATCH[2]}"
                log "自动检测到仓库: $GITHUB_REPO"
            else
                error "无法获取GitHub仓库信息，请设置GITHUB_REPO环境变量"
            fi
        else
            error "GITHUB_REPO环境变量未设置且无法从git获取"
        fi
    fi
}

# GitHub API调用
github_api() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    
    local curl_args=(
        -X "$method"
        -H "Authorization: token $GITHUB_TOKEN"
        -H "Accept: application/vnd.github.v3+json"
        -H "Content-Type: application/json"
        -s
    )
    
    if [[ -n "$data" ]]; then
        curl_args+=(-d "$data")
    fi
    
    local url="${GITHUB_API_BASE}/repos/${GITHUB_REPO}${endpoint}"
    curl "${curl_args[@]}" "$url"
}

# 获取或创建标签
ensure_labels() {
    local labels_to_create=(
        "tdd:red:FF0000:TDD Red Phase"
        "tdd:green:00FF00:TDD Green Phase"
        "tdd:refactor:0066CC:TDD Refactor Phase"
        "priority:critical:FF0000:Critical Priority"
        "priority:high:FF6600:High Priority"
        "priority:medium:FFCC00:Medium Priority"
        "priority:low:CCCCCC:Low Priority"
        "type:feature:0066CC:New Feature"
        "type:test:00CC66:Test Related"
        "type:refactor:CC6600:Refactoring"
        "type:bug:FF0000:Bug Fix"
        "blocked:FF0000:Task is blocked"
    )
    
    local existing_labels
    existing_labels=$(github_api GET "/labels" | jq -r '.[].name')
    
    for label_def in "${labels_to_create[@]}"; do
        IFS=':' read -r name color description <<< "$label_def"
        
        if ! echo "$existing_labels" | grep -q "^${name}$"; then
            local label_data
            label_data=$(jq -n \
                --arg name "$name" \
                --arg color "$color" \
                --arg description "$description" \
                '{name: $name, color: $color, description: $description}')
            
            github_api POST "/labels" "$label_data" >/dev/null
            log "创建标签: $name"
        fi
    done
}

# 任务转换为Issue
task_to_issue() {
    local task="$1"
    local feature_prefix="${2:-}"
    
    local title body labels assignees
    title=$(echo "$task" | jq -r '.title')
    
    # 添加功能前缀
    if [[ -n "$feature_prefix" ]]; then
        title="[$feature_prefix] $title"
    fi
    
    # 构建Issue描述
    local description estimation acceptance_criteria dependencies
    description=$(echo "$task" | jq -r '.description // ""')
    estimation=$(echo "$task" | jq -r '.estimation // "未估算"')
    acceptance_criteria=$(echo "$task" | jq -r '.acceptanceCriteria // ""')
    dependencies=$(echo "$task" | jq -r '.dependencies[]?' | tr '\n' ',' | sed 's/,$//')
    
    body="## 任务描述
$description

## 估算时间
$estimation

## 验收标准
$acceptance_criteria

## 技术要求
$(echo "$task" | jq -r '.technicalRequirements // "无特殊要求"')

## 依赖任务
${dependencies:-"无"}

---
*此Issue由Claude TDD工具自动创建*"
    
    # 构建标签
    local priority type complexity status
    priority=$(echo "$task" | jq -r '.priority // "medium"')
    type=$(echo "$task" | jq -r '.type // "feature"')
    complexity=$(echo "$task" | jq -r '.complexity // 5')
    status=$(echo "$task" | jq -r '.status')
    
    labels=("priority:$priority" "type:$type")
    
    # 添加复杂度标签
    if [[ $complexity -gt 7 ]]; then
        labels+=("complexity:high")
    elif [[ $complexity -lt 3 ]]; then
        labels+=("complexity:low")
    fi
    
    # 添加状态标签
    case "$status" in
        blocked) labels+=("blocked") ;;
        in_progress) labels+=("in progress") ;;
    esac
    
    # 构建JSON
    jq -n \
        --arg title "$title" \
        --arg body "$body" \
        --argjson labels "$(printf '%s\n' "${labels[@]}" | jq -R . | jq -s .)" \
        '{title: $title, body: $body, labels: $labels}'
}

# 创建单个Issue
create_issue() {
    local task="$1"
    local feature_prefix="${2:-}"
    
    local issue_data
    issue_data=$(task_to_issue "$task" "$feature_prefix")
    
    local response
    response=$(github_api POST "/issues" "$issue_data")
    
    local issue_number
    issue_number=$(echo "$response" | jq -r '.number')
    
    if [[ "$issue_number" == "null" ]]; then
        log "❌ 创建Issue失败"
        echo "$response" | jq .
        return 1
    fi
    
    local task_id
    task_id=$(echo "$task" | jq -r '.id')
    log "✅ 创建Issue #$issue_number for $task_id"
    
    echo "$issue_number"
}

# 批量创建Issues
batch_create_issues() {
    local tasks_file="$1"
    local feature_filter="${2:-}"
    local with_dependencies="${3:-false}"
    local priority_filter="${4:-}"
    
    if [[ ! -f "$tasks_file" ]]; then
        error "任务文件不存在: $tasks_file"
    fi
    
    local tasks
    tasks=$(jq '.tasks' "$tasks_file")
    
    # 应用过滤器
    if [[ -n "$feature_filter" ]]; then
        tasks=$(echo "$tasks" | jq --arg feature "$feature_filter" '[.[] | select(.feature == $feature)]')
    fi
    
    if [[ -n "$priority_filter" ]]; then
        tasks=$(echo "$tasks" | jq --arg priority "$priority_filter" '[.[] | select(.priority == $priority)]')
    fi
    
    local task_count
    task_count=$(echo "$tasks" | jq '. | length')
    
    if [[ $task_count -eq 0 ]]; then
        echo "没有符合条件的任务"
        return 0
    fi
    
    echo "准备创建 $task_count 个Issues..."
    
    ensure_labels
    
    # 存储任务ID到Issue编号的映射
    local mapping_file="${CACHE_DIR}/issue-mapping.json"
    mkdir -p "$CACHE_DIR"
    
    if [[ ! -f "$mapping_file" ]]; then
        echo '{}' > "$mapping_file"
    fi
    
    local created_count=0
    while IFS= read -r task; do
        local task_id feature_name
        task_id=$(echo "$task" | jq -r '.id')
        feature_name=$(echo "$task" | jq -r '.feature // ""')
        
        # 检查是否已创建
        local existing_issue
        existing_issue=$(jq -r --arg id "$task_id" '.[$id] // "null"' "$mapping_file")
        
        if [[ "$existing_issue" != "null" ]]; then
            log "跳过已存在的任务: $task_id (Issue #$existing_issue)"
            continue
        fi
        
        local issue_number
        if issue_number=$(create_issue "$task" "$feature_name"); then
            # 更新映射文件
            local temp_file
            temp_file=$(mktemp)
            jq --arg id "$task_id" --arg issue "$issue_number" '. + {($id): $issue}' "$mapping_file" > "$temp_file"
            mv "$temp_file" "$mapping_file"
            
            ((created_count++))
            sleep 1  # 避免API限制
        fi
        
    done < <(echo "$tasks" | jq -c '.[]')
    
    echo "✅ 成功创建 $created_count 个Issues"
    
    # 如果需要建立依赖关系
    if [[ "$with_dependencies" == "true" ]]; then
        log "开始建立依赖关系..."
        link_dependencies "$tasks_file"
    fi
}

# 建立依赖关系
link_dependencies() {
    local tasks_file="$1"
    local mapping_file="${CACHE_DIR}/issue-mapping.json"
    
    if [[ ! -f "$mapping_file" ]]; then
        log "映射文件不存在，无法建立依赖关系"
        return 1
    fi
    
    local tasks
    tasks=$(jq '.tasks' "$tasks_file")
    
    while IFS= read -r task; do
        local task_id
        task_id=$(echo "$task" | jq -r '.id')
        
        local dependencies
        dependencies=$(echo "$task" | jq -r '.dependencies[]?' || true)
        
        if [[ -z "$dependencies" ]]; then
            continue
        fi
        
        local issue_number
        issue_number=$(jq -r --arg id "$task_id" '.[$id] // "null"' "$mapping_file")
        
        if [[ "$issue_number" == "null" ]]; then
            continue
        fi
        
        local dep_links=""
        while IFS= read -r dep_id; do
            [[ -z "$dep_id" ]] && continue
            
            local dep_issue
            dep_issue=$(jq -r --arg id "$dep_id" '.[$id] // "null"' "$mapping_file")
            
            if [[ "$dep_issue" != "null" ]]; then
                dep_links+="Depends on #$dep_issue\n"
            fi
        done <<< "$dependencies"
        
        if [[ -n "$dep_links" ]]; then
            local comment_body="## 依赖关系\n\n$dep_links\n---\n*自动添加的依赖信息*"
            local comment_data
            comment_data=$(jq -n --arg body "$(echo -e "$comment_body")" '{body: $body}')
            
            github_api POST "/issues/${issue_number}/comments" "$comment_data" >/dev/null
            log "✅ 为Issue #$issue_number 添加依赖信息"
        fi
        
    done < <(echo "$tasks" | jq -c '.[]')
}

# 同步Issue状态到任务文件
pull_issue_status() {
    local tasks_file="$1"
    local issue_ids="${2:-}"
    local update_dependencies="${3:-false}"
    
    local mapping_file="${CACHE_DIR}/issue-mapping.json"
    
    if [[ ! -f "$mapping_file" ]]; then
        log "映射文件不存在"
        return 1
    fi
    
    local issues_to_check=()
    
    if [[ -n "$issue_ids" ]]; then
        # 指定的Issue IDs
        IFS=',' read -ra issues_to_check <<< "$issue_ids"
    else
        # 所有已映射的Issues
        mapfile -t issues_to_check < <(jq -r '.[]' "$mapping_file")
    fi
    
    local updated_count=0
    
    for issue_id in "${issues_to_check[@]}"; do
        local issue_info
        issue_info=$(github_api GET "/issues/$issue_id")
        
        local github_state labels
        github_state=$(echo "$issue_info" | jq -r '.state')
        labels=$(echo "$issue_info" | jq -r '.labels[].name')
        
        # 转换GitHub状态到任务状态
        local task_status="pending"
        case "$github_state" in
            closed) task_status="completed" ;;
            open)
                if echo "$labels" | grep -q "in progress"; then
                    task_status="in_progress"
                elif echo "$labels" | grep -q "blocked"; then
                    task_status="blocked"
                else
                    task_status="pending"
                fi
                ;;
        esac
        
        # 找到对应的任务ID
        local task_id
        task_id=$(jq -r --arg issue "$issue_id" 'to_entries[] | select(.value == $issue) | .key' "$mapping_file")
        
        if [[ "$task_id" != "null" ]] && [[ -n "$task_id" ]]; then
            # 更新任务文件
            local temp_file
            temp_file=$(mktemp)
            
            jq --arg id "$task_id" \
               --arg status "$task_status" \
               '(.tasks[] | select(.id == $id) | .status) = $status' \
               "$tasks_file" > "$temp_file"
            
            mv "$temp_file" "$tasks_file"
            log "✅ 更新任务 $task_id 状态为 $task_status"
            ((updated_count++))
        fi
    done
    
    echo "✅ 同步完成，更新了 $updated_count 个任务状态"
}

# 双向同步
sync_bidirectional() {
    local tasks_file="$1"
    local with_dependencies="${2:-false}"
    local force="${3:-false}"
    
    log "🔄 开始双向同步..."
    
    # 先推送本地更改到GitHub
    echo "📤 推送本地任务到GitHub..."
    push_updates "$tasks_file"
    
    # 再拉取GitHub更改到本地
    echo "📥 拉取GitHub状态到本地..."
    pull_issue_status "$tasks_file" "" "$with_dependencies"
    
    log "✅ 双向同步完成"
}

# 推送更新到GitHub
push_updates() {
    local tasks_file="$1"
    
    log "推送更新暂未实现，请使用batch-create或其他命令"
}

# 显示帮助
show_help() {
    cat << EOF
GitHub Issues同步工具

用法:
  $0 <command> [options]

命令:
  batch-create                批量创建Issues
    --tasks-file <file>       任务文件路径
    --feature <name>          只处理指定功能的任务
    --priority <level>        只处理指定优先级的任务
    --with-dependencies       同时建立依赖关系

  link-dependencies           建立依赖关系
    --tasks-file <file>       任务文件路径

  link-blocking               建立阻塞关系
    --blocker-issue <id>      阻塞者Issue ID
    --blocked-issue <id>      被阻塞者Issue ID

  update-dependencies         更新依赖关系
    --completed-issue <id>    已完成的Issue ID

  push                        推送本地更改
    --feature <name>          指定功能
    --task-ids <ids>          指定任务IDs (逗号分隔)

  pull                        拉取GitHub状态
    --issue <id>              指定Issue ID
    --issues <ids>            指定多个Issue IDs (逗号分隔)
    --update-dependencies     同时更新依赖状态

  sync                        双向同步
    --with-dependencies       包含依赖关系
    --force                   强制同步（解决冲突时使用）

环境变量:
  GITHUB_TOKEN              GitHub访问令牌 (必需)
  GITHUB_REPO               GitHub仓库 (格式: owner/repo)

示例:
  export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
  export GITHUB_REPO="username/project"
  
  $0 batch-create --tasks-file "docs/tasks/user-auth.tasks.json"
  $0 pull --issues "123,124,125"
  $0 sync --with-dependencies
EOF
}

# 主函数
main() {
    local command="$1"
    shift || true
    
    # 检查GitHub配置
    check_github_config
    
    case "$command" in
        batch-create)
            local tasks_file="" feature="" priority="" with_dependencies="false"
            
            while [[ $# -gt 0 ]]; do
                case $1 in
                    --tasks-file) tasks_file="$2"; shift 2 ;;
                    --feature) feature="$2"; shift 2 ;;
                    --priority) priority="$2"; shift 2 ;;
                    --with-dependencies) with_dependencies="true"; shift ;;
                    *) error "未知参数: $1" ;;
                esac
            done
            
            [[ -z "$tasks_file" ]] && error "缺少 --tasks-file 参数"
            batch_create_issues "$tasks_file" "$feature" "$with_dependencies" "$priority"
            ;;
            
        link-dependencies)
            local tasks_file=""
            while [[ $# -gt 0 ]]; do
                case $1 in
                    --tasks-file) tasks_file="$2"; shift 2 ;;
                    *) error "未知参数: $1" ;;
                esac
            done
            
            [[ -z "$tasks_file" ]] && error "缺少 --tasks-file 参数"
            link_dependencies "$tasks_file"
            ;;
            
        pull)
            local tasks_file="" issue="" issues="" update_dependencies="false"
            while [[ $# -gt 0 ]]; do
                case $1 in
                    --issue) issue="$2"; shift 2 ;;
                    --issues) issues="$2"; shift 2 ;;
                    --update-dependencies) update_dependencies="true"; shift ;;
                    *) error "未知参数: $1" ;;
                esac
            done
            
            local issue_ids="${issue:-$issues}"
            pull_issue_status "${tasks_file:-$(find . -name "*.tasks.json" | head -1)}" "$issue_ids" "$update_dependencies"
            ;;
            
        sync)
            local tasks_file="" with_dependencies="false" force="false"
            while [[ $# -gt 0 ]]; do
                case $1 in
                    --with-dependencies) with_dependencies="true"; shift ;;
                    --force) force="true"; shift ;;
                    *) error "未知参数: $1" ;;
                esac
            done
            
            sync_bidirectional "${tasks_file:-$(find . -name "*.tasks.json" | head -1)}" "$with_dependencies" "$force"
            ;;
            
        help|--help|-h)
            show_help
            ;;
            
        *)
            error "未知命令: $command"
            ;;
    esac
}

# 检查依赖
for cmd in curl jq; do
    if ! command -v "$cmd" >/dev/null 2>&1; then
        error "需要安装 $cmd 命令"
    fi
done

if [[ $# -eq 0 ]]; then
    show_help
    exit 1
fi

main "$@"