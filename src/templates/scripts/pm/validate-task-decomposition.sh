#!/bin/bash

# 任务分解质量检查脚本
# 验证任务分解的合理性、依赖关系和估时准确性

set -euo pipefail

readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly LOG_FILE="${PROJECT_ROOT}/.claude/logs/pm.log"

# 默认验证规则配置
readonly MIN_TASK_ESTIMATION_HOURS=0.5
readonly MAX_TASK_ESTIMATION_HOURS=40
readonly MAX_DEPENDENCIES_PER_TASK=5
readonly MIN_TASK_TITLE_LENGTH=5
readonly MAX_TASK_TITLE_LENGTH=100

# 日志记录
log() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 验证任务文件格式
validate_file_format() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo "❌ 文件不存在: $file"
        return 1
    fi
    
    # 验证JSON格式
    if ! jq empty "$file" 2>/dev/null; then
        echo "❌ JSON格式错误: $file"
        return 1
    fi
    
    # 验证基本结构
    if ! jq -e '.tasks | type == "array"' "$file" >/dev/null 2>&1; then
        echo "❌ 缺少tasks数组: $file"
        return 1
    fi
    
    echo "✅ 文件格式正确"
    return 0
}

# 验证单个任务的基本字段
validate_task_fields() {
    local task="$1"
    local task_id
    task_id=$(echo "$task" | jq -r '.id // "missing"')
    
    local errors=()
    
    # 检查必需字段
    if [[ -z "$(echo "$task" | jq -r '.id // ""')" ]]; then
        errors+=("缺少id字段")
    fi
    
    if [[ -z "$(echo "$task" | jq -r '.title // ""')" ]]; then
        errors+=("缺少title字段")
    fi
    
    if [[ -z "$(echo "$task" | jq -r '.status // ""')" ]]; then
        errors+=("缺少status字段")
    fi
    
    # 验证字段值
    local title
    title=$(echo "$task" | jq -r '.title // ""')
    if [[ ${#title} -lt $MIN_TASK_TITLE_LENGTH ]] || [[ ${#title} -gt $MAX_TASK_TITLE_LENGTH ]]; then
        errors+=("标题长度不合理: ${#title} (应在${MIN_TASK_TITLE_LENGTH}-${MAX_TASK_TITLE_LENGTH}之间)")
    fi
    
    local status
    status=$(echo "$task" | jq -r '.status // ""')
    case "$status" in
        pending|in_progress|completed|blocked|cancelled|review|testing) ;;
        *) errors+=("状态值无效: $status") ;;
    esac
    
    local priority
    priority=$(echo "$task" | jq -r '.priority // "medium"')
    case "$priority" in
        critical|high|medium|low) ;;
        *) errors+=("优先级值无效: $priority") ;;
    esac
    
    if [[ ${#errors[@]} -gt 0 ]]; then
        echo "❌ 任务 $task_id 字段验证失败:"
        printf "   - %s\n" "${errors[@]}"
        return 1
    fi
    
    return 0
}

# 验证估时合理性
validate_estimation() {
    local task="$1"
    local task_id
    task_id=$(echo "$task" | jq -r '.id')
    
    local estimation
    estimation=$(echo "$task" | jq -r '.estimation // "unknown"')
    
    if [[ "$estimation" == "unknown" ]] || [[ -z "$estimation" ]]; then
        echo "⚠️  任务 $task_id 缺少估时信息"
        return 0
    fi
    
    # 解析估时（支持多种格式：1h, 2d, 0.5h, 1.5d等）
    local hours=0
    if [[ "$estimation" =~ ^([0-9]*\.?[0-9]+)([hd])$ ]]; then
        local value="${BASH_REMATCH[1]}"
        local unit="${BASH_REMATCH[2]}"
        
        case "$unit" in
            h) hours=$(echo "$value" | bc -l) ;;
            d) hours=$(echo "$value * 8" | bc -l) ;;
        esac
    else
        echo "⚠️  任务 $task_id 估时格式无效: $estimation"
        return 1
    fi
    
    # 检查估时范围
    if (( $(echo "$hours < $MIN_TASK_ESTIMATION_HOURS" | bc -l) )); then
        echo "⚠️  任务 $task_id 估时过小: ${estimation} (最小${MIN_TASK_ESTIMATION_HOURS}h)"
        return 1
    fi
    
    if (( $(echo "$hours > $MAX_TASK_ESTIMATION_HOURS" | bc -l) )); then
        echo "❌ 任务 $task_id 估时过大: ${estimation} (最大${MAX_TASK_ESTIMATION_HOURS}h，建议拆分)"
        return 1
    fi
    
    return 0
}

