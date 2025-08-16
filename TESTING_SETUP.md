# Testing Setup Guide

This guide explains how to test the authentication system without having real OAuth credentials.

## 🧪 Testing Mode (Default)

The system is currently configured for **testing mode** by default. This means:

- ✅ No real OAuth calls are made
- ✅ Fake user data is used
- ✅ **Profiles are stored in Supabase** (real database)
- ✅ All functionality can be tested locally
- ✅ No external OAuth API calls required

## 🔧 How to Switch Between Testing and Production

### Testing Mode (Current)
```typescript
// src/lib/config/testing.ts
export const TESTING_CONFIG = {
  // Set this to true to enable fake authentication for testing
  ENABLE_FAKE_AUTH: true,  // ← Currently TRUE for testing
  // ... rest of config
};
```

### Production Mode
```typescript
// src/lib/config/testing.ts
export const TESTING_CONFIG = {
  // Set this to false to enable real OAuth authentication
  ENABLE_FAKE_AUTH: false,  // ← Change to FALSE for production
  // ... rest of config
};
```

## 🗄️ Supabase Setup Required

**Important**: Even in testing mode, you need a Supabase database for profile storage.

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Get your project URL and anon key

### 2. Set Environment Variables
Create a `.env` file with your Supabase credentials:
```env
# Supabase Configuration (required for testing and production)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migration
In your Supabase SQL editor, run the migration from `supabase_migration.sql`:
- This creates the `profiles` table
- Sets up proper permissions and indexes
- Enables Row Level Security

## 🚀 Testing the System

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Navigate to `/login`
- Click "Sign In with GTA World"
- You'll see a 1-second delay (simulating real auth)
- Then you'll be redirected to the home page

### 3. Test Profile Management
- Click your profile dropdown in the header
- Click "Manage Profiles"
- You'll see all 7 test characters
- **Profiles are automatically created in Supabase**
- Edit profiles, set active profiles, etc.

### 4. Test All Features
- ✅ Authentication flow
- ✅ Character profile creation in Supabase
- ✅ Profile editing and saving to database
- ✅ Active profile switching
- ✅ Data persistence (Supabase)
- ✅ Header updates
- ✅ Navigation

## 🔄 Switching to Production

When you're ready to deploy with real OAuth:

### 1. Update Testing Config
```typescript
// src/lib/config/testing.ts
export const TESTING_CONFIG = {
  ENABLE_FAKE_AUTH: false,  // ← Change to FALSE
  // ... rest of config
};
```

### 2. Set OAuth Environment Variables
```env
# OAuth 2.0 Configuration
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=https://your-domain.com/auth/callback

# Supabase Configuration (keep these)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Deploy
The system will automatically use real OAuth authentication while keeping Supabase for profile storage.

## 🧹 Cleaning Up Test Data

When switching to production, you may want to clear test data:

```sql
-- In Supabase SQL editor
DELETE FROM public.profiles;
```

## 🔍 What You Can Test Right Now

### Authentication Flow
- Sign in button works
- Loading states display correctly
- Redirect to home page after "authentication"

### Profile Management
- All 7 test characters are displayed
- **Profiles are automatically created in Supabase**
- Edit profile information (saves to database)
- Set active profiles
- Data persists between sessions
- Active profile updates header

### Navigation
- Header shows username and active profile
- Profile dropdown works
- Manage Profiles button navigates correctly
- Back to Home button works

### Data Persistence
- **Profiles save to Supabase database**
- Active profile selection persists
- Logout clears local state but keeps database data

## 🐛 Troubleshooting Testing Mode

### If profiles don't load:
1. Check browser console for errors
2. Verify Supabase credentials in `.env`
3. Ensure `profiles` table exists in Supabase
4. Check Supabase logs for errors

### If authentication doesn't work:
1. Verify `ENABLE_FAKE_AUTH: true` in testing config
2. Check browser console for "🔧 Using FAKE authentication" message
3. Ensure Supabase environment variables are set

### If data doesn't persist:
1. Check Supabase connection
2. Verify RLS policies are set correctly
3. Check browser console for Supabase errors

## 📝 Notes

- **Testing mode**: No OAuth calls, fake user data, **real Supabase database**
- **Production mode**: Real OAuth, real API calls, **same Supabase database**
- **Profiles are always stored in Supabase** (both modes)
- **Easy to switch**: Just change one boolean value
- **No OAuth setup required** for testing, but Supabase is required

## 🎯 Next Steps

1. **Set up Supabase** and run the migration
2. **Test everything thoroughly** in testing mode
3. **Fix any issues** you find
4. **Get your OAuth credentials** from GTA World
5. **Switch to production mode** when ready
6. **Deploy your fully tested system**

This approach gives you a complete, functional website with real database persistence that you can use to get OAuth approval from GTA World, while allowing full testing of all features locally! 🚀
