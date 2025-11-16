/**
 * Lost & Found Service
 * Handles Lost & Found API calls
 * 
 * Backend endpoints (to be implemented):
 * - GET /api/v1/lostfound/items - Get all lost/found items
 * - POST /api/v1/lostfound/items - Create new lost/found item
 * - GET /api/v1/lostfound/items/:id - Get item details
 * - PUT /api/v1/lostfound/items/:id - Update item
 * - DELETE /api/v1/lostfound/items/:id - Delete item
 * - POST /api/v1/lostfound/items/:id/found - Mark item as found
 * - POST /api/v1/lostfound/items/:id/report - Report finding an item
 */

import { api } from './apiClient';

export interface LostFoundItemDTO {
  id: number;
  title: string;
  description: string;
  status: 'LOST' | 'FOUND';
  location: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  email: string;
  imageUri?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLostFoundItemRequest {
  title: string;
  description: string;
  location: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  status: 'LOST' | 'FOUND';
  imageUri?: string;
}

export interface FounderDTO {
  id: number;
  itemId: number;
  userId: number;
  name: string;
  email: string;
  phoneNumber?: string;
  discoveryLocation?: string;
  discoveryCoordinates?: {
    latitude: number;
    longitude: number;
  };
  reportedAt: string;
  itemPhotos?: string[];
}

/**
 * Get all lost/found items
 */
export const getLostFoundItems = async (): Promise<LostFoundItemDTO[]> => {
  const response = await api.get<LostFoundItemDTO[]>('/api/v1/lostfound/items');
  return response.data;
};

/**
 * Get lost/found items by user
 */
export const getUserLostFoundItems = async (userId: number): Promise<LostFoundItemDTO[]> => {
  const response = await api.get<LostFoundItemDTO[]>(`/api/v1/lostfound/items/user/${userId}`);
  return response.data;
};

/**
 * Get item details
 */
export const getLostFoundItemById = async (id: number): Promise<LostFoundItemDTO> => {
  const response = await api.get<LostFoundItemDTO>(`/api/v1/lostfound/items/${id}`);
  return response.data;
};

/**
 * Create new lost/found item
 */
export const createLostFoundItem = async (
  data: CreateLostFoundItemRequest
): Promise<LostFoundItemDTO> => {
  const response = await api.post<LostFoundItemDTO>('/api/v1/lostfound/items', data);
  return response.data;
};

/**
 * Update lost/found item
 */
export const updateLostFoundItem = async (
  id: number,
  data: Partial<CreateLostFoundItemRequest>
): Promise<LostFoundItemDTO> => {
  const response = await api.put<LostFoundItemDTO>(`/api/v1/lostfound/items/${id}`, data);
  return response.data;
};

/**
 * Delete lost/found item
 */
export const deleteLostFoundItem = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/lostfound/items/${id}`);
};

/**
 * Mark item as found
 */
export const markItemAsFound = async (id: number): Promise<LostFoundItemDTO> => {
  const response = await api.post<LostFoundItemDTO>(`/api/v1/lostfound/items/${id}/found`);
  return response.data;
};

/**
 * Report finding an item
 */
export const reportFoundItem = async (
  itemId: number,
  data: {
    discoveryLocation?: string;
    discoveryCoordinates?: { latitude: number; longitude: number };
    itemPhotos?: string[];
  }
): Promise<FounderDTO> => {
  const response = await api.post<FounderDTO>(
    `/api/v1/lostfound/items/${itemId}/report`,
    data
  );
  return response.data;
};

/**
 * Get founders/reporters for an item
 */
export const getItemFounders = async (itemId: number): Promise<FounderDTO[]> => {
  const response = await api.get<FounderDTO[]>(`/api/v1/lostfound/items/${itemId}/founders`);
  return response.data;
};

export const lostFoundService = {
  getLostFoundItems,
  getUserLostFoundItems,
  getLostFoundItemById,
  createLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  markItemAsFound,
  reportFoundItem,
  getItemFounders,
};

export default lostFoundService;
