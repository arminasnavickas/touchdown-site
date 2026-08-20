import { NextRequest, NextResponse } from "next/server";

// Password-gates PREVIEW deployments only (branch/PR previews created by
// `vercel` without --prod). Production (touchdownfreediving.com) is never
// affected, even if this file is left in place long-term.
//
// Uses a cookie + plain HTML login form instead of HTTP Basic Auth. Basic
// Auth relies on the browser showing its own native username/password
// dialog — in-app browsers (Facebook Messenger, Instagram, etc.) often
// don't implement that dialog at all, and just show a dead-end
// "Authentication required" page with no way to type a password. A normal
// HTML form works identically everywhere, including inside those in-app
// browsers, since it's just a web page.
//
// Every response here is marked no-store: preview pages must never be
// cached at Vercel's edge, or a visitor could be served a previously
// cached page without the password check ever running again.

const COOKIE_NAME = "preview_auth";
const LOGIN_PATH = "/preview-login";
const NO_STORE = "no-store, no-cache, must-revalidate";

export async function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.next();
  }

  const password = process.env.PREVIEW_PASSWORD;
  if (!password) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;

  // Handle the login form submission.
  if (pathname === LOGIN_PATH && request.method === "POST") {
    const form = await request.formData();
    const supplied = form.get("password");
    const redirectTo = safeRedirect(form.get("redirectTo"));

    if (supplied === password) {
      const response = NextResponse.redirect(new URL(redirectTo, request.url));
      response.cookies.set(COOKIE_NAME, password, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      response.headers.set("Cache-Control", NO_STORE);
      return response;
    }

    return loginPage(redirectTo, true);
  }

  // Already authenticated via cookie.
  if (request.cookies.get(COOKIE_NAME)?.value === password) {
    const response = NextResponse.next();
    response.headers.set("Cache-Control", NO_STORE);
    return response;
  }

  // Not authenticated: show the login form, remembering where they were
  // trying to go so we can send them there after a correct password.
  return loginPage(pathname === LOGIN_PATH ? "/" : pathname + search, false);
}

function safeRedirect(value: FormDataEntryValue | null): string {
  const path = typeof value === "string" ? value : "/";
  // Only ever redirect to a same-site path, never an absolute/external URL.
  return path.startsWith("/") && !path.startsWith("//") ? path : "/";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loginPage(redirectTo: string, failed: boolean): NextResponse {
  // Matches the site's own design tokens (tailwind.config.ts) and mirrors
  // the booking modal's card treatment (dark header strip + white logo,
  // white body) so the gate feels like part of the site, not a generic
  // auth wall. Font and logo are loaded from /fonts and /images, which are
  // carved out of the middleware matcher below so they load even before
  // the visitor is authenticated.
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Touchdown Preview</title>
<style>
  @font-face {
    font-family: "Switzer";
    src: url("/fonts/Switzer-Regular.woff2") format("woff2");
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Switzer";
    src: url("/fonts/Switzer-Medium.woff2") format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: "Switzer";
    src: url("/fonts/Switzer-Light.woff2") format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #003354;
    font-family: "Switzer", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 24px;
  }
  .card {
    background: #ffffff;
    border-radius: 8px;
    width: 100%;
    max-width: 380px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }
  .card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #023048;
    padding: 40px 32px;
  }
  .card-header img {
    height: 24px;
    width: auto;
  }
  form {
    padding: 32px 28px 36px;
  }
  h1 {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 300;
    letter-spacing: -0.01em;
    color: #023048;
  }
  p.sub {
    margin: 0 0 20px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(2, 48, 72, 0.7);
  }
  input[type="password"] {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(2, 48, 72, 0.2);
    border-radius: 6px;
    font-family: inherit;
    font-size: 16px;
    color: #023048;
    margin-bottom: 16px;
  }
  input[type="password"]::placeholder {
    color: rgba(2, 48, 72, 0.4);
  }
  input[type="password"]:focus {
    outline: none;
    border-color: #00bfff;
  }
  button {
    width: 100%;
    padding: 14px 16px;
    border: none;
    border-radius: 6px;
    background: #00bfff;
    color: #ffffff;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  button:hover {
    background: #65cee6;
    color: #023048;
  }
  p.error {
    color: #dc2626;
    font-size: 13px;
    margin: -8px 0 16px;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="card-header">
      <img src="/images/logo-white.svg" alt="Touchdown" />
    </div>
    <form method="POST" action="${LOGIN_PATH}">
      <h1>Private preview</h1>
      <p class="sub">This is a private preview. Enter the password to continue.</p>
      ${failed ? '<p class="error">Wrong password — try again.</p>' : ""}
      <input type="hidden" name="redirectTo" value="${escapeHtml(redirectTo)}" />
      <input type="password" name="password" placeholder="Password" autofocus required />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;

  // Serving this as 200 (not 401) is deliberate: since there's no
  // WWW-Authenticate challenge involved anymore, a 401 here just means
  // "not-quite-normal response to a page navigation" to some browsers/
  // security layers, which can behave unpredictably. Nothing protected is
  // ever in this response body regardless of status code, so 200 is both
  // simpler and more compatible.
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": NO_STORE,
    },
  });
}

export const config = {
  // /fonts and the logo files stay ungated so the login page itself can
  // render with the site's real font and branding before anyone has
  // authenticated. Everything else — including the rest of /images — is
  // still gated as before.
  matcher:
    "/((?!_next/static|_next/image|favicon.ico|fonts/|images/logo(?:-white)?\\.svg).*)",
};
