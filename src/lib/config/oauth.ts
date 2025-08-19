// OAuth 2.0 Configuration
export const OAUTH_CONFIG = {
  // Authorization endpoint
  AUTHORIZATION_URL: "https://ucp.gta.world/oauth/authorize",

  // Token endpoint
  TOKEN_URL: "https://ucp.gta.world/oauth/token",

  // User info endpoint
  USER_INFO_URL: "https://ucp.gta.world/api/user",

  // Profile creation endpoint
  PROFILE_CREATION_URL: "https://ucp.gta.world/api/user/profile",

  // OAuth parameters
  RESPONSE_TYPE: "code",
  SCOPE: "", // Add any required scopes here

  // Cookie settings - these are defaults, can be overridden
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax" as const,
    maxAge: 86400, // 24 hours default for better user experience
  },
};

// Helper function to build authorization URL
export function buildAuthorizationUrl(
  clientId: string,
  redirectUri: string,
): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: OAUTH_CONFIG.RESPONSE_TYPE,
    scope: OAUTH_CONFIG.SCOPE,
  });

  return `${OAUTH_CONFIG.AUTHORIZATION_URL}?${params.toString()}`;
}
