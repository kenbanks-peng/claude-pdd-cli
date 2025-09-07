# 命令文档模板

## 标准命令文档结构

为了保持文档一致性和遵循DRY原则，所有命令文档应遵循以下模板结构：

### 基础模板

```markdown
---
description: 命令简短描述
allowed-tools: Tool1, Tool2, Tool3
---

## 🎯 命令标题

简短的命令功能说明。

### 执行方式

具体的执行命令或步骤：

```bash
command_example
```

### 功能详解

详细说明命令的功能和工作原理。

### 配置选项

如果有可配置项，列出主要配置选项。

### 最佳实践

使用该命令的最佳实践建议。

---
**下一步**: 建议的后续操作
```

## 共享文档片段

### TDD阶段说明片段
```markdown
#### TDD阶段说明
- 🔴 **RED**: 编写失败测试阶段
- 🟢 **GREEN**: 实现代码阶段  
- 🔧 **REFACTOR**: 重构优化阶段
- 🔵 **READY**: 准备开始阶段
```

### 状态检查片段
```markdown
#### 查看当前状态
```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh status
```
```

### 项目类型支持片段
```markdown
#### 支持的项目类型
- **Java**: Maven (pom.xml) / Gradle (build.gradle)
- **JavaScript/TypeScript**: Node.js (package.json)
- **Python**: setup.py / pyproject.toml / requirements.txt
- **Go**: go.mod
- **Rust**: Cargo.toml
- **C/C++**: CMakeLists.txt / Makefile
```

### 故障排除片段
```markdown
### 故障排除

#### 常见问题
1. **TDD状态文件不存在**
   ```bash
   /tdd:init  # 重新初始化
   ```

2. **状态显示异常**
   ```bash
   bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh reset
   ```
```

## 文档引用规范

### 内部文档引用
使用相对路径引用其他文档：
```markdown
- 详细配置请参考：[TDD规则](../rules/tdd-phases.md)
- 相关命令：[状态查看](./status.md)
```

### 外部文档引用
```markdown
- [Claude Code官方文档](https://docs.anthropic.com/claude-code)
- [TDD最佳实践](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
```

## 代码示例规范

### Bash命令示例
```bash
# 注释说明命令用途
command_name --option value
```

### 多语言代码示例
使用语言特定的代码块：

#### Java示例
```java
@Test
void shouldDoSomething() {
    // 测试实现
}
```

#### JavaScript示例
```javascript
describe('功能描述', () => {
  it('应该_期望结果_当_条件', () => {
    // 测试实现
  });
});
```

## 文档维护原则

### DRY原则应用
1. **共享内容**: 提取为可重用片段
2. **模板化**: 使用统一的文档模板
3. **引用机制**: 避免内容重复，使用引用
4. **版本控制**: 统一更新共享内容

### 一致性检查
1. **格式统一**: 标题、列表、代码块格式一致
2. **术语统一**: 使用统一的技术术语
3. **风格一致**: 语言风格和表达方式一致
4. **结构对齐**: 相似文档使用相同结构

### 更新策略
1. **定期审查**: 定期检查文档准确性
2. **及时更新**: 功能变更时同步更新文档
3. **版本记录**: 重要变更记录版本历史
4. **反馈循环**: 根据用户反馈改进文档