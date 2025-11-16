/**
 * Lost & Found React Query Hooks
 * Custom hooks for Lost & Found feature with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../stores/queryClient';
import { lostFoundService, CreateLostFoundItemRequest } from '../services/lostfound.service';

/**
 * Get all lost/found items
 */
export const useLostFoundItems = () => {
  return useQuery({
    queryKey: queryKeys.lostFound.all,
    queryFn: () => lostFoundService.getLostFoundItems(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get user's lost/found items
 */
export const useUserLostFoundItems = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.lostFound.byUser(userId),
    queryFn: () => lostFoundService.getUserLostFoundItems(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get item details
 */
export const useLostFoundItem = (id: number) => {
  return useQuery({
    queryKey: queryKeys.lostFound.byId(id),
    queryFn: () => lostFoundService.getLostFoundItemById(id),
    enabled: !!id,
  });
};

/**
 * Create lost/found item mutation
 */
export const useCreateLostFoundItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLostFoundItemRequest) =>
      lostFoundService.createLostFoundItem(data),
    onSuccess: () => {
      // Invalidate items list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
    },
  });
};

/**
 * Update lost/found item mutation
 */
export const useUpdateLostFoundItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateLostFoundItemRequest> }) =>
      lostFoundService.updateLostFoundItem(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific item and list
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.byId(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
    },
  });
};

/**
 * Delete lost/found item mutation
 */
export const useDeleteLostFoundItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lostFoundService.deleteLostFoundItem(id),
    onSuccess: () => {
      // Invalidate items list
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
    },
  });
};

/**
 * Mark item as found mutation
 */
export const useMarkItemAsFound = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => lostFoundService.markItemAsFound(id),
    onSuccess: (_, id) => {
      // Invalidate specific item and list
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.byId(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lostFound.all });
    },
  });
};

/**
 * Report finding an item mutation
 */
export const useReportFoundItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: {
        discoveryLocation?: string;
        discoveryCoordinates?: { latitude: number; longitude: number };
        itemPhotos?: string[];
      };
    }) => lostFoundService.reportFoundItem(itemId, data),
    onSuccess: (_, variables) => {
      // Invalidate founders list for this item
      queryClient.invalidateQueries({
        queryKey: queryKeys.lostFound.founders(variables.itemId),
      });
    },
  });
};

/**
 * Get item founders/reporters
 */
export const useItemFounders = (itemId: number) => {
  return useQuery({
    queryKey: queryKeys.lostFound.founders(itemId),
    queryFn: () => lostFoundService.getItemFounders(itemId),
    enabled: !!itemId,
  });
};
