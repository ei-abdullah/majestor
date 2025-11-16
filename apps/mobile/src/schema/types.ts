/**
 * Application-wide TypeScript Types
 * Common types used across the app
 */

// ============================================
// NAVIGATION TYPES
// ============================================

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  Login: undefined;
  CreateAccount: { role: UserRole };
  EmailVerification: { email: string };
};

export type MainTabParamList = {
  Home: undefined;
  Discussions: undefined;
  Carpool: undefined;
  Accommodation: undefined;
  Events: undefined;
  LostFound: undefined;
  Documents: undefined;
  Profile: undefined;
};

// ============================================
// USER & ROLE TYPES
// ============================================

export type UserRole = 'student' | 'accommodator' | 'faculty';

export interface User {
  id: number;
  email: string;
  username: string;
  phone: string;
  universityId: number;
  facultyId: number;
  role: UserRole;
  verified: boolean;
  avatar?: string;
  createdAt?: string;
}

// ============================================
// FORM STATE TYPES
// ============================================

export interface FormFieldError {
  message: string;
}

export type FormState<T> = {
  data: T;
  errors: Partial<Record<keyof T, FormFieldError>>;
  isSubmitting: boolean;
  isValid: boolean;
};

// ============================================
// API REQUEST STATE TYPES
// ============================================

export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface PaginatedRequestState<T> extends RequestState<T[]> {
  hasMore: boolean;
  page: number;
  limit: number;
}

// ============================================
// DROPDOWN/PICKER TYPES
// ============================================

export interface DropdownOption {
  label: string;
  value: string | number;
}

// ============================================
// IMAGE & FILE TYPES
// ============================================

export interface ImageAsset {
  uri: string;
  width: number;
  height: number;
  type?: string;
  fileName?: string;
}

export interface UploadedFile {
  id: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

// ============================================
// FEATURE-SPECIFIC TYPES
// ============================================

// Discussions
export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  tags?: string[];
  createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  content: string;
  authorId: number;
  authorName: string;
  upvotes: number;
  createdAt: string;
}

// Carpool
export interface Ride {
  id: number;
  driverId: number;
  driverName: string;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat?: number;
  status: 'available' | 'full' | 'completed' | 'cancelled';
  createdAt: string;
}

// Accommodation
export interface Accommodation {
  id: number;
  ownerId: number;
  title: string;
  description: string;
  type: 'apartment' | 'room' | 'hostel' | 'pg';
  price: number;
  location: string;
  images?: string[];
  amenities?: string[];
  available: boolean;
  createdAt: string;
}

// Events
export interface Event {
  id: number;
  organizerId: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  capacity?: number;
  registeredCount: number;
  imageUrl?: string;
  tags?: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

// Documents
export interface Document {
  id: number;
  uploaderId: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'pdf' | 'doc' | 'image' | 'other';
  universityId: number;
  facultyId?: number;
  courseCode?: string;
  year?: number;
  downloads: number;
  createdAt: string;
}
