---
description: 基于需求分析和技术设计文档执行任务分解
allowed-tools: Task
---

## 🧩 任务分解器

基于结构化需求分析和技术设计文档，将功能分解为细粒度的TDD开发任务，支持并行开发和依赖管理。

### 执行方式

调用专门的task-decomposer Agent执行任务分解：

```bash
# 基础任务分解
/pm:task-decompose

# 指定功能ID进行分解  
/pm:task-decompose --feature-id "user-authentication"

# 分解并直接同步到GitHub
/pm:task-decompose --feature-id "user-authentication" --sync-github
```

### 输入要求

#### 必需文档
1. **需求分析文档**: `docs/analysis/{FEATURE_ID}.requirements.md`
   - 必须由prd-analyzer-designer Agent生成
   - 包含结构化的用户故事和验收标准
   
2. **技术设计文档**: `docs/design/{FEATURE_ID}.design.md`  
   - 必须由prd-analyzer-designer Agent生成
   - 包含完整的技术架构和实现方案

#### 可选输入
- **PRD文档**: `docs/prd/{FEATURE_ID}.prd.md` (作为参考)
- **现有代码结构**: 用于理解项目架构模式

### 输出交付物

#### 主要输出文件
**任务清单**: `docs/tasks/{FEATURE_ID}.tasks.json`

包含完整的任务分解结果：

```json
{
  "metadata": {
    "featureId": "user-authentication",
    "version": "v1.0", 
    "createdAt": "2024-01-15T10:30:00Z",
    "estimatedTotalHours": 48,
    "parallelizationDegree": 4,
    "criticalPath": ["T001", "T003", "T006"]
  },
  "epics": [
    {
      "id": "E001",
      "title": "用户认证核心功能",
      "description": "实现完整的用户认证系统",
      "userStoryIds": ["US001", "US002", "US003"],
      "priority": "P0",
      "estimatedHours": 32
    }
  ],
  "tasks": [
    {
      "id": "T001",
      "title": "用户注册API实现",
      "description": "实现用户注册的核心API，包括邮箱验证和基本信息保存",
      "type": "feature",
      "epic": "E001", 
      "userStoryId": "US001",
      "acceptanceCriteria": ["AC001", "AC002"],
      "priority": "P0",
      "estimatedHours": 6,
      "complexity": "medium",
      "riskLevel": "low",
      "dependencies": {
        "blocks": ["T002", "T003"],
        "dependsOn": [],
        "softDependencies": []
      },
      "tdd": {
        "testScope": "unit",
        "testFiles": ["src/test/java/com/example/UserRegistrationControllerTest.java"],
        "implementationFiles": ["src/main/java/com/example/UserRegistrationController.java"],
        "testStrategy": "先编写用户注册API的失败测试，验证邮箱格式、重复注册等场景"
      },
      "workEnvironment": {
        "worktree": "task-T001",
        "branch": "feature/user-registration-api",
        "isolationLevel": "full"
      },
      "qualityGates": {
        "unitTestCoverage": ">=85%",
        "integrationTests": "required",
        "codeReview": "required",
        "performanceTest": "optional"
      }
    }
  ],
  "dependencies": {
    "graph": {
      "T001": ["T002", "T003"],
      "T002": ["T004"],
      "T003": ["T005"]
    },
    "criticalPath": ["T001", "T002", "T004"],
    "parallelGroups": [
      {
        "groupId": "G001",
        "tasks": ["T001", "T006", "T007"], 
        "maxParallel": 3
      }
    ]
  }
}
```

### 分解策略

#### 1. 垂直切分原则
- **用户故事驱动**: 每个任务对应完整的用户价值
- **端到端切片**: 从API到数据库的完整功能片段
- **独立部署**: 任务完成后可独立验证

#### 2. 粒度控制
```yaml
理想任务粒度:
  开发时间: 2-8小时 (单人完成)
  测试用例: 3-15个
  代码行数: 50-200行 (业务代码)
  职责边界: 单一职责，最多涉及2-3个类

自动检查规则:
  过大信号: >8小时估时、涉及多个子系统
  过小信号: <1小时估时、无实际业务价值  
  合理标准: 有明确TDD测试策略、独立可验证
```

#### 3. 依赖关系分析
- **强依赖**: 接口定义、数据模型、基础组件
- **软依赖**: 性能优化、UI样式、监控日志  
- **并行识别**: 不同业务模块、不同技术层次、独立功能

### 分解执行流程

#### 阶段1: 需求映射
1. **提取用户故事**: 从requirements.md中提取所有用户故事
2. **分析验收标准**: 将验收标准映射为测试场景
3. **识别技术组件**: 从design.md中提取技术组件和接口

