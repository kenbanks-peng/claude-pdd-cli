#!/bin/bash

# TDD Phase Guard - Enforce phase-based file editing restrictions
# 根据当前TDD阶段限制文件编辑操作

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
TDD_STATE_FILE="$PROJECT_DIR/.claude/tdd-state.json"
JSON_TOOL="$PROJECT_DIR/.claude/bin/json-tool.cjs"

# 检查是否启用TDD
if [[ ! -f "$TDD_STATE_FILE" ]]; then
    echo "ℹ️  TDD未初始化，允许所有文件操作"
    exit 0
fi

# JSON 工具函数
json_get() {
    local file="$1"
    local path="$2"
    
    if command -v jq >/dev/null 2>&1; then
        jq -r ".$path" "$file" 2>/dev/null || echo ""
    elif [[ -f "$JSON_TOOL" ]]; then
        node "$JSON_TOOL" get "$file" "$path" 2>/dev/null || echo ""
    else
        echo ""
    fi
}

# 获取当前TDD阶段
current_phase=$(json_get "$TDD_STATE_FILE" "currentPhase")

# 如果无法获取阶段，默认允许操作
if [[ -z "$current_phase" || "$current_phase" == "null" ]]; then
    current_phase="READY"
fi

echo "🛡️ TDD Phase Guard: 当前阶段 [$current_phase]"

# 获取正在编辑的文件（如果有的话）
edited_file="$1"

# 如果没有提供文件名，跳过检查
if [[ -z "$edited_file" ]]; then
    exit 0
fi

# 基于TDD阶段的文件编辑规则
case "$current_phase" in
    "RED")
        # RED阶段：只允许编辑测试文件
        if [[ "$edited_file" =~ \.(test|spec)\. ]] || [[ "$edited_file" =~ /__tests__/ ]] || [[ "$edited_file" =~ /tests?/ ]]; then
            echo "✅ RED阶段：允许编辑测试文件 - $edited_file"
            exit 0
        else
            echo "⚠️  RED阶段警告：当前阶段应该只编写测试！"
            echo "   正在编辑源代码文件: $edited_file"
            echo "   建议: 先完成测试编写，然后运行 /tdd:green 进入GREEN阶段"
            # 不阻止，只是警告
            exit 0
        fi
        ;;
    
    "GREEN")
        # GREEN阶段：只允许编辑源代码文件
        if [[ "$edited_file" =~ \.(test|spec)\. ]] || [[ "$edited_file" =~ /__tests__/ ]] || [[ "$edited_file" =~ /tests?/ ]]; then
            echo "⚠️  GREEN阶段警告：当前阶段应该只编写实现代码！"
            echo "   正在编辑测试文件: $edited_file"
            echo "   建议: 专注于实现功能，让测试通过"
            # 不阻止，只是警告
            exit 0
        else
            echo "✅ GREEN阶段：允许编辑源代码文件 - $edited_file"
            exit 0
        fi
        ;;
    
    "REFACTOR")
        # REFACTOR阶段：允许编辑源代码和测试文件
        echo "✅ REFACTOR阶段：允许编辑代码进行重构 - $edited_file"
        exit 0
        ;;
    
    "READY"|*)
        # READY阶段或其他状态：允许所有操作
        echo "✅ 允许所有文件操作 - $edited_file"
        exit 0
        ;;
esac