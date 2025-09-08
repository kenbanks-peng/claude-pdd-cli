#!/bin/bash

# 项目类型自动检测脚本
# 自动识别项目技术栈并配置相应的测试命令

set -euo pipefail

readonly PROJECT_ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
readonly CONFIG_FILE="${PROJECT_ROOT}/.claude/project-config.json"
readonly LOG_FILE="${PROJECT_ROOT}/.claude/logs/detector.log"

# 日志记录
log() {
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检测Java项目
detect_java() {
    if [[ -f "pom.xml" ]]; then
        echo "maven"
        return 0
    elif [[ -f "build.gradle" ]] || [[ -f "build.gradle.kts" ]]; then
        echo "gradle"
        return 0
    fi
    return 1
}

# 检测Node.js项目
detect_nodejs() {
    if [[ -f "package.json" ]]; then
        echo "nodejs"
        return 0
    fi
    return 1
}

# 检测Python项目
detect_python() {
    if [[ -f "setup.py" ]] || [[ -f "pyproject.toml" ]] || [[ -f "requirements.txt" ]] || [[ -f "Pipfile" ]]; then
        if [[ -f "pyproject.toml" ]]; then
            echo "python-poetry"
        elif [[ -f "Pipfile" ]]; then
            echo "python-pipenv"
        else
            echo "python"
        fi
        return 0
    fi
    return 1
}

# 检测Go项目
detect_go() {
    if [[ -f "go.mod" ]] || [[ -f "go.sum" ]]; then
        echo "go"
        return 0
    fi
    return 1
}

# 检测Rust项目
detect_rust() {
    if [[ -f "Cargo.toml" ]]; then
        echo "rust"
        return 0
    fi
    return 1
}

# 检测C/C++项目
detect_cpp() {
    if [[ -f "CMakeLists.txt" ]]; then
        echo "cmake"
        return 0
    elif [[ -f "Makefile" ]]; then
        echo "make"
        return 0
    elif [[ -f "meson.build" ]]; then
        echo "meson"
        return 0
    fi
    return 1
}

# 检测PHP项目
detect_php() {
    if [[ -f "composer.json" ]]; then
        echo "php"
        return 0
    fi
    return 1
}

# 检测.NET项目
detect_dotnet() {
    if [[ -f "*.csproj" ]] || [[ -f "*.sln" ]] || [[ -f "project.json" ]]; then
        echo "dotnet"
        return 0
    fi
    return 1
}

# 获取测试框架配置
get_test_config() {
    local project_type="$1"
    local build_tool="$2"
    
    case "$project_type" in
        java)
            case "$build_tool" in
                maven)
                    echo "mvn test" "mvn compile" "mvn checkstyle:check" "mvn jacoco:report"
                    ;;
                gradle)
                    echo "./gradlew test" "./gradlew build" "./gradlew check" "./gradlew jacocoTestReport"
                    ;;
            esac
            ;;
        nodejs)
            if [[ -f "package.json" ]]; then
                local has_jest=$(jq -r '.devDependencies.jest // .dependencies.jest // "null"' package.json)
                local has_mocha=$(jq -r '.devDependencies.mocha // .dependencies.mocha // "null"' package.json)
                local has_vitest=$(jq -r '.devDependencies.vitest // .dependencies.vitest // "null"' package.json)
                
                if [[ "$has_jest" != "null" ]]; then
                    echo "npm test" "npm run build" "npm run lint" "npm run coverage"
                elif [[ "$has_vitest" != "null" ]]; then
                    echo "npm run test" "npm run build" "npm run lint" "npm run coverage"
                elif [[ "$has_mocha" != "null" ]]; then
                    echo "npm test" "npm run build" "npm run lint" "nyc npm test"
                else
                    echo "npm test" "npm run build" "npm run lint" "npm run test:coverage"
                fi
            else
                echo "npm test" "npm run build" "npm run lint" "npm run coverage"
            fi
            ;;
        python*)
            case "$build_tool" in
                python-poetry)
                    echo "poetry run pytest" "poetry build" "poetry run flake8" "poetry run pytest --cov"
                    ;;
                python-pipenv)
                    echo "pipenv run pytest" "pipenv run python setup.py build" "pipenv run flake8" "pipenv run pytest --cov"
                    ;;
                *)
                    echo "python -m pytest" "python setup.py build" "flake8" "python -m pytest --cov"
                    ;;
            esac
            ;;
        go)
            echo "go test ./..." "go build" "golangci-lint run" "go test -coverprofile=coverage.out ./..."
            ;;
        rust)
            echo "cargo test" "cargo build" "cargo clippy" "cargo tarpaulin"
            ;;
        cpp)
            case "$build_tool" in
                cmake)
                    echo "ctest" "cmake --build ." "cppcheck --enable=all src/" "gcov"
                    ;;
                make)
                    echo "make test" "make" "cppcheck --enable=all src/" "gcov"
                    ;;
                meson)
                    echo "meson test" "ninja" "cppcheck --enable=all src/" "gcov"
                    ;;
            esac
            ;;
        php)
            echo "vendor/bin/phpunit" "composer install" "vendor/bin/phpcs" "vendor/bin/phpunit --coverage-html coverage"
            ;;
        dotnet)
            echo "dotnet test" "dotnet build" "dotnet format --verify-no-changes" "dotnet test --collect:\"XPlat Code Coverage\""
            ;;
        *)
            echo "echo 'Please configure test command'" "echo 'Please configure build command'" "echo 'Please configure lint command'" "echo 'Please configure coverage command'"
            ;;
    esac
}

