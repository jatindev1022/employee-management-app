import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(req) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const team = searchParams.get('team'); // Get ?team=backend

        let query = {};
        if (team) {
            query.team = team;
        }

        const users = await User.find(query).lean();

        const teamMap = {};

        users.forEach(user => {
            if (!user.team) return;
            if (!teamMap[user.team]) teamMap[user.team] = [];
            teamMap[user.team].push({
                _id: user._id,
                name: `${user.firstName} ${user.lastName}`,
              });
        });

        return NextResponse.json(teamMap, { status: 200 });

    } catch (error) {
        console.error('❌ Error fetching team members:', error);
        return NextResponse.json({ message: 'Failed to fetch teams' }, { status: 500 });
    }
}

