#!/bin/bash

# Commit Validator Hook - 验证提交信息和TDD状态
# 确保提交符合TDD工作流规范

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
TDD_STATE_FILE="$PROJECT_DIR/.claude/tdd-state.json"

echo "📝 验证提交规范..."

# 检查TDD状态
if [[ ! -f "$TDD_STATE_FILE" ]]; then
    echo "⚠️  TDD状态文件不存在，无法验证TDD阶段"
    exit 0  # 非TDD项目允许正常提交
fi

# 获取当前TDD状态
current_phase=$(jq -r '.currentPhase' "$TDD_STATE_FILE")
tests_passing=$(jq -r '.testsPassing' "$TDD_STATE_FILE")
feature_id=$(jq -r '.featureId' "$TDD_STATE_FILE")

# 检查测试状态
if [[ "$tests_passing" == "false" && "$current_phase" != "RED" ]]; then
    echo "❌ 提交被阻止：测试失败"
    echo "   TDD规则：只有RED阶段允许提交失败的测试"
    echo "   当前阶段：$current_phase"
    echo "   建议：修复测试或使用 /tdd:red 进入RED阶段"
    exit 1
fi

# 获取最后一次提交信息（如果存在）
last_commit_msg=""
if git rev-parse --verify HEAD >/dev/null 2>&1; then
    last_commit_msg=$(git log -1 --pretty=%B)
fi

# 验证提交信息格式
validate_commit_message() {
    local msg="$1"
    
    # 检查是否包含TDD阶段标识
    if [[ ! "$msg" =~ \[(RED|GREEN|REFACTOR)\] ]]; then
        echo "⚠️  建议：提交信息包含TDD阶段标识，如 [RED], [GREEN], [REFACTOR]"
    fi
    
    # 检查是否包含功能ID
    if [[ -n "$feature_id" && "$feature_id" != "null" ]]; then
        if [[ ! "$msg" =~ $feature_id ]]; then
            echo "⚠️  建议：提交信息包含功能ID: $feature_id"
        fi
    fi
    
    # 检查提交信息长度
    if [[ ${#msg} -lt 10 ]]; then
        echo "⚠️  建议：提交信息应该更加详细描述"
    fi
}

# 如果有提交信息，进行验证
if [[ -n "$last_commit_msg" ]]; then
    validate_commit_message "$last_commit_msg"
fi

# 根据TDD阶段给出提交建议
case "$current_phase" in
    "RED")
        echo "🔴 RED阶段提交：新增失败测试"
        echo "   ✓ 允许测试失败的提交"
        ;;
    "GREEN")
        if [[ "$tests_passing" == "true" ]]; then
            echo "🟢 GREEN阶段提交：实现代码使测试通过"
            echo "   ✓ 测试通过，符合GREEN阶段要求"
        else
            echo "❌ GREEN阶段要求：所有测试必须通过"
            exit 1
        fi
        ;;
    "REFACTOR")
        if [[ "$tests_passing" == "true" ]]; then
            echo "🔧 REFACTOR阶段提交：重构代码质量"
            echo "   ✓ 测试保持绿色，符合REFACTOR阶段要求"
        else
            echo "❌ REFACTOR阶段要求：重构不能破坏测试"
            exit 1
        fi
        ;;
    "READY")
        echo "🔵 READY阶段提交：配置或文档更新"
        ;;
esac

# 更新提交历史
if [[ -f "$TDD_STATE_FILE" ]]; then
    commit_hash=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
    jq ".history += [{\"phase\": \"$current_phase\", \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"commit\": \"$commit_hash\"}]" "$TDD_STATE_FILE" > "$TDD_STATE_FILE.tmp"
    mv "$TDD_STATE_FILE.tmp" "$TDD_STATE_FILE"
fi

echo "✅ 提交验证通过"
exit 0