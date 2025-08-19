# Netlify Deployment Guide

## Environment Variables Setup

This project uses a dual environment variable configuration to work in both development and production.

### 1. Development Environment (npm run dev)

Create a `.env.local` file in your project root with:

```env
# OAuth 2.0 Configuration
CLIENT_ID=your_oauth_client_id
CLIENT_SECRET=your_oauth_client_secret
REDIRECT_URI=http://localhost:5173/auth/callback

# Supabase Configuration (for development)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: `VITE_` prefixed variables are exposed to client-side during development.

### 2. Production Environment (Netlify)

In your Netlify dashboard, go to **Site settings** → **Environment variables** and add:

```env
CLIENT_ID=your_oauth_client_id
CLIENT_SECRET=your_oauth_client_secret
REDIRECT_URI=https://your-domain.com/auth/callback
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note**: No `VITE_` prefix in production - these are server-side only.

### 3. How It Works

- **Development**: Uses `VITE_` variables for local development
- **Production**: Uses non-`VITE_` variables for server-side operations
- **Build Process**: Automatically switches between the two configurations

### 4. Why This Approach

- ✅ **Development**: Works with `npm run dev` using Vite's environment handling
- ✅ **Production**: No secrets exposed to client-side in Netlify
- ✅ **Security**: Production builds only use server-side variables
- ✅ **Flexibility**: Same codebase works in both environments

### 5. Important Notes

- Both `VITE_` and non-`VITE_` variables should have the same values
- The `VITE_` variables are only used during development
- Production builds automatically use the server-side variables
- This prevents the "Remove the secrets" error in Netlify

### 6. Redeploy

After setting up the environment variables in Netlify, trigger a new deployment. The error should be resolved.
