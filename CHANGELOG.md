# 变更日志

此项目的所有显著更改都将在此文件中记录。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [未发布]

### 💫 敬请期待下个版本的精彩更新...

## [1.0.0] - 2025-09-11 🎉 Claude PDD CLI 首个正式版本

### 🎯 全新的项目驱动开发平台
- **项目理念**: Project-Driven Development (PDD) - 项目需求优先，灵活集成多种开发方法论
- **核心命令**: `cpdd` - 简洁易记的CLI工具
- **多方法论支持**: 灵活支持PDD、PMD、TDD等多种开发方式

### ✨ 三种灵活的开发模式
- **PDD模式** - Project-Driven Development: 完整项目驱动开发，灵活支持多种方法论
- **PM模式** - Project Management Driven: 专注项目管理和团队协作  
- **TDD模式** - Test-Driven Development: 传统测试驱动开发

### 📋 安装模式重新定义

#### PDD模式 (推荐) 
```bash
cpdd init --mode=pdd
```
- **方法论**: Project-Driven Development - 项目需求优先，灵活集成多种开发方法
- **包含**: CCPM完整系统(39个PM命令) + TDD工具(5个命令) + 支持PDD/BDD/TDD混合开发
- **适用**: 完整项目开发流程，从需求到交付

#### PM模式
```bash
cpdd init --mode=pm
```
- **方法论**: Project Management Driven - 专注项目管理和团队协作
- **包含**: CCPM项目管理功能(39个PM命令) + GitHub集成 + 团队协作工作流
- **适用**: 项目经理、团队协作、需求管理

#### TDD模式
```bash
cpdd init --mode=tdd
```
- **方法论**: Test-Driven Development - 传统TDD红绿重构循环
- **包含**: TDD开发命令(5个) + 智能测试生成 + Red-Green-Refactor循环
- **适用**: 技术驱动开发，单元测试优先

### 🔄 完全重写的用户体验
- **新项目定位**: "灵活的项目驱动开发平台" 而非单纯的TDD工具
- **核心理念**: "先有规划，再写代码" (Plan First, Code Later)
- **方法论无关**: 支持PDD、PMD、TDD等多种开发方法论
- **目标驱动**: "方法论灵活，目标驱动" (Methodology Agnostic, Goal Driven)

### 💔 破坏性变更
- **命令完全改变**: 所有`ctdd`命令改为`cpdd`，无别名支持
- **包名更改**: NPM包从`claude-tdd-cli`改为`claude-pdd-cli`
- **模式名称变更**: `--mode=full` → `--mode=pdd`, `--mode=ccpm` → `--mode=pm`
- **项目仓库**: GitHub仓库从`claude-tdd-cli`改为`claude-pdd-cli`
- **默认模式**: 从`full`改为`pdd`

### 📚 文档全面更新
- **README重写**: 突出PDD理念和三种模式的方法论说明
- **USAGE文档**: 更新所有命令和模式说明
- **API文档**: 更新类型定义和接口
- **贡献指南**: 更新开发流程和规范

### 🛠️ 技术改进
- **类型系统更新**: 所有TypeScript类型定义更新为新模式名称
- **配置逻辑重构**: 模式判断和处理逻辑完全重写
- **交互式安装**: 更新选项文本和用户引导
- **错误处理**: 更新所有错误消息和帮助信息

### 🧹 项目优化 (延续自1.x)
- **移除examples目录** - 简化项目结构，集中文档内容到README
- **完善分层架构** - 完全分离templates（CCPM备份）和tdd-enhancements（TDD增强层）
- **清理重复文件** - 移除templates中的TDD相关文件，避免与tdd-enhancements重复
- **文档集中化** - 将使用示例直接集成到README，提高文档维护效率

### 💡 架构完善 (延续自1.x)
- **纯CCPM备份** - templates目录只保留39个PM命令和CCPM核心功能
- **独立TDD增强** - tdd-enhancements作为完全独立的功能层
- **智能动态集成** - 在线/离线模式都通过叠加tdd-enhancements实现完整功能

