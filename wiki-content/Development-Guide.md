# 🛠️ 开发指南

本指南将帮助你搭建 Claude TDD CLI 的开发环境，了解项目结构，并开始贡献代码。

## 📋 开发环境要求

### 必需软件
- **Node.js**: 18.x, 20.x, 或 22.x
- **npm**: 9.x 或更高版本
- **Git**: 2.x 或更高版本
- **VS Code** (推荐): 最佳 TypeScript 开发体验

### 可选工具
- **Claude Code**: 用于测试 CLI 集成
- **Docker**: 用于容器化测试
- **GitHub CLI**: 便于 PR 管理

## 🚀 环境搭建

### 1. 克隆仓库

```bash
# 1. Fork 项目到你的 GitHub 账户
# 2. 克隆你的 fork
git clone https://github.com/你的用户名/claude-tdd-cli.git
cd claude-tdd-cli

# 3. 添加上游仓库
git remote add upstream https://github.com/MuziGeek/claude-tdd-cli.git
```

### 2. 安装依赖

```bash
# 安装所有依赖（包括开发依赖）
npm install

# 验证安装
npm run build
npm test
```

### 3. 本地链接

```bash
# 创建全局链接用于测试
npm link

# 验证安装
claude-tdd --version
ctdd --help
```

### 4. 开发工具配置

创建 `.vscode/settings.json`：
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.exclude": {
    "node_modules": true,
    "dist": true,
    "coverage": true
  }
}
```

## 📁 项目结构

```
claude-tdd-cli/
├── src/                    # 源代码
│   ├── commands/          # CLI 命令实现
│   │   ├── init.ts       # 初始化命令
│   │   ├── doctor.ts     # 诊断命令
│   │   ├── status.ts     # 状态命令
│   │   └── config.ts     # 配置命令
│   ├── core/             # 核心功能
│   │   ├── detector.ts   # 环境检测
│   │   ├── template-manager.ts  # 模板管理
│   │   └── config-generator.ts  # 配置生成
│   ├── templates/        # 模板文件
│   ├── ui/              # 用户界面
│   └── index.ts         # 程序入口
├── tests/               # 测试文件
├── dist/               # 构建输出（Git 忽略）
├── docs/               # 文档文件（本地）
├── wiki-content/       # Wiki 内容（本地）
├── scripts/            # 构建脚本
└── .github/            # GitHub Actions 工作流
```

### 核心模块说明

#### `src/commands/`
包含所有 CLI 命令的实现：

- `init.ts`: 项目初始化逻辑
- `doctor.ts`: 环境诊断和健康检查
- `status.ts`: 项目状态查看
- `config.ts`: 配置管理

#### `src/core/`
核心业务逻辑：

- `detector.ts`: 框架和环境检测
- `template-manager.ts`: 模板文件管理
- `config-generator.ts`: 配置文件生成

#### `src/templates/`
模板文件存储，包含不同框架的：

- 配置文件模板
- 脚本模板
- 文档模板

## 🔧 开发工作流

### 1. 日常开发

```bash
# 1. 更新本地代码
git fetch upstream
git checkout develop
git merge upstream/develop

# 2. 创建功能分支
git checkout -b feature/your-feature-name

# 3. 开发过程中
npm run dev          # 监听模式构建
npm run test:watch   # 监听模式测试

# 4. 测试 CLI
claude-tdd init --help  # 测试命令

# 5. 提交代码
git add .
git commit -m "feat(init): 添加新功能"
git push origin feature/your-feature-name
```

### 2. 测试策略

```bash
# 单元测试
npm test

# 监听模式测试
npm run test:watch

# 覆盖率测试
npm run test:coverage

# 类型检查
npm run lint

# 集成测试（手动）
npm run build
npm link
claude-tdd init --framework nodejs
```

### 3. 调试技巧

#### VS Code 调试配置
创建 `.vscode/launch.json`：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/dist/index.js",
      "args": ["init", "--framework", "nodejs"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

#### 日志调试
```typescript
// 使用内置的调试工具
import { debug } from './ui/output.js';

debug('检测到框架:', frameworkName);
debug('配置对象:', JSON.stringify(config, null, 2));
```

## 📝 代码规范

### TypeScript 最佳实践

```typescript
// ✅ 使用明确的类型定义
interface FrameworkConfig {
  readonly name: string;
  readonly testCommand: string;
  readonly buildCommand?: string;
}

