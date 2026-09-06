import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Freelancer ke saare routes protect karo
  if (pathname.startsWith("/freelancer")) {
    const accessToken = request.cookies.get("access_token")?.value;
    const role = request.cookies.get("role")?.value;

    // Login nahi hai
    if (!accessToken) {
      const loginUrl = new URL("/auth/login", request.url);

      // Login ke baad original page par wapas bhejne ke liye
      loginUrl.searchParams.set(
        "callbackUrl",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    // Freelancer role nahi hai
    if (role !== "freelancer") {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/freelancer/:path*"],
};