### 🚀 快速开始
```bash
# 安装 Claude PDD CLI
npm install -g claude-pdd-cli

# 初始化项目（推荐PDD模式）
cpdd init --mode=pdd

# 其他模式选择
cpdd init --mode=pm   # 项目管理模式
cpdd init --mode=tdd  # 传统TDD模式
```

## [历史版本记录]

*以下为开发历史记录，仅供参考*

## [0.3.0] - 2025-09-10 🎉 重大版本更新

### 🚀 重大架构重构
- **动态 CCPM 集成** - 革命性的在线/离线安装模式
- **智能安装系统** - 自动检测网络并从 CCPM GitHub 仓库获取最新内容
- **TDD 增强层** - 在 CCPM 基础上叠加 5 个专业 TDD 命令
- **跨平台执行** - 支持 Windows PowerShell 和 Unix Bash 安装

### ✨ 新增功能
- **CCPMInstaller 类** - 动态 CCPM 安装和管理
- **TDD 增强模板系统** - 独立的 TDD 功能层
- **智能降级策略** - 在线安装失败自动切换到离线模式
- **网络状态检测** - 自动检测并选择最佳安装方式
- **版本跟踪机制** - 记录 CCPM 版本和安装方式

### 🎯 核心 TDD 命令
- `/tdd:cycle` - 完整 Red-Green-Refactor 循环
- `/tdd:red` - 红灯阶段（编写失败测试）
- `/tdd:green` - 绿灯阶段（最小实现）
- `/tdd:refactor` - 重构阶段（质量提升）
- `/tdd:spec-to-test` - 规格转测试用例

### 🤖 AI Agents 系统
- **TDD Agent** - TDD 工作流协调器
- **Test Generator** - 智能测试用例生成器
- **Spec-driven TDD 工作流** - 完整的规格驱动开发流程
- **Issue-to-Test 工作流** - GitHub Issue 到测试的转换

### 🔧 CLI 增强
- `--online` / `--offline` 选项控制安装模式
- 智能安装状态显示和进度追踪
- 详细的安装摘要和下一步指导
- 跨平台命令执行和错误处理

### 💔 破坏性变更
- 移除了原有的静态模板系统
- 删除了旧的测试框架配置
- 重构了整个安装和配置流程
- 更改了内部 API 结构

### 🏗️ 架构优化
- **分层设计** - CCPM 基础 + TDD 增强
- **解耦架构** - 各组件独立演进
- **智能合并** - 自动处理文件冲突和更新
- **维护简化** - 自动同步上游 CCPM 更新

### 🐛 修复
- 修复 ES 模块中 `__dirname` 未定义问题
- 修复跨平台路径兼容性问题
- 修复安装验证和状态检测逻辑
- 修复模板文件复制和权限问题

### 📦 依赖更新
- 新增 `axios` - HTTP 请求和 GitHub API
- 移除 `jest`、`@types/jest`、`ts-jest` - 简化测试依赖
- 保持核心依赖最新版本

### 🎨 用户体验改进
- **安装体验重新设计** - 更直观的进度显示
- **智能提示系统** - 根据安装方式提供相应建议
- **错误处理优化** - 更友好的错误信息和恢复建议
- **文档和示例更新** - 反映新的工作流程

## [0.2.4] - 2025-09-08

### 新增
- 完整的 ESM 模块支持，彻底解决依赖兼容性问题
- 跨平台 CI/CD 工作流支持 (Ubuntu, Windows, macOS)
- 智能缓存优化提升构建性能
- 自动化发布流程和 Release Notes 生成

### 修复
- 修复 Windows 环境下的路径兼容性问题
- 解决 CI 环境中 Jest 测试失败问题
- 修复模板复制缺失和文档准确性问题
- 优化测试覆盖率配置和阈值

