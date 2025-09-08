#!/usr/bin/env node

/**
 * JSON 处理工具 - 替代 jq 的跨平台解决方案
 * 为 Claude TDD CLI 提供 JSON 文件读取、修改和查询功能
 */

const fs = require('fs');
const path = require('path');

class JsonTool {
  constructor() {
    this.usage = `
用法: node json-tool.js <操作> [参数...]

操作:
  get <file> <path>           - 获取 JSON 字段值 (等效于 jq -r '.path')
  set <file> <path> <value>   - 设置 JSON 字段值
  update <file> <updates>     - 批量更新 JSON 对象
  has <file> <path>           - 检查字段是否存在
  raw <file> <path>           - 获取原始值不转义 (等效于 jq '.path')

示例:
  node json-tool.js get config.json currentPhase
  node json-tool.js set config.json testsPassing true
  node json-tool.js update config.json '{"testsPassing": true, "timestamp": "2023-01-01"}'
  node json-tool.js has config.json currentPhase
`;
  }

  /**
   * 安全地读取 JSON 文件
   */
  readJsonFile(filepath) {
    try {
      if (!fs.existsSync(filepath)) {
        console.error(`错误: 文件不存在 - ${filepath}`);
        process.exit(1);
      }
      
      const content = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`错误: 无法解析 JSON 文件 ${filepath} - ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * 安全地写入 JSON 文件
   */
  writeJsonFile(filepath, data) {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      fs.writeFileSync(filepath, jsonString, 'utf8');
    } catch (error) {
      console.error(`错误: 无法写入 JSON 文件 ${filepath} - ${error.message}`);
      process.exit(1);
    }
  }

  /**
   * 通过路径获取嵌套对象的值
   * 支持 dot notation: "a.b.c" 或 bracket notation: "['a']['b']['c']"
   */
  getValueByPath(obj, path) {
    if (!path) return obj;
    
    // 处理简单路径 (不包含 . 或 [])
    if (!path.includes('.') && !path.includes('[')) {
      return obj[path];
    }

    // 处理复杂路径
    const keys = path.split('.').map(key => {
      // 处理数组访问 key[0] 或 key['prop']
      if (key.includes('[')) {
        const match = key.match(/^([^[]+)\[([^\]]+)\]$/);
        if (match) {
          const [, baseKey, index] = match;
          // 移除引号如果是字符串索引
          const cleanIndex = index.replace(/['"]/g, '');
          return [baseKey, cleanIndex];
        }
      }
      return key;
    }).flat();

    let current = obj;
    for (const key of keys) {
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[key];
    }
    return current;
  }

  /**
   * 通过路径设置嵌套对象的值
   */
  setValueByPath(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    // 遍历到倒数第二个键
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || current[key] === null || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    // 设置最后一个键的值
    const lastKey = keys[keys.length - 1];
    
    // 尝试解析值的类型
    if (value === 'null') {
      current[lastKey] = null;
    } else if (value === 'true') {
      current[lastKey] = true;
    } else if (value === 'false') {
      current[lastKey] = false;
    } else if (!isNaN(value) && !isNaN(parseFloat(value))) {
      current[lastKey] = parseFloat(value);
    } else {
      // 尝试解析为 JSON (用于复杂对象)
      try {
        current[lastKey] = JSON.parse(value);
      } catch {
        // 如果解析失败，当作字符串处理
        current[lastKey] = value;
      }
    }
  }

  /**
   * 执行 get 操作
   */
  executeGet(filepath, path, raw = false) {
    const data = this.readJsonFile(filepath);
    const value = this.getValueByPath(data, path);
    
    if (value === undefined || value === null) {
      if (raw) {
        console.log('null');
      } else {
        console.log('');
      }
    } else if (typeof value === 'object') {
      console.log(JSON.stringify(value, null, 2));
    } else if (typeof value === 'string' && !raw) {
      console.log(value);
    } else {
      console.log(JSON.stringify(value));
    }
  }

  /**
   * 执行 set 操作
   */
  executeSet(filepath, path, value) {
    const data = this.readJsonFile(filepath);
    this.setValueByPath(data, path, value);
    this.writeJsonFile(filepath, data);
  }

  /**
   * 执行 update 操作 (批量更新)
   */
  executeUpdate(filepath, updates) {
    const data = this.readJsonFile(filepath);
    
    let updateObj;
    try {
      updateObj = JSON.parse(updates);
    } catch (error) {
      console.error(`错误: 无效的更新对象 JSON - ${error.message}`);
      process.exit(1);
    }

    // 递归合并对象
    const mergeObjects = (target, source) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {};
          }
          mergeObjects(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
      return target;
    };

    mergeObjects(data, updateObj);
    this.writeJsonFile(filepath, data);
  }

  /**
   * 执行 has 操作 (检查字段是否存在)
   */
  executeHas(filepath, path) {
    const data = this.readJsonFile(filepath);
    const value = this.getValueByPath(data, path);
    console.log(value !== undefined ? 'true' : 'false');
  }

  /**
   * 主执行函数
   */
  execute() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log(this.usage);
      process.exit(0);
    }

    const [operation, filepath, ...operationArgs] = args;

    switch (operation) {
      case 'get':
        if (operationArgs.length !== 1) {
          console.error('get 操作需要1个参数: <path>');
          process.exit(1);
        }
        this.executeGet(filepath, operationArgs[0], false);
        break;

      case 'raw':
        if (operationArgs.length !== 1) {
          console.error('raw 操作需要1个参数: <path>');
          process.exit(1);
        }
        this.executeGet(filepath, operationArgs[0], true);
        break;

      case 'set':
        if (operationArgs.length !== 2) {
          console.error('set 操作需要2个参数: <path> <value>');
          process.exit(1);
        }
        this.executeSet(filepath, operationArgs[0], operationArgs[1]);
        break;

      case 'update':
        if (operationArgs.length !== 1) {
          console.error('update 操作需要1个参数: <updates_json>');
          process.exit(1);
        }
        this.executeUpdate(filepath, operationArgs[0]);
        break;

      case 'has':
        if (operationArgs.length !== 1) {
          console.error('has 操作需要1个参数: <path>');
          process.exit(1);
        }
        this.executeHas(filepath, operationArgs[0]);
        break;

      case '-h':
      case '--help':
        console.log(this.usage);
        process.exit(0);
        break;

      default:
        console.error(`错误: 未知操作 '${operation}'`);
        console.log(this.usage);
        process.exit(1);
    }
  }
}

// 执行工具
const tool = new JsonTool();
tool.execute();