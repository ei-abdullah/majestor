/**
 * Auth React Query Hooks
 * Custom hooks for authentication with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../stores/queryClient';
import { authService } from '../services/auth.service';
import { mockAuthService } from '../mocks/mockApi';
import { ENV } from '../constants/env';
import type { LoginRequest, SignupRequest } from '../schema/api-schemas';

// Use mock or real service based on environment
const service = ENV.USE_MOCKS ? mockAuthService : authService;

// Log which service is being used
console.log('🔧 Auth Service Config:', {
  USE_MOCKS: ENV.USE_MOCKS,
  API_BASE_URL: ENV.API_BASE_URL,
  service: ENV.USE_MOCKS ? 'MOCK' : 'REAL',
});

/**
 * Login Mutation Hook
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => service.login(credentials),
    onSuccess: (data) => {
      // Invalidate auth queries on successful login
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.isAuthenticated });
    },
  });
};

/**
 * Signup Mutation Hook
 */
export const useSignup = () => {
  return useMutation({
    mutationFn: (userData: SignupRequest) => service.signup(userData),
  });
};

/**
 * Email Verification Mutation Hook
 */
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => service.verifyEmail(token),
  });
};

/**
 * Logout Mutation Hook
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });
};

/**
 * Check if user is authenticated
 */
export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: queryKeys.auth.isAuthenticated,
    queryFn: () => authService.isAuthenticated(),
    staleTime: Infinity, // Never auto-refetch
  });
};