# 更新配置文件
update_config() {
    local project_type="$1"
    local build_tool="$2"
    local language="$3"
    local test_framework="$4"
    
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log "配置文件不存在，无法更新"
        return 1
    fi
    
    # 获取测试命令配置
    local commands=($(get_test_config "$project_type" "$build_tool"))
    local test_cmd="${commands[0]:-echo 'Please configure test command'}"
    local build_cmd="${commands[1]:-echo 'Please configure build command'}"
    local lint_cmd="${commands[2]:-echo 'Please configure lint command'}"
    local coverage_cmd="${commands[3]:-echo 'Please configure coverage command'}"
    
    # 使用jq更新配置
    local temp_file=$(mktemp)
    jq --arg type "$project_type" \
       --arg build "$build_tool" \
       --arg lang "$language" \
       --arg framework "$test_framework" \
       --arg test_cmd "$test_cmd" \
       --arg build_cmd "$build_cmd" \
       --arg lint_cmd "$lint_cmd" \
       --arg coverage_cmd "$coverage_cmd" \
       '
       .project.type = $type |
       .project.language = $lang |
       .project.testFramework = $framework |
       .project.buildTool = $build |
       .commands.test = $test_cmd |
       .commands.build = $build_cmd |
       .commands.lint = $lint_cmd |
       .commands.coverage = $coverage_cmd |
       .project.lastDetection = now | strftime("%Y-%m-%dT%H:%M:%SZ")
       ' "$CONFIG_FILE" > "$temp_file"
    
    mv "$temp_file" "$CONFIG_FILE"
    log "✅ 配置已更新: $project_type ($build_tool)"
}

