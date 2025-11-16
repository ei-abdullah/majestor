/**
 * Mock API Service
 * Simulates backend API calls for development
 * Toggle via USE_MOCKS environment variable
 */

import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  EmailVerificationResponse,
  UniversitiesWithFacultiesResponse,
} from '../schema/api-schemas';
import {
  mockUniversities,
  mockLoginResponse,
  mockSignupResponse,
  mockEmailVerificationResponse,
  simulateDelay,
  mockError,
} from './mockData';

/**
 * Mock Auth Service
 */
export const mockAuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    await simulateDelay(800);
    
    // Simulate validation
    if (!credentials.email || !credentials.password) {
      throw mockError('Email and password are required', 400);
    }
    
    // Simulate wrong credentials
    if (credentials.password === 'wrongpassword') {
      throw mockError('Invalid email or password', 401);
    }
    
    return mockLoginResponse;
  },

  signup: async (userData: SignupRequest): Promise<SignupResponse> => {
    await simulateDelay(1000);
    
    // Simulate duplicate email
    if (userData.email === 'existing@cust.pk') {
      throw mockError('Email already exists', 409);
    }
    
    return mockSignupResponse;
  },

  verifyEmail: async (token: string): Promise<EmailVerificationResponse> => {
    await simulateDelay(500);
    
    // Simulate invalid token
    if (token === 'invalid-token') {
      throw mockError('Invalid or expired verification token', 400);
    }
    
    return mockEmailVerificationResponse;
  },
};

/**
 * Mock University Service
 */
export const mockUniversityService = {
  getUniversitiesWithFaculties: async (): Promise<UniversitiesWithFacultiesResponse> => {
    await simulateDelay(600);
    return mockUniversities;
  },
};

/**
 * Main Mock API
 * Export all mock services
 */
export const mockApi = {
  auth: mockAuthService,
  university: mockUniversityService,
};

export default mockApi;
