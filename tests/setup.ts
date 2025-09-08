/**
 * Jest 测试设置文件
 * 全局测试配置和工具函数
 */

import { jest } from '@jest/globals';

// 设置测试超时时间 (10秒)
jest.setTimeout(10000);

// 全局测试工具函数
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidPath(): R;
    }
  }
}

// 自定义匹配器：验证路径格式
expect.extend({
  toBeValidPath(received: string) {
    const pass = typeof received === 'string' && received.length > 0 && !received.includes('\\\\');
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid path`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid path`,
        pass: false
      };
    }
  }
});

// 模拟 console 方法以避免测试时的噪音
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info
};

// 在测试开始前设置静默模式
beforeAll(() => {
  // 只在非调试模式下静默 console
  if (!process.env.DEBUG_TESTS) {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    // 保留 error 输出，因为它们对调试很重要
  }
});

// 在测试结束后恢复 console
afterAll(() => {
  if (!process.env.DEBUG_TESTS) {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.info = originalConsole.info;
  }
});

// 每个测试前清理模拟
beforeEach(() => {
  jest.clearAllMocks();
});