/**
 * Zod Validation Schemas
 * Client-side form validation using zod
 * 
 * Matches backend validation rules:
 * - Email: valid email format
 * - Password: required, min length
 * - Username: 2-20 characters
 * - Phone: 03XXXXXXXXX format (11 digits)
 */

import { z } from 'zod';

// ============================================
// AUTH VALIDATION SCHEMAS
// ============================================

/**
 * Login Form Schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Signup Form Schema
 */
export const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address')
    .refine(
      (email) => {
        // Accept both university emails (@cust.pk) and gmail for testing
        return email.endsWith('@cust.pk') || email.endsWith('@gmail.com');
      },
      { message: 'Email must be a valid university email (@cust.pk) or gmail for testing' }
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^03[0-9]{9}$/, 'Phone number must be in format 03XXXXXXXXX'),
  universityId: z
    .number()
    .positive('Please select a university'),
  facultyId: z
    .number()
    .positive('Please select a faculty'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// ============================================
// LOST & FOUND VALIDATION SCHEMAS
// ============================================

/**
 * Create Lost Item Schema
 */
export const createLostItemSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  lastLocation: z.object({
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().optional(),
  }).optional(),
});

export type CreateLostItemFormData = z.infer<typeof createLostItemSchema>;

// ============================================
// USER PROFILE VALIDATION SCHEMAS
// ============================================

/**
 * Update User Profile Schema
 */
export const updateUserProfileSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'Username must be less than 20 characters')
    .optional(),
  phone: z
    .string()
    .regex(/^03[0-9]{9}$/, 'Phone number must be in format 03XXXXXXXXX')
    .optional(),
  universityId: z.number().positive().optional(),
  facultyId: z.number().positive().optional(),
});

export type UpdateUserProfileFormData = z.infer<typeof updateUserProfileSchema>;
