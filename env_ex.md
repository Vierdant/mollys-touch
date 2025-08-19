# Environment Variables Example

This file shows what environment variables you'll need when switching to production.

## 🧪 Current Status: Testing Mode

The system is currently running in **testing mode** with fake authentication. No environment variables are required.

## 🚀 Production Environment Variables

When you're ready to switch to real OAuth authentication, create a `.env` file with:

```env
# OAuth 2.0 Configuration
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=https://your-domain.com/auth/callback

# Supabase Configuration (for other features)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 Switching to Production

1. **Update testing config:**

   ```typescript
   // src/lib/config/testing.ts
   export const TESTING_CONFIG = {
     ENABLE_FAKE_AUTH: false, // ← Change to FALSE
   };
   ```

2. **Create .env file** with your real credentials

3. **Restart development server**

4. **Test OAuth flow** with real credentials

## 📝 Notes

- **Testing mode**: No external calls, fake data, full functionality
- **Production mode**: Real OAuth, real API calls, real user data
- **Easy switch**: Just change one boolean value
- **No breaking changes**: Same UI, same functionality
