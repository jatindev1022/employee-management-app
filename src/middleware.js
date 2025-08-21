import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Get token from cookies
  const token = req.cookies.get('token')?.value;

  if (!token) {
    // Redirect to login WITHOUT query param
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.set("fromMiddleware", "true");
    return response;
    
  }

  try {
    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch {
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    return response;
  }
}
// Protect dashboard routes
export const config = {
  matcher: ['/dashboard/:path*'],
};
