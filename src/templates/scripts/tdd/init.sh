#!/bin/bash

# TDD初始化脚本 - 设置完整的TDD开发环境
# 包括项目检测、配置文件创建、质量门控设置等

set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly CLAUDE_DIR="${PROJECT_ROOT}/.claude"
readonly LOG_FILE="${CLAUDE_DIR}/logs/init.log"

# 强制重新初始化标志
FORCE_INIT=false

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

# 检查必要工具
check_dependencies() {
    local missing_tools=()
    
    for tool in jq git; do
        if ! command -v "$tool" >/dev/null 2>&1; then
            missing_tools+=("$tool")
        fi
    done
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        error "缺少必要工具: ${missing_tools[*]}. 请先安装这些工具."
    fi
    
    log "✅ 依赖检查通过"
}

# 创建目录结构
create_directories() {
    local dirs=(
        ".claude/scripts/tdd"
        ".claude/scripts/pm" 
        ".claude/hooks"
        ".claude/logs"
        ".claude/configs"
        ".claude/templates"
    )
    
    for dir in "${dirs[@]}"; do
        mkdir -p "${PROJECT_ROOT}/${dir}"
        log "创建目录: $dir"
    done
    
    log "✅ 目录结构创建完成"
}

# 复制脚本文件
copy_scripts() {
    local template_root
    # 在CLI工具内部时，模板在src/templates
    if [[ -d "${SCRIPT_DIR}/../../../templates" ]]; then
        template_root="${SCRIPT_DIR}/../../../templates"
    # 在用户项目中时，寻找CLI工具安装路径
    elif [[ -d "$(npm root -g)/claude-tdd-cli/dist/templates" ]]; then
        template_root="$(npm root -g)/claude-tdd-cli/dist/templates"
    else
        error "无法找到模板文件目录"
    fi
    
    # 复制脚本
    cp -r "${template_root}/scripts"/* "${CLAUDE_DIR}/scripts/"
    cp -r "${template_root}/hooks"/* "${CLAUDE_DIR}/hooks/"
    
    # 设置执行权限
    find "${CLAUDE_DIR}/scripts" -name "*.sh" -exec chmod +x {} \;
    find "${CLAUDE_DIR}/hooks" -name "*.sh" -exec chmod +x {} \;
    
    log "✅ 脚本文件复制完成"
}

# 运行项目检测
detect_project_type() {
    if [[ -x "${CLAUDE_DIR}/scripts/tdd/project-detector.sh" ]]; then
        log "🔍 开始项目类型检测..."
        "${CLAUDE_DIR}/scripts/tdd/project-detector.sh" config
        log "✅ 项目类型检测完成"
    else
        log "⚠️  项目检测脚本不存在，跳过自动配置"
    fi
}

# 创建配置文件
create_configs() {
    local config_file="${CLAUDE_DIR}/project-config.json"
    local state_file="${CLAUDE_DIR}/tdd-state.json"
    
    # 项目配置文件
    if [[ ! -f "$config_file" ]] || [[ "$FORCE_INIT" == true ]]; then
        cat > "$config_file" << EOF
{
  "project": {
    "name": "$(basename "$PROJECT_ROOT")",
    "type": "unknown",
    "language": "unknown",
    "testFramework": "unknown",
    "buildTool": "unknown"
  },
  "tdd": {
    "enabled": true,
    "strictMode": false,
    "autoRunTests": true,
    "guardEnabled": true
  },
  "commands": {
    "test": "echo 'Please configure test command'",
    "build": "echo 'Please configure build command'",
    "lint": "echo 'Please configure lint command'",
    "coverage": "echo 'Please configure coverage command'"
  },
  "quality": {
    "minCoverage": 80,
    "maxComplexity": 10,
    "enforceTests": true
  },
  "hooks": {
    "preCommit": true,
    "postCommit": false,
    "preTest": false,
    "postTest": false
  },
  "created": "$(date -Iseconds)",
  "version": "1.0.0"
}
EOF
        log "✅ 项目配置文件已创建"
    fi
    
    # TDD状态文件
    if [[ ! -f "$state_file" ]] || [[ "$FORCE_INIT" == true ]]; then
        cat > "$state_file" << EOF
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
        log "✅ TDD状态文件已创建"
    fi
}

# 设置Git Hooks
setup_git_hooks() {
    if [[ ! -d "${PROJECT_ROOT}/.git" ]]; then
        log "⚠️  不是Git仓库，跳过Git hooks设置"
        return
    fi
    
    local git_hooks_dir="${PROJECT_ROOT}/.git/hooks"
    
    # Pre-commit hook
    cat > "${git_hooks_dir}/pre-commit" << 'EOF'
#!/bin/bash
# Claude TDD Pre-commit Hook
if [[ -f ".claude/hooks/tdd-guard.sh" ]]; then
    .claude/hooks/tdd-guard.sh pre-commit
fi
EOF
    
    # Post-commit hook  
    cat > "${git_hooks_dir}/post-commit" << 'EOF'
#!/bin/bash
# Claude TDD Post-commit Hook
if [[ -f ".claude/hooks/commit-validator.sh" ]]; then
    .claude/hooks/commit-validator.sh post-commit
fi
EOF
    
    chmod +x "${git_hooks_dir}/pre-commit"
    chmod +x "${git_hooks_dir}/post-commit"
    
    log "✅ Git hooks设置完成"
}

# 创建示例文件
create_examples() {
    local readme_file="${CLAUDE_DIR}/README.md"
    
    if [[ ! -f "$readme_file" ]] || [[ "$FORCE_INIT" == true ]]; then
        cat > "$readme_file" << 'EOF'
# Claude TDD 配置

此目录包含Claude TDD工具的配置和脚本文件。

## 目录结构

```
.claude/
├── scripts/           # 脚本文件
│   ├── tdd/          # TDD相关脚本
│   └── pm/           # 项目管理脚本
├── hooks/            # Git hooks
├── logs/             # 日志文件
├── configs/          # 配置模板
└── templates/        # 其他模板
```

## TDD命令

- `/tdd:init` - 初始化TDD环境
- `/tdd:red` - 开始RED阶段（编写失败测试）
- `/tdd:green` - 开始GREEN阶段（实现代码）
- `/tdd:refactor` - 开始REFACTOR阶段（重构代码）
- `/tdd:status` - 查看当前TDD状态

## 配置文件

- `project-config.json` - 项目配置
- `tdd-state.json` - TDD状态跟踪

请根据您的项目需求修改配置文件。
EOF
        log "✅ README文件已创建"
    fi
    
    # 创建.gitignore（如果不存在）
    local gitignore="${CLAUDE_DIR}/.gitignore"
    if [[ ! -f "$gitignore" ]]; then
        cat > "$gitignore" << 'EOF'
logs/
*.tmp
*.log
.DS_Store
EOF
        log "✅ .gitignore文件已创建"
    fi
}

# 验证安装
verify_installation() {
    local required_files=(
        ".claude/scripts/tdd/state-manager.sh"
        ".claude/scripts/tdd/project-detector.sh"
        ".claude/hooks/test-runner.sh"
        ".claude/hooks/tdd-guard.sh"
        ".claude/project-config.json"
        ".claude/tdd-state.json"
    )
    
    local missing_files=()
    for file in "${required_files[@]}"; do
        if [[ ! -f "${PROJECT_ROOT}/$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        error "安装不完整，缺少文件: ${missing_files[*]}"
    fi
    
    log "✅ 安装验证通过"
}

# 显示完成信息
show_completion() {
    cat << EOF

🎉 TDD环境初始化完成！

📁 已创建的目录和文件:
  - .claude/ 目录及所有子目录
  - 项目配置文件 (.claude/project-config.json)
  - TDD状态文件 (.claude/tdd-state.json)
  - 所有必需的脚本和hooks

🔧 接下来的步骤:
  1. 检查并修改 .claude/project-config.json 中的配置
  2. 运行项目检测: bash .claude/scripts/tdd/project-detector.sh
  3. 开始您的第一个TDD循环: /tdd:red

📖 更多信息请查看: .claude/README.md

EOF
}

# 显示帮助
show_help() {
    cat << EOF
TDD初始化脚本

用法:
  $0 [options]

选项:
  --force    强制重新初始化（覆盖现有配置）
  --help     显示此帮助信息

示例:
  $0              # 标准初始化
  $0 --force      # 强制重新初始化
EOF
}

# 主函数
main() {
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force)
                FORCE_INIT=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            *)
                error "未知参数: $1"
                ;;
        esac
    done
    
    # 检查是否已初始化
    if [[ -d "$CLAUDE_DIR" ]] && [[ "$FORCE_INIT" != true ]]; then
        echo "⚠️  TDD环境已存在。使用 --force 参数强制重新初始化。"
        exit 1
    fi
    
    log "🚀 开始TDD环境初始化..."
    
    check_dependencies
    create_directories
    copy_scripts
    create_configs
    detect_project_type
    setup_git_hooks
    create_examples
    verify_installation
    
    log "✅ TDD环境初始化完成"
    show_completion
}

main "$@"