# Node.js TDD Example Project

这是一个使用 Claude TDD CLI 的 Node.js/TypeScript 示例项目。

## 快速开始

1. **安装 Claude TDD CLI**
   ```bash
   npm install -g claude-tdd-cli
   ```

2. **安装项目依赖**
   ```bash
   npm install
   ```

3. **初始化 TDD 工作流**
   ```bash
   claude-tdd init --framework nodejs --quick
   ```

4. **检查环境状态**
   ```bash
   claude-tdd doctor
   ```

## 项目结构

```
nodejs-example/
├── src/
│   ├── index.ts              # 主入口文件
│   ├── calculator.ts         # 计算器示例类
│   └── utils/
│       └── validation.ts     # 工具函数
├── tests/
│   ├── calculator.test.ts    # 计算器测试
│   └── utils/
│       └── validation.test.ts # 工具测试
├── .claude/                  # Claude TDD 配置
│   ├── agents/              # AI 代理配置
│   ├── commands/            # 命令模板
│   ├── hooks/               # Git hooks
│   └── rules/               # TDD 规则
├── package.json
├── tsconfig.json
└── jest.config.js
```

## TDD 工作流

### 1. RED 阶段 - 编写失败的测试
```bash
# 使用 Claude 开始 RED 阶段
/tdd:red
```

### 2. GREEN 阶段 - 编写最小实现
```bash
# 使用 Claude 进入 GREEN 阶段
/tdd:green
```

### 3. REFACTOR 阶段 - 重构代码
```bash
# 使用 Claude 进行重构
/tdd:refactor
```

### 4. 检查状态
```bash
# 查看当前 TDD 状态
claude-tdd status
```

## 示例：创建一个计算器

### 步骤 1: 编写测试 (RED)
```typescript
// tests/calculator.test.ts
import { Calculator } from '../src/calculator';

describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  it('should add two numbers correctly', () => {
    expect(calculator.add(2, 3)).toBe(5);
  });

  it('should subtract two numbers correctly', () => {
    expect(calculator.subtract(5, 3)).toBe(2);
  });
});
```

### 步骤 2: 运行测试并确认失败
```bash
npm test
```

### 步骤 3: 编写最小实现 (GREEN)
```typescript
// src/calculator.ts
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

### 步骤 4: 运行测试确认通过
```bash
npm test
```

### 步骤 5: 重构 (REFACTOR)
优化代码结构，添加错误处理等。

## 可用脚本

- `npm test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 生成覆盖率报告
- `npm run build` - 构建 TypeScript
- `npm run dev` - 开发模式
- `npm run lint` - 代码检查
- `npm run format` - 代码格式化

## Claude 命令

- `/tdd:init` - 初始化新的 TDD 循环
- `/tdd:red` - 进入 RED 阶段
- `/tdd:green` - 进入 GREEN 阶段
- `/tdd:refactor` - 进入 REFACTOR 阶段
- `/tdd:status` - 查看当前状态
- `/commit` - 智能提交代码

## 最佳实践

1. **遵循 TDD 循环**: 始终按照 RED-GREEN-REFACTOR 顺序
2. **编写小的测试**: 每次只测试一个功能点
3. **快速迭代**: 保持测试-代码-重构的快节奏
4. **使用描述性测试名称**: 测试名称应清楚表达意图
5. **保持测试简单**: 避免复杂的测试逻辑

## 故障排除

### 常见问题

1. **测试不运行**
   ```bash
   # 检查 Jest 配置
   npx jest --init
   ```

2. **TypeScript 编译错误**
   ```bash
   # 检查 tsconfig.json
   npx tsc --noEmit
   ```

3. **Claude 命令不工作**
   ```bash
   # 诊断 Claude 环境
   claude-tdd doctor
   ```

## 学习资源

- [TDD 基础](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Jest 文档](https://jestjs.io/docs/getting-started)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)
- [Claude Code 文档](https://claude.ai/code)