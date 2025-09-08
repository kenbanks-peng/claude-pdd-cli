# Claude TDD CLI Examples

这个目录包含了不同编程语言和框架的 Claude TDD CLI 使用示例。每个示例都展示了如何在特定技术栈中实施测试驱动开发 (TDD) 最佳实践。

## 📁 可用示例

### [Node.js/TypeScript](nodejs/)
- **框架**: Node.js + TypeScript
- **测试框架**: Jest
- **构建工具**: npm/yarn
- **特色**: Express.js 集成、ES6+ 特性、类型安全

### [Java](java/)
- **框架**: Java 11+ with Maven
- **测试框架**: JUnit 5 + Mockito + AssertJ
- **构建工具**: Maven
- **特色**: 现代 Java 特性、代码覆盖率、静态分析

### [Python](python/)
- **框架**: Python 3.8+
- **测试框架**: pytest
- **构建工具**: pip/poetry
- **特色**: 现代 Python 工具链、类型提示、代码质量检查

### [Go](go/) 🚧
- **框架**: Go 1.19+
- **测试框架**: 内置 testing 包
- **构建工具**: go mod
- **状态**: 即将推出

### [Rust](rust/) 🚧
- **框架**: Rust 1.70+
- **测试框架**: 内置 test 框架
- **构建工具**: Cargo
- **状态**: 即将推出

## 🚀 快速开始

### 1. 安装 Claude TDD CLI
```bash
npm install -g claude-tdd-cli@beta
```

### 2. 选择一个示例项目
```bash
# 复制示例到你的工作目录
cp -r examples/nodejs my-tdd-project
cd my-tdd-project
```

### 3. 初始化 TDD 工作流
```bash
claude-tdd init --framework nodejs --quick
```

### 4. 开始 TDD 循环
```bash
# 查看当前状态
claude-tdd status

# 开始编写测试 (RED 阶段)
# 在 Claude Code 中使用: /tdd:red

# 实现功能 (GREEN 阶段)
# 在 Claude Code 中使用: /tdd:green

# 重构代码 (REFACTOR 阶段)
# 在 Claude Code 中使用: /tdd:refactor
```

## 🎯 TDD 工作流程

每个示例都遵循标准的 TDD 三步循环：

### 🔴 RED - 编写失败的测试
1. 编写一个描述期望行为的测试
2. 运行测试，确认它失败
3. 测试失败的原因应该是功能尚未实现

### 🟢 GREEN - 编写最小实现
1. 编写**最少**的代码使测试通过
2. 不要过度设计，只专注于通过测试
3. 运行测试确认全部通过

### 🔵 REFACTOR - 重构改进
1. 改进代码结构和设计
2. 消除重复代码
3. 运行测试确保功能不变

## 🛠️ 每个示例包含的内容

### 项目结构
- 标准的目录布局
- 适合框架的构建配置
- 测试和源码分离

### TDD 配置
- `.claude/` 目录包含所有 Claude TDD 配置
- 专门的 AI 代理用于不同任务
- 自定义命令和钩子脚本
- 框架特定的规则和模板

### 示例代码
- 完整的 TDD 循环示例
- 最佳实践演示
- 常见场景的处理方法
- 错误处理和边界情况

### 文档
- 详细的设置说明
- 工作流程指南
- 故障排除建议
- 学习资源链接

## 📚 学习路径

### 初学者
1. 从 **Node.js** 或 **Python** 示例开始
2. 跟随 README 中的逐步指南
3. 完成基础的计算器示例
4. 尝试添加新功能

### 中级开发者
1. 探索 **Java** 示例的高级特性
2. 实践不同的测试模式
3. 集成 CI/CD 流程
4. 学习代码质量工具

### 高级开发者
1. 自定义 Claude TDD 配置
2. 创建自己的代理和命令
3. 集成团队工作流
4. 贡献新的示例

## 🎨 自定义示例

如果你想创建自己的示例：

```bash
# 创建新的示例目录
mkdir examples/my-framework

# 初始化项目
cd examples/my-framework
claude-tdd init --framework my-framework

# 自定义配置
# 编辑 .claude/ 目录下的文件
```

### 示例结构模板

```
my-framework/
├── src/                    # 源代码
├── tests/                  # 测试代码  
├── .claude/               # Claude TDD 配置
│   ├── agents/           # AI 代理
│   ├── commands/         # 自定义命令
│   ├── hooks/            # Git 钩子
│   └── rules/            # TDD 规则
├── build-config.*        # 构建配置文件
├── README.md             # 详细说明
└── package.json          # 项目配置
```

## 🤝 贡献指南

欢迎贡献新的示例！请遵循以下步骤：

1. **Fork 仓库**
2. **创建新的示例目录**
3. **包含完整的项目结构**
4. **编写详细的 README**
5. **提供工作示例代码**
6. **测试示例确保可用**
7. **提交 Pull Request**

### 贡献清单
- [ ] 项目可以成功构建
- [ ] 测试可以运行并通过  
- [ ] README 包含清晰的说明
- [ ] 代码遵循最佳实践
- [ ] 包含 Claude TDD 配置
- [ ] 示例具有教育价值

## 📞 获取帮助

- **文档**: [Claude TDD CLI 文档](https://github.com/claude-tdd/claude-tdd-cli#readme)
- **问题**: [GitHub Issues](https://github.com/claude-tdd/claude-tdd-cli/issues)
- **讨论**: [GitHub Discussions](https://github.com/claude-tdd/claude-tdd-cli/discussions)

## 📈 反馈和改进

这些示例是活跃开发的，我们欢迎你的反馈：

- 哪些示例最有用？
- 你希望看到哪些新的框架示例？
- 文档有哪些可以改进的地方？
- 是否遇到了任何问题？

请通过 [GitHub Issues](https://github.com/claude-tdd/claude-tdd-cli/issues) 告诉我们你的想法！

---

**Happy TDD Coding! 🚀**