// ✅ 使用枚举表示固定值
enum SupportedFrameworks {
  NODEJS = 'nodejs',
  PYTHON = 'python',
  JAVA = 'java',
  GO = 'go',
  RUST = 'rust'
}

// ✅ 使用类型守卫
function isValidFramework(framework: string): framework is SupportedFrameworks {
  return Object.values(SupportedFrameworks).includes(framework as SupportedFrameworks);
}

// ✅ 错误处理
class ConfigurationError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ConfigurationError';
  }
}
```

### 测试最佳实践

```typescript
describe('FrameworkDetector', () => {
  let detector: FrameworkDetector;
  
  beforeEach(() => {
    detector = new FrameworkDetector();
  });
  
  describe('detectFramework', () => {
    it('应该检测到 Node.js 项目当存在 package.json', () => {
      // Arrange
      const projectPath = '/path/to/nodejs/project';
      
      // Act
      const result = detector.detectFramework(projectPath);
      
      // Assert
      expect(result.name).toBe('nodejs');
      expect(result.testCommand).toBe('npm test');
    });
    
    it('应该抛出错误当无法检测到框架', () => {
      // Arrange
      const emptyPath = '/path/to/empty/project';
      
      // Act & Assert
      expect(() => detector.detectFramework(emptyPath))
        .toThrow(FrameworkNotFoundError);
    });
  });
});
```

## 🔍 常见开发任务

### 添加新框架支持

1. **定义框架配置**
   ```typescript
   // src/core/frameworks.ts
   export const SUPPORTED_FRAMEWORKS = {
     // ... 现有框架
     dart: {
       name: 'dart',
       testCommand: 'dart test',
       buildCommand: 'dart compile',
       configFiles: ['pubspec.yaml']
     }
   } as const;
   ```

2. **更新检测逻辑**
   ```typescript
   // src/core/detector.ts
   detectFramework(projectPath: string) {
     if (fs.existsSync(path.join(projectPath, 'pubspec.yaml'))) {
       return SUPPORTED_FRAMEWORKS.dart;
     }
     // ... 其他检测逻辑
   }
   ```

3. **添加模板文件**
   ```bash
   mkdir src/templates/dart
   # 创建相应的模板文件
   ```

4. **编写测试**
   ```typescript
   it('应该检测到 Dart 项目', () => {
     const result = detector.detectFramework('/path/to/dart/project');
     expect(result.name).toBe('dart');
   });
   ```

### 添加新命令

1. **创建命令文件**
   ```typescript
   // src/commands/new-command.ts
   export async function newCommand(options: NewCommandOptions) {
     // 命令逻辑
   }
   ```

2. **注册命令**
   ```typescript
   // src/index.ts
   program
     .command('new-command')
     .description('描述新命令')
     .action(newCommand);
   ```

3. **添加类型定义**
   ```typescript
   interface NewCommandOptions {
     // 选项类型
   }
   ```

## 🐛 调试指南

### 常见问题

1. **模块导入错误**
   - 确保使用 `.js` 扩展名导入 TypeScript 文件
   - 检查 `tsconfig.json` 配置

2. **路径解析错误**
   - 使用 `path.resolve()` 而不是字符串拼接
   - 注意跨平台路径兼容性

3. **异步操作问题**
   - 确保 async/await 正确使用
   - 处理 Promise 拒绝

### 调试工具

```bash
# Node.js 调试
node --inspect-brk dist/index.js init --framework nodejs

# 内存使用分析
node --heap-prof dist/index.js init

# 性能分析
node --prof dist/index.js init
```

## 📈 性能优化

### 启动时间优化
- 延迟加载模块
- 缓存计算结果
- 减少文件系统操作

### 内存使用优化
- 及时释放大对象
- 使用流处理大文件
- 避免内存泄漏

### I/O 优化
- 批量文件操作
- 使用 Worker Threads
- 异步并行处理

---

**文档最后更新**: 2025-09-08
**需要帮助?** 查看 [故障排除](Troubleshooting) 或创建 [Issue](https://github.com/MuziGeek/claude-tdd-cli/issues)