#### 阶段2: 任务生成  
1. **按技术栈分层**: Model→Repository→Service→Controller→API
2. **按业务功能切片**: 完整的功能垂直切分
3. **估算工作量**: 基于复杂度和团队经验估算

#### 阶段3: 依赖分析
1. **构建依赖图**: 分析任务间的技术依赖关系
2. **拓扑排序**: 确定任务执行顺序
3. **并行度分析**: 识别可并行执行的任务组

#### 阶段4: 质量验证
1. **完整性检查**: 确保所有用户故事都有对应任务
2. **可执行性验证**: 验证每个任务都有明确的TDD策略
3. **依赖关系验证**: 检查循环依赖和阻塞关系

### 配置选项

通过`.claude/settings.json`控制分解行为：

```json
{
  "taskDecomposer": {
    "granularity": "fine",           // 任务粒度：coarse|medium|fine
    "maxTaskHours": 8,               // 单任务最大工时
    "minTaskHours": 1,               // 单任务最小工时  
    "parallelizationTarget": 4,      // 目标并行度
    "riskThreshold": "medium",       // 风险阈值
    "testStrategyRequired": true,    // 是否强制要求测试策略
    "workEnvironment": {
      "isolationLevel": "full",      // 工作环境隔离级别
      "autoCreateWorktrees": true    // 是否自动创建worktrees
    }
  }
}
```

### 质量保证

#### 分解质量检查
```yaml
完整性验证:
  - [ ] 每个用户故事都有对应任务
  - [ ] 每个验收标准都可追溯  
  - [ ] 所有技术组件都被覆盖
  - [ ] Epic和任务层次清晰

可执行性验证:
  - [ ] 每个任务都有TDD测试策略
  - [ ] 任务描述清晰具体
  - [ ] 验收标准可测试验证
  - [ ] 估时合理可达成

依赖关系验证:
  - [ ] 无循环依赖
  - [ ] 关键路径已识别
  - [ ] 并行任务无冲突
  - [ ] 阻塞关系合理
```

#### 自动化验证
```bash
# 运行任务分解质量检查
bash $CLAUDE_PROJECT_DIR/.claude/scripts/pm/validate-task-decomposition.sh \
  --tasks-file "docs/tasks/user-auth.tasks.json" \
  --requirements-file "docs/analysis/user-auth.requirements.md" \
  --design-file "docs/design/user-auth.design.md"
```

### 后续流程集成

#### 分解完成后的标准流程
1. **质量审查**: 技术团队审查任务分解结果
2. **工作量评估**: 确认预估工时的合理性  
3. **任务分配**: 根据团队成员专长分配任务
4. **GitHub同步**: 使用`/pm:issue-sync`同步到GitHub Issues
5. **开始开发**: 使用`/pm:next`选择第一个任务开始TDD

#### 与其他命令的协作
```bash
# 完整的从PRD到开发的工作流
/pm:prd-new --feature-id "user-auth"              # 创建PRD
# 使用prd-analyzer-designer Agent分析PRD
/pm:task-decompose --feature-id "user-auth"       # 分解任务  
/pm:issue-sync batch-create --tasks-file "docs/tasks/user-auth.tasks.json"  # 同步GitHub
/pm:next                                           # 选择第一个任务
/tdd:red                                           # 开始TDD RED阶段
```

### 示例场景

#### 用户认证功能分解示例
**输入**: 
- `docs/analysis/user-auth.requirements.md` (包含3个用户故事)
- `docs/design/user-auth.design.md` (包含API设计、数据模型、安全策略)

**输出**:
- 12个细粒度TDD任务
- 3个Epic分组  
- 4个并行开发组
- 预计总工时: 48小时
- 关键路径: 6个任务，24小时

**关键任务举例**:
- T001: 用户注册API (Controller层)
- T002: 用户注册Service (业务逻辑层)  
- T003: 用户数据Repository (数据访问层)
- T004: 密码加密工具类 (工具层)
- T005: 用户注册集成测试
- T006: 邮箱验证API (并行开发)

### 最佳实践

#### 分解前准备
1. **确保输入文档质量**: 需求分析和技术设计必须完整准确
2. **了解团队能力**: 考虑团队成员的技术栈熟悉程度
3. **评估项目约束**: 时间、资源、技术债务等因素

#### 分解过程中
1. **保持用户价值导向**: 每个任务都应该有明确的用户价值
2. **考虑测试优先**: 确保每个任务都有清晰的测试策略
3. **平衡粒度**: 避免任务过大或过小，保持合理粒度

#### 分解后验证
1. **团队评审**: 让开发团队参与评审分解结果  
2. **依赖关系验证**: 仔细检查任务间的依赖关系
3. **并行度评估**: 确认并行开发的可行性

---
**下一步**: 使用 `/pm:issue-sync batch-create` 将任务同步到GitHub Issues，开始团队协作开发