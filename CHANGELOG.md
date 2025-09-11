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

### 🔄 完全创新的用户体验
- **核心理念**: "先有规划，再写代码" (Plan First, Code Later)
- **方法论无关**: 支持PDD、PMD、TDD等多种开发方法论
- **目标驱动**: "方法论灵活，目标驱动" (Methodology Agnostic, Goal Driven)

### 📚 文档全面齐备
- **README完整**: 突出PDD理念和三种模式的方法论说明
- **USAGE文档**: 详细的命令和模式说明
- **API文档**: 完整的类型定义和接口
- **贡献指南**: 开发流程和规范

### 🛠️ 技术特性
- **类型系统**: 完整TypeScript类型定义
- **配置逻辑**: 智能模式判断和处理逻辑
- **交互式安装**: 友好的选项文本和用户引导
- **错误处理**: 完善的错误消息和帮助信息

### 🧹 架构设计
- **分层架构**: 完全分离templates（CCPM备份）和tdd-enhancements（TDD增强层）
- **动态集成**: 智能在线/离线模式都通过叠加tdd-enhancements实现完整功能
- **模块化设计**: 各组件独立演进

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