/**
 * Auth Context
 * Provides authentication state and methods across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { tokenManager } from '../services/apiClient';
import type { AuthUser } from '../schema/api-schemas';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await tokenManager.getToken();
      if (token) {
        // Token exists - user is authenticated
        // TODO: Optionally fetch user details from /api/user/me endpoint
        setUser({
          id: 0, // Placeholder - will be replaced by actual user fetch
          email: '',
          username: '',
          phone: '',
          universityId: 0,
          facultyId: 0,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string, userData: AuthUser) => {
    await tokenManager.setToken(token);
    setUser(userData);
  };

  const logout = async () => {
    await tokenManager.clearToken();
    setUser(null);
  };

  const updateUser = (userData: AuthUser) => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use Auth Context
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
