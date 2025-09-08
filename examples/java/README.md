# Java TDD Example Project

这是一个使用 Claude TDD CLI 的 Java/Maven 示例项目。

## 快速开始

1. **安装 Claude TDD CLI**
   ```bash
   npm install -g claude-tdd-cli
   ```

2. **确保 Java 和 Maven 已安装**
   ```bash
   java --version
   mvn --version
   ```

3. **初始化 TDD 工作流**
   ```bash
   claude-tdd init --framework java
   ```

4. **编译和测试**
   ```bash
   mvn clean compile
   mvn test
   ```

## 项目结构

```
java-example/
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/example/
│   │           ├── Calculator.java
│   │           └── StringUtils.java
│   └── test/
│       └── java/
│           └── com/example/
│               ├── CalculatorTest.java
│               └── StringUtilsTest.java
├── .claude/                  # Claude TDD 配置
│   ├── agents/              # AI 代理配置
│   ├── commands/            # 命令模板
│   ├── hooks/               # Git hooks
│   └── rules/               # TDD 规则
├── pom.xml                  # Maven 配置
└── README.md
```

## TDD 工作流示例：字符串工具类

### 步骤 1: 编写测试 (RED)

```java
// src/test/java/com/example/StringUtilsTest.java
package com.example;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DisplayName("StringUtils Tests")
class StringUtilsTest {

    @Test
    @DisplayName("应该正确反转字符串")
    void shouldReverseString() {
        // Given
        String input = "hello";
        String expected = "olleh";
        
        // When
        String actual = StringUtils.reverse(input);
        
        // Then
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    @DisplayName("空字符串应该返回空字符串")
    void shouldHandleEmptyString() {
        assertThat(StringUtils.reverse("")).isEmpty();
    }

    @Test
    @DisplayName("null字符串应该抛出异常")
    void shouldThrowExceptionForNull() {
        assertThrows(IllegalArgumentException.class, 
            () -> StringUtils.reverse(null));
    }

    @ParameterizedTest
    @ValueSource(strings = {"a", "ab", "abc", "hello world"})
    @DisplayName("应该正确处理各种长度的字符串")
    void shouldHandleVariousLengths(String input) {
        String reversed = StringUtils.reverse(input);
        String doubleReversed = StringUtils.reverse(reversed);
        
        assertThat(doubleReversed).isEqualTo(input);
    }
}
```

### 步骤 2: 运行测试确认失败
```bash
mvn test
# 测试应该失败，因为 StringUtils 类还不存在
```

### 步骤 3: 编写最小实现 (GREEN)

```java
// src/main/java/com/example/StringUtils.java
package com.example;

public class StringUtils {
    
    public static String reverse(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Input cannot be null");
        }
        
        if (input.isEmpty()) {
            return input;
        }
        
        return new StringBuilder(input).reverse().toString();
    }
}
```

### 步骤 4: 运行测试确认通过
```bash
mvn test
```

### 步骤 5: 重构 (REFACTOR)
添加更多功能或优化现有实现。

## 可用 Maven 命令

```bash
# 编译项目
mvn compile

# 运行测试
mvn test

# 生成测试覆盖率报告
mvn jacoco:report

# 运行代码质量检查
mvn checkstyle:check

# 运行 SpotBugs 静态分析
mvn spotbugs:check

# 打包项目
mvn package

# 清理构建目录
mvn clean

# 完整的构建流程
mvn clean compile test package
```

## 测试最佳实践

### 1. 使用 JUnit 5 注解
```java
@Test                    // 标记测试方法
@DisplayName("测试描述")   // 提供可读的测试名称
@ParameterizedTest      // 参数化测试
@BeforeEach             // 每个测试前执行
@AfterEach              // 每个测试后执行
```

### 2. 使用 AssertJ 断言
```java
import static org.assertj.core.api.Assertions.*;

// 更流畅的断言语法
assertThat(actual).isEqualTo(expected);
assertThat(list).hasSize(3).contains("item1");
assertThat(exception).hasMessage("Error message");
```

### 3. 使用 Mockito 进行模拟
```java
import static org.mockito.Mockito.*;

@Mock
private UserRepository userRepository;

@Test
void shouldFindUser() {
    // Given
    User expectedUser = new User("John");
    when(userRepository.findById(1L)).thenReturn(expectedUser);
    
    // When
    User actualUser = userService.findById(1L);
    
    // Then
    assertThat(actualUser).isEqualTo(expectedUser);
    verify(userRepository).findById(1L);
}
```

## Claude 命令集成

在项目中使用 Claude Code 时，可以使用以下命令：

```bash
# TDD 相关命令
/tdd:red          # 开始编写测试
/tdd:green        # 实现代码使测试通过
/tdd:refactor     # 重构代码
/tdd:status       # 查看当前 TDD 状态

# 项目管理命令
/pm:task-decompose  # 分解大任务
/pm:next           # 获取下一个任务

# 提交代码
/commit           # 智能提交
```

## 代码质量配置

### Checkstyle 配置 (checkstyle.xml)
项目包含基本的 Checkstyle 配置，用于保持代码风格一致性。

### JaCoCo 覆盖率
运行 `mvn jacoco:report` 后，可以在 `target/site/jacoco/` 查看详细的覆盖率报告。

### SpotBugs 静态分析
使用 SpotBugs 检测潜在的 bug 和代码问题。

## 故障排除

### 常见问题

1. **编译错误**
   ```bash
   mvn clean compile
   ```

2. **测试失败**
   ```bash
   mvn test -Dtest=SpecificTestClass
   ```

3. **依赖问题**
   ```bash
   mvn dependency:tree
   mvn dependency:resolve
   ```

## 学习资源

- [JUnit 5 用户指南](https://junit.org/junit5/docs/current/user-guide/)
- [AssertJ 文档](https://assertj.github.io/doc/)
- [Mockito 文档](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Maven 指南](https://maven.apache.org/guides/index.html)