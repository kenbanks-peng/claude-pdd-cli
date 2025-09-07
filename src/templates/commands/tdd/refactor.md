---
description: 进入TDD REFACTOR阶段，重构和优化代码
allowed-tools: Bash, Read, Write, Edit
---

## 🔧 REFACTOR阶段：改善代码质量

切换到TDD REFACTOR阶段，在保持测试绿色的前提下改善代码质量。

### 1. 切换到REFACTOR阶段

首先更新TDD状态到REFACTOR阶段：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh update REFACTOR "$FEATURE_ID" "重构代码质量"
```

### 2. 验证前置条件

确认GREEN阶段已完成且所有测试通过：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh status
```

### 3. REFACTOR阶段规则

在REFACTOR阶段，你可以：
- ✅ 重构源代码文件 (`src/**/*`, `lib/**/*`)
- ✅ 提取方法和类
- ✅ 优化算法和性能
- ✅ 改善代码可读性
- ✅ 更新注释和文档

被限制的操作：
- ❌ 修改测试行为或逻辑
- ❌ 添加新功能
- ❌ 破坏现有测试

### 4. 重构原则

#### TDD第三法则的扩展
在保持测试绿色的前提下改善代码设计

#### 重构黄金规则
1. **小步重构**: 每次改动要小且安全
2. **频繁验证**: 每次修改后立即运行测试
3. **保持行为**: 不改变外部可观察行为
4. **改善设计**: 提高代码质量和可维护性

### 5. 重构检查清单

#### 代码结构优化
- [ ] **消除重复代码**: 提取公共逻辑
- [ ] **方法过长**: 分解为小的、职责单一的方法
- [ ] **类职责过多**: 拆分为多个职责明确的类
- [ ] **参数过多**: 使用参数对象或建造者模式

#### 命名和可读性
- [ ] **命名清晰**: 类名、方法名、变量名表达意图
- [ ] **消除魔法数字**: 用常量替代硬编码值
- [ ] **简化条件**: 复杂条件提取为方法
- [ ] **消除注释**: 让代码自解释

#### 设计优化  
- [ ] **降低耦合**: 减少类间依赖
- [ ] **提高内聚**: 相关功能聚合
- [ ] **遵循SOLID原则**: 单一职责、开闭原则等
- [ ] **使用设计模式**: 适当应用设计模式

### 6. 渐进式重构流程

```bash
# 1. 进行小改动
# 2. 运行测试验证
bash $CLAUDE_PROJECT_DIR/.claude/hooks/test-runner.sh

# 3. 测试通过后继续下一个改动
# 4. 重复直到满意
```

### 7. 常见重构技术

#### 提取方法
```javascript
// 重构前
function calculatePrice(items) {
  let total = 0;
  for (let item of items) {
    total += item.price * item.quantity;
    if (item.discount) {
      total -= item.price * item.quantity * item.discount;
    }
  }
  let tax = total * 0.1;
  return total + tax;
}

// 重构后
function calculatePrice(items) {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  return subtotal + tax;
}

function calculateSubtotal(items) {
  return items.reduce((total, item) => 
    total + calculateItemPrice(item), 0);
}

function calculateItemPrice(item) {
  const basePrice = item.price * item.quantity;
  return item.discount ? 
    basePrice * (1 - item.discount) : basePrice;
}

function calculateTax(subtotal) {
  return subtotal * 0.1;
}
```

#### 提取类
```python
# 重构前：用户类职责过多
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
    
    def send_email(self, message):
        # 发送邮件逻辑
        pass
    
    def validate_email(self):
        # 验证邮件逻辑  
        pass

# 重构后：职责分离
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.email_service = EmailService()
    
    def send_email(self, message):
        self.email_service.send(self.email, message)

class EmailService:
    def send(self, email, message):
        if self.validate_email(email):
            # 发送邮件逻辑
            pass
    
    def validate_email(self, email):
        # 验证邮件逻辑
        pass
```

### 8. 重构完成验证

#### 测试验证
确保所有测试仍然通过：
```bash
bash $CLAUDE_PROJECT_DIR/.claude/hooks/test-runner.sh
```

#### 质量检查
- [ ] 代码可读性提升
- [ ] 复杂度降低  
- [ ] 重复代码消除
- [ ] 设计更加清晰

### 9. REFACTOR阶段完成

记录重构完成状态：

```bash
bash $CLAUDE_PROJECT_DIR/.claude/scripts/tdd/state-manager.sh record "REFACTOR phase completed"
```

#### 选择下一步
- 使用 `/tdd:red` 开始新的功能循环
- 完成功能开发，准备提交
- 继续其他重构改进

### 10. 重构的时机

#### 什么时候重构
- GREEN阶段完成后
- 发现代码异味时
- 准备添加新功能前
- 代码审查发现问题时

#### 什么时候不重构
- 测试未通过时
- 接近发布截止日期
- 代码将要被删除
- 没有测试保护时

---
**当前阶段**: 🔧 REFACTOR | **专注**: 改善代码质量 | **下一步**: `/tdd:red` 开始新循环