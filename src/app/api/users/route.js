import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

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
