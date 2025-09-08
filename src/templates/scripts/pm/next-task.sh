#!/bin/bash

# 智能任务推荐脚本
# 基于依赖关系、优先级和当前状态推荐下一个最佳任务

set -euo pipefail

readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly TASKS_DIR="${PROJECT_ROOT}/docs/tasks"
readonly TDD_STATE="${PROJECT_ROOT}/.claude/tdd-state.json"
readonly LOG_FILE="${PROJECT_ROOT}/.claude/logs/pm.log"

# 日志记录
log() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 获取所有任务文件
get_task_files() {
    if [[ ! -d "$TASKS_DIR" ]]; then
        echo "任务目录不存在: $TASKS_DIR"
        return 1
    fi
    find "$TASKS_DIR" -name "*.tasks.json" -type f
}

# 解析单个任务文件
parse_task_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        return 1
    fi
    
    jq -r '.tasks[] | 
    select(.status != "completed" and .status != "cancelled") |
    {
        id: .id,
        title: .title,
        status: .status,
        priority: (.priority // "medium"),
        dependencies: (.dependencies // []),
        estimation: (.estimation // "unknown"),
        complexity: (.complexity // 5),
        feature: (.feature // ""),
        file: "'"$file"'",
        type: (.type // "development")
    }' "$file" 2>/dev/null || true
}

# 获取所有可用任务
get_all_tasks() {
    local task_files
    mapfile -t task_files < <(get_task_files)
    
    for file in "${task_files[@]}"; do
        parse_task_file "$file"
    done | jq -s '.'
}

# 检查任务依赖是否已完成
check_dependencies() {
    local tasks="$1"
    local task_id="$2"
    
    local dependencies
    dependencies=$(echo "$tasks" | jq -r --arg id "$task_id" '.[] | select(.id == $id) | .dependencies[]? // empty')
    
    if [[ -z "$dependencies" ]]; then
        echo "true"
        return
    fi
    
    while IFS= read -r dep_id; do
        local dep_status
        dep_status=$(echo "$tasks" | jq -r --arg id "$dep_id" '.[] | select(.id == $id) | .status // "notfound"')
        if [[ "$dep_status" != "completed" ]]; then
            echo "false"
            return
        fi
    done <<< "$dependencies"
    
    echo "true"
}

# 计算任务优先级分数
calculate_priority_score() {
    local priority="$1"
    local complexity="$2"
    local status="$3"
    
    local priority_score=0
    case "$priority" in
        critical) priority_score=100 ;;
        high) priority_score=80 ;;
        medium) priority_score=60 ;;
        low) priority_score=40 ;;
        *) priority_score=50 ;;
    esac
    
    # 复杂度调整（越简单优先级越高）
    local complexity_bonus=$((10 - complexity))
    
    # 状态调整
    local status_bonus=0
    case "$status" in
        blocked) status_bonus=-50 ;;
        in_progress) status_bonus=20 ;;
        pending) status_bonus=0 ;;
        review) status_bonus=30 ;;
    esac
    
    echo $((priority_score + complexity_bonus + status_bonus))
}

# 获取当前TDD状态
get_current_tdd_state() {
    if [[ -f "$TDD_STATE" ]]; then
        jq -r '.currentPhase // "INIT"' "$TDD_STATE"
    else
        echo "INIT"
    fi
}

# 根据TDD阶段过滤任务
filter_by_tdd_phase() {
    local tasks="$1"
    local current_phase
    current_phase=$(get_current_tdd_state)
    
    case "$current_phase" in
        RED)
            # RED阶段优先推荐测试相关任务
            echo "$tasks" | jq '[.[] | select(.type == "test" or .title | test("测试|test"; "i"))]'
            ;;
        GREEN)
            # GREEN阶段优先推荐实现相关任务
            echo "$tasks" | jq '[.[] | select(.type == "development" or .type == "feature")]'
            ;;
        REFACTOR)
            # REFACTOR阶段优先推荐重构相关任务
            echo "$tasks" | jq '[.[] | select(.type == "refactor" or .title | test("重构|refactor"; "i"))]'
            ;;
        *)
            # 其他阶段返回所有任务
            echo "$tasks"
            ;;
    esac
}

