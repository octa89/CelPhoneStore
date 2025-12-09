# AWS Amplify Environment Variables - Complete Setup

## Required Environment Variables for AWS Amplify

Add ALL these variables in AWS Amplify Console > Environment Variables:

### Admin Authentication
| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | Random secret (32+ chars) |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |

### DynamoDB Configuration
| Variable | Description |
|----------|-------------|
| `DYNAMODB_REGION` | AWS region (e.g., `us-east-2`) |
| `DYNAMODB_ACCESS_KEY_ID` | IAM Access Key ID |
| `DYNAMODB_SECRET_ACCESS_KEY` | IAM Secret Access Key |
| `DYNAMODB_PRODUCTS_TABLE` | `tecnoexpress-products` |
| `DYNAMODB_CAROUSEL_TABLE` | `tecnoexpress-carousel` |
| `DYNAMODB_ACTIVITY_LOG_TABLE` | `tecnoexpress-activity-log` |
| `DYNAMODB_CATEGORIES_TABLE` | `tecnoexpress-categories` |
| `DYNAMODB_CHAT_CONVERSATIONS_TABLE` | `tecnoexpress-chat-conversations` |
| `DYNAMODB_PRODUCT_INQUIRIES_TABLE` | `tecnoexpress-product-inquiries` |
| `DYNAMODB_POPULAR_MODELS_TABLE` | `tecnoexpress-popular-models` |
| `DYNAMODB_RESERVATIONS_TABLE` | `tecnoexpress-reservations` |

### OpenAI Chatbot
| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | OpenAI API key (`sk-proj-...`) |

### Email Notifications (Gmail)
| Variable | Description |
|----------|-------------|
| `GMAIL_USER` | Gmail address for sending |
| `GMAIL_APP_PASSWORD` | Gmail App Password (16 chars) |
| `ADMIN_NOTIFICATION_EMAIL` | Email to receive notifications |

### Public URLs
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BASE_URL` | Production URL (e.g., `https://www.tecnoexp.com`) |
| `NEXT_PUBLIC_SITE_URL` | Same as above |

### Stripe (Optional)
| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

---

## Step-by-Step Setup

### 1. Open AWS Amplify Console
1. Go to AWS Console > AWS Amplify
2. Select your app
3. Click **Environment variables** in sidebar
4. Click **Manage variables**

### 2. Add All Variables
Copy values from your `.env.local` file to Amplify.

**IMPORTANT:** Do NOT use `AWS_` prefix for DynamoDB credentials - Amplify reserves those.

### 3. Save and Redeploy
1. Click **Save**
2. Amplify will automatically redeploy

---

## Gmail App Password Setup

To send email notifications:

1. Enable 2FA on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Create App Password for "Mail"
4. Use the 16-character password in `GMAIL_APP_PASSWORD`

---

## Verification

After deploy, verify:
- [ ] Homepage loads with products
- [ ] Admin login works (`/admin/login`)
- [ ] Chat widget appears and responds
- [ ] Email notifications send when chat ends

---

## Troubleshooting

### "DYNAMODB_REGION must be set"
- Verify variable names are correct
- Click Save after adding variables
- Redeploy manually if needed

### "OpenAI API error"
- Check `OPENAI_API_KEY` is set correctly
- Verify API key has credits

### "Email not sending"
- Verify `GMAIL_APP_PASSWORD` is 16 chars (no spaces)
- Check Gmail 2FA is enabled
- Verify App Password was created correctly
