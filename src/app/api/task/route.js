import { connectToDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Task from '@/models/Task';


export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    // If `id` and `status` are provided → update status only
    if (body.id && body.status) {
      const { id, status } = body;

      const validStatuses = ['todo', 'inprogress', 'onhold', 'completed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 });
      }

      const task = await Task.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).populate('assignee', 'firstName lastName email');

      if (!task) {
        return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: task }, { status: 200 });
    }

    // Otherwise → create a new task (original logic)
    const { project, title, description, assignee, priority, dueDate } = body;

    const newTask = new Task({
      project,
      title,
      description,
      assignee,
      priority,
      dueDate,
    });

    await newTask.save();

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    console.error('Error handling task:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json({ message: "Project ID required" }, { status: 400 });
    }

    const tasks = await Task.find({ project: projectId });
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}



