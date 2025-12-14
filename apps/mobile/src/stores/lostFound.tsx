/**
 * Lost and Found Items Store
 * State management for lost and found items with backend integration
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { lostItemService, LostItemBasic, LostItemDetailed } from '../services/lostfound.service';

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  location: string;
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  phoneNumber: string;
  email: string;
  status: 'LOST' | 'FOUND' | 'RECLAIMED';
  imageUri?: string;
  createdAt: Date;
  userId?: string;
}

interface LostFoundContextType {
  items: LostFoundItem[];
  isLoading: boolean;
  error: string | null;
  refreshItems: () => Promise<void>;
  addItem: (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'userId'> & { userId: number; images?: File[] }) => Promise<void>;
  removeItem: (id: string) => void;
  getUserItems: (userId?: string) => LostFoundItem[];
}

// Mock items for initial display
const INITIAL_ITEMS: LostFoundItem[] = [
  {
    id: '1',
    title: 'Black Backpack wit...',
    description: 'Black backpack with laptop compartment',
    location: 'Main Library, 2nd Floor',
    phoneNumber: '+92 300 1234567',
    email: '₨21-12348jhu.edu.pk',
    status: 'LOST',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    title: 'Silver Water Bottle',
    description: 'Stainless steel water bottle',
    location: 'Dr.Shahid Gallery',
    phoneNumber: '+92 300 6678000',
    email: '₨25-6678@nu.edu.pk',
    status: 'FOUND',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    title: 'Blue Headphones...',
    description: 'Wireless blue headphones',
    location: 'Student Cafeteria',
    phoneNumber: '+92 300 9912000',
    email: '₨21-9912@nu.edu.pk',
    status: 'LOST',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '4',
    title: 'Physics Textbook',
    description: 'Physics textbook 2nd edition',
    location: 'Room 301, Engineering...',
    phoneNumber: '+92 300 3445000',
    email: '₨21-3445@nu.edu.pk',
    status: 'FOUND',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '5',
    title: 'Red Umbrella',
    description: 'Red umbrella with wooden handle',
    location: 'Main Entrance',
    phoneNumber: '+92 300 7890000',
    email: '₨21-7890@nu.edu.pk',
    status: 'LOST',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

const LostFoundContext = createContext<LostFoundContextType | undefined>(undefined);

// Convert backend LostItemBasic to frontend LostFoundItem
const convertToLostFoundItem = (item: LostItemBasic): LostFoundItem => ({
  id: item.id.toString(),
  title: item.title,
  description: '', // Not available in list view
  location: '', // Not available in list view
  locationCoordinates: undefined,
  phoneNumber: '', // Not available in list view
  email: '', // Not available in list view
  status: item.status,
  imageUri: item.imageUri,
  createdAt: new Date(item.createdAt),
  userId: item.ownerId.toString(),
});

export function LostFoundProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LostFoundItem[]>(INITIAL_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Don't fetch on mount - wait for user to be logged in
  // useEffect(() => {
  //   refreshItems();
  // }, []);

  const refreshItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await lostItemService.getAllLostItems(0, 100);
      const convertedItems = response.content.map(convertToLostFoundItem);
      setItems(convertedItems);
      console.log('✅ Loaded', convertedItems.length, 'items from backend');
    } catch (err: any) {
      console.error('❌ Failed to fetch lost items:', err);
      setError(err.message || 'Failed to load items');
      // Keep using mock data on error - don't crash the app
      console.log('Using mock data as fallback');
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Omit<LostFoundItem, 'id' | 'createdAt' | 'userId'> & { userId: number; images?: File[] }) => {
    try {
      await lostItemService.createLostItem(item.userId, {
        title: item.title,
        description: item.description,
        lastLocationDescription: item.location,
        phone: item.phoneNumber,
        lastLocation: item.locationCoordinates ? {
          lat: item.locationCoordinates.latitude,
          lng: item.locationCoordinates.longitude,
        } : undefined,
        lostItemImages: item.images || [],
      });
      
      // Refresh items to get the newly created item
      await refreshItems();
      console.log('✅ Item created successfully');
    } catch (err: any) {
      console.error('❌ Failed to create item:', err);
      throw err;
    }
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const getUserItems = (userId?: string) => {
    if (!userId) return [];
    return items.filter((item) => item.userId === userId);
  };

  return (
    <LostFoundContext.Provider value={{ items, isLoading, error, refreshItems, addItem, removeItem, getUserItems }}>
      {children}
    </LostFoundContext.Provider>
  );
}

export function useLostFoundStore() {
  const context = useContext(LostFoundContext);
  if (!context) {
    throw new Error('useLostFoundStore must be used within LostFoundProvider');
  }
  return context;
}
