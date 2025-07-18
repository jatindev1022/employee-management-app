import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';


export async function POST(req){
    try{
        const{ email,password }= await req.json();
        if(!email || !password){
            return Response.json({ message: 'Email and password are required' }, { status: 400 });
        }
    
        await connectToDB();

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return Response.json({ message: 'User already exists' }, { status: 400 });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword });
        return Response.json({ message: 'User created successfully' }, { status: 201 });
    }
    catch (error) {
        console.error('Register error:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}