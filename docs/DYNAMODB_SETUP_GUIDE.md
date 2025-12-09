# DynamoDB Setup Guide

This guide will walk you through migrating Tecno Express from JSON file storage to AWS DynamoDB.

---

## Prerequisites

- AWS Account
- Node.js 20+ installed
- AWS CLI configured (optional but recommended)

---

## Part 1: AWS Setup (15-20 minutes)

### Step 1: Create DynamoDB Tables

1. **Log in to AWS Console** → Go to **DynamoDB**

2. **Create the Products Table**
   - Click **"Create table"**
   - Table name: `tecnoexpress-products`
   - Partition key: `id` (String)
   - **Settings:** Keep default settings (On-demand capacity)
   - Click **"Create table"**
   - Wait for table to become "Active" (~1 minute)

3. **Create the Carousel Table**
   - Click **"Create table"**
   - Table name: `tecnoexpress-carousel`
   - Partition key: `id` (String)
   - **Settings:** Keep default settings
   - Click **"Create table"**

4. **Create the Activity Log Table**
   - Click **"Create table"**
   - Table name: `tecnoexpress-activity-log`
   - Partition key: `id` (String)
   - Sort key: `timestamp` (String)
   - **Settings:** Keep default settings
   - Click **"Create table"**

5. **Create the Categories Table**
   - Click **"Create table"**
   - Table name: `tecnoexpress-categories`
   - Partition key: `id` (String)
   - **Settings:** Keep default settings
   - Click **"Create table"**

**✅ Checkpoint:** You should have 4 tables all in "Active" status.

---

### Step 2: Create IAM User for DynamoDB Access

1. **Go to IAM Console**
   - AWS Console → Search for "IAM" → Click **"Users"**

2. **Create New User**
   - Click **"Create user"**
   - User name: `tecnoexpress-dynamodb-user`
   - Click **"Next"**

3. **Set Permissions**
   - Select **"Attach policies directly"**
   - Search for: `AmazonDynamoDBFullAccess`
   - ✅ Check the box next to it
   - Click **"Next"**
   - Click **"Create user"**

4. **Create Access Keys**
   - Click on the user you just created
   - Go to **"Security credentials"** tab
   - Scroll down to **"Access keys"**
   - Click **"Create access key"**
   - Select **"Application running outside AWS"**
   - Click **"Next"**
   - (Optional) Add description: "Tecno Express App"
   - Click **"Create access key"**

5. **IMPORTANT: Save Your Credentials**
   ```
   Access key ID:     AKIA****************
   Secret access key: ****************************************
   ```
   **⚠️ WARNING: You can only see the secret key ONCE. Save it now!**

   - Click **"Download .csv file"** (recommended)
   - Store it securely - you'll need these for the next step

**✅ Checkpoint:** You have Access Key ID and Secret Access Key saved safely.

---

## Part 2: Local Configuration (5 minutes)

### Step 3: Update Environment Variables

