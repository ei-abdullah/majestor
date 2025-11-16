/**
 * React Query Configuration
 * Centralized setup for TanStack Query
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query Client Configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default query options
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime in v4)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Default mutation options
      retry: 1,
    },
  },
});

/**
 * Query Keys - centralized query key factory
 */
export const queryKeys = {
  auth: {
    user: ['auth', 'user'] as const,
    isAuthenticated: ['auth', 'isAuthenticated'] as const,
  },
  universities: {
    all: ['universities'] as const,
    withFaculties: ['universities', 'withFaculties'] as const,
  },
  posts: {
    all: ['posts'] as const,
    byId: (id: number) => ['posts', id] as const,
    comments: (postId: number) => ['posts', postId, 'comments'] as const,
  },
  rides: {
    all: ['rides'] as const,
    byId: (id: number) => ['rides', id] as const,
  },
  accommodations: {
    all: ['accommodations'] as const,
    byId: (id: number) => ['accommodations', id] as const,
  },
  events: {
    all: ['events'] as const,
    byId: (id: number) => ['events', id] as const,
  },
  lostFound: {
    all: ['lostFound'] as const,
    byId: (id: number) => ['lostFound', id] as const,
    byUser: (userId: number) => ['lostFound', 'user', userId] as const,
    founders: (itemId: number) => ['lostFound', itemId, 'founders'] as const,
  },
  documents: {
    all: ['documents'] as const,
    byId: (id: number) => ['documents', id] as const,
  },
} as const;

export default queryClient;
