/** @type {import('jest').Config} */
module.exports = {
  // 预设配置，用于处理 TypeScript
  preset: 'ts-jest',
  
  // 测试环境
  testEnvironment: 'node',
  
  // 根目录
  rootDir: '.',
  
  // 测试文件匹配模式
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  
  // 设置文件
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // 清除模拟数据
  clearMocks: true,
  
  // 显示详细输出
  verbose: true,
  
  // 模拟文件扩展名
  moduleFileExtensions: [
    'ts',
    'js',
    'json'
  ]
};