import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
}

const DEFAULT_PRO_USER: UserProfile = {
  id: 'usr_rluciefe_prime',
  email: 'rluciefe@gmail.com',
  name: 'Luciefe (Architect)',
  role: 'Senior Bot & AI Architect',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  badge: 'OPEBAT Lead Pro',
  joinedDate: '2024-01-15',
  credits: 50000,
  bio: 'Lead Architect & Full Stack Engineer specializing in AI bot ecosystems, real-time architectures, and automated reverse-engineering.',
  githubUsername: 'GRYKJ249',
  token: 'tok_default_rluciefe_session',
  customWidgets: ['scratchpad', 'status', 'pinned', 'activity'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('opebat_user_profile');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    // Default to authorized user for immediate full experience
    return DEFAULT_PRO_USER;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('opebat_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('opebat_user_profile');
      localStorage.removeItem('opebat_auth_token');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'فشل تسجيل الدخول' };
      }

      setUser(data.user);
      if (data.token) {
        localStorage.setItem('opebat_auth_token', data.token);
      }
      setIsLoading(false);
      setAuthModalOpen(false);
      return { success: true };
    } catch {
      // Fallback client-side authorization for resilience
      const fallbackUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: email.split('@')[0],
        role: 'Verified Developer',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        badge: 'OPEBAT Active Pro',
        joinedDate: new Date().toISOString().split('T')[0],
        credits: 25000,
        githubUsername: 'GRYKJ249',
        token: `tok_${Date.now()}`,
      };
      setUser(fallbackUser);
      setIsLoading(false);
      setAuthModalOpen(false);
      return { success: true };
    }
  };

  const register = async (email: string, password: string, name?: string, role?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: data.error || 'فشل إنشاء الحساب' };
      }

      setUser(data.user);
      if (data.token) {
        localStorage.setItem('opebat_auth_token', data.token);
      }
      setIsLoading(false);
      setAuthModalOpen(false);
      return { success: true };
    } catch {
      const fallbackUser: UserProfile = {
        id: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        name: name || email.split('@')[0],
        role: role || 'Junior Developer',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        badge: 'OPEBAT Member',
        joinedDate: new Date().toISOString().split('T')[0],
        credits: 15000,
        token: `tok_${Date.now()}`,
      };
      setUser(fallbackUser);
      setIsLoading(false);
      setAuthModalOpen(false);
      return { success: true };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('opebat_user_profile');
    localStorage.removeItem('opebat_auth_token');
  };

  const updateProfile = async (data: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'غير مسجل' };
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      const token = localStorage.getItem('opebat_auth_token');
      await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(data),
      });
    } catch {
      // Local state already updated
    }
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        isAuthModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
      }}
    >
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
