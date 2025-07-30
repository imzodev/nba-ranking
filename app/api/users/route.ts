import { NextResponse } from 'next/server';
import { UserService } from '@/lib/services/userService';
import { isValidEmail, isValidName } from '@/lib/utils/validation';
import { headers } from 'next/headers';

/**
 * POST /api/users
 * Create or update a user
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;
    
    // Validate email and name
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    if (!name || !isValidName(name)) {
      return NextResponse.json(
        { error: 'Invalid name' },
        { status: 400 }
      );
    }
    
    // Get IP address from headers
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    // Create or update user
    const userService = new UserService();
    const { data: user, error } = await userService.createOrUpdateUser(email, name, ipAddress);
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to create or update user', details: error },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error creating or updating user:', error);
    
    return NextResponse.json(
      { error: 'Failed to create or update user', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/users
 * Get a user by email
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    const userService = new UserService();
    const user = await userService.getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}
