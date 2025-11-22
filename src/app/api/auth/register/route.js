// app/api/auth/register/route.js (App Router)
// or pages/api/auth/register.js (Pages Router)

import { hash } from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb'; // Adjust import path as needed

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return Response.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return Response.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase(); // Destructure to get the db object
    const users = db.collection('users');

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return Response.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const result = await users.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      isFirstLogin: true,
    });

    return Response.json(
      { 
        message: 'User created successfully',
        userId: result.insertedId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// For Pages Router, use this format instead:
/*
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;
    
    // ... same logic as above ...
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertedId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
*/