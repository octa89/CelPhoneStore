# Tecno Express - Quick Start Guide

## ⚡ Quick Setup (30 minutes)

### 1. AWS DynamoDB Tables (10 min)
Create 4 tables in AWS Console → DynamoDB:
- `tecnoexpress-products` (partition key: `id` String)
- `tecnoexpress-carousel` (partition key: `id` Number)
- `tecnoexpress-activity-log` (partition key: `id` String, sort key: `timestamp` String)
- `tecnoexpress-categories` (partition key: `id` String)

### 2. IAM User (5 min)
AWS Console → IAM → Users:
- Create user: `tecnoexpress-dynamodb-user`
- Attach policy: `AmazonDynamoDBFullAccess`
- Create access key → Save credentials!

### 3. Local Environment (2 min)
Copy `.env.example` to `.env.local` and fill in:
```env
# Admin
ADMIN_USERNAME=your_username
ADMIN_PASSWORD=your_password
SESSION_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA****************
AWS_SECRET_ACCESS_KEY=****************************************
```

### 4. Migrate Data (3 min)
```bash
npm install
npm run migrate:dynamodb
```

### 5. Test Locally (5 min)
```bash
npm run dev
```
- Visit: http://localhost:3000
- Admin: http://localhost:3000/admin/login

### 6. Deploy to Amplify (5 min)
1. Add all environment variables from `.env.local` to Amplify Console
2. Redeploy or push to GitHub
3. Done! 🎉

---

## 📚 Full Documentation

- **Complete Setup:** See [DYNAMODB_SETUP_GUIDE.md](./DYNAMODB_SETUP_GUIDE.md)
- **Project Docs:** See [docs/README.md](./docs/README.md)
- **Security:** See [SECURITY.md](./SECURITY.md)

---

## 🔧 Common Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run migrate:dynamodb # Migrate JSON data to DynamoDB
npm run lint             # Check code quality
```

---

## ❓ Need Help?

1. Check [DYNAMODB_SETUP_GUIDE.md](./DYNAMODB_SETUP_GUIDE.md) troubleshooting section
2. Review AWS Amplify build logs
3. Verify environment variables are set correctly

---

**Last Updated:** January 2025
