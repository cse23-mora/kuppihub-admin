'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithRedirect, 
  getRedirectResult,
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin emails - can be configured via environment variable
const getAdminEmails = (): string[] => {
  const envEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (envEmails) {
    return envEmails.split(',').map(email => email.trim().toLowerCase());
  }
  return [];
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkIsAdmin = (email: string | null): boolean => {
    if (!email) return false;
    const adminEmails = getAdminEmails();
    return adminEmails.includes(email.toLowerCase());
  };

  useEffect(() => {
    // Handle redirect result when returning from Google sign-in
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const isAdmin = checkIsAdmin(result.user.email);
          if (!isAdmin) {
            await firebaseSignOut(auth);
            setError('Access denied. You are not authorized as an admin.');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Redirect result error:', error);
        setError('Failed to sign in. Please try again.');
      }
    };

    handleRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const isAdmin = checkIsAdmin(firebaseUser.email);
        
        if (!isAdmin) {
          // Not an admin, sign them out
          await firebaseSignOut(auth);
          setUser(null);
          setError('Access denied. You are not authorized as an admin.');
        } else {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            isAdmin: true,
          });
          setError(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      await signInWithRedirect(auth, googleProvider);
      // The result will be handled in the useEffect when redirected back
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      setError('Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        return await currentUser.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, error, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
