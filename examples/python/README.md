# Python TDD Example Project

这是一个使用 Claude TDD CLI 的 Python 示例项目，采用现代 Python 开发工具和最佳实践。

## 快速开始

1. **安装 Claude TDD CLI**
   ```bash
   npm install -g claude-tdd-cli
   ```

2. **设置 Python 虚拟环境**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **安装项目依赖**
   ```bash
   pip install -e ".[dev]"
   ```

4. **初始化 TDD 工作流**
   ```bash
   claude-tdd init --framework python
   ```

## 项目结构

```
python-example/
├── src/
│   └── claude_tdd_example/
│       ├── __init__.py
│       ├── calculator.py        # 计算器示例
│       ├── string_utils.py      # 字符串工具
│       └── web_client.py        # HTTP 客户端示例
├── tests/
│   ├── __init__.py
│   ├── test_calculator.py       # 计算器测试
│   ├── test_string_utils.py     # 字符串工具测试
│   └── test_web_client.py       # Web 客户端测试
├── .claude/                     # Claude TDD 配置
├── pyproject.toml              # 项目配置
├── requirements.txt            # 依赖列表
└── README.md
```

## TDD 工作流示例：字符串验证器

### 步骤 1: 编写测试 (RED)

```python
# tests/test_string_utils.py
import pytest
from claude_tdd_example.string_utils import StringValidator

class TestStringValidator:
    
    def setup_method(self):
        """每个测试方法前都会执行"""
        self.validator = StringValidator()
    
    def test_should_validate_email_address(self):
        """应该正确验证邮箱地址"""
        # Given
        valid_email = "user@example.com"
        
        # When
        result = self.validator.is_valid_email(valid_email)
        
        # Then
        assert result is True
    
    def test_should_reject_invalid_email(self):
        """应该拒绝无效的邮箱地址"""
        invalid_emails = [
            "invalid.email",
            "@example.com",
            "user@",
            "",
            None
        ]
        
        for email in invalid_emails:
            assert self.validator.is_valid_email(email) is False
    
    @pytest.mark.parametrize("password,expected", [
        ("ValidPass123!", True),   # 有效密码
        ("short", False),          # 太短
        ("nouppercase123!", False), # 没有大写字母
        ("NOLOWERCASE123!", False), # 没有小写字母
        ("NoNumbers!", False),      # 没有数字
        ("NoSpecialChars123", False), # 没有特殊字符
    ])
    def test_should_validate_password_strength(self, password, expected):
        """应该正确验证密码强度"""
        result = self.validator.is_strong_password(password)
        assert result is expected
    
    def test_should_sanitize_user_input(self):
        """应该清理用户输入"""
        # Given
        malicious_input = "<script>alert('xss')</script>Hello World"
        expected = "Hello World"
        
        # When
        result = self.validator.sanitize_input(malicious_input)
        
        # Then
        assert result == expected
```

### 步骤 2: 运行测试确认失败
```bash
pytest tests/test_string_utils.py -v
```

### 步骤 3: 编写最小实现 (GREEN)

```python
# src/claude_tdd_example/string_utils.py
import re
from typing import Optional

class StringValidator:
    """字符串验证工具类"""
    
    EMAIL_PATTERN = re.compile(
        r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    )
    
    def is_valid_email(self, email: Optional[str]) -> bool:
        """验证邮箱地址格式"""
        if not email:
            return False
        
        return bool(self.EMAIL_PATTERN.match(email))
    
    def is_strong_password(self, password: Optional[str]) -> bool:
        """验证密码强度
        
        要求:
        - 至少8个字符
        - 包含大写字母
        - 包含小写字母
        - 包含数字
        - 包含特殊字符
        """
        if not password or len(password) < 8:
            return False
        
        checks = [
            any(c.isupper() for c in password),  # 大写字母
            any(c.islower() for c in password),  # 小写字母
            any(c.isdigit() for c in password),  # 数字
            any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password)  # 特殊字符
        ]
        
        return all(checks)
    
    def sanitize_input(self, user_input: str) -> str:
        """清理用户输入，移除HTML标签"""
        if not user_input:
            return ""
        
        # 简单的HTML标签移除
        clean_text = re.sub(r'<[^>]+>', '', user_input)
        return clean_text.strip()
```

