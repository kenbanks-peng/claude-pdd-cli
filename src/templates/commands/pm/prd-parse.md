---
description: 解析PRD文档生成技术任务和测试规范
allowed-tools: Read, Write, Edit, Bash
---

## 🔍 PRD技术解析

将产品需求文档(PRD)解析为结构化的技术任务和测试规范，为TDD开发提供明确指导。

### 执行流程

1. **读取PRD文档**：从`docs/prd/`目录读取指定的PRD文件
2. **需求分析**：提取功能需求、验收标准、技术约束
3. **任务分解**：将需求分解为可TDD的技术任务
4. **测试规范**：生成对应的测试用例规范

### 输入参数

提供PRD文件名（不带扩展名）：
```
PRD文件名: user-auth  # 对应 docs/prd/user-auth.prd.md
```

### 输出文件

#### 1. 技术设计文档
```
docs/design/{功能名称}.design.md
```
包含：
- 技术架构设计
- API接口定义
- 数据库模型设计
- 系统集成方案

#### 2. 测试规范文档
```
docs/test-specs/{功能名称}.test-spec.md
```
包含：
- 单元测试规范
- 集成测试规范
- 端到端测试场景
- 性能测试要求

#### 3. TDD任务清单
```
docs/design/{功能名称}.tdd-tasks.md
```
包含：
- 按优先级排序的TDD任务
- 每个任务的测试场景
- 依赖关系映射
- 完成标准定义

### 解析过程

#### 需求映射
```
PRD用户故事 → 测试用例
验收标准 → 断言条件
业务规则 → 测试场景
边界情况 → 边界测试
```

#### 任务分解策略
1. **垂直切分**：按用户功能分解
2. **水平切分**：按技术层次分解
3. **依赖优先**：识别任务依赖关系
4. **TDD友好**：确保每个任务可独立测试

### 示例：用户认证解析结果

#### 技术设计
```markdown
# 用户认证技术设计

## API设计
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- POST /api/auth/logout - 用户登出
- POST /api/auth/reset-password - 密码重置

## 数据模型
- User: 用户基本信息
- UserCredential: 用户凭据
- UserSession: 用户会话
```

#### 测试规范
```markdown
# 用户认证测试规范

## 单元测试
- UserService.register() 测试
- PasswordValidator.validate() 测试
- TokenGenerator.generate() 测试

## 集成测试
- 注册流程端到端测试
- 登录认证流程测试
- 密码重置流程测试
```

#### TDD任务清单
```markdown
# 用户认证 TDD任务

## Task 1: 用户注册基础功能
- 测试场景: 有效邮箱注册成功
- 测试场景: 重复邮箱注册失败
- 测试场景: 无效邮箱格式拒绝

## Task 2: 密码安全验证
- 测试场景: 强密码通过验证
- 测试场景: 弱密码被拒绝
- 测试场景: 密码加密存储
```

### 与GitHub Issues集成

解析完成后可以：
1. 自动创建GitHub Issues
2. 设置任务标签和里程碑
3. 建立任务依赖关系
4. 分配给团队成员

### 配置选项

可以通过`.claude/settings.json`配置解析行为：

```json
{
  "prd": {
    "outputFormat": "detailed",
    "taskGranularity": "fine",
    "testCoverage": "comprehensive",
    "githubSync": true
  }
}
```

### 质量检查

解析过程会验证：
- [ ] 所有用户故事都有对应测试
- [ ] 验收标准可测试且明确
- [ ] 任务分解合理且独立
- [ ] 技术设计与需求匹配

### 后续流程

解析完成后，开始TDD开发：
1. 选择第一个任务：`/pm:next`
2. 初始化TDD环境：`/tdd:init`
3. 开始RED阶段：`/tdd:red`

### 最佳实践

#### PRD质量要求
- 用户故事格式规范
- 验收标准具体可测
- 边界情况覆盖完整
- 非功能需求明确

#### 任务分解原则
- 每个任务2-8小时完成
- 任务间依赖最小化
- 优先级明确排序
- 测试场景完整覆盖

---
**下一步**: 使用 `/pm:next` 选择第一个任务，或 `/pm:issue-sync` 同步到GitHub