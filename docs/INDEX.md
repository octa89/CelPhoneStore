# Documentation Index

Welcome to the Tecno Express e-commerce platform documentation. This index will guide you to the right document for your needs.

## Quick Navigation

| I Want To... | Read This |
|--------------|-----------|
| Get started with the project | [README.md](./README.md) |
| Set up AWS DynamoDB | [DYNAMODB_SETUP_GUIDE.md](./DYNAMODB_SETUP_GUIDE.md) |
| Configure AWS Amplify environment | [AMPLIFY_ENV_UPDATE_CHECKLIST.md](./AMPLIFY_ENV_UPDATE_CHECKLIST.md) |
| Optimize for mobile devices | [MOBILE_RESPONSIVENESS.md](./MOBILE_RESPONSIVENESS.md) |
| Fix a TypeScript error | [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) |
| Solve a build or runtime issue | [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) |
| Fix AWS Amplify build errors | [AWS_AMPLIFY_BUILD_GUIDE.md](./AWS_AMPLIFY_BUILD_GUIDE.md) |
| Set up the AI Chatbot | [CHATBOT_SETUP.md](./CHATBOT_SETUP.md) |
| See what changed recently | [CHANGELOG.md](./CHANGELOG.md) |
| Understand the design system | [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) |
| Review security practices | [SECURITY.md](./SECURITY.md) |
| Write TypeScript code (for Claude) | [.claude/typescript-guidelines.md](../.claude/typescript-guidelines.md) |

---

## Documentation Overview

### 📘 [README.md](./README.md)
**Complete project documentation**

- Project overview and features
- Quick start guide
- Architecture explanation
- Development guide
- Deployment instructions
- Contributing guidelines

**Read this if you're:**
- New to the project
- Setting up development environment
- Need to understand the architecture
- Deploying to AWS Amplify

---

### 📗 [MOBILE_RESPONSIVENESS.md](./MOBILE_RESPONSIVENESS.md)
**Complete mobile optimization guide**

- iPhone optimization (430x932 resolution)
- Mobile-first design patterns
- Touch-friendly interactions
- Responsive layouts and typography
- Admin panel mobile features
- Testing on real devices
- Performance optimization

**Read this if you're:**
- Building mobile-responsive components
- Optimizing for iPhone/Android
- Implementing touch gestures
- Testing responsive layouts
- Getting mobile UI feedback

**Key Topics:**
- ✅ Responsive breakpoints (sm, md, lg, xl)
- ✅ Touch-friendly tap targets (44x44px)
- ✅ Mobile-first CSS patterns
- ✅ Drag-and-drop on mobile
- ✅ Testing strategies

---

### 📗 [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md)
**Comprehensive TypeScript guide for developers and AI assistants**

- Object.entries() type inference issues (CRITICAL)
- Type assertions vs type annotations
- Array and object type safety
- Strict mode compliance
- Common pitfalls and solutions
- Build verification checklist
- Quick reference patterns

**Read this if you're:**
- Encountering TypeScript errors
- Writing new components
- Refactoring existing code
- Getting "unknown type" errors
- Working with Object.entries() or reduce()

**Key Topics:**
- ✅ Object.entries() pattern (most common error)
- ✅ Array.reduce() typing
- ✅ React event handler types
- ✅ API response typing
- ✅ Null safety patterns

---

### 📕 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
**Solutions to common problems**

**Sections:**
1. TypeScript Errors
   - Type 'unknown' errors
   - Implicit 'any' errors
   - Null assignability errors
2. Build Failures
   - Missing SWC dependencies
   - Module not found errors
   - TypeScript compilation errors
3. AWS Amplify Deployment
   - Build failures
   - Environment variables
   - Runtime issues
4. Runtime Errors
   - Hydration errors
   - Property access errors
5. Development Server Issues
   - Port conflicts
   - Hot reload problems
6. Database Problems
   - Prisma client issues
   - Connection failures
   - Migration errors
7. Performance Issues
   - Slow page loads
   - Memory leaks

**Read this if you're:**
- Getting error messages
- Build is failing
- App doesn't work as expected
- Performance problems
- Database connection issues

---

### 📔 [CHANGELOG.md](./CHANGELOG.md)
**Version history and changes**

- Detailed version history
- Bug fixes by version
- New features by version
- Breaking changes
- Migration guides
- Roadmap

**Read this if you're:**
- Wondering what changed
- Upgrading to a new version
- Need to understand a fix
- Looking for feature timeline

---

### 📙 [.claude/typescript-guidelines.md](../.claude/typescript-guidelines.md)
**Quick reference for Claude Code AI assistant**

- Critical TypeScript patterns
- Object.entries() usage (with examples)
- Pre-commit checklist
- Common error solutions
- Project-specific types

**This is for:**
- Claude Code AI to reference when writing code
- Quick TypeScript pattern lookup
- Ensuring consistency in AI-generated code

---

## Documentation by Role

### 🧑‍💻 For Developers

