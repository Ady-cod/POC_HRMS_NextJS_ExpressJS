import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface UserInfo {
  employeeId: string;
  role: string;
  fullName: string;
  email: string;
}

export function decodeJWT(token: string): UserInfo | null {
  try {
    // Decode JWT payload (this is just base64 decoding, not verification)
    // Note: For security, actual verification should be done on the backend
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    return {
      employeeId: payload.employeeId,
      role: payload.role,
      fullName: payload.fullName,
      email: payload.email,
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export function getCurrentUser(): UserInfo | null {
  try {
    const token = cookies().get('token')?.value;
    if (!token) {
      return null;
    }
    return decodeJWT(token);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// For testing purposes - allows access without authentication
export function getOptionalAuth(): UserInfo | null {
  const user = getCurrentUser();
  if (!user) {
    console.log("User not found - proceeding with guest access for testing");
    return null;
  }
  return user;
}

// Original requireAuth function (currently disabled for testing)
export function requireAuth(): UserInfo {
  const user = getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

// Helper function to get user display name with fallback
export function getUserDisplayName(user: UserInfo | null): string {
  if (!user) return 'User';
  return user.fullName?.trim() || 'User';
} 