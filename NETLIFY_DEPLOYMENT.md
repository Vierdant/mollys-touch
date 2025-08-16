# Netlify Deployment Guide

## Environment Variables Setup

To fix the "Remove the secrets" error, you need to configure environment variables correctly in Netlify.

### 1. Remove VITE_ Prefix from Supabase Variables

**❌ Don't use these (they expose secrets to client-side):**
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

**✅ Use these instead (server-side only):**
```env
SUPABASE_URL=your_url
SUPABASE_ANON_KEY=your_key
```

### 2. Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add these variables:

```
CLIENT_ID=your_oauth_client_id
CLIENT_SECRET=your_oauth_client_secret
REDIRECT_URI=https://your-domain.com/auth/callback
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Why This Fixes the Error

- **VITE_** prefixed variables are bundled into client-side JavaScript
- Netlify's security scanner detects these as exposed secrets
- **Without VITE_** prefix, variables are only available server-side
- Your Supabase operations now happen in server-side API routes (`/api/profiles`)

### 4. Verify Your Setup

- ✅ Supabase client uses `process.env.SUPABASE_URL` (server-side)
- ✅ All database operations happen in `/api/profiles` endpoints
- ✅ No sensitive data exposed to client-side code
- ✅ Environment variables properly configured in Netlify

### 5. Redeploy

After updating the environment variables in Netlify, trigger a new deployment. The error should be resolved.
