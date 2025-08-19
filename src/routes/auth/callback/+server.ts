// src/routes/auth/callback/+server.ts
import { json, redirect } from "@sveltejs/kit";
import axios from "axios";
import { OAUTH_CONFIG } from "../../../lib/config/oauth";

export async function GET({ url, cookies }) {
  const code = url.searchParams.get("code");
  if (!code) return json({ error: "Missing code" }, { status: 400 });

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post(OAUTH_CONFIG.TOKEN_URL, null, {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri:
          process.env.REDIRECT_URI || "https://your-domain.com/auth/callback",
        code,
      },
    });

    // Set the access token in an HTTP-only, secure cookie
    const cookieOptions = {
      ...OAUTH_CONFIG.COOKIE_OPTIONS,
      maxAge: data.expires_in || OAUTH_CONFIG.COOKIE_OPTIONS.maxAge,
      // Ensure the cookie is secure in production
      secure: process.env.NODE_ENV === "production",
      // Make it HTTP-only for security
      httpOnly: true,
      // Set sameSite to lax for better security
      sameSite: "lax" as const,
      // Set path to root
      path: "/",
    };

    cookies.set("access_token", data.access_token, cookieOptions);

    // Redirect back to the application
    // The frontend will handle checking authentication status
    throw redirect(302, "/");
  } catch (err: any) {
    console.error("Token exchange failed:", err);

    // If it's a redirect, re-throw it
    if (err.status === 302) {
      throw err;
    }

    return json({ error: "Token exchange failed" }, { status: 500 });
  }
}