1. **Open your `.env.local` file** (create if it doesn't exist)

2. **Add the following variables:**

```env
# Admin Panel Authentication
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_password
SESSION_SECRET=your_session_secret_here

# DynamoDB Configuration (no AWS_ prefix to avoid Amplify conflicts)
DYNAMODB_REGION=us-east-1
DYNAMODB_ACCESS_KEY_ID=AKIA****************
DYNAMODB_SECRET_ACCESS_KEY=****************************************

# DynamoDB Table Names (these match what you created)
DYNAMODB_PRODUCTS_TABLE=tecnoexpress-products
DYNAMODB_CAROUSEL_TABLE=tecnoexpress-carousel
DYNAMODB_ACTIVITY_LOG_TABLE=tecnoexpress-activity-log
DYNAMODB_CATEGORIES_TABLE=tecnoexpress-categories
```

3. **Replace the placeholders:**
   - `DYNAMODB_ACCESS_KEY_ID`: Use the Access Key ID from Step 2
   - `DYNAMODB_SECRET_ACCESS_KEY`: Use the Secret Access Key from Step 2
   - `DYNAMODB_REGION`: Use the region where you created the tables (e.g., `us-east-1`, `us-west-2`)

   **⚠️ IMPORTANT:** We use `DYNAMODB_*` prefix instead of `AWS_*` prefix because AWS Amplify reserves environment variables starting with `AWS_` and won't allow you to set them in the Amplify Console. Using `DYNAMODB_*` avoids this conflict.

4. **Generate SESSION_SECRET if you don't have one:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

**✅ Checkpoint:** Your `.env.local` file has all required variables.

---

## Part 3: Data Migration (5 minutes)

### Step 4: Run Migration Script

This will copy all your products, categories, and carousel data from JSON files to DynamoDB.

```bash
npm run migrate:dynamodb
```

**You should see:**
```
============================================================
  TECNO EXPRESS - DynamoDB Migration Script
============================================================

🔧 Environment: development
🌍 AWS Region: us-east-1
📦 DynamoDB Tables:
   - Products: tecnoexpress-products
   - Categories: tecnoexpress-categories
   - Carousel: tecnoexpress-carousel
   - Activity Log: tecnoexpress-activity-log

⚠️  WARNING: This will overwrite existing data in DynamoDB
   Press Ctrl+C to cancel, or wait 3 seconds to continue...

📱 Migrating Products...
   Found 16 products to migrate
   ✓ Migrated: iPhone 16 Pro Max
   ✓ Migrated: Samsung Galaxy S24 Ultra
   ...
✅ Successfully migrated 16 products

📁 Migrating Categories...
   ...
✅ Successfully migrated 3 categories

🎠 Migrating Carousel...
   ...
✅ Successfully migrated 3 carousel slides

============================================================
  MIGRATION COMPLETE
============================================================

📊 Migration Summary:
   Products:     16
   Categories:   3
   Carousel:     3
   Activity Log: 1

✅ All data migrated successfully!
```

**✅ Checkpoint:** Migration completed successfully without errors.

---

### Step 5: Verify Data in AWS Console

1. Go back to **AWS Console → DynamoDB**
2. Click on each table and click **"Explore table items"**
3. Verify you see your products, categories, carousel slides

---

## Part 4: Test Locally (5 minutes)

### Step 6: Test the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Public Site:**
   - Go to: http://localhost:3000
   - Verify products are displaying
   - Check that the carousel works

3. **Test Admin Panel:**
   - Go to: http://localhost:3000/admin/login
   - Log in with your `ADMIN_USERNAME` and `ADMIN_PASSWORD`
   - Navigate to **Products** page
   - Try adding a new test product
   - Try editing an existing product
   - Try deleting the test product
   - Check **Activity Log** to see if actions are being recorded

**✅ Checkpoint:** Everything works locally - products display, admin panel functional.

---

## Part 5: Deploy to AWS Amplify (10 minutes)

### Step 7: Add Environment Variables to Amplify

1. **Go to AWS Amplify Console**
   - Select your app (tecnoexpress)
   - Click **"Environment variables"** in the left sidebar
   - Click **"Manage variables"**

2. **Add ALL these variables:**

| Variable | Value | Example |
|----------|-------|---------|
| `SESSION_SECRET` | Your session secret | `abc123...` (32+ chars) |
| `ADMIN_USERNAME` | Your admin username | `admin` |
| `ADMIN_PASSWORD` | Your admin password | `SecurePass123!` |
| `DYNAMODB_REGION` | Your DynamoDB region | `us-east-1` |
| `DYNAMODB_ACCESS_KEY_ID` | Your IAM access key | `AKIA...` |
| `DYNAMODB_SECRET_ACCESS_KEY` | Your IAM secret key | `wJalr...` |
| `DYNAMODB_PRODUCTS_TABLE` | Products table name | `tecnoexpress-products` |
| `DYNAMODB_CAROUSEL_TABLE` | Carousel table name | `tecnoexpress-carousel` |
| `DYNAMODB_ACTIVITY_LOG_TABLE` | Activity log table name | `tecnoexpress-activity-log` |
| `DYNAMODB_CATEGORIES_TABLE` | Categories table name | `tecnoexpress-categories` |
| `NEXT_PUBLIC_BASE_URL` | Your production URL | `https://www.tecnoexp.com` |

   **⚠️ NOTE:** We use `DYNAMODB_*` prefix (not `AWS_*`) because AWS Amplify reserves variables starting with `AWS_` and prevents you from setting them manually.

3. **Click "Save"**

---

### Step 8: Deploy

1. **Trigger a new deployment:**
   - Method 1: Push new code to your GitHub repository
   - Method 2: In Amplify Console → Click **"Redeploy this version"**

2. **Monitor the build:**
   - Watch the build logs
   - Look for any errors
   - Build should complete successfully (~5-10 minutes)

3. **Test the deployed site:**
   - Visit your production URL (e.g., https://www.tecnoexp.com)
   - Verify products are loading
   - Test the admin panel:
     - Go to `/admin/login`
     - Log in with your credentials
     - Add/Edit/Delete a product
     - Verify changes appear immediately

**✅ Checkpoint:** Production site is live and admin panel works!

---

## Troubleshooting

### Issue: "DYNAMODB_REGION must be set in environment variables"

**Solution:**
- Check that `DYNAMODB_REGION` is set in `.env.local` (local)
- Check that `DYNAMODB_REGION` is set in Amplify environment variables (production)

### Issue: "Session verification failed" or 500 errors

**Solution:**
- Verify `SESSION_SECRET` is at least 32 characters
- Make sure `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Check Amplify build logs for specific errors

### Issue: Migration script fails with "AccessDeniedException"

**Solution:**
- Verify IAM user has `AmazonDynamoDBFullAccess` policy
- Double-check `DYNAMODB_ACCESS_KEY_ID` and `DYNAMODB_SECRET_ACCESS_KEY` are correct
- Make sure table names match exactly (case-sensitive)

### Issue: Products not showing on website

**Solution:**
- Check DynamoDB Console to verify data was migrated
- Check browser console for errors
- Verify `DYNAMODB_REGION` matches where your tables are located
- Try running migration again: `npm run migrate:dynamodb`

### Issue: "Cannot find module '@aws-sdk/client-dynamodb'"

**Solution:**
```bash
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

---

## Security Best Practices

### ⚠️ CRITICAL: Protect Your Credentials

1. **Never commit `.env.local` to git**
   - It's in `.gitignore` - verify this!
   - Run: `git ls-files | grep .env.local` (should return nothing)

2. **Use different credentials for different environments**
   - Development: One set of AWS keys
   - Production: Different set of AWS keys

3. **Rotate credentials regularly**
   - Change AWS access keys every 90 days
   - Change admin password periodically

4. **Use AWS IAM best practices**
   - Only grant minimum required permissions
   - Enable MFA on your AWS account
   - Review IAM user access regularly

---

## What Changed?

### Before (JSON Files):
- Products stored in `src/data/products.json`
- Data lost on every Amplify deployment
- Couldn't update products without re-deploying
- Filesystem writes failed on Amplify

### After (DynamoDB):
- Products stored in AWS DynamoDB
- Data persists across deployments
- Admin panel works on production
- Can add/edit/delete products live
- Scalable and reliable

---

## Cost Estimate

**DynamoDB On-Demand Pricing (us-east-1):**
- First 25 GB storage: **FREE** (AWS Free Tier)
- Read requests: $0.25 per million
- Write requests: $1.25 per million

**Expected Cost for Tecno Express:**
- ~100 products: **< $0.01/month**
- Low traffic e-commerce: **< $1/month**
- **Total:** Essentially free for your use case

---

## Next Steps

1. ✅ Test thoroughly in production
2. ✅ Train team on using admin panel
3. ✅ Monitor AWS costs in AWS Billing Dashboard
4. ✅ Set up billing alerts (recommended: $5 threshold)
5. ✅ Create DynamoDB backups (AWS → DynamoDB → Backups)

---

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review AWS Amplify build logs
3. Check browser console for errors
4. Verify all environment variables are set correctly

---

**Congratulations!** 🎉 Your Tecno Express admin panel is now fully functional with DynamoDB!

**Last Updated:** December 2025
**Version:** 2.1.0
