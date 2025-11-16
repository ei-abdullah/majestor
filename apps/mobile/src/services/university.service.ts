/**
 * University Service
 * Handles university and faculty API calls
 * 
 * Backend endpoints:
 * - GET /api/v1/university/getWithFaculties
 */

import { api } from './apiClient';
import type { UniversitiesWithFacultiesResponse } from '../schema/api-schemas';

/**
 * Get all universities with their faculties
 * @returns List of universities with nested faculties
 */
export const getUniversitiesWithFaculties = async (): Promise<UniversitiesWithFacultiesResponse> => {
  const response = await api.get<UniversitiesWithFacultiesResponse>(
    '/api/v1/university/getWithFaculties'
  );
  return response.data;
};

export const universityService = {
  getUniversitiesWithFaculties,
};

export default universityService;
