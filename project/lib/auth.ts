import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const TOKEN_NAME = 'auth-token';
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthSession {
  user: AuthUser;
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

// Remove auth cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

// Get session from cookies (for server components/API routes)
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    
    if (!token) {
      return null;
    }

    const user = verifyToken(token);
    if (!user) {
      return null;
    }

    return { user };
  } catch {
    return null;
  }
}

// Get session from request (for API routes with NextRequest)
export function getSessionFromRequest(req: NextRequest): AuthSession | null {
  try {
    const token = req.cookies.get(TOKEN_NAME)?.value;
    
    if (!token) {
      return null;
    }

    const user = verifyToken(token);
    if (!user) {
      return null;
    }

    return { user };
  } catch {
    return null;
  }
}

// Login function
export async function loginUser(email: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    await connectToDatabase();
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return { success: false, error: 'Invalid password' };
    }

    const authUser: AuthUser = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return { success: true, user: authUser };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Authentication failed' };
  }
}

// Check if user is admin
export async function requireAdmin(): Promise<AuthSession | null> {
  const session = await getSession();
  if (!session || session.user.role !== 'admin') {
    return null;
  }
  return session;
}
