---
description: 进入TDD GREEN阶段，最小实现使测试通过
allowed-tools: Bash, Read, Write, Edit
---

## 🟢 GREEN阶段：最小实现

切换到TDD GREEN阶段，编写让测试通过的最小代码实现。

### 1. 切换到GREEN阶段

首先更新TDD状态到GREEN阶段：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh update GREEN "$FEATURE_ID" "实现最小代码"
```

### 2. 验证前置条件

确认RED阶段已完成且测试失败：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh status
```

### 3. GREEN阶段规则

在GREEN阶段，你只能：
- ✅ 修改源代码文件 (`src/**/*`, `lib/**/*`, `main/**/*`)
- ✅ 创建必要的类和方法
- ✅ 实现最小可行解决方案

被限制的操作：
- ❌ 修改测试逻辑（除非修复测试bug）
- ❌ 过度设计和预测性编程
- ❌ 添加未经测试覆盖的功能

### 4. 最小实现原则

#### TDD第二法则
只允许写出刚好能够通过当前失败测试的产品代码

#### 实现策略
1. **最简解决方案**: 选择最直接的实现方式
2. **硬编码优先**: 可以先返回硬编码值，后续重构优化
3. **一次只解决一个测试**: 专注让当前失败测试通过
4. **避免预测**: 不实现未来可能需要的功能

#### 示例实现思路
```javascript
// 阶段1：让测试通过的最简实现
function calculateDiscount(price) {
  return 10; // 硬编码，让测试通过
}

// 阶段2：稍微泛化（仍然最小）
function calculateDiscount(price) {
  if (price > 100) return 10;
  return 0;
}

// 重构阶段：优化设计（保持测试绿色）
```

### 5. 实现检查清单

#### 编写代码时
- [ ] 代码只解决当前失败的测试
- [ ] 实现是最简可行方案
- [ ] 没有添加额外复杂性
- [ ] 没有预测未来需求

#### 验证测试通过
运行测试确保所有测试通过：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/hooks/test-runner.sh
```

### 6. 常见实现模式

根据项目类型，使用对应的实现模式：

#### Java项目
```java
@Service
public class UserService {
    public User createUser(String name) {
        // 最小实现
        return new User(name);
    }
}
```

#### JavaScript/TypeScript项目
```javascript
export class UserService {
  createUser(name) {
    // 最小实现
    return { id: 1, name };
  }
}
```

#### Python项目
```python
class UserService:
    def create_user(self, name):
        # 最小实现
        return {"id": 1, "name": name}
```

### 7. GREEN阶段完成标志

- [ ] 所有RED阶段测试都通过
- [ ] 实现是最小且简洁的
- [ ] 没有添加未经测试的功能
- [ ] 代码可读性良好

### 8. 进入下一阶段

GREEN阶段完成后，记录状态并考虑下一步：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh record "GREEN phase completed"
```

#### 选择下一步
- 使用 `/tdd:refactor` 改善代码质量
- 使用 `/tdd:red` 添加更多功能测试
- 完成功能后提交代码

### 9. 常见陷阱避免

#### ❌ 不要做的事
- 过度设计架构
- 添加"以后可能用到"的功能
- 修改测试以适应实现
- 实现多个功能点

#### ✅ 应该做的事
- 专注让测试通过
- 选择最简单的解决方案
- 保持代码可读性
- 为重构阶段留空间

---
**当前阶段**: 🟢 GREEN | **专注**: 最小实现 | **下一步**: `/tdd:refactor` 或 `/tdd:red`