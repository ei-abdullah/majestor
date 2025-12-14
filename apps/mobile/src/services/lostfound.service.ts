/**
 * Lost & Found API Service
 * Complete implementation of all Lost & Found backend endpoints
 * 
 * Backend Base: /api/v1
 * Controllers: 
 * - LostItemController (/api/v1/lostItem)
 * - FounderController (/api/v1/founder)
 */

import api from './apiClient';

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Location coordinates
 */
export interface Location {
  lat: number;
  lng: number;
}

/**
 * Lost Item Status
 */
export type LostItemStatus = 'LOST' | 'FOUND' | 'RECLAIMED';

/**
 * Founder (person who found an item) with their submission details
 */
export interface Founder {
  id: number;
  username: string;
  phone: string;
  founderEmail: string;
  foundLocationDescription: string;
  lastLocation: Location;
  foundItemImageUris: string[];
  createdAt: string;
}

/**
 * Basic Lost Item (for list views)
 */
export interface LostItemBasic {
  id: number;
  title: string;
  status: LostItemStatus;
  ownerId: number;
  imageUri: string;
  createdAt: string;
}

/**
 * Detailed Lost Item with all information and founders
 */
export interface LostItemDetailed {
  id: number;
  ownerId: number;
  ownerEmail: string;
  title: string;
  description: string;
  phone: string;
  lastLocationDescription: string;
  lastLocation: Location;
  lostItemImageUris: string[];
  itemFounders: Founder[];
  createdAt: string;
}

/**
 * Paginated response for lost items list
 */
export interface LostItemsPage {
  content: LostItemBasic[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============================================
// REQUEST TYPES
// ============================================

/**
 * Create Lost Item Request
 * Note: Uses FormData for multipart/form-data with images
 */
export interface CreateLostItemRequest {
  title: string;
  description: string;
  phone: string;
  lastLocationDescription: string;
  lastLocation?: Location;
  lostItemImages: File[] | Blob[];
}

/**
 * Report Found Item Request
 * Note: Uses FormData for multipart/form-data with images
 */
export interface ReportFoundItemRequest {
  foundLocationDescription: string;
  foundLocation?: Location;
  foundItemImages: File[] | Blob[];
}

// ============================================
// LOST ITEM SERVICE
// ============================================

class LostItemService {
  
  /**
   * Create a new lost item request
   * POST /api/v1/lostItem/createRequest/{userId}
   * Content-Type: multipart/form-data
   * 
   * @param userId - ID of the user creating the request
   * @param data - Lost item details with images
   */
  async createLostItem(userId: number, data: CreateLostItemRequest): Promise<void> {
    const formData = new FormData();
    
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('phone', data.phone);
    formData.append('lastLocationDescription', data.lastLocationDescription);
    
    if (data.lastLocation) {
      formData.append('lastLocation.lat', data.lastLocation.lat.toString());
      formData.append('lastLocation.lng', data.lastLocation.lng.toString());
    }
    
    // Append images
    data.lostItemImages.forEach((image, index) => {
      formData.append('lostItemImages', image, `image-${index}.jpg`);
    });

    await api.post(`/api/v1/lostItem/createRequest/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get all lost items by user ID filtered by status
   * GET /api/v1/lostItem/findLostItemsByUserId/{userId}?status=LOST
   * 
   * @param userId - Owner's user ID
   * @param status - Filter by status (LOST, FOUND, RECLAIMED)
   * @returns List of user's lost items
   */
  async getLostItemsByUserId(
    userId: number, 
    status: LostItemStatus
  ): Promise<LostItemBasic[]> {
    const response = await api.get<LostItemBasic[]>(
      `/api/v1/lostItem/findLostItemsByUserId/${userId}`,
      {
        params: { status }
      }
    );
    return response.data;
  }

  /**
   * Get all lost items with LOST status (paginated)
   * GET /api/v1/lostItem/findAllLostItems?page=0&size=10
   * 
   * @param page - Page number (0-indexed)
   * @param size - Items per page
   * @returns Paginated list of lost items
   */
  async getAllLostItems(page: number = 0, size: number = 20): Promise<LostItemsPage> {
    const response = await api.get<LostItemsPage>('/api/v1/lostItem/findAllLostItems', {
      params: { page, size }
    });
    return response.data;
  }

  /**
   * Get detailed lost item with founders
   * GET /api/v1/lostItem/findLostItemWithFounders/{lostItemId}
   * 
   * @param lostItemId - Lost item ID
   * @returns Detailed item with all founders who reported finding it
   */
  async getLostItemWithFounders(lostItemId: number): Promise<LostItemDetailed> {
    const response = await api.get<LostItemDetailed>(
      `/api/v1/lostItem/findLostItemWithFounders/${lostItemId}`
    );
    return response.data;
  }

  /**
   * Mark a lost item as found
   * PATCH /api/v1/lostItem/markLostItemFound/{lostItemId}
   * 
   * @param lostItemId - Lost item ID to mark as found
   */
  async markItemAsFound(lostItemId: number): Promise<void> {
    await api.patch(`/api/v1/lostItem/markLostItemFound/${lostItemId}`);
  }
}

// ============================================
// FOUNDER SERVICE
// ============================================

class FounderService {
  
  /**
   * Report finding a lost item
   * POST /api/v1/founder/foundLostItem/{founderId}/{lostItemId}
   * Content-Type: multipart/form-data
   * 
   * @param founderId - ID of the user who found the item
   * @param lostItemId - ID of the lost item that was found
   * @param data - Found item details with images
   */
  async reportFoundItem(
    founderId: number,
    lostItemId: number,
    data: ReportFoundItemRequest
  ): Promise<void> {
    const formData = new FormData();
    
    formData.append('foundLocationDescription', data.foundLocationDescription);
    
    if (data.foundLocation) {
      formData.append('foundLocation.lat', data.foundLocation.lat.toString());
      formData.append('foundLocation.lng', data.foundLocation.lng.toString());
    }
    
    // Append images
    data.foundItemImages.forEach((image, index) => {
      formData.append('foundItemImages', image, `found-${index}.jpg`);
    });

    await api.post(
      `/api/v1/founder/foundLostItem/${founderId}/${lostItemId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }
}

// ============================================
// EXPORTS
// ============================================

export const lostItemService = new LostItemService();
export const founderService = new FounderService();

/**
 * Combined Lost & Found service
 */
export const lostFoundService = {
  lostItem: lostItemService,
  founder: founderService,
};

export default lostFoundService;
