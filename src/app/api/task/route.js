import { connectToDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import Task from '@/models/Task';


export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();

    // ✅ Case 1: Update only status
    if (body._id && body.status && Object.keys(body).length === 2) {
      const { _id, status } = body;
      const validStatuses = ["todo", "inprogress", "onhold", "completed"];

      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status value" },
          { status: 400 }
        );
      }

      const task = await Task.findByIdAndUpdate(
        _id,
        { status },
        { new: true, runValidators: true }
      ).populate("assignee", "firstName lastName email");

      return task
        ? NextResponse.json({ success: true, task }, { status: 200 }) // 👈 unified
        : NextResponse.json(
            { success: false, error: "Task not found" },
            { status: 404 }
          );
    }

    // ✅ Case 2: Full update
    if (body._id) {
      const { _id, ...updateData } = body;
      const task = await Task.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true }
      ).populate("assignee", "firstName lastName email");

      return task
        ? NextResponse.json({ success: true, task }, { status: 200 }) // 👈 unified
        : NextResponse.json(
            { success: false, error: "Task not found" },
            { status: 404 }
          );
    }

    // ✅ Case 3: Create new task (only if NO _id provided)
    if (!body._id) {
      const { project, title, description, assignee, priority, dueDate } = body;

      if (!project || !title || !description) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

      const newTask = new Task({
        project,
        title,
        description,
        assignee,
        priority,
        dueDate,
      });
      await newTask.save();

      return NextResponse.json({ success: true, task: newTask }, { status: 201 }); // 👈 unified
    }

    // ❌ If _id exists but no match
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error handling task:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
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

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId"); // get ID from query

    if (!taskId) return NextResponse.json({ success: false, error: "Task ID required" }, { status: 400 });

    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });

    return NextResponse.json({ success: true, taskId }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}