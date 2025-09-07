#!/bin/bash

# Test Runner Hook - 在代码变更后自动运行测试
# 根据TDD阶段和项目类型智能选择测试策略

PROJECT_DIR="$CLAUDE_PROJECT_DIR"
TDD_STATE_FILE="$PROJECT_DIR/.claude/tdd-state.json"

# 检查是否启用TDD
if [[ ! -f "$TDD_STATE_FILE" ]]; then
    echo "ℹ️  TDD未初始化，跳过自动测试"
    exit 0
fi

# 获取当前TDD阶段
current_phase=$(jq -r '.currentPhase' "$TDD_STATE_FILE")

# 如果是READY阶段，不运行测试
if [[ "$current_phase" == "READY" ]]; then
    exit 0
fi

echo "🧪 TDD自动测试 ($current_phase阶段)"

# 检测项目类型并运行相应的测试命令
detect_and_run_tests() {
    local test_cmd=""
    
    # Java项目检测
    if [[ -f "pom.xml" ]]; then
        test_cmd="mvn test -q"
        echo "📋 检测到Maven项目，运行: $test_cmd"
    elif [[ -f "build.gradle" ]]; then
        test_cmd="./gradlew test --quiet"
        echo "📋 检测到Gradle项目，运行: $test_cmd"
    
    # Node.js项目检测
    elif [[ -f "package.json" ]]; then
        if [[ $(jq -r '.scripts.test' package.json 2>/dev/null) != "null" ]]; then
            test_cmd="npm test"
        else
            test_cmd="npx jest --passWithNoTests"
        fi
        echo "📦 检测到Node.js项目，运行: $test_cmd"
    
    # Python项目检测
    elif [[ -f "setup.py" ]] || [[ -f "pyproject.toml" ]] || [[ -f "requirements.txt" ]]; then
        if command -v pytest >/dev/null 2>&1; then
            test_cmd="pytest -v"
        else
            test_cmd="python -m unittest discover -v"
        fi
        echo "🐍 检测到Python项目，运行: $test_cmd"
    
    # Go项目检测
    elif [[ -f "go.mod" ]]; then
        test_cmd="go test ./..."
        echo "🐹 检测到Go项目，运行: $test_cmd"
    
    # Rust项目检测
    elif [[ -f "Cargo.toml" ]]; then
        test_cmd="cargo test"
        echo "🦀 检测到Rust项目，运行: $test_cmd"
    
    else
        echo "⚠️  未能识别项目类型，跳过自动测试"
        echo "   支持的项目类型：Java, Node.js, Python, Go, Rust"
        return 0
    fi
    
    # 执行测试命令
    if [[ -n "$test_cmd" ]]; then
        echo "🔍 执行测试..."
        
        # 使用timeout避免测试卡死
        timeout 300s bash -c "$test_cmd" 2>&1
        local test_result=$?
        
        # 更新TDD状态中的测试结果
        local tests_passing="false"
        if [[ $test_result -eq 0 ]]; then
            tests_passing="true"
            echo "✅ 测试通过"
        else
            echo "❌ 测试失败"
        fi
        
        # 更新状态文件
        jq ".testsPassing = $tests_passing | .timestamp = \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"" "$TDD_STATE_FILE" > "$TDD_STATE_FILE.tmp"
        mv "$TDD_STATE_FILE.tmp" "$TDD_STATE_FILE"
        
        # 根据TDD阶段和测试结果给出建议
        case "$current_phase" in
            "RED")
                if [[ "$tests_passing" == "true" ]]; then
                    echo "⚠️  RED阶段警告：测试不应该通过！"
                    echo "   确保新写的测试正确表达了需求"
                else
                    echo "✅ RED阶段正确：测试按预期失败"
                    echo "   下一步：运行 /tdd:green 编写最小实现"
                fi
                ;;
            "GREEN")
                if [[ "$tests_passing" == "true" ]]; then
                    echo "✅ GREEN阶段成功：所有测试通过"
                    echo "   下一步：运行 /tdd:refactor 改善代码质量"
                else
                    echo "🔄 GREEN阶段：继续编写代码直到测试通过"
                fi
                ;;
            "REFACTOR")
                if [[ "$tests_passing" == "true" ]]; then
                    echo "✅ REFACTOR阶段安全：测试保持绿色"
                else
                    echo "⚠️  REFACTOR阶段警告：重构破坏了测试！"
                    echo "   立即修复以保持测试绿色"
                fi
                ;;
        esac
        
        return $test_result
    fi
}

# 运行测试
detect_and_run_tests