**Getting Started:**
1. [README.md](./README.md) - Setup and overview
2. [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) - Coding standards

**During Development:**
- [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) - Reference while coding
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - When you encounter errors

**Before Committing:**
- Run `npm run lint && npm run build`
- Check [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) checklist
- Update [CHANGELOG.md](../CHANGELOG.md) if needed

### 🤖 For Claude Code / AI Assistants

**Before Writing Any Code:**
1. Read [.claude/typescript-guidelines.md](../.claude/typescript-guidelines.md)
2. Reference [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md) for detailed patterns

**Critical Patterns to Follow:**
- Object.entries() with type annotation + assertion
- Array.reduce() with generic type parameter
- Explicit return types on exported functions
- Proper null/undefined handling

**Before Completing Task:**
- Verify code follows patterns in typescript-guidelines.md
- Run `npm run build` to verify no errors
- Check for common pitfalls listed in documentation

### 🚀 For DevOps / Deployment

**Deploying to AWS Amplify:**
1. [README.md](./README.md#deployment) - Deployment setup
2. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#aws-amplify-deployment) - Deployment issues

**Environment Setup:**
- [README.md](./README.md#environment-variables) - Required variables
- Check [CHANGELOG.md](../CHANGELOG.md) for config changes

### 🐛 For Debugging

**TypeScript Errors:**
1. [TYPESCRIPT_BEST_PRACTICES.md](./TYPESCRIPT_BEST_PRACTICES.md#common-pitfalls-and-solutions)
2. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#typescript-errors)
3. [.claude/typescript-guidelines.md](../.claude/typescript-guidelines.md) - Quick patterns

**Build Errors:**
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#build-failures)
2. [README.md](./README.md#troubleshooting)

**Runtime Errors:**
1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md#runtime-errors)
2. Browser console logs
3. Check [CHANGELOG.md](../CHANGELOG.md) for recent breaking changes

---

## Documentation Standards

### File Organization

```
project-root/
├── docs/                              # User-facing documentation
│   ├── INDEX.md                       # This file
│   ├── README.md                      # Main project docs
│   ├── TYPESCRIPT_BEST_PRACTICES.md   # TS coding standards
│   └── TROUBLESHOOTING.md             # Problem solutions
├── .claude/                           # AI assistant references
│   └── typescript-guidelines.md       # Quick TS patterns for Claude
├── CHANGELOG.md                       # Version history (root level)
└── README.md                          # Project overview (root level)
```

### Documentation Maintenance

**When to Update Documentation:**

1. **TYPESCRIPT_BEST_PRACTICES.md**
   - New TypeScript pattern discovered
   - Common error pattern identified
   - New project-specific type added

2. **TROUBLESHOOTING.md**
   - New error encountered and solved
   - Build issue on new platform
   - Deployment problem solved

3. **CHANGELOG.md**
   - Every version release
   - Bug fixes
   - New features
   - Breaking changes

4. **README.md**
   - Architecture changes
   - New dependencies
   - Setup process changes
   - New features requiring documentation

5. **.claude/typescript-guidelines.md**
   - Critical patterns for AI to follow
   - Common AI-generated code issues
   - Project-specific conventions

### Documentation Style Guide

- Use clear headings and subheadings
- Include code examples with ❌ WRONG and ✅ CORRECT patterns
- Add file paths for references (e.g., `src/components/brands-dropdown.tsx:32`)
- Include version numbers and dates
- Keep examples up-to-date with current codebase
- Use tables for comparison and quick reference
- Include CLI commands in code blocks
- Cross-reference related documentation

---

## Most Common Issues and Quick Links

### 🔥 Top 5 Issues

1. **TypeScript: Type 'unknown' is not assignable**
   → [TYPESCRIPT_BEST_PRACTICES.md#object.entries()-type-inference-issues](./TYPESCRIPT_BEST_PRACTICES.md#objectentries-type-inference-issues)

2. **Build fails on AWS Amplify**
   → [TROUBLESHOOTING.md#aws-amplify-deployment](./TROUBLESHOOTING.md#aws-amplify-deployment)

3. **Missing SWC dependencies**
   → [TROUBLESHOOTING.md#error-found-lockfile-missing-swc-dependencies](./TROUBLESHOOTING.md#error-found-lockfile-missing-swc-dependencies)

4. **Parameter implicitly has 'any' type**
   → [TYPESCRIPT_BEST_PRACTICES.md#avoid-implicit-any](./TYPESCRIPT_BEST_PRACTICES.md#avoid-implicit-any)

5. **Hydration failed error**
   → [TROUBLESHOOTING.md#error-hydration-failed](./TROUBLESHOOTING.md#error-hydration-failed)

---

## External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Support

- **Email**: info@geolink.dev
- **GitHub Issues**: [Report a bug](https://github.com/octa89/CelPhoneStore/issues)
- **Documentation Issues**: Report in GitHub with label `documentation`

---

**Last Updated:** 2025-12-09
**Documentation Version:** 2.1.0
**Project Version:** 2.1.0