# 验证依赖关系
validate_dependencies() {
    local tasks="$1"
    local all_task_ids
    all_task_ids=$(echo "$tasks" | jq -r '.[].id')
    
    local errors=0
    
    while IFS= read -r task; do
        local task_id
        task_id=$(echo "$task" | jq -r '.id')
        
        local dependencies
        dependencies=$(echo "$task" | jq -r '.dependencies[]? // empty')
        
        if [[ -z "$dependencies" ]]; then
            continue
        fi
        
        local dep_count
        dep_count=$(echo "$dependencies" | wc -l)
        if [[ $dep_count -gt $MAX_DEPENDENCIES_PER_TASK ]]; then
            echo "⚠️  任务 $task_id 依赖过多: ${dep_count} (建议最多${MAX_DEPENDENCIES_PER_TASK}个)"
            ((errors++))
        fi
        
        # 检查依赖是否存在
        while IFS= read -r dep_id; do
            if ! echo "$all_task_ids" | grep -q "^${dep_id}$"; then
                echo "❌ 任务 $task_id 依赖不存在的任务: $dep_id"
                ((errors++))
            fi
        done <<< "$dependencies"
        
    done < <(echo "$tasks" | jq -c '.[]')
    
    return $errors
}

# 检查循环依赖
check_circular_dependencies() {
    local tasks="$1"
    local visited=()
    local stack=()
    
    check_node() {
        local node="$1"
        local current_stack=("${stack[@]}")
        
        # 检查是否在当前路径中（循环依赖）
        for item in "${current_stack[@]}"; do
            if [[ "$item" == "$node" ]]; then
                echo "❌ 发现循环依赖: ${current_stack[*]} -> $node"
                return 1
            fi
        done
        
        # 检查是否已访问
        for item in "${visited[@]}"; do
            if [[ "$item" == "$node" ]]; then
                return 0
            fi
        done
        
        visited+=("$node")
        stack+=("$node")
        
        # 递归检查依赖
        local dependencies
        dependencies=$(echo "$tasks" | jq -r --arg id "$node" '.[] | select(.id == $id) | .dependencies[]? // empty')
        
        while IFS= read -r dep; do
            [[ -z "$dep" ]] && continue
            if ! check_node "$dep"; then
                return 1
            fi
        done <<< "$dependencies"
        
        # 从栈中移除
        unset 'stack[-1]'
        return 0
    }
    
    # 对所有任务进行检查
    local task_ids
    task_ids=$(echo "$tasks" | jq -r '.[].id')
    
    while IFS= read -r task_id; do
        [[ -z "$task_id" ]] && continue
        if ! check_node "$task_id"; then
            return 1
        fi
    done <<< "$task_ids"
    
    echo "✅ 未发现循环依赖"
    return 0
}

# 验证任务分解粒度
validate_task_granularity() {
    local tasks="$1"
    local warnings=0
    
    while IFS= read -r task; do
        local task_id title complexity estimation
        task_id=$(echo "$task" | jq -r '.id')
        title=$(echo "$task" | jq -r '.title // ""')
        complexity=$(echo "$task" | jq -r '.complexity // 5')
        estimation=$(echo "$task" | jq -r '.estimation // "unknown"')
        
        # 检查复杂度和估时匹配度
        if [[ "$estimation" != "unknown" ]] && [[ "$estimation" =~ ^([0-9]*\.?[0-9]+)([hd])$ ]]; then
            local value="${BASH_REMATCH[1]}"
            local unit="${BASH_REMATCH[2]}"
            local hours=0
            
            case "$unit" in
                h) hours=$(echo "$value" | bc -l) ;;
                d) hours=$(echo "$value * 8" | bc -l) ;;
            esac
            
            # 高复杂度任务应该有相应的估时
            if [[ $complexity -gt 7 ]] && (( $(echo "$hours < 4" | bc -l) )); then
                echo "⚠️  任务 $task_id 复杂度高但估时偏少，建议进一步分解"
                ((warnings++))
            fi
            
            # 低复杂度任务不应该有过长估时
            if [[ $complexity -lt 3 ]] && (( $(echo "$hours > 8" | bc -l) )); then
                echo "⚠️  任务 $task_id 复杂度低但估时过多，可能需要重新评估"
                ((warnings++))
            fi
        fi
        
        # 检查标题关键词
        if echo "$title" | grep -i "大量\|批量\|整体\|所有\|全部" >/dev/null; then
            echo "⚠️  任务 $task_id 标题暗示粒度过大: $title"
            ((warnings++))
        fi
        
    done < <(echo "$tasks" | jq -c '.[]')
    
    if [[ $warnings -eq 0 ]]; then
        echo "✅ 任务粒度合理"
    fi
    
    return $warnings
}

# 生成质量报告
generate_quality_report() {
    local tasks="$1"
    local file="$2"
    
    local total_tasks
    total_tasks=$(echo "$tasks" | jq '. | length')
    
    local status_stats
    status_stats=$(echo "$tasks" | jq -r 'group_by(.status) | map({status: .[0].status, count: length}) | .[] | "\(.status): \(.count)"')
    
    local priority_stats
    priority_stats=$(echo "$tasks" | jq -r 'group_by(.priority // "medium") | map({priority: .[0].priority, count: length}) | .[] | "\(.priority): \(.count)"')
    
    local avg_complexity
    avg_complexity=$(echo "$tasks" | jq '[.[] | .complexity // 5] | add / length')
    
    local total_estimation
    total_estimation=0
    while IFS= read -r task; do
        local estimation
        estimation=$(echo "$task" | jq -r '.estimation // "unknown"')
        if [[ "$estimation" =~ ^([0-9]*\.?[0-9]+)([hd])$ ]]; then
            local value="${BASH_REMATCH[1]}"
            local unit="${BASH_REMATCH[2]}"
            local hours=0
            
            case "$unit" in
                h) hours=$(echo "$value" | bc -l) ;;
                d) hours=$(echo "$value * 8" | bc -l) ;;
            esac
            
            total_estimation=$(echo "$total_estimation + $hours" | bc -l)
        fi
    done < <(echo "$tasks" | jq -c '.[]')
    
    cat << EOF

