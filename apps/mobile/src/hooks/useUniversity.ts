/**
 * University React Query Hooks
 * Custom hooks for university and faculty data
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../stores/queryClient';
import { universityService } from '../services/university.service';
import { mockUniversityService } from '../mocks/mockApi';
import { ENV } from '../constants/env';

// Use mock or real service based on environment
const service = ENV.USE_MOCKS ? mockUniversityService : universityService;

/**
 * Get Universities with Faculties Hook
 */
export const useUniversitiesWithFaculties = () => {
  return useQuery({
    queryKey: queryKeys.universities.withFaculties,
    queryFn: () => service.getUniversitiesWithFaculties(),
    staleTime: 1000 * 60 * 30, // 30 minutes - universities don't change often
  });
};
