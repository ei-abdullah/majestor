/**
 * Mock API Data
 * Realistic sample data for development without backend
 */

import type {
  UniversitiesWithFacultiesResponse,
  LoginResponse,
  SignupResponse,
} from '../schema/api-schemas';

/**
 * Mock Universities with Faculties
 */
export const mockUniversities: UniversitiesWithFacultiesResponse = [
  {
    id: 1,
    name: 'Capital University of Science and Technology',
    faculties: [
      { id: 1, name: 'Faculty of Computing', universityId: 1 },
      { id: 2, name: 'Faculty of Engineering', universityId: 1 },
      { id: 3, name: 'Faculty of Management Sciences', universityId: 1 },
      { id: 4, name: 'Faculty of Sciences', universityId: 1 },
    ],
  },
  {
    id: 2,
    name: 'National University of Sciences and Technology',
    faculties: [
      { id: 5, name: 'School of Electrical Engineering and Computer Science', universityId: 2 },
      { id: 6, name: 'School of Mechanical and Manufacturing Engineering', universityId: 2 },
      { id: 7, name: 'School of Civil and Environmental Engineering', universityId: 2 },
    ],
  },
  {
    id: 3,
    name: 'University of Engineering and Technology',
    faculties: [
      { id: 8, name: 'Faculty of Computer Science', universityId: 3 },
      { id: 9, name: 'Faculty of Electrical Engineering', universityId: 3 },
      { id: 10, name: 'Faculty of Mechanical Engineering', universityId: 3 },
    ],
  },
];

/**
 * Mock Login Response
 */
export const mockLoginResponse: LoginResponse = {
  token: 'mock-jwt-token-abc123xyz456',
  authUserDTO: {
    id: 1,
    email: 'student@cust.pk',
    username: 'testuser',
    phone: '03001234567',
    universityId: 1,
    facultyId: 1,
    role: 'STUDENT',
    verified: true,
  },
};

/**
 * Mock Signup Response
 */
export const mockSignupResponse: SignupResponse = {
  message: 'Please verify your email before logging in!. Check your inbox for verification link.',
};

/**
 * Mock Email Verification Response
 */
export const mockEmailVerificationResponse = {
  message: 'Email verified successfully!',
};

/**
 * Simulated API delay
 */
export const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Simulated error response
 */
export const mockError = (message: string, status: number = 400) => {
  return {
    message,
    status,
  };
};
