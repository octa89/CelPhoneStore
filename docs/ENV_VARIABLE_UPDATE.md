# Environment Variable Prefix Change

**Date:** January 19, 2025
**Type:** Breaking Change (Environment Variables Only)
**Status:** ✅ Completed & Tested

---

## 🔄 Changes Made

### Problem
AWS Amplify **reserves** environment variables starting with `AWS_` prefix and prevents users from manually setting them in the Amplify Console. This caused deployment issues when trying to configure DynamoDB credentials.

### Solution
Changed all AWS credential environment variables from `AWS_*` to `DYNAMODB_*` prefix.

---

## 📝 Environment Variable Changes

| Old Name (❌ Blocked by Amplify) | New Name (✅ Works) |
|----------------------------------|---------------------|
| `AWS_REGION` | `DYNAMODB_REGION` |
| `AWS_ACCESS_KEY_ID` | `DYNAMODB_ACCESS_KEY_ID` |
| `AWS_SECRET_ACCESS_KEY` | `DYNAMODB_SECRET_ACCESS_KEY` |

**Table name variables remain unchanged:**
- ✅ `DYNAMODB_PRODUCTS_TABLE`
- ✅ `DYNAMODB_CAROUSEL_TABLE`
- ✅ `DYNAMODB_ACTIVITY_LOG_TABLE`
- ✅ `DYNAMODB_CATEGORIES_TABLE`

---

## 🔧 Files Modified

### Code Files
1. **`src/lib/dynamodb.ts`** ✅
   - Updated environment variable validation
   - Updated DynamoDB client configuration
   - Added comment explaining the prefix change

2. **`.env.local`** ✅
   - Changed `AWS_REGION` → `DYNAMODB_REGION`
   - Changed `AWS_ACCESS_KEY_ID` → `DYNAMODB_ACCESS_KEY_ID`
   - Changed `AWS_SECRET_ACCESS_KEY` → `DYNAMODB_SECRET_ACCESS_KEY`

3. **`.env.example`** ✅
   - Updated all AWS credentials to use DYNAMODB_ prefix
   - Added explanatory comment about Amplify conflict

### Documentation Files
4. **`docs/README.md`** ✅
   - Updated environment variables section
   - Added comment about Amplify conflicts

5. **`DYNAMODB_SETUP_GUIDE.md`** ✅
   - Updated all references to AWS_ variables
   - Added warning about Amplify reserved variables
   - Updated troubleshooting section
   - Updated Amplify deployment table

6. **`QUICK_START.md`** ✅
   - Updated environment variables section
   - Added comment about prefix change

---

## ✅ Verification

### Build Test
```bash
npm run build
```
**Result:** ✅ Build successful - 52 pages generated without errors

### Environment Variables Work
- ✅ DynamoDB client initializes correctly
- ✅ All admin API routes function properly
- ✅ Migration script works with new variable names

---

## 🚀 Deployment Instructions

### For Existing Deployments

If you have already deployed to AWS Amplify, you need to update your environment variables:

**Step 1: Update Local Environment**
```bash
# Edit .env.local and replace:
AWS_REGION → DYNAMODB_REGION
AWS_ACCESS_KEY_ID → DYNAMODB_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY → DYNAMODB_SECRET_ACCESS_KEY
```

**Step 2: Update Amplify Console**
1. Go to AWS Amplify Console
2. Select your app
3. Go to **Environment variables**
4. **DELETE** the old variables (if they exist):
   - ❌ `AWS_REGION`
   - ❌ `AWS_ACCESS_KEY_ID`
   - ❌ `AWS_SECRET_ACCESS_KEY`

5. **ADD** the new variables:
   - ✅ `DYNAMODB_REGION` = `us-east-2` (your region)
   - ✅ `DYNAMODB_ACCESS_KEY_ID` = `AKIA****************` (your access key)
   - ✅ `DYNAMODB_SECRET_ACCESS_KEY` = `****************************************` (your secret key)

6. Click **Save**

**Step 3: Redeploy**
```bash
git add .
git commit -m "Update environment variable names to avoid Amplify conflicts"
git push
```

Or manually trigger a redeploy in Amplify Console.

---

## 🔍 What This Fixes

### Before (❌ Problem)
```
AWS Amplify Console → Environment Variables
❌ Cannot add AWS_REGION (reserved by AWS)
❌ Cannot add AWS_ACCESS_KEY_ID (reserved by AWS)
❌ Cannot add AWS_SECRET_ACCESS_KEY (reserved by AWS)
⚠️  Build fails: "DYNAMODB_REGION must be set in environment variables"
```

### After (✅ Solution)
```
AWS Amplify Console → Environment Variables
✅ Can add DYNAMODB_REGION
✅ Can add DYNAMODB_ACCESS_KEY_ID
✅ Can add DYNAMODB_SECRET_ACCESS_KEY
✅ Build succeeds and app works correctly
```

---

## 📚 Why AWS Reserves These Variables

AWS Amplify automatically sets `AWS_*` environment variables based on:
- The deployment region
- Temporary IAM role credentials
- Service-specific configurations

These are used by AWS SDKs for automatic credential resolution. By using custom `DYNAMODB_*` variables, we:
1. ✅ Avoid conflicts with Amplify's automatic variables
2. ✅ Have explicit control over which credentials are used
3. ✅ Can set them manually in the Amplify Console

---

## 🛠️ Migration Checklist

For team members updating their local environment:

- [ ] Pull latest code from repository
- [ ] Update `.env.local` with new variable names:
  - [ ] `AWS_REGION` → `DYNAMODB_REGION`
  - [ ] `AWS_ACCESS_KEY_ID` → `DYNAMODB_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY` → `DYNAMODB_SECRET_ACCESS_KEY`
- [ ] Verify values are correct (us-east-2, AKIA..., jXGP...)
- [ ] Run `npm run build` to test
- [ ] Run `npm run dev` and test admin panel
- [ ] Verify products load on homepage

For AWS Amplify deployment:

- [ ] Update environment variables in Amplify Console
- [ ] Remove old `AWS_*` variables (if any)
- [ ] Add new `DYNAMODB_*` variables
- [ ] Save and redeploy
- [ ] Verify production site works
- [ ] Test admin login and product management

---

## ⚠️ Breaking Change Notice

**This is a breaking change for existing deployments.**

If you deploy without updating the environment variables, you will get this error:
```
Error: DYNAMODB_REGION must be set in environment variables
```

**Fix:** Update your environment variables as described above.

---

## 📞 Support

If you encounter issues after this change:

1. **Verify environment variables are set correctly**
   ```bash
   # Check .env.local has all three variables
   cat .env.local | grep DYNAMODB_
   ```

2. **Test build locally**
   ```bash
   npm run build
   ```

3. **Check Amplify Console**
   - Ensure all DYNAMODB_* variables are set
   - Check build logs for specific errors

4. **Migration script**
   ```bash
   # Should work without errors
   npm run migrate:dynamodb
   ```

---

## Summary

✅ **Changed:** Environment variable names from `AWS_*` to `DYNAMODB_*`
✅ **Why:** AWS Amplify reserves `AWS_*` variables
✅ **Impact:** Existing deployments need environment variable updates
✅ **Tested:** Build succeeds, all features work correctly
✅ **Documentation:** All docs updated with new variable names

**Action Required:** Update environment variables in `.env.local` and AWS Amplify Console.
