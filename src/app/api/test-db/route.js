// src/app/api/test-db/route.js
import { connectToDB } from '@/lib/mongodb';

export async function GET() {
  try {
    await connectToDB();
    return Response.json({ message: 'MongoDB connected successfully 🎉' });
  } catch (error) {
    return Response.json({ error: 'MongoDB connection failed' }, { status: 500 });
  }
}
