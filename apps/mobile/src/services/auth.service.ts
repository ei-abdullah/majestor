/**
 * Auth Service
 * Handles authentication API calls
 * 
 * Backend endpoints:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/signup
 * - GET /api/v1/auth/signup/verify?token=xxx
 */

import { api, tokenManager } from './apiClient';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  EmailVerificationResponse,
} from '../schema/api-schemas';

/**
 * Login user
 * @param credentials - Email and password
 * @returns Auth response with token and user data
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/v1/auth/login', credentials);
  
  // Store token securely
  if (response.data.token) {
    await tokenManager.setToken(response.data.token);
  }
  
  return response.data;
};

/**
 * Signup new user
 * @param userData - User registration data
 * @returns Signup response with verification message
 */
export const signup = async (userData: SignupRequest): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>('/api/v1/auth/signup', userData);
  return response.data;
};

/**
 * Verify email with token
 * @param token - Email verification token
 * @returns Verification response
 */
export const verifyEmail = async (token: string): Promise<EmailVerificationResponse> => {
  const response = await api.get<EmailVerificationResponse>(
    `/api/v1/auth/signup/verify?token=${token}`
  );
  return response.data;
};

/**
 * Logout user (clear stored token)
 */
export const logout = async (): Promise<void> => {
  await tokenManager.clearToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await tokenManager.getToken();
  return !!token;
};

export const authService = {
  login,
  signup,
  verifyEmail,
  logout,
  isAuthenticated,
};

export default authService;