📊 任务分解质量报告
======================
📁 文件: $(basename "$file")
📈 任务总数: $total_tasks
⏱️  总估时: $(printf "%.1f" "$total_estimation") 小时 ($(printf "%.1f" "$(echo "$total_estimation / 8" | bc -l)") 天)
🎯 平均复杂度: $(printf "%.1f" "$avg_complexity")

📋 状态分布:
$status_stats

🔥 优先级分布:
$priority_stats

EOF
}

# 主验证函数
validate_tasks() {
    local file="$1"
    local show_report="${2:-false}"
    
    log "🔍 开始验证任务分解: $(basename "$file")"
    
    # 1. 验证文件格式
    if ! validate_file_format "$file"; then
        return 1
    fi
    
    local tasks
    tasks=$(jq '.tasks' "$file")
    
    if [[ "$tasks" == "[]" ]]; then
        echo "⚠️  文件中没有任务"
        return 0
    fi
    
    echo "开始验证 $(echo "$tasks" | jq '. | length') 个任务..."
    echo ""
    
    local total_errors=0
    local total_warnings=0
    
    # 2. 验证每个任务的基本字段
    echo "🔍 验证任务字段..."
    while IFS= read -r task; do
        if ! validate_task_fields "$task"; then
            ((total_errors++))
        fi
        
        if ! validate_estimation "$task"; then
            ((total_warnings++))
        fi
    done < <(echo "$tasks" | jq -c '.[]')
    
    # 3. 验证依赖关系
    echo "🔍 验证依赖关系..."
    local dep_errors
    dep_errors=$(validate_dependencies "$tasks")
    total_errors=$((total_errors + dep_errors))
    
    # 4. 检查循环依赖
    echo "🔍 检查循环依赖..."
    if ! check_circular_dependencies "$tasks"; then
        ((total_errors++))
    fi
    
    # 5. 验证任务粒度
    echo "🔍 验证任务粒度..."
    local granularity_warnings
    granularity_warnings=$(validate_task_granularity "$tasks")
    total_warnings=$((total_warnings + granularity_warnings))
    
    # 6. 生成报告
    if [[ "$show_report" == "true" ]]; then
        generate_quality_report "$tasks" "$file"
    fi
    
    # 总结
    echo "验证完成:"
    if [[ $total_errors -eq 0 ]] && [[ $total_warnings -eq 0 ]]; then
        echo "✅ 任务分解质量优秀"
        log "✅ 验证通过: $(basename "$file")"
        return 0
    elif [[ $total_errors -eq 0 ]]; then
        echo "⚠️  任务分解基本合格，有 $total_warnings 个建议改进点"
        log "⚠️  验证通过但有警告: $(basename "$file") - $total_warnings warnings"
        return 0
    else
        echo "❌ 任务分解存在 $total_errors 个错误和 $total_warnings 个警告，需要修正"
        log "❌ 验证失败: $(basename "$file") - $total_errors errors, $total_warnings warnings"
        return 1
    fi
}

# 显示帮助
show_help() {
    cat << EOF
任务分解质量检查器

用法:
  $0 --tasks-file <file> [options]

选项:
  --tasks-file <file>    指定要验证的任务文件
  --report               生成详细报告
  --help                 显示此帮助

验证项目:
  ✓ JSON格式和结构
  ✓ 必需字段完整性
  ✓ 字段值有效性
  ✓ 估时合理性
  ✓ 依赖关系正确性
  ✓ 循环依赖检测
  ✓ 任务粒度合理性

示例:
  $0 --tasks-file docs/tasks/user-auth.tasks.json
  $0 --tasks-file docs/tasks/user-auth.tasks.json --report
EOF
}

# 主函数
main() {
    local tasks_file=""
    local show_report="false"
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --tasks-file)
                tasks_file="$2"
                shift 2
                ;;
            --report)
                show_report="true"
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                echo "错误: 未知参数 '$1'"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 验证参数
    if [[ -z "$tasks_file" ]]; then
        echo "错误: 必须指定 --tasks-file 参数"
        show_help
        exit 1
    fi
    
    # 处理相对路径
    if [[ ! "$tasks_file" =~ ^/ ]]; then
        tasks_file="${PROJECT_ROOT}/$tasks_file"
    fi
    
    validate_tasks "$tasks_file" "$show_report"
}

# 检查依赖
if ! command -v jq >/dev/null 2>&1; then
    echo "错误: 需要安装jq命令行工具"
    exit 1
fi

if ! command -v bc >/dev/null 2>&1; then
    echo "错误: 需要安装bc命令行工具"
    exit 1
fi

main "$@"