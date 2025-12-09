# Missing AWS Amplify Environment Variables

## 🚨 Add These 4 Variables to Fix the 500 Error

Go back to AWS Amplify Console → Environment Variables → Add these:

| Variable | Value |
|----------|-------|
| `DYNAMODB_PRODUCTS_TABLE` | `tecnoexpress-products` |
| `DYNAMODB_CAROUSEL_TABLE` | `tecnoexpress-carousel` |
| `DYNAMODB_ACTIVITY_LOG_TABLE` | `tecnoexpress-activity-log` |
| `DYNAMODB_CATEGORIES_TABLE` | `tecnoexpress-categories` |

## Why You're Getting 500 Error

The app is trying to connect to DynamoDB tables but doesn't know the table names, causing a runtime error.

## Steps:

1. Click **"Manage variables"** in Amplify Console
2. Click **"Add variable"** 4 times
3. Add each variable above with exact spelling
4. Click **"Save"**
5. Wait for automatic redeploy (~5 min)

## After Adding Variables

Your complete list should have **11 variables total**:

```
✅ ADMIN_PASSWORD
✅ ADMIN_USERNAME
✅ DYNAMODB_ACCESS_KEY_ID
✅ DYNAMODB_REGION
✅ DYNAMODB_SECRET_ACCESS_KEY
✅ DYNAMODB_PRODUCTS_TABLE          ← ADD THIS
✅ DYNAMODB_CAROUSEL_TABLE          ← ADD THIS
✅ DYNAMODB_ACTIVITY_LOG_TABLE      ← ADD THIS
✅ DYNAMODB_CATEGORIES_TABLE        ← ADD THIS
✅ NEXT_PUBLIC_BASE_URL
✅ SESSION_SECRET
```

Plus optional Stripe variables if you're using them.
