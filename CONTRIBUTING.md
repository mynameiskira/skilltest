# Contributing to SkillTest

Thank you for considering contributing to SkillTest. This document outlines the process and guidelines for contributing.

## Development Workflow

### Branch Strategy

We follow the Git Flow branching model:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `release/*` - Release preparation

### Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes that don't modify src or test files

#### Examples

```
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh to improve user experience
and reduce authentication failures.

Closes #123
```

```
fix(dashboard): correct data loading race condition

Resolve issue where dashboard would display stale data
when navigating quickly between views.

Fixes #456
```

### Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes following our coding standards
3. Write or update tests as needed
4. Update documentation if required
5. Ensure all tests pass
6. Create a pull request to `develop`
7. Wait for code review and address feedback
8. Once approved, the PR will be merged

### Code Quality Standards

#### Backend (Node.js/TypeScript)

- Follow TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Write unit tests for business logic
- Document complex functions with JSDoc comments

#### Frontend (Angular/TypeScript)

- Use Angular Signals for state management
- Follow Angular style guide
- Implement proper component lifecycle management
- Write unit tests for components and services
- Ensure accessibility (WCAG 2.1 AA)

### Testing

- Write unit tests for new features
- Ensure test coverage remains above 70%
- Run full test suite before submitting PR
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)

### Documentation

- Update README.md if adding new features
- Document API changes in relevant files
- Update CHANGELOG.md following Keep a Changelog format
- Add inline comments for complex logic

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

### Creating a Release

1. Create release branch from `develop`
2. Update VERSION file
3. Update CHANGELOG.md
4. Create pull request to `main`
5. After merge, create and push version tag
6. GitHub Actions will automatically build and deploy

### Tag Format

```bash
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3
```

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Other conduct deemed inappropriate

## Getting Help

- Check existing documentation
- Search existing issues
- Create a new issue with detailed description
- Join our development discussions

## License

By contributing to SkillTest, you agree that your contributions will be licensed under the same license as the project.
