# Security Documentation

## Authentication System

### Overview
The admin panel uses JWT-based authentication with secure session management.

### Security Features Implemented

#### 1. **JWT Token Authentication**
- Uses industry-standard JWT (JSON Web Tokens) with HS256 signing algorithm
- Tokens are signed with a secret key and have a 7-day expiration
- Tokens stored in HttpOnly cookies to prevent XSS attacks

#### 2. **Rate Limiting**
- **5 failed login attempts** allowed per IP address
- **15-minute lockout** after exceeding limit
- Automatic reset on successful login
- Prevents brute force attacks

#### 3. **Secure Session Management**
- Sessions expire after 7 days
- HttpOnly cookies prevent JavaScript access
- SameSite=lax prevents CSRF attacks
- Secure flag enabled in production (HTTPS only)

#### 4. **Middleware Protection**
- All `/admin` and `/api/admin` routes are protected
- Automatic redirect to login for unauthenticated users
- Token verification on every request

#### 5. **Environment Variables**
- Credentials never hardcoded in source code
- Strong SESSION_SECRET requirement (minimum 32 characters)
- Application fails fast if security requirements not met

## Setup Instructions

### 1. Generate Strong Credentials

```bash
# Generate a strong SESSION_SECRET (required)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Configure .env.local

Copy `.env.example` to `.env.local` and fill in the values:

```env
ADMIN_USERNAME=your_admin_username  # Use a strong, unique username
ADMIN_PASSWORD=your_strong_password  # At least 12 characters, mixed case, numbers, symbols
SESSION_SECRET=your_generated_secret  # Output from command above
```

### 3. Best Practices

**DO:**
- ✅ Use strong, unique passwords (12+ characters, mixed case, numbers, symbols)
- ✅ Keep `.env.local` out of version control (already in .gitignore)
- ✅ Rotate SESSION_SECRET periodically
- ✅ Use HTTPS in production
- ✅ Monitor failed login attempts

**DON'T:**
- ❌ Use default credentials in production
- ❌ Share your `.env.local` file
- ❌ Commit secrets to git
- ❌ Use weak passwords like "password123"
- ❌ Disable rate limiting

## Security Checklist for Production

- [ ] Change default ADMIN_USERNAME and ADMIN_PASSWORD
- [ ] Generate and set a strong SESSION_SECRET
- [ ] Enable HTTPS (secure cookies will be enforced)
- [ ] Review and update rate limiting thresholds if needed
- [ ] Set up monitoring for failed login attempts
- [ ] Keep dependencies up to date
- [ ] Configure proper CORS settings
- [ ] Set up proper firewall rules
- [ ] Enable security headers (CSP, X-Frame-Options, etc.)
- [ ] Regular security audits

## Rate Limiting Details

| Action | Limit | Window | Lockout |
|--------|-------|--------|---------|
| Login attempts | 5 | 15 minutes | 15 minutes |

After 5 failed login attempts from the same IP, the user will see:
> "Too many login attempts. Please try again in X minutes."

## Session Management

- **Duration**: 7 days
- **Renewal**: Tokens are not automatically renewed (must re-login after 7 days)
- **Logout**: Clears session cookie immediately
- **Cookie Name**: `admin-session`
- **Cookie Flags**: HttpOnly, SameSite=lax, Secure (production)

## API Security

All admin API endpoints require authentication:
- Unauthenticated requests return `401 Unauthorized`
- Rate-limited requests return `429 Too Many Requests`
- Invalid tokens redirect to login page

## Threat Mitigation

| Threat | Mitigation |
|--------|-----------|
| Brute Force | Rate limiting (5 attempts/15min) |
| XSS | HttpOnly cookies |
| CSRF | SameSite cookies, token verification |
| Session Hijacking | HTTPS, secure cookies, token expiration |
| Credential Stuffing | Rate limiting, strong password requirements |
| Timing Attacks | Constant-time comparison (planned) |

## Future Enhancements

Potential security improvements for consideration:

1. **Two-Factor Authentication (2FA)**
2. **Password hashing** with bcrypt/argon2
3. **Audit logging** of all admin actions
4. **IP whitelisting** for admin access
5. **CAPTCHA** after failed login attempts
6. **Session activity monitoring**
7. **Automatic session timeout** on inactivity
8. **Redis-based rate limiting** for scalability

## Reporting Security Issues

If you discover a security vulnerability, please email info@geolink.dev (DO NOT create a public issue).

## Last Updated

This security documentation was last updated: December 2025
**Version:** 2.1.0
