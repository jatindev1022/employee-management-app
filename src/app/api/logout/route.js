import { NextResponse } from 'next/server';

export async function POST() {
    try {
      console.log('🚀 Logout API called');
      
      const response = NextResponse.json({
        success: true,
        message: 'Logged out successfully'
      });
      
      // Clear the cookie
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
      
      console.log('✅ Logout completed');
      return response;
      
    } catch (error) {
      console.error('💥 Logout error:', error);
      return NextResponse.json(
        { message: 'Logout failed' },
        { status: 500 }
      );
    }
  }
  