# 主检测函数
detect_project() {
    cd "$PROJECT_ROOT"
    
    local project_type=""
    local build_tool=""
    local language=""
    local test_framework=""
    
    log "🔍 开始检测项目类型..."
    
    # 检查是否强制指定框架
    if [[ -n "${FORCE_FRAMEWORK:-}" ]]; then
        log "🔧 使用强制指定的框架: $FORCE_FRAMEWORK"
        project_type="$FORCE_FRAMEWORK"
        language="$FORCE_FRAMEWORK"
        
        case "$FORCE_FRAMEWORK" in
            nodejs)
                build_tool="nodejs"
                test_framework="jest"
                language="javascript"
                # 检查是否有 TypeScript
                if [[ -f "tsconfig.json" ]] || [[ -f "package.json" ]]; then
                    if [[ -f "package.json" ]] && grep -q typescript package.json; then
                        language="typescript"
                    fi
                fi
                ;;
            java)
                if [[ -f "pom.xml" ]]; then
                    build_tool="maven"
                elif [[ -f "build.gradle" ]] || [[ -f "build.gradle.kts" ]]; then
                    build_tool="gradle"
                else
                    build_tool="maven"  # 默认
                fi
                test_framework="junit"
                ;;
            python)
                if [[ -f "pyproject.toml" ]]; then
                    build_tool="python-poetry"
                elif [[ -f "Pipfile" ]]; then
                    build_tool="python-pipenv"
                else
                    build_tool="python"
                fi
                test_framework="pytest"
                ;;
            go)
                build_tool="go"
                test_framework="go-test"
                ;;
            rust)
                build_tool="rust"
                test_framework="cargo-test"
                ;;
            *)
                log "⚠️  未知的强制框架类型: $FORCE_FRAMEWORK，回退到自动检测"
                FORCE_FRAMEWORK=""
                ;;
        esac
    fi
    
    # 如果没有强制指定框架，进行自动检测
    if [[ -z "$project_type" ]]; then
        # 按优先级检测各种项目类型
        if build_tool=$(detect_java); then
        project_type="java"
        language="java"
        case "$build_tool" in
            maven) test_framework="junit" ;;
            gradle) test_framework="junit" ;;
        esac
    elif build_tool=$(detect_nodejs); then
        project_type="nodejs"
        language="javascript"
        # 检测具体的测试框架
        if [[ -f "package.json" ]]; then
            if jq -e '.devDependencies.jest or .dependencies.jest' package.json >/dev/null; then
                test_framework="jest"
            elif jq -e '.devDependencies.mocha or .dependencies.mocha' package.json >/dev/null; then
                test_framework="mocha"
            elif jq -e '.devDependencies.vitest or .dependencies.vitest' package.json >/dev/null; then
                test_framework="vitest"
            else
                test_framework="unknown"
            fi
            # 检测语言类型
            if jq -e '.devDependencies.typescript or .dependencies.typescript' package.json >/dev/null; then
                language="typescript"
            fi
        fi
    elif build_tool=$(detect_python); then
        project_type="python"
        language="python"
        test_framework="pytest"
    elif build_tool=$(detect_go); then
        project_type="go"
        language="go"
        test_framework="go-test"
    elif build_tool=$(detect_rust); then
        project_type="rust"
        language="rust"
        test_framework="cargo-test"
    elif build_tool=$(detect_cpp); then
        project_type="cpp"
        language="cpp"
        case "$build_tool" in
            cmake) test_framework="ctest" ;;
            make) test_framework="custom" ;;
            meson) test_framework="meson-test" ;;
        esac
    elif build_tool=$(detect_php); then
        project_type="php"
        language="php"
        test_framework="phpunit"
    elif build_tool=$(detect_dotnet); then
        project_type="dotnet"
        language="csharp"
        test_framework="xunit"
    else
        project_type="unknown"
        build_tool="unknown"
        language="unknown"
        test_framework="unknown"
        log "⚠️  无法识别项目类型"
    fi
    fi
    
    echo "检测结果:"
    echo "  项目类型: $project_type"
    echo "  构建工具: $build_tool"
    echo "  语言: $language"
    echo "  测试框架: $test_framework"
    
    return 0
}

# 显示配置
show_config() {
    if [[ ! -f "$CONFIG_FILE" ]]; then
        echo "配置文件不存在"
        return 1
    fi
    
    echo "当前项目配置:"
    jq -r '
    "  项目名称: \(.project.name)",
    "  项目类型: \(.project.type)",
    "  语言: \(.project.language)",
    "  构建工具: \(.project.buildTool)",
    "  测试框架: \(.project.testFramework)",
    "",
    "命令配置:",
    "  测试: \(.commands.test)",
    "  构建: \(.commands.build)",
    "  代码检查: \(.commands.lint)",
    "  覆盖率: \(.commands.coverage)"
    ' "$CONFIG_FILE"
}

# 显示帮助
show_help() {
    cat << EOF
项目类型检测器

用法:
  $0 <command>

命令:
  detect      检测项目类型并显示结果
  config      检测项目类型并更新配置文件
  show        显示当前配置
  help        显示此帮助信息

支持的项目类型:
  - Java (Maven/Gradle)
  - Node.js (npm/yarn)
  - Python (pip/poetry/pipenv)
  - Go
  - Rust (Cargo)
  - C/C++ (CMake/Make/Meson)
  - PHP (Composer)
  - .NET (dotnet)

EOF
}

# 主函数
main() {
    case "${1:-detect}" in
        detect)
            detect_project
            ;;
        config)
            if detect_project; then
                # 从检测结果中提取信息并更新配置
                local result=$(detect_project 2>/dev/null)
                local project_type=$(echo "$result" | grep "项目类型:" | cut -d: -f2 | xargs)
                local build_tool=$(echo "$result" | grep "构建工具:" | cut -d: -f2 | xargs)
                local language=$(echo "$result" | grep "语言:" | cut -d: -f2 | xargs)
                local test_framework=$(echo "$result" | grep "测试框架:" | cut -d: -f2 | xargs)
                
                update_config "$project_type" "$build_tool" "$language" "$test_framework"
                echo "✅ 配置已更新"
            fi
            ;;
        show)
            show_config
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