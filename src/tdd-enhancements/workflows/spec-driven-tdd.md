# Specification-Driven TDD Workflow

Complete workflow for implementing features using specification-driven test-driven development integrated with CCPM.

## Overview
This workflow ensures every line of code traces back to a specification through comprehensive testing, following the "No Vibe Coding" principle.

## Prerequisites
- CCPM system installed and configured
- GitHub Issues integration enabled
- Test framework configured for project

## Workflow Steps

### 1. Requirement Loading
```
/pm:issue-start [issue-number]
```
- Loads GitHub Issue with requirements
- Parses acceptance criteria
- Sets development context
- Initializes traceability tracking

### 2. Specification Analysis
```
/tdd:spec-to-test
```
- Analyzes loaded requirements
- Generates comprehensive test scenarios
- Creates test files for all identified behaviors
- Links tests to specific requirements

### 3. Test Validation (Red Phase)
```
/tdd:red
```
- Reviews generated tests for quality
- Ensures tests fail for correct reasons
- Validates test coverage completeness
- Confirms edge case handling

### 4. Implementation (Green Phase)
```
/tdd:green
```
- Implements minimal code to pass tests
- Focuses on functionality over design
- Maintains failing test visibility
- Validates solution correctness

### 5. Quality Enhancement (Refactor Phase)
```
/tdd:refactor
```
- Improves code quality and design
- Maintains test coverage
- Enhances readability and maintainability
- Optimizes performance when safe

### 6. Progress Tracking
```
/pm:issue-update [issue-number]
```
- Updates GitHub Issue with progress
- Reports test coverage metrics
- Links implementation to requirements
- Tracks completion status

### 7. Completion Validation
```
/pm:issue-close [issue-number]
```
- Validates all acceptance criteria met
- Confirms test coverage requirements
- Updates Epic progress
- Marks issue as complete

## Quality Gates

### After Each Phase
- All tests must pass (Green/Refactor phases)
- Coverage threshold maintained
- No regression in existing functionality
- Traceability links intact

### Before Issue Closure
- 100% acceptance criteria coverage
- Minimum test coverage threshold met
- All quality checks passed
- Documentation updated

## Integration Benefits

- **Complete Traceability**: Every test links to requirements
- **Quality Assurance**: Systematic validation at each step
- **Progress Visibility**: Real-time updates in GitHub Issues
- **Team Coordination**: Clear status for all stakeholders

## Best Practices

1. **Start Small**: Break large features into smaller, testable units
2. **Test First**: Never write production code without failing tests
3. **Maintain Discipline**: Follow Red-Green-Refactor sequence strictly
4. **Update Frequently**: Keep GitHub Issues current with progress
5. **Review Quality**: Regular code and test quality assessments

## Troubleshooting

### Tests Not Failing Properly
- Review test assertions and expectations
- Ensure test isolation and setup
- Validate requirement understanding

### Implementation Difficulties
- Break down into smaller steps
- Focus on making one test pass at a time
- Avoid over-engineering in Green phase

### Refactoring Concerns
- Ensure comprehensive test coverage first
- Make small, incremental changes
- Run tests after each refactoring step