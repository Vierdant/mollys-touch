# OAuth 2.0 Authentication Setup

This document explains how the OAuth 2.0 authentication system works in Molly's Touch and how to set it up.

## Overview

The application now uses OAuth 2.0 for user authentication with GTA World. Users sign in with a single button and are redirected to the OAuth provider (ucp.gta.world) for authentication. After successful authentication, the system retrieves user data including multiple characters and allows users to manage profiles for each character.

## OAuth Flow

1. **User clicks Sign In**: User clicks the "Sign In with GTA World" button
2. **Redirect to OAuth provider**: User is redirected to `https://ucp.gta.world/oauth/authorize`
3. **User authenticates**: User logs in with the OAuth provider
4. **Callback with code**: OAuth provider redirects back to `/auth/callback` with an authorization code
5. **Token exchange**: Server exchanges the code for an access token
6. **Session creation**: Access token is stored in an HTTP-only cookie
7. **Character data retrieval**: System fetches user data including all characters
8. **Profile management**: Users can manage profiles for each character (phone, routing, address, Discord)

## User Data Structure

The system receives user data in this format:
```json
{
  "user": {
    "id": 1,
    "username": "TestUser",
    "confirmed": 1,
    "role": {
      "id": 585,
      "user_id": 1,
      "role_id": "Manager",
      "server": 0
    },
    "character": [
      {
        "id": 425345,
        "memberid": 1,
        "firstname": "Testttt",
        "lastname": "Testiti"
      }
      // ... more characters
    ]
  }
}
```

## Character Profile Management

- Each character gets a default profile with empty fields
- Users can edit: phone number, routing number, address, Discord
- Only one character profile can be active at a time
- Profile data is stored locally in localStorage
- Active profile determines which character's data is used throughout the app

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# OAuth 2.0 Configuration
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=https://your-domain.com/auth/callback

# Supabase Configuration (for other features)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Configuration

The OAuth configuration is centralized in `src/lib/config/oauth.ts`. This file contains:

- Authorization endpoint URLs
- Token endpoint URLs
- User info endpoints
- Cookie settings
- Helper functions for building authorization URLs

## API Endpoints

### `/auth/callback`
- Handles the OAuth callback
- Exchanges authorization code for access token
- Sets the access token in an HTTP-only cookie
- Redirects user back to the application

### `/api/user`
- `GET`: Fetches user data using the access token
- Returns user information including all characters

## Frontend Changes

### Sign In Page (`/login`)
- Single button to authenticate with GTA World
- No forms or user input required
- Clean, simple interface

### Manage Profiles Page (`/profiles`)
- Grid view of all character profiles
- Edit profile details (phone, routing, address, Discord)
- Set active profile
- Only accessible to authenticated users

### Header Component
- Shows username and active profile phone number
- "Manage Profiles" button in dropdown menu
- "Sign In" button for unauthenticated users

### Auth Service
- `signIn()` method redirects to OAuth
- `getCurrentUser()` fetches user data using token
- `logout()` clears tokens and resets the auth store

### Auth Store
- Stores user data and active character profile
- Manages authentication state
- Handles profile switching

## Deployment Notes

When deploying to Netlify:

1. Set the environment variables in Netlify's dashboard
2. Update the `REDIRECT_URI` to match your production domain
3. Ensure the callback URL is whitelisted with your OAuth provider
4. The server functions will automatically be converted to Netlify functions

## Security Considerations

- Access tokens are stored in HTTP-only cookies
- Cookies use `sameSite: 'lax'` for security
- Secure cookies are enabled in production
- Tokens have expiration times set by the OAuth provider
- Profile data is stored locally (consider encryption for sensitive data)

## Testing

To test the OAuth flow:

1. Set up your environment variables
2. Start the development server
3. Navigate to `/login`
4. Click "Sign In with GTA World"
5. You should be redirected to the OAuth provider
6. After authentication, you'll be redirected back to the application
7. Navigate to `/profiles` to manage character profiles

## Troubleshooting

### Common Issues

1. **Redirect URI mismatch**: Ensure the redirect URI in your OAuth provider matches your environment variable
2. **Missing environment variables**: Check that all required environment variables are set
3. **CORS issues**: Ensure your OAuth provider allows requests from your domain
4. **Token exchange failures**: Check that your client ID and secret are correct

### Debug Mode

Enable debug logging by checking the browser console and server logs for detailed error messages.
