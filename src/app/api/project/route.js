import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { NextResponse } from 'next/server';





export async function POST(req){
    try{
        await connectToDB();
        const body = await req.json();
        const {
            name,
            description,
            priority,
            startDate,
            endDate,
            team,
            members
          } = body;

            // ✅ Validation
            if (!name || name.trim().length < 3) {
                return NextResponse.json({ success: false, message: 'name is required and must be at least 3 characters long' }, { status: 400 });
            }

            if (!description || description.trim().length < 10) {
                return NextResponse.json({ success: false, message: 'Description is required and must be at least 10 characters long' }, { status: 400 });
            }

            if (!['low', 'medium', 'high'].includes(priority)) {
                return NextResponse.json({ success: false, message: 'Priority must be low, medium, or high' }, { status: 400 });
            }

            if (!startDate || !endDate) {
                return NextResponse.json({ success: false, message: 'Start and End dates are required' }, { status: 400 });
            }

            if (new Date(startDate) > new Date(endDate)) {
                return NextResponse.json({ success: false, message: 'Start date cannot be after End date' }, { status: 400 });
            }

            if (!team || team.trim() === '') {
                return NextResponse.json({ success: false, message: 'Team is required' }, { status: 400 });
            }

            if (!Array.isArray(members) || members.length === 0) {
                return NextResponse.json({ success: false, message: 'At least one team member must be selected' }, { status: 400 });
            }

        const newProject =await Project.create({
            name: name.trim(),
            description: description.trim(),
            priority,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            team: team.trim(),
            members
        });
        return NextResponse.json({ success: true, data: newProject }, { status: 201 });

    }
    catch (error) {
        console.error('[PROJECT_POST_ERROR]', error);
        return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
    }
}

export  async function GET() {
    try{
        await connectToDB();

        const projects= await Project.find();

        return Response.json(projects); 
    }
    catch (error){
        console.error('Error fetching projects:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch projects' }),
      { status: 500 }
    );
    }
}
