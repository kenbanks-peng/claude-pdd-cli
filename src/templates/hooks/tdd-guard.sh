#!/bin/bash

# TDD Guard Hook - 控制TDD阶段的文件编辑权限
# 在Write/Edit操作前检查当前TDD阶段和文件类型

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
TDD_STATE_FILE="$PROJECT_DIR/.claude/tdd-state.json"

# 检查TDD状态文件是否存在
if [[ ! -f "$TDD_STATE_FILE" ]]; then
    echo "⚠️  TDD状态文件不存在。运行 /tdd:init 初始化TDD环境。"
    exit 1
fi

# 获取当前TDD阶段
current_phase=$(jq -r '.currentPhase' "$TDD_STATE_FILE")

# 获取要操作的文件路径（从环境变量或参数中获取）
target_file="${CLAUDE_TOOL_ARGS}"

# 如果无法获取目标文件，允许操作（可能是其他类型的操作）
if [[ -z "$target_file" ]]; then
    exit 0
fi

# 函数：检查文件是否匹配模式
matches_pattern() {
    local file="$1"
    local pattern="$2"
    
    case "$file" in
        $pattern) return 0;;
        *) return 1;;
    esac
}

# 函数：检查文件类型
is_test_file() {
    local file="$1"
    [[ "$file" =~ \.test\. ]] || [[ "$file" =~ \.spec\. ]] || [[ "$file" =~ ^tests/ ]]
}

is_source_file() {
    local file="$1"
    [[ "$file" =~ ^src/ ]] || [[ "$file" =~ ^lib/ ]] || [[ "$file" =~ ^main/ ]]
}

is_config_file() {
    local file="$1"
    [[ "$file" =~ ^\.claude/ ]] || [[ "$file" =~ \.config\. ]] || 
    [[ "$file" =~ package\.json ]] || [[ "$file" =~ pom\.xml ]] || [[ "$file" =~ setup\.py ]]
}

# 根据当前阶段检查权限
case "$current_phase" in
    "RED")
        if is_test_file "$target_file"; then
            echo "✅ RED阶段：允许编辑测试文件"
            exit 0
        else
            echo "🔴 RED阶段限制：只能编辑测试文件 ($target_file)"
            echo "   提示：使用 /tdd:green 进入GREEN阶段编写实现代码"
            exit 1
        fi
        ;;
    "GREEN")
        if is_source_file "$target_file"; then
            echo "✅ GREEN阶段：允许编辑源代码文件"
            exit 0
        elif is_test_file "$target_file"; then
            echo "🟡 GREEN阶段警告：不建议在GREEN阶段修改测试文件"
            echo "   提示：GREEN阶段应专注于让现有测试通过"
            exit 0  # 警告但允许
        else
            echo "🟢 GREEN阶段限制：只能编辑源代码文件 ($target_file)"
            echo "   提示：使用 /tdd:refactor 进入REFACTOR阶段进行其他修改"
            exit 1
        fi
        ;;
    "REFACTOR")
        if is_source_file "$target_file"; then
            echo "✅ REFACTOR阶段：允许重构源代码"
            exit 0
        elif is_test_file "$target_file"; then
            echo "🔧 REFACTOR阶段限制：不应修改测试文件逻辑"
            echo "   提示：REFACTOR阶段应保持测试不变，只重构实现"
            exit 1
        else
            echo "✅ REFACTOR阶段：允许修改配置和文档"
            exit 0
        fi
        ;;
    "READY")
        if is_config_file "$target_file"; then
            echo "✅ READY阶段：允许修改配置文件"
            exit 0
        else
            echo "🔵 READY阶段限制：只能修改配置文件 ($target_file)"
            echo "   提示：使用 /tdd:red 开始新的TDD循环"
            exit 1
        fi
        ;;
    *)
        echo "⚠️  未知的TDD阶段：$current_phase"
        echo "   使用 /tdd:status 检查状态，或 /tdd:init 重新初始化"
        exit 1
        ;;
esac