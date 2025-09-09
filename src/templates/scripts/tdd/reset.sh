#!/bin/bash

# TDD状态重置脚本 - 重置TDD工作流状态到初始状态
# 不重新初始化环境，只重置状态文件和清理缓存

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly CLAUDE_DIR="${PROJECT_ROOT}/.claude"
readonly LOG_FILE="${CLAUDE_DIR}/logs/reset.log"
readonly TDD_STATE_FILE="${CLAUDE_DIR}/tdd-state.json"

# 强制重置标志
FORCE_RESET=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_RESET=true
            shift
            ;;
        *)
            echo "未知参数: $1"
            echo "用法: $0 [--force]"
            exit 1
            ;;
    esac
done

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

# 检查环境
check_environment() {
    if [[ ! -d "$CLAUDE_DIR" ]]; then
        error "未找到 .claude 目录。请先运行 'claude-tdd init' 初始化TDD环境。"
    fi
    
    if [[ ! -f "$TDD_STATE_FILE" ]]; then
        log "警告: 未找到 tdd-state.json 文件，将创建新的状态文件"
    fi
    
    log "✅ 环境检查通过"
}

# 检查当前TDD状态
check_current_state() {
    if [[ -f "$TDD_STATE_FILE" ]] && [[ "$FORCE_RESET" != true ]]; then
        local current_phase
        current_phase=$(jq -r '.currentPhase // "NONE"' "$TDD_STATE_FILE" 2>/dev/null || echo "NONE")
        
        if [[ "$current_phase" != "NONE" && "$current_phase" != "null" ]]; then
            echo "⚠️  当前TDD状态: $current_phase"
            echo "重置将清除所有TDD历史和当前状态。"
            read -p "确定要继续吗？ (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log "重置取消"
                exit 0
            fi
        fi
    fi
}

# 重置TDD状态文件
reset_tdd_state() {
    log "重置TDD状态文件..."
    
    # 创建新的状态文件
    cat > "$TDD_STATE_FILE" << 'EOF'
{
  "currentPhase": "NONE",
  "phaseHistory": [],
  "statistics": {
    "totalCycles": 0,
    "redPhases": 0,
    "greenPhases": 0,
    "refactorPhases": 0,
    "testsRun": 0,
    "testsPassedCount": 0,
    "testsFailedCount": 0
  },
  "lastUpdated": "",
  "projectType": "",
  "testCommand": "",
  "buildCommand": "",
  "currentTask": "",
  "cycleStartTime": null,
  "phaseStartTime": null
}
EOF
    
    # 更新时间戳
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    jq ".lastUpdated = \"$timestamp\"" "$TDD_STATE_FILE" > "${TDD_STATE_FILE}.tmp" && mv "${TDD_STATE_FILE}.tmp" "$TDD_STATE_FILE"
    
    log "✅ TDD状态文件已重置"
}

# 清理测试缓存和临时文件
cleanup_cache() {
    log "清理测试缓存和临时文件..."
    
    # 清理常见的测试缓存目录
    local cache_dirs=(
        "${PROJECT_ROOT}/.pytest_cache"
        "${PROJECT_ROOT}/target/surefire-reports" 
        "${PROJECT_ROOT}/build/test-results"
        "${PROJECT_ROOT}/coverage"
        "${PROJECT_ROOT}/.nyc_output"
        "${PROJECT_ROOT}/node_modules/.cache"
        "${CLAUDE_DIR}/temp"
        "${CLAUDE_DIR}/cache"
    )
    
    for cache_dir in "${cache_dirs[@]}"; do
        if [[ -d "$cache_dir" ]]; then
            rm -rf "$cache_dir"
            log "清理缓存目录: $cache_dir"
        fi
    done
    
    # 清理临时文件
    find "$PROJECT_ROOT" -name "*.tmp" -type f -delete 2>/dev/null || true
    find "$PROJECT_ROOT" -name ".DS_Store" -type f -delete 2>/dev/null || true
    find "$CLAUDE_DIR" -name "*.log.old" -type f -delete 2>/dev/null || true
    
    log "✅ 缓存和临时文件清理完成"
}

# 重置hooks状态（如果存在）
reset_hooks_state() {
    log "重置hooks状态..."
    
    local hook_state_file="${CLAUDE_DIR}/hooks/.hook-state"
    if [[ -f "$hook_state_file" ]]; then
        rm -f "$hook_state_file"
        log "清理hooks状态文件"
    fi
    
    # 重置git hooks的临时状态
    local git_hooks_dir="${PROJECT_ROOT}/.git/hooks"
    if [[ -d "$git_hooks_dir" ]]; then
        rm -f "${git_hooks_dir}/.tdd-"*
        log "清理git hooks临时状态"
    fi
    
    log "✅ hooks状态重置完成"
}

# 创建重置报告
create_reset_report() {
    log "创建重置报告..."
    
    local report_file="${CLAUDE_DIR}/logs/reset-report-$(date +%Y%m%d-%H%M%S).json"
    
    cat > "$report_file" << EOF
{
  "resetTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "resetBy": "${USER:-unknown}",
  "forceReset": $FORCE_RESET,
  "actions": [
    "TDD状态文件重置",
    "测试缓存清理",
    "临时文件清理",
    "hooks状态重置"
  ],
  "nextSteps": [
    "使用 /tdd:status 确认状态",
    "使用 /tdd:red 开始新循环"
  ]
}
EOF
    
    log "重置报告已保存: $report_file"
}

# 显示重置后的状态
show_reset_summary() {
    log ""
    log "🔄 TDD工作流重置完成！"
    log ""
    log "重置内容:"
    log "  ✅ TDD状态文件已重置"
    log "  ✅ 测试缓存已清理"
    log "  ✅ 临时文件已清理"
    log "  ✅ hooks状态已重置"
    log ""
    log "下一步操作:"
    log "  • 使用 /tdd:status 确认状态"
    log "  • 使用 /tdd:red 开始新的TDD循环"
    log ""
    log "注意: 如需重新初始化完整环境，请使用: claude-tdd init --force"
}

# 主执行流程
main() {
    log "🔄 开始TDD状态重置..."
    
    # 执行重置步骤
    check_environment
    check_current_state
    reset_tdd_state
    cleanup_cache
    reset_hooks_state
    create_reset_report
    show_reset_summary
    
    log "TDD重置完成于 $(date)"
}

# 执行主函数
main "$@"