#!/bin/bash

# TDD State Manager - TDD状态管理脚本
# 管理RED/GREEN/REFACTOR三个阶段的状态转换和记录

set -euo pipefail

# 配置文件路径
readonly STATE_FILE="${CLAUDE_PROJECT_DIR}/.claude/tdd-state.json"
readonly CONFIG_FILE="${CLAUDE_PROJECT_DIR}/.claude/project-config.json"
readonly LOG_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/tdd.log"

# 确保必要目录存在
ensure_directories() {
    mkdir -p "$(dirname "$STATE_FILE")"
    mkdir -p "$(dirname "$LOG_FILE")"
}

# 日志记录
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# 初始化状态文件
init_state() {
    if [[ ! -f "$STATE_FILE" ]]; then
        cat > "$STATE_FILE" << EOF
{
  "currentPhase": "INIT",
  "currentFeature": null,
  "lastUpdate": "$(date -Iseconds)",
  "testHistory": [],
  "phaseHistory": [],
  "statistics": {
    "redPhases": 0,
    "greenPhases": 0,
    "refactorPhases": 0,
    "totalCycles": 0
  }
}
EOF
        log "初始化TDD状态文件"
    fi
}

# 更新状态
update_state() {
    local phase="$1"
    local feature_id="$2"
    local description="$3"
    
    ensure_directories
    init_state
    
    # 使用jq更新状态
    local temp_file=$(mktemp)
    jq --arg phase "$phase" \
       --arg feature "$feature_id" \
       --arg desc "$description" \
       --arg timestamp "$(date -Iseconds)" \
       '
       .currentPhase = $phase |
       .currentFeature = $feature |
       .lastUpdate = $timestamp |
       .phaseHistory += [{
         "phase": $phase,
         "feature": $feature,
         "description": $desc,
         "timestamp": $timestamp
       }] |
       if $phase == "RED" then .statistics.redPhases += 1
       elif $phase == "GREEN" then .statistics.greenPhases += 1
       elif $phase == "REFACTOR" then .statistics.refactorPhases += 1
       else . end
       ' "$STATE_FILE" > "$temp_file"
    
    mv "$temp_file" "$STATE_FILE"
    log "更新状态: $phase - $feature_id - $description"
    echo "✅ TDD状态已更新: $phase 阶段"
}

# 记录测试结果
record_test() {
    local result="$1"
    local message="${2:-}"
    local feature="${3:-}"
    
    ensure_directories
    init_state
    
    local temp_file=$(mktemp)
    jq --arg result "$result" \
       --arg message "$message" \
       --arg feature "$feature" \
       --arg timestamp "$(date -Iseconds)" \
       '
       .testHistory += [{
         "result": $result,
         "message": $message,
         "feature": $feature,
         "timestamp": $timestamp
       }]
       ' "$STATE_FILE" > "$temp_file"
    
    mv "$temp_file" "$STATE_FILE"
    log "记录测试: $result - $message"
}

# 记录任意事件
record() {
    local message="$1"
    local feature="${2:-$(get_current_feature)}"
    
    record_test "INFO" "$message" "$feature"
    echo "📝 已记录: $message"
}

# 获取当前状态
get_status() {
    if [[ ! -f "$STATE_FILE" ]]; then
        echo "❌ TDD状态文件不存在，请先运行初始化"
        return 1
    fi
    
    local phase=$(jq -r '.currentPhase' "$STATE_FILE")
    local feature=$(jq -r '.currentFeature' "$STATE_FILE")
    local last_update=$(jq -r '.lastUpdate' "$STATE_FILE")
    
    echo "🔄 当前TDD状态:"
    echo "   阶段: $phase"
    echo "   功能: ${feature:-"无"}"
    echo "   更新时间: $last_update"
    
    # 显示统计信息
    local stats=$(jq -r '.statistics | "RED: \(.redPhases), GREEN: \(.greenPhases), REFACTOR: \(.refactorPhases)"' "$STATE_FILE")
    echo "   统计: $stats"
}

# 获取当前状态(简洁版)
get_state() {
    if [[ ! -f "$STATE_FILE" ]]; then
        echo "INIT"
        return
    fi
    jq -r '.currentPhase' "$STATE_FILE"
}

# 获取当前功能
get_feature() {
    if [[ ! -f "$STATE_FILE" ]]; then
        echo "null"
        return
    fi
    jq -r '.currentFeature' "$STATE_FILE"
}

# 获取当前功能(内部使用)
get_current_feature() {
    local feature=$(get_feature)
    [[ "$feature" == "null" ]] && echo "" || echo "$feature"
}

# 获取测试历史
get_tests() {
    if [[ ! -f "$STATE_FILE" ]]; then
        echo "[]"
        return
    fi
    
    echo "📊 最近的测试记录:"
    jq -r '.testHistory[-5:] | .[] | "  \(.timestamp): \(.result) - \(.message)"' "$STATE_FILE"
}

# 重置状态
reset() {
    if [[ -f "$STATE_FILE" ]]; then
        rm "$STATE_FILE"
        log "重置TDD状态"
        echo "🔄 TDD状态已重置"
    else
        echo "ℹ️  状态文件不存在，无需重置"
    fi
}

# 显示帮助
show_help() {
    cat << EOF
TDD State Manager - TDD状态管理工具

用法:
  $0 <command> [options]

命令:
  update <phase> <feature_id> <description>  - 更新TDD状态
    phase: RED | GREEN | REFACTOR
    
  status                                     - 显示当前状态
  get-state                                  - 获取当前阶段
  get-feature                                - 获取当前功能ID
  get-tests                                  - 显示测试历史
  record <message> [feature]                 - 记录事件
  reset                                      - 重置状态
  
示例:
  $0 update RED "user-login" "编写登录失败测试"
  $0 status
  $0 record "所有测试通过"
EOF
}

# 主函数
main() {
    case "${1:-help}" in
        update)
            [[ $# -lt 4 ]] && { echo "错误: update需要3个参数"; show_help; exit 1; }
            update_state "$2" "$3" "$4"
            ;;
        status)
            get_status
            ;;
        get-state)
            get_state
            ;;
        get-feature)
            get_feature
            ;;
        get-tests)
            get_tests
            ;;
        record)
            [[ $# -lt 2 ]] && { echo "错误: record需要消息参数"; exit 1; }
            record "$2" "${3:-}"
            ;;
        reset)
            reset
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