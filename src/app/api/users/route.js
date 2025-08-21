import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);

    const ids = searchParams.getAll('_id'); // Collects all _id params
    const team = searchParams.get('team');
    const position = searchParams.get('position');
    const search = searchParams.get('search');

    const query = {};

    // Handle user IDs if provided
    if (ids && ids.length > 0) {
      const idArray = ids.map(id => new mongoose.Types.ObjectId(id.trim()));
      query._id = { $in: idArray };
    }

    if (team) query.team = team;
    if (position) query.position = position;

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).lean();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    console.log('Incoming data:', data);

    const { firstName, lastName, email, phone, team, position } = data;

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Name and Email required' }, { status: 400 });
    }

    await connectToDB();
    console.log('DB connected');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    console.log('Generated password:', randomPassword);

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    console.log('Password hashed');

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phone,
      team,
      position,
      password: hashedPassword,
    });
    console.log('User created:', newUser);

    return NextResponse.json({
      success: true,
      message: 'Member added successfully',
      user: newUser,
      tempPassword: randomPassword,
    });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create member' }, { status: 500 });
  }
}