### 步骤 4: 运行测试确认通过
```bash
pytest tests/test_string_utils.py -v
```

### 步骤 5: 重构 (REFACTOR)
优化代码，添加更多验证功能。

## 可用命令

```bash
# 运行测试
pytest

# 运行特定测试文件
pytest tests/test_calculator.py

# 运行带覆盖率的测试
pytest --cov=src

# 运行测试并生成HTML覆盖率报告
pytest --cov=src --cov-report=html

# 代码格式化
black src tests

# 导入排序
isort src tests

# 代码检查
flake8 src tests

# 类型检查
mypy src

# 运行所有质量检查
black src tests && isort src tests && flake8 src tests && mypy src
```

## 测试最佳实践

### 1. 使用 pytest fixtures
```python
import pytest
from unittest.mock import Mock

@pytest.fixture
def mock_database():
    """模拟数据库连接"""
    return Mock()

@pytest.fixture
def sample_user():
    """测试用户数据"""
    return {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
    }

def test_user_creation(mock_database, sample_user):
    """使用 fixtures 的测试"""
    # 测试逻辑
    pass
```

### 2. 参数化测试
```python
@pytest.mark.parametrize("input_value,expected", [
    (1, 2),
    (2, 4),
    (3, 6),
    (0, 0),
])
def test_double_function(input_value, expected):
    assert double(input_value) == expected
```

### 3. 模拟外部依赖
```python
from unittest.mock import patch, Mock
import requests

def test_api_call():
    with patch('requests.get') as mock_get:
        # 配置模拟响应
        mock_response = Mock()
        mock_response.json.return_value = {"status": "success"}
        mock_get.return_value = mock_response
        
        # 执行测试
        result = make_api_call("https://api.example.com")
        
        # 验证结果
        assert result["status"] == "success"
        mock_get.assert_called_once_with("https://api.example.com")
```

### 4. 测试异常处理
```python
def test_should_raise_exception_for_invalid_input():
    with pytest.raises(ValueError, match="Invalid input"):
        process_data(None)
```

## 代码质量工具

### Black (代码格式化)
自动格式化 Python 代码，保持一致的代码风格。

### isort (导入排序)
自动排序和组织 import 语句。

### flake8 (代码检查)
检查代码风格问题和潜在错误。

### mypy (类型检查)
静态类型检查，确保类型注解的正确性。

### pytest-cov (覆盖率)
生成测试覆盖率报告。

## Claude 命令集成

```bash
# TDD 相关命令
/tdd:red          # 开始编写测试
/tdd:green        # 实现功能代码
/tdd:refactor     # 重构代码
/tdd:status       # 查看 TDD 状态

# 代码质量命令
/lint             # 运行代码检查
/format           # 格式化代码
/test             # 运行测试
```

## 开发工作流

1. **设置预提交钩子**
   ```bash
   pre-commit install
   ```

2. **开发新功能**
   - 编写测试 (RED)
   - 实现功能 (GREEN)  
   - 重构优化 (REFACTOR)

3. **质量检查**
   ```bash
   pytest --cov=src
   black src tests
   flake8 src tests
   mypy src
   ```

4. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add string validation functionality"
   ```

## 故障排除

### 常见问题

1. **导入错误**
   ```bash
   pip install -e .
   ```

2. **测试失败**
   ```bash
   pytest -v --tb=long
   ```

3. **依赖冲突**
   ```bash
   pip-compile pyproject.toml
   ```

## 学习资源

- [pytest 文档](https://docs.pytest.org/)
- [Python 测试指南](https://realpython.com/python-testing/)
- [TDD with Python](https://www.obeythetestinggoat.com/)
- [Python 类型提示](https://docs.python.org/3/library/typing.html)