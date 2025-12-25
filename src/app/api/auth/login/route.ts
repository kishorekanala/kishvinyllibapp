import { NextRequest, NextResponse } from 'next/server';
import { validateUserCredentials, createUser } from '@/lib/auth';
import { LoginPayload } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body: LoginPayload = await req.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate user credentials
    const user = await validateUserCredentials(body.email, body.password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to login' },
      { status: 500 }
    );
  }
}
