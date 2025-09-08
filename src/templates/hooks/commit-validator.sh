#!/bin/bash

# Commit Validator - 确保提交符合TDD规则和阶段要求
# 验证当前TDD状态并在提交时记录历史

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
TDD_STATE_FILE="$PROJECT_DIR/.claude/tdd-state.json"
JSON_TOOL="$PROJECT_DIR/.claude/bin/json-tool.js"

# 检查是否启用TDD
if [[ ! -f "$TDD_STATE_FILE" ]]; then
    echo "ℹ️  TDD未初始化，跳过提交验证"
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

json_update() {
    local file="$1"
    local updates="$2"
    
    if command -v jq >/dev/null 2>&1; then
        local temp_file="${file}.tmp"
        echo "$updates" | jq -s '.[0] * .[1]' "$file" - > "$temp_file" && mv "$temp_file" "$file"
    elif [[ -f "$JSON_TOOL" ]]; then
        node "$JSON_TOOL" update "$file" "$updates"
    else
        echo "⚠️  无法更新 TDD 状态：缺少 JSON 处理工具"
    fi
}

# 获取TDD状态信息
current_phase=$(json_get "$TDD_STATE_FILE" "currentPhase")
tests_passing=$(json_get "$TDD_STATE_FILE" "testsPassing")
feature_id=$(json_get "$TDD_STATE_FILE" "featureId")

# 如果无法读取状态，跳过验证
if [[ -z "$current_phase" || "$current_phase" == "null" ]]; then
    echo "⚠️  无法读取TDD状态，跳过提交验证"
    exit 0
fi

echo "🔍 TDD提交验证 - 阶段: $current_phase"

# 获取提交消息（如果是pre-commit钩子）
commit_msg_file="$1"
commit_msg=""
if [[ -f "$commit_msg_file" ]]; then
    commit_msg=$(cat "$commit_msg_file")
fi

# 基于TDD阶段的提交验证规则
case "$current_phase" in
    "RED")
        # RED阶段：测试应该失败
        if [[ "$tests_passing" == "true" ]]; then
            echo "⚠️  RED阶段警告：测试通过了！"
            echo "   RED阶段的提交应该包含失败的测试"
            echo "   这可能表示："
            echo "   1. 测试没有正确表达需求"
            echo "   2. 已存在的代码意外满足了新需求"
            echo ""
            echo "建议: 检查测试是否正确，确保它测试了新功能"
        else
            echo "✅ RED阶段提交：测试按预期失败"
        fi
        
        # 建议提交消息格式
        if [[ -n "$commit_msg" ]] && [[ ! "$commit_msg" =~ ^test: ]]; then
            echo "💡 建议：RED阶段提交消息以 'test:' 开头"
        fi
        ;;
    
    "GREEN")
        # GREEN阶段：测试应该通过
        if [[ "$tests_passing" != "true" ]]; then
            echo "❌ GREEN阶段错误：测试未通过！"
            echo "   GREEN阶段不应该在测试失败时提交"
            echo "   请先确保所有测试通过"
            echo ""
            echo "建议: 继续实现功能直到测试通过，或运行 /tdd:red 回到RED阶段"
            exit 1
        else
            echo "✅ GREEN阶段提交：所有测试通过"
        fi
        
        # 建议提交消息格式
        if [[ -n "$commit_msg" ]] && [[ ! "$commit_msg" =~ ^feat: ]] && [[ ! "$commit_msg" =~ ^fix: ]]; then
            echo "💡 建议：GREEN阶段提交消息以 'feat:' 或 'fix:' 开头"
        fi
        ;;
    
    "REFACTOR")
        # REFACTOR阶段：测试应该保持通过
        if [[ "$tests_passing" != "true" ]]; then
            echo "❌ REFACTOR阶段错误：重构破坏了测试！"
            echo "   重构的金规则：不改变外部行为"
            echo "   测试失败表明重构改变了功能行为"
            echo ""
            echo "建议: 撤销重构更改或修复测试"
            exit 1
        else
            echo "✅ REFACTOR阶段提交：测试保持通过"
        fi
        
        # 建议提交消息格式
        if [[ -n "$commit_msg" ]] && [[ ! "$commit_msg" =~ ^refactor: ]]; then
            echo "💡 建议：REFACTOR阶段提交消息以 'refactor:' 开头"
        fi
        ;;
    
    "READY")
        echo "ℹ️  READY阶段：自由提交"
        ;;
    
    *)
        echo "⚠️  未知TDD阶段: $current_phase"
        ;;
esac

# 记录提交历史到TDD状态
commit_hash=$(git rev-parse HEAD 2>/dev/null || echo "pending")
timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)

# 更新提交信息
commit_info="{\"lastCommit\": {\"phase\": \"$current_phase\", \"timestamp\": \"$timestamp\", \"commit\": \"$commit_hash\", \"testsPassing\": $tests_passing}}"
json_update "$TDD_STATE_FILE" "$commit_info"

echo "📝 TDD提交信息已更新"

# 如果是特定的TDD阶段完成，提供下一步建议
case "$current_phase" in
    "RED")
        echo ""
        echo "🟢 下一步: 运行 /tdd:green 开始实现功能"
        ;;
    "GREEN")
        echo ""
        echo "🔵 下一步: 运行 /tdd:refactor 改善代码质量，或 /tdd:red 添加新功能"
        ;;
    "REFACTOR")
        echo ""
        echo "🔴 下一步: 运行 /tdd:red 添加新功能，或继续重构"
        ;;
esac

exit 0