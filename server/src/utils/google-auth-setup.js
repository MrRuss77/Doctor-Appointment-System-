/**
 * One-time script to obtain a Google OAuth2 refresh token.
 *
 * Before running:
 *   1. Go to Google Cloud Console → APIs & Services → Credentials
 *   2. Edit your OAuth 2.0 Client ID
 *   3. Under "Authorized redirect URIs" add:  http://localhost:3000
 *   4. Save, then run:  node server/src/utils/google-auth-setup.js
 *
 * The browser will open automatically. After granting access, the
 * refresh token is printed in the terminal — copy it to your .env.
 */
import http from "http";
import { google } from "googleapis";
import { loadEnv } from "../config/env.js";

loadEnv();

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env first.");
  process.exit(1);
}

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}`;
const SCOPES = ["https://www.googleapis.com/auth/calendar"];

const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent"
});

console.log("\nOpening browser for Google authorization...");
console.log("If it does not open automatically, visit this URL:\n");
console.log(authUrl, "\n");

// Try to open the browser automatically
const { exec } = await import("child_process");
exec(`xdg-open "${authUrl}" || open "${authUrl}" || start "${authUrl}"`, () => {});

// Spin up a temporary server to capture the redirect
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.end(`<h2>Authorization failed: ${error}</h2><p>You can close this tab.</p>`);
    console.error("\nAuthorization was denied:", error);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.end("<h2>No code received.</h2>");
    return;
  }

  res.end("<h2>Authorization successful!</h2><p>You can close this tab and check your terminal.</p>");

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    console.log("Success! Add this to your .env file:\n");
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_CALENDAR_ID=primary\n`);
  } catch (err) {
    console.error("Failed to exchange code for tokens:", err.message);
  } finally {
    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`Waiting for Google redirect on http://localhost:${PORT} ...\n`);
});
