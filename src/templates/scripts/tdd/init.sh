#!/bin/bash

# TDD内部初始化脚本 - 仅用于特殊情况的后处理
# 注意：主要初始化功能已移至 claude-tdd CLI 工具
# 如需完整初始化TDD环境，请使用: claude-tdd init

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly CLAUDE_DIR="${PROJECT_ROOT}/.claude"
readonly LOG_FILE="${CLAUDE_DIR}/logs/post-init.log"

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

# 检查环境是否已初始化
check_initialization() {
    if [[ ! -d "$CLAUDE_DIR" ]]; then
        error "TDD环境未初始化。请运行: claude-tdd init"
    fi
    
    if [[ ! -f "${CLAUDE_DIR}/project-config.json" ]]; then
        error "项目配置文件不存在。请运行: claude-tdd init"
    fi
    
    log "✅ TDD环境已初始化"
}

# 设置脚本执行权限
fix_script_permissions() {
    log "设置脚本执行权限..."
    
    # 设置执行权限
    if [[ -d "${CLAUDE_DIR}/scripts" ]]; then
        find "${CLAUDE_DIR}/scripts" -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
        log "✅ scripts目录权限已设置"
    fi
    
    if [[ -d "${CLAUDE_DIR}/hooks" ]]; then
        find "${CLAUDE_DIR}/hooks" -name "*.sh" -exec chmod +x {} \; 2>/dev/null || true
        log "✅ hooks目录权限已设置"
    fi
}

# 验证TDD状态文件
verify_tdd_state() {
    local state_file="${CLAUDE_DIR}/tdd-state.json"
    
    if [[ ! -f "$state_file" ]]; then
        log "创建TDD状态文件..."
        cat > "$state_file" << 'EOF'
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
        log "✅ TDD状态文件已创建"
    else
        log "✅ TDD状态文件已存在"
    fi
}

# 显示使用提示
show_usage_info() {
    log ""
    log "📋 TDD环境后处理完成"
    log ""
    log "⚠️  注意: 此脚本仅用于内部后处理"
    log "    如需完整初始化，请使用: claude-tdd init"
    log ""
    log "可用的TDD命令:"
    log "  • /tdd:red      - 开始RED阶段"
    log "  • /tdd:green    - 开始GREEN阶段"
    log "  • /tdd:refactor - 开始REFACTOR阶段"
    log "  • /tdd:status   - 查看TDD状态"
    log "  • /tdd:reset    - 重置TDD状态"
    log ""
    log "CLI工具命令:"
    log "  • claude-tdd init   - 初始化TDD环境"
    log "  • claude-tdd doctor - 诊断环境"
    log "  • claude-tdd status - 查看状态"
    log ""
}

# 主执行流程
main() {
    log "🔧 开始TDD环境后处理..."
    
    # 执行基本的后处理步骤
    check_initialization
    fix_script_permissions
    verify_tdd_state
    show_usage_info
    
    log "TDD环境后处理完成于 $(date)"
}

# 执行主函数
main "$@"