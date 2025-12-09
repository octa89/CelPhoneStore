# AWS Amplify Build Configuration Guide

## Overview
This document outlines best practices to prevent build errors on AWS Amplify for Next.js 15 with TypeScript.

## Current Issues & Solutions

### Problem 1: Module-Level Client Initialization (CRITICAL)
**Issue:** External service clients (OpenAI, etc.) initialized at module level fail during Amplify's "Collecting page data" phase because environment variables aren't available at build time.

**Error Example:**
```
Error: Missing credentials. Please pass an `apiKey`, or set the `OPENAI_API_KEY` environment variable.
[Error: Failed to collect page data for /api/chat]
```

**Solution Implemented (v2.1.0):**
Use lazy initialization pattern for any client that requires environment variables:

```typescript
// ❌ WRONG - Module-level instantiation (fails at build time)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ CORRECT - Lazy initialization (only runs at runtime)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Use in request handler
export async function POST(request: Request) {
  const openai = getOpenAIClient(); // Only created at runtime
  // ...
}
```

**Files Using This Pattern:**
- `src/app/api/chat/route.ts` - OpenAI client
- `src/lib/dynamodb.ts` - DynamoDB client (already lazy)
- `src/lib/auth.ts` - Session secret (already lazy)

---

### Problem 2: TypeScript Errors Breaking Builds
**Issue:** Amplify fails builds when TypeScript finds type errors, even minor ones.

**Solutions Implemented:**
1. ✅ Using `npm install` instead of `npm ci` in amplify.yml
2. ✅ Added `output: 'standalone'` in next.config.ts for optimal serverless deployment
3. ✅ Fixed all TypeScript errors proactively
4. ✅ Using lazy initialization for external clients

**Recommended (Optional):** Add safety net to next.config.ts:
```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    // ⚠️ Only use in emergency - better to fix types!
    ignoreBuildErrors: false, // Set to true only if needed
  },
  eslint: {
    // ⚠️ Only use in emergency - better to fix linting!
    ignoreDuringBuilds: false, // Set to true only if needed
  },
};
```

### Problem 2: Package Lock File Sync Issues
**Issue:** `npm ci` fails when package-lock.json is out of sync with package.json

**Solution:** ✅ Changed amplify.yml to use `npm install` instead of `npm ci`
- `npm install` resolves dependencies dynamically
- Auto-updates lock file if needed
- More forgiving with version mismatches

### Problem 3: Missing Type Definitions
**Issue:** Properties like `displayOrder` used in code but not defined in types

**Solution:** ✅ Always update type definitions when adding new features
```typescript
// src/lib/types.ts
export type Product = {
  // ... existing properties
  displayOrder?: number; // Added for product ordering feature
};
```

## Best Practices to Prevent Future Errors

### 1. **Local Type Checking Before Push**
Always run these commands locally before committing:

```bash
# Check TypeScript errors
npx tsc --noEmit

# Check ESLint errors
npm run lint

# Test production build
npm run build
```

### 2. **Pre-commit Hook (Recommended)**
Create `.husky/pre-commit` to automatically check before commits:

```bash
#!/bin/sh
npm run lint
npx tsc --noEmit
```

### 3. **Type-Safe Development**
- Always define types for new properties
- Use TypeScript strict mode (already enabled)
- Avoid using `any` type
- Use proper type assertions instead of `as any`

### 4. **Amplify Configuration**

**amplify.yml Best Practices:**
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 20  # Use Node 20+ for Next.js 15
        - npm install  # More forgiving than npm ci
        - npx next telemetry disable
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next  # Required for Next.js SSR
    files:
      - "**/*"
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 5. **TypeScript Configuration**

**tsconfig.json Best Practices:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    // ... other options
  },
  "exclude": ["node_modules", "amplify", ".next", "out"]
}
```

### 6. **Environment Variables**
- Never use `AWS_` prefix for custom environment variables
- Set in Amplify Console for production
- Use `.env.local` for development
- Ensure all required env vars are set before deployment

## Monitoring & Debugging

### Check Build Logs
1. Go to AWS Amplify Console
2. Select your app
3. Click on the failed build
4. Review the detailed logs to identify specific errors

### Common Error Patterns

**TypeScript Errors:**
```
Type error: Property 'X' does not exist on type 'Y'
```
**Fix:** Add property to type definition

**Package Errors:**
```
npm ci can only install packages when package.json and package-lock.json are in sync
```
**Fix:** Already solved by using `npm install`

**Missing Dependencies:**
```
Missing: @package/name from lock file
```
**Fix:** Run `npm install` locally and commit package-lock.json

## Emergency Options (Last Resort)

If you need to deploy urgently and can't fix TypeScript errors immediately:

### Option 1: Disable TypeScript Checks (NOT RECOMMENDED)
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Temporary only!
  },
};
```

### Option 2: Disable ESLint Checks (NOT RECOMMENDED)
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ Temporary only!
  },
};
```

⚠️ **WARNING:** These options hide problems instead of fixing them. Use only for emergency deployments and fix issues immediately after.

## Continuous Improvement

### Weekly Checks
- Run `npm audit` for security vulnerabilities
- Update dependencies: `npm update`
- Regenerate lock file: `rm -f package-lock.json && npm install`
- Test build locally: `npm run build`

### Before Each Feature
- Define types first
- Write code with type safety
- Test locally
- Check for linting errors
- Commit with clean build

## Summary

**Prevention Checklist:**
- [x] Use `npm install` in amplify.yml (more forgiving)
- [x] Set `output: 'standalone'` in next.config.ts
- [x] Always define types for new properties
- [x] Run `npm run lint` before commits
- [x] Run `npx tsc --noEmit` before commits
- [x] Test `npm run build` locally before push
- [x] Keep dependencies updated
- [x] Use lazy initialization for external service clients (OpenAI, etc.)
- [ ] (Optional) Set up pre-commit hooks
- [ ] (Optional) Add TypeScript/ESLint ignore flags for emergency

**Key Takeaways:**
1. **Prevention is better than emergency fixes.** Always validate locally before pushing to avoid Amplify build failures.
2. **Environment variables are NOT available at build time.** Any code that requires them must use lazy initialization patterns.
3. **Module-level code runs during static page collection.** This is when most build errors occur.

---

**Last Updated:** 2025-12-09
**Version:** 2.1.0
