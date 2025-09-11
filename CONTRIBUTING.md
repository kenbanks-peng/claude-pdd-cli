# 🤝 贡献指南

感谢您对 Claude PDD CLI 项目的兴趣！我们欢迎各种形式的贡献。

## 🌟 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议：

1. **搜索已有 Issues**：确保问题未被重复报告
2. **使用 Issue 模板**：提供尽可能详细的信息
3. **包含环境信息**：
   - Node.js 版本
   - 操作系统
   - claude-pdd-cli 版本
   - 错误堆栈信息

### 提交代码

#### 开发环境搭建

```bash
# 1. Fork 项目并克隆
git clone https://github.com/你的用户名/claude-pdd-cli.git
cd claude-pdd-cli

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 5. 链接到本地（用于测试）
npm link
```

#### 开发工作流

1. **创建功能分支**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **遵循提交规范**
   ```bash
   # 格式：<type>(<scope>): <subject>
   git commit -m "feat(init): 添加 Rust 框架支持"
   git commit -m "fix(doctor): 修复环境检测问题"
   git commit -m "docs: 更新 API 文档"
   ```

3. **确保代码质量**
   ```bash
   # 代码检查和格式化
   npm run lint
   
   # 构建验证
   npm run build
   ```

4. **提交 Pull Request**
   - 基于 `develop` 分支创建 PR
   - 使用清晰的 PR 标题和描述
   - 关联相关的 Issues
   - 确保 CI 检查通过

## 📋 代码规范

### TypeScript 规范

- 使用 TypeScript 严格模式
- 为公共 API 提供完整类型注解
- 使用接口定义数据结构
- 优先使用 `const` 断言

```typescript
// ✅ 好的做法
interface FrameworkConfig {
  name: string;
  testCommand: string;
  buildCommand?: string;
}

const frameworks: readonly FrameworkConfig[] = [
  { name: 'nodejs', testCommand: 'npm test' },
  { name: 'python', testCommand: 'pytest' }
] as const;

// ❌ 避免的做法
const frameworks = [
  { name: 'nodejs', testCommand: 'npm test' },
  { name: 'python', testCommand: 'pytest' }
];
```

### 命名规范

- **文件名**：kebab-case (`framework-detector.ts`)
- **类名**：PascalCase (`FrameworkDetector`)
- **函数名**：camelCase (`detectFramework`)
- **常量**：SCREAMING_SNAKE_CASE (`DEFAULT_CONFIG`)

### 错误处理

- 使用具体的错误类型
- 提供有意义的错误信息
- 包含错误恢复建议

```typescript
// ✅ 好的错误处理
class FrameworkNotFoundError extends Error {
  constructor(projectPath: string) {
    super(
      `无法检测到支持的框架在路径: ${projectPath}\n` +
      `建议：确保项目包含 package.json、pom.xml 或其他框架配置文件`
    );
    this.name = 'FrameworkNotFoundError';
  }
}
```

### 测试规范

- 为每个公共函数编写测试
- 使用描述性的测试名称
- 遵循 AAA 模式（Arrange, Act, Assert）

```typescript
describe('FrameworkDetector', () => {
  describe('detectFramework', () => {
    it('应该检测到 Node.js 项目当 package.json 存在时', () => {
      // Arrange
      const detector = new FrameworkDetector();
      
      // Act
      const result = detector.detectFramework('/path/to/nodejs/project');
      
      // Assert
      expect(result.name).toBe('nodejs');
    });
  });
});
```

## 🔄 分支策略

我们使用 Git Flow 工作流：

- `main`：生产就绪代码
- `develop`：开发分支
- `feature/*`：新功能开发
- `hotfix/*`：紧急修复
- `release/*`：版本发布准备

详细的分支管理策略请参考 [Wiki - 分支管理](https://github.com/MuziGeek/claude-pdd-cli/wiki/Branch-Management)。

## 📝 提交信息规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建工具或辅助工具变更

### 作用域

- `init`: 项目初始化
- `doctor`: 环境诊断
- `config`: 配置管理
- `template`: 模板系统
- `ui`: 用户界面
- `cli`: 命令行接口

### 示例

```bash
feat(init): 添加 Go 框架支持
fix(doctor): 修复 Windows 路径检测问题
docs(readme): 更新安装说明
refactor(template): 重构模板加载机制
test(detector): 添加框架检测单元测试
```

## ✅ Pull Request 检查清单

在提交 PR 前，请确认：

### 代码质量
- [ ] 代码检查通过 (`npm run lint`)
- [ ] 构建成功 (`npm run build`)
- [ ] 功能实现完整

### 功能完整性
- [ ] 新功能文档完整
- [ ] 更新了相关文档
- [ ] 命令行帮助信息正确
- [ ] 错误处理适当

### 兼容性
- [ ] 跨平台兼容 (Windows, macOS, Linux)
- [ ] Node.js 多版本兼容 (18.x, 20.x, 22.x)
- [ ] 向后兼容现有 API

### 文档
- [ ] README 更新（如有必要）
- [ ] API 文档更新
- [ ] CHANGELOG 条目添加
- [ ] 示例代码有效

## 🎯 开发重点

### 当前优先级

1. **框架支持扩展**
   - 添加新的编程语言支持
   - 改进框架检测准确性

2. **用户体验改进**
   - 更好的错误信息
   - 交互式配置向导
   - 进度指示器

3. **性能优化**
   - 减少启动时间
   - 缓存机制
   - 并行处理

4. **测试覆盖**
   - 增加边界条件测试
   - 集成测试
   - 性能测试

### 技术债务

- 重构老旧的模块
- 改进错误处理
- 统一配置格式
- 优化依赖管理

## 🛡️ 安全考虑

- **不要提交敏感信息**：API 密钥、密码、令牌
- **验证用户输入**：防止路径遍历、注入攻击
- **安全的文件操作**：使用安全的文件路径处理
- **依赖安全**：定期检查依赖漏洞

## 📚 学习资源

### 项目相关
- [Claude Code 文档](https://claude.ai/code)
- [TDD 最佳实践](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [CLI 设计指南](https://clig.dev/)

### 技术栈
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Node.js API 文档](https://nodejs.org/api/)
- [Jest 测试框架](https://jestjs.io/docs/getting-started)

## 💬 获得帮助

- **GitHub Issues**：报告问题或功能请求
- **GitHub Discussions**：讨论想法和获得帮助
- **Wiki**：查看详细文档
- **Email**：紧急问题可发邮件至 mz@easymuzi.cn

## 🎉 贡献者

感谢所有为项目做出贡献的人！

<!-- 这里将自动显示贡献者头像 -->
<a href="https://github.com/MuziGeek/claude-pdd-cli/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MuziGeek/claude-pdd-cli" />
</a>

## 📄 行为准则

我们致力于营造一个开放、友好的社区环境。参与本项目即表示您同意遵守我们的行为准则：

### 我们的承诺

- **包容**：欢迎不同背景和观点的人
- **尊重**：尊重不同意见和经历
- **协作**：以建设性方式解决分歧
- **学习**：互相学习，共同成长

### 不当行为

以下行为不被接受：

- 使用性化的言语或图像
- 人身攻击或侮辱
- 骚扰行为
- 发布他人隐私信息
- 其他不专业行为

### 执行

项目维护者有权删除、编辑或拒绝违反行为准则的评论、提交、代码、问题等。

---

再次感谢您的贡献！每个贡献都让 Claude PDD CLI 变得更好。🚀