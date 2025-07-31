// Backend API route - /api/profile/route.js

import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';
import { cloudinary } from '@/lib/cloudinary';
import formidable from 'formidable';





export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: 'Invalid User ID' }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Fetch profile error:', error.message, error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDB();

    const formData = await req.formData();
    const userId = formData.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const update = {};
    const fields = ['firstName', 'lastName', 'email', 'phone', 'bio', 'department', 'position', 'location'];
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null && value !== '') {
        update[field] = value;
      }
    });

    const file = formData.get('profileImage');

    if (file && typeof file === 'object' && 'arrayBuffer' in file && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

        const uploaded = await cloudinary.uploader.upload(base64Image, {
          folder: 'profile_pics',
        });

        update.profileImage = uploaded.secure_url;

      } catch (fileError) {
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({
      error: error.message || 'Failed to update profile'
    }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Optional: Add DELETE method to handle profile image deletion
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const deleteImage = searchParams.get('deleteImage');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
    }

    await connectToDB();

    if (deleteImage === 'true') {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Delete the profile image file if it exists
      if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
        const imagePath = path.join(process.cwd(), 'public', user.profileImage);
        try {
          await fs.unlink(imagePath);
        } catch (deleteError) {
          console.warn('Could not delete image file:', deleteError.message);
        }
      }

      // Remove profileImage from user document
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $unset: { profileImage: 1 } },
        { new: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Profile image deleted successfully',
        user: updatedUser
      });
    }

    return NextResponse.json({ error: 'Invalid delete request' }, { status: 400 });

  } catch (error) {
    console.error('Profile image deletion error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to delete profile image' 
    }, { status: 500 });
  }
}