# 智能推荐下一个任务
recommend_next_task() {
    local max_recommendations="${1:-3}"
    local filter_feature="${2:-}"
    
    log "🤖 开始智能任务推荐..."
    
    local all_tasks
    all_tasks=$(get_all_tasks)
    
    if [[ "$all_tasks" == "[]" ]] || [[ -z "$all_tasks" ]]; then
        echo "📝 没有找到可用的任务"
        return 0
    fi
    
    # 按功能过滤（如果指定）
    if [[ -n "$filter_feature" ]]; then
        all_tasks=$(echo "$all_tasks" | jq --arg feature "$filter_feature" '[.[] | select(.feature == $feature)]')
    fi
    
    # 根据TDD阶段过滤
    local filtered_tasks
    filtered_tasks=$(filter_by_tdd_phase "$all_tasks")
    
    # 如果TDD过滤后没有任务，回退到所有任务
    if [[ "$filtered_tasks" == "[]" ]]; then
        filtered_tasks="$all_tasks"
    fi
    
    # 过滤出依赖已完成的任务
    local available_tasks=()
    while IFS= read -r task; do
        local task_id
        task_id=$(echo "$task" | jq -r '.id')
        local deps_ready
        deps_ready=$(check_dependencies "$all_tasks" "$task_id")
        
        if [[ "$deps_ready" == "true" ]]; then
            available_tasks+=("$task")
        fi
    done < <(echo "$filtered_tasks" | jq -c '.[]')
    
    if [[ ${#available_tasks[@]} -eq 0 ]]; then
        echo "⚠️  所有任务都被依赖阻塞或已完成"
        return 0
    fi
    
    # 计算每个任务的推荐分数
    local scored_tasks=()
    for task in "${available_tasks[@]}"; do
        local priority complexity status
        priority=$(echo "$task" | jq -r '.priority')
        complexity=$(echo "$task" | jq -r '.complexity')
        status=$(echo "$task" | jq -r '.status')
        
        local score
        score=$(calculate_priority_score "$priority" "$complexity" "$status")
        
        local scored_task
        scored_task=$(echo "$task" | jq --argjson score "$score" '. + {score: $score}')
        scored_tasks+=("$scored_task")
    done
    
    # 按分数排序并限制推荐数量
    local recommendations
    recommendations=$(printf '%s\n' "${scored_tasks[@]}" | jq -s 'sort_by(-.score) | .[:'"$max_recommendations"']')
    
    # 显示推荐结果
    local current_phase
    current_phase=$(get_current_tdd_state)
    
    echo "🎯 基于当前TDD阶段 ($current_phase) 的任务推荐:"
    echo ""
    
    local count=1
    echo "$recommendations" | jq -r '.[] | 
    "【" + (.score | tostring) + "分】 " + .id + " - " + .title + 
    "\n  💡 优先级: " + .priority + " | 复杂度: " + (.complexity | tostring) + " | 状态: " + .status +
    "\n  📁 文件: " + (.file | split("/") | last) +
    (if .estimation != "unknown" then "\n  ⏱️  估时: " + .estimation else "" end) +
    (if .dependencies | length > 0 then "\n  🔗 依赖: " + (.dependencies | join(", ")) else "" end) +
    "\n"' | head -n $((max_recommendations * 8))
    
    return 0
}

# 显示任务详情
show_task_details() {
    local task_id="$1"
    
    local all_tasks
    all_tasks=$(get_all_tasks)
    
    local task_info
    task_info=$(echo "$all_tasks" | jq --arg id "$task_id" '.[] | select(.id == $id)')
    
    if [[ -z "$task_info" ]] || [[ "$task_info" == "null" ]]; then
        echo "❌ 未找到任务: $task_id"
        return 1
    fi
    
    echo "📋 任务详情:"
    echo "$task_info" | jq -r '
    "  ID: " + .id,
    "  标题: " + .title,
    "  状态: " + .status,
    "  优先级: " + .priority,
    "  复杂度: " + (.complexity | tostring),
    "  类型: " + .type,
    "  功能: " + (.feature // "未分类"),
    "  文件: " + (.file | split("/") | last),
    (if .estimation != "unknown" then "  估时: " + .estimation else "  估时: 未设置" end),
    (if .dependencies | length > 0 then "  依赖: " + (.dependencies | join(", ")) else "  依赖: 无" end)
    '
    
    # 检查依赖状态
    local deps_ready
    deps_ready=$(check_dependencies "$all_tasks" "$task_id")
    if [[ "$deps_ready" == "true" ]]; then
        echo "  ✅ 依赖状态: 就绪"
    else
        echo "  ⚠️  依赖状态: 阻塞中"
    fi
}

# 显示统计信息
show_statistics() {
    local all_tasks
    all_tasks=$(get_all_tasks)
    
    if [[ "$all_tasks" == "[]" ]]; then
        echo "📊 没有找到任务数据"
        return 0
    fi
    
    echo "📊 任务统计:"
    echo "$all_tasks" | jq -r '
    group_by(.status) | 
    map({status: .[0].status, count: length}) | 
    .[] | 
    "  " + .status + ": " + (.count | tostring)
    '
    
    echo ""
    echo "优先级分布:"
    echo "$all_tasks" | jq -r '
    group_by(.priority) | 
    map({priority: .[0].priority, count: length}) | 
    .[] | 
    "  " + .priority + ": " + (.count | tostring)
    '
}

# 显示帮助
show_help() {
    cat << EOF
智能任务推荐器

用法:
  $0 [command] [options]

命令:
  recommend [number] [feature]  推荐下一个任务
    number: 推荐数量 (默认: 3)
    feature: 功能过滤器 (可选)
    
  details <task_id>             显示任务详情
  stats                         显示统计信息
  list                          列出所有可用任务
  help                          显示此帮助

示例:
  $0 recommend                  # 推荐3个任务
  $0 recommend 5                # 推荐5个任务
  $0 recommend 3 user-auth      # 推荐用户认证相关的3个任务
  $0 details T001               # 显示T001任务详情
  $0 stats                      # 显示统计信息

智能推荐考虑因素:
  - 依赖关系完成情况
  - 任务优先级和复杂度
  - 当前TDD阶段匹配度
  - 任务类型和状态
EOF
}

# 列出所有可用任务
list_tasks() {
    local all_tasks
    all_tasks=$(get_all_tasks)
    
    if [[ "$all_tasks" == "[]" ]]; then
        echo "📝 没有找到可用的任务"
        return 0
    fi
    
    echo "📋 所有可用任务:"
    echo "$all_tasks" | jq -r '.[] | 
    .id + " - " + .title + " (" + .status + ", " + .priority + ")"'
}

# 主函数
main() {
    case "${1:-recommend}" in
        recommend)
            recommend_next_task "${2:-3}" "${3:-}"
            ;;
        details)
            [[ $# -lt 2 ]] && { echo "错误: details需要task_id参数"; exit 1; }
            show_task_details "$2"
            ;;
        stats)
            show_statistics
            ;;
        list)
            list_tasks
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo "错误: 未知命令 '$1'"
            show_help
            exit 1
            ;;
    esac
}

# 检查依赖
if ! command -v jq >/dev/null 2>&1; then
    echo "错误: 需要安装jq命令行工具"
    exit 1
fi

main "$@"