import { connectToDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Task from '@/models/Task';


export async function POST(req) {
 try{
    await connectToDB();

    const res=await req.json();

    const { project, title, description, assignee, priority, dueDate } =res;

    const newTask = new Task({
        project,
        title,
        description,
        assignee, // array of ObjectIds
        priority,
        dueDate
      });
  
      await newTask.save();
  
      return NextResponse.json({ success: true, task: newTask }, { status: 201 });

    }catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
      

}
