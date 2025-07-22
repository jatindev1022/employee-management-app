

// app/api/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDB } from '@/lib/mongodb'; // ✅ Use named import

import User from '@/models/User';



export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
