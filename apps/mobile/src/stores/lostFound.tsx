/**
 * Lost and Found Items Store
 * Simple state management for lost and found items
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  status: 'LOST' | 'FOUND';
  imageUri?: string;
  createdAt: Date;
  userId?: string;
}

interface LostFoundContextType {
  items: LostFoundItem[];
  addItem: (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => void;
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

export function LostFoundProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LostFoundItem[]>(INITIAL_ITEMS);

  const addItem = (item: Omit<LostFoundItem, 'id' | 'createdAt'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setItems((prevItems) => [newItem, ...prevItems]);
    console.log('Item added:', newItem);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const getUserItems = (userId?: string) => {
    if (!userId) return [];
    return items.filter((item) => item.userId === userId);
  };

  return (
    <LostFoundContext.Provider value={{ items, addItem, removeItem, getUserItems }}>
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
