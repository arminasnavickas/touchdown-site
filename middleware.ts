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
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Touchdown Preview</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #003354;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 24px;
  }
  form {
    background: #ffffff;
    border-radius: 12px;
    padding: 32px 28px;
    width: 100%;
    max-width: 360px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }
  h1 {
    margin: 0 0 8px;
    font-size: 20px;
    color: #003354;
  }
  p.sub {
    margin: 0 0 20px;
    font-size: 14px;
    color: #55677a;
  }
  input[type="password"] {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 16px;
  }
  input[type="password"]:focus {
    outline: none;
    border-color: #f97316;
  }
  button {
    width: 100%;
    padding: 12px 14px;
    border: none;
    border-radius: 8px;
    background: #f97316;
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  p.error {
    color: #dc2626;
    font-size: 13px;
    margin: -10px 0 16px;
  }
</style>
</head>
<body>
  <form method="POST" action="${LOGIN_PATH}">
    <h1>Touchdown Preview</h1>
    <p class="sub">This is a private preview. Enter the password to continue.</p>
    ${failed ? '<p class="error">Wrong password — try again.</p>' : ""}
    <input type="hidden" name="redirectTo" value="${escapeHtml(redirectTo)}" />
    <input type="password" name="password" placeholder="Password" autofocus required />
    <button type="submit">Enter</button>
  </form>
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
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
