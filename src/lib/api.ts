'use client';

import { auth } from '@/lib/firebase';

/**
 * Make an authenticated API request
 * Automatically includes the Firebase ID token in the Authorization header
 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  
  const token = await currentUser.getIdToken();
  
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Hook-compatible function to get auth fetch
 * Can be used in components where useAuth is available
 */
export function createAuthFetch(getIdToken: () => Promise<string | null>) {
  return async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await getIdToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    
    return fetch(url, {
      ...options,
      headers,
    });
  };
}
