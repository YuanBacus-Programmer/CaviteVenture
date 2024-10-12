// context/AuthContext.tsx
"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface User {
  profilePicture: string;
  firstname: string;
  lastname: string;
  birthday: string;
  location: string;
  gender: string;
  role: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

interface SignInResponse {
  token: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get<User>('/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          setIsAuthenticated(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await axios.post<SignInResponse>('/api/signin', { email, password });
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        router.push('/profile');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const signOut = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
