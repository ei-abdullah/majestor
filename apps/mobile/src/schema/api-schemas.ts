/**
 * API Schemas - TypeScript Types
 * Type definitions matching backend DTOs
 * 
 * Backend endpoint reference:
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/signup
 * - GET /api/v1/auth/signup/verify?token=xxx
 * - GET /api/v1/university/getWithFaculties
 */

// ============================================
// AUTH MODULE TYPES
// ============================================

/**
 * Login Request
 * Endpoint: POST /api/v1/auth/login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Signup Request
 * Endpoint: POST /api/v1/auth/signup
 */
export interface SignupRequest {
  email: string;
  password: string;
  username: string;
  phone: string; // Format: 03XXXXXXXXX (11 digits starting with 03)
  universityId: number;
  facultyId: number;
}

/**
 * Auth User DTO
 */
export interface AuthUser {
  id: number;
  email: string;
  username: string;
  phone: string;
  universityId: number;
  facultyId: number;
  role?: string;
  verified?: boolean;
}

/**
 * Login Response
 * Endpoint: POST /api/v1/auth/login
 */
export interface LoginResponse {
  token: string;
  authUserDTO: AuthUser;
}

/**
 * Signup Response
 * Endpoint: POST /api/v1/auth/signup
 */
export interface SignupResponse {
  message: string;
}

/**
 * Email Verification Response
 * Endpoint: GET /api/v1/auth/signup/verify?token=xxx
 */
export interface EmailVerificationResponse {
  message: string;
}

// ============================================
// UNIVERSITY & FACULTY MODULE TYPES
// ============================================

/**
 * Faculty DTO
 */
export interface Faculty {
  id: number;
  name: string;
  universityId?: number;
}

/**
 * University with Faculties DTO
 */
export interface UniversityWithFaculties {
  id: number;
  name: string;
  faculties: Faculty[];
}

/**
 * Universities with Faculties Response
 * Endpoint: GET /api/v1/university/getWithFaculties
 */
export type UniversitiesWithFacultiesResponse = UniversityWithFaculties[];

// ============================================
// LOST & FOUND MODULE TYPES (for future use)
// ============================================

export interface LastLocation {
  latitude: number;
  longitude: number;
  description?: string;
}

export interface LostItem {
  id: number;
  title: string;
  description: string;
  status: 'LOST' | 'FOUND' | 'PENDING';
  lastLocation?: LastLocation;
  userId: number;
  createdAt: string;
  images?: string[];
}

export interface CreateLostItemRequest {
  title: string;
  description: string;
  lastLocation?: LastLocation;
  images?: File[];
}

// ============================================
// USER MODULE TYPES (for future use)
// ============================================

export interface UpdateUserDetailsRequest {
  username?: string;
  phone?: string;
  universityId?: number;
  facultyId?: number;
}

export interface GetUserDetailsResponse extends AuthUser {
  createdAt?: string;
  updatedAt?: string;
}

// ============================================
// API ERROR RESPONSE
// ============================================

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}