### 改进
- 升级所有依赖包到最新版本 (chalk, ora, boxen)
- 重构 Jest 配置完全支持 ESM
- 优化构建系统和模板处理
- 改进错误处理和用户体验

### 技术亮点
- 🚀 现代 JavaScript：完全 ESM 兼容
- ⚡ 性能提升：原生 ESM 加载，Tree Shaking 优化
- 🌍 跨平台：Node.js 18.x, 20.x, 22.x 全面支持
- 🧪 测试覆盖：100% 测试通过率

## [0.2.3] - 2025-09-08

### 新增
- 全面升级 GitHub CI/CD 工作流
- 跨平台支持和智能缓存优化
- 自动化测试矩阵 (Ubuntu, Windows, macOS)
- GitHub Actions 工作流状态监控

### 改进
- 升级 README 文档，新增 CI/CD 状态徽章
- 完善开发指南和贡献说明
- 优化项目结构和文档组织
- 改进错误报告和诊断信息

### 修复
- 修复 Windows 环境下的模板复制命令
- 解决跨平台路径处理问题
- 修复 CI/CD 测试失败的配置问题

## [0.2.2] - 2025-09-07

### 新增
- 完善 USAGE.md 文档
- Claude Code 集成指南
- 完整故障排除指南
- 项目使用最佳实践

### 改进
- 优化命令行界面体验
- 改进错误消息和帮助信息
- 完善文档结构和内容

### 修复
- 修复模板复制缺失问题
- 解决文档准确性问题
- 修复命令行参数处理

## [0.2.1] - 2025-09-07

### 新增
- 框架切换功能
- 完整的 TDD 脚本模板
- 多种开发框架支持 (Node.js, Python, Java, Go, Rust)
- 自动化环境检测和配置

### 改进
- 完善文档和清理项目结构
- 优化模板系统架构
- 改进命令行交互体验
- 添加更多示例和最佳实践

### 修复
- 修复模板加载问题
- 解决框架检测错误
- 修复配置文件生成问题

## [0.2.0] - 2025-09-06

### 新增
- 🎉 初始化 Claude TDD CLI 工具
- 完整的 TDD 工作流管理系统
- 多框架支持 (Node.js, Python, Java, Go, Rust)
- 自动化项目初始化
- Claude Code 集成支持
- 环境诊断和健康检查功能

### 功能特性
- **项目初始化**: `claude-tdd init` 快速创建 TDD 项目结构
- **环境诊断**: `claude-tdd doctor` 检查开发环境配置
- **状态管理**: `claude-tdd status` 查看项目和工作流状态
- **配置管理**: `claude-tdd config` 管理工具配置
- **多框架支持**: 支持主流开发框架的 TDD 最佳实践

### 技术架构
- TypeScript 构建的现代化 CLI 工具
- 模块化设计，易于扩展
- 跨平台支持 (Windows, macOS, Linux)
- 完整的测试覆盖和 CI/CD 流程

### 开发体验
- 直观的命令行界面
- 详细的错误提示和帮助信息
- 自动化配置和最佳实践应用
- 与 Claude Code 无缝集成

---

## 版本规范说明

### 版本号格式
遵循语义化版本规范 `MAJOR.MINOR.PATCH`：

- **MAJOR** (主版本号): 不兼容的 API 变更
- **MINOR** (次版本号): 向后兼容的功能新增
- **PATCH** (修订号): 向后兼容的问题修复

### 变更类型
- **新增** - 新功能和特性
- **改进** - 对现有功能的增强
- **修复** - 问题修复和错误解决
- **移除** - 移除的功能 (breaking changes)
- **安全** - 安全相关的修复

### 发布节奏
- **主版本**: 重大架构变更或不兼容更新
- **次版本**: 定期功能更新 (通常每月)
- **修订版本**: 紧急修复和小改进 (按需发布)

---

**安装最新版本**: `npm install -g claude-pdd-cli@latest`

**项目主页**: https://github.com/MuziGeek/claude-pdd-cli