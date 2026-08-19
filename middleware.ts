import { NextRequest, NextResponse } from "next/server";

// Password-gates PREVIEW deployments only (branch/PR previews created by
// `vercel` without --prod). Production (touchdownfreediving.com) is never
// affected, even if this file is left in place long-term.
//
// Every response here is marked no-store: preview pages must never be
// cached at Vercel's edge, or an unauthenticated visitor could be served a
// previously-cached page without the password check ever running again.
export function middleware(request: NextRequest) {
  if (process.env.VERCEL_ENV !== "preview") {
    return NextResponse.next();
  }

  const password = process.env.PREVIEW_PASSWORD;
  if (!password) {
    // No password configured for this environment - fail open rather than
    // accidentally locking everyone out of every preview.
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.slice(6);
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    const suppliedPassword =
      separatorIndex === -1 ? "" : decoded.slice(separatorIndex + 1);

    if (suppliedPassword === password) {
      const response = NextResponse.next();
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      return response;
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Touchdown Preview"',
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

export const config = {
  // Run on everything except static assets, so both pages and /studio
  // stay behind the gate on preview deployments.
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
