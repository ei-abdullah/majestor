/**
 * FormData Helper Utilities
 * Utilities for creating FormData for multipart/form-data requests
 * 
 * IMPORTANT: Use FormData for endpoints that accept images/files
 * Backend requirement: "jis api endpoint par images involved hai usmai form-data se values bhejna, not JSON"
 */

import type { PickedImage } from '../hooks/useImagePicker';

/**
 * Create FormData from object
 * Automatically handles images and regular fields
 * 
 * @param data - Object with fields and optional images
 * @returns FormData ready for upload
 * 
 * @example
 * const formData = createFormData({
 *   title: 'My Post',
 *   description: 'Hello',
 *   image: pickedImage, // Single image
 * });
 * 
 * @example
 * const formData = createFormData({
 *   title: 'Report',
 *   images: [image1, image2], // Multiple images
 * });
 */
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Skip null/undefined values
    if (value === null || value === undefined) {
      return;
    }

    // Handle single image
    if (isPickedImage(value)) {
      formData.append(key, {
        uri: value.uri,
        type: value.type || 'image/jpeg',
        name: value.name || `${key}.jpg`,
      } as any);
    }
    // Handle array of images
    else if (Array.isArray(value) && value.length > 0 && isPickedImage(value[0])) {
      value.forEach((image, index) => {
        formData.append(key, {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: image.name || `${key}_${index}.jpg`,
        } as any);
      });
    }
    // Handle regular values
    else if (Array.isArray(value)) {
      // Convert array to JSON string for backend
      formData.append(key, JSON.stringify(value));
    } else if (typeof value === 'object') {
      // Convert object to JSON string
      formData.append(key, JSON.stringify(value));
    } else {
      // String, number, boolean
      formData.append(key, String(value));
    }
  });

  return formData;
};

/**
 * Type guard to check if object is a PickedImage
 */
const isPickedImage = (value: any): value is PickedImage => {
  return (
    value &&
    typeof value === 'object' &&
    'uri' in value &&
    typeof value.uri === 'string' &&
    value.uri.length > 0
  );
};

/**
 * Create multipart config for axios
 * Returns headers config for FormData requests
 */
export const getMultipartConfig = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

/**
 * Example usage patterns
 */

// Example 1: User profile update with avatar
export const exampleUserUpdate = (
  personalEmail: string,
  phone: string,
  avatar?: PickedImage
) => {
  const formData = createFormData({
    personalEmail,
    phone,
    avatar, // Single image (optional)
  });

  // Use with axios:
  // api.patch('/api/v1/user/updateUserDetails/:id', formData, getMultipartConfig())
  
  return formData;
};

// Example 2: Lost item report with multiple images
export const exampleLostItemReport = (
  title: string,
  description: string,
  images: PickedImage[],
  lastLocationLat?: number,
  lastLocationLng?: number
) => {
  const formData = createFormData({
    title,
    description,
    lastLocationLat,
    lastLocationLng,
    images, // Multiple images
  });

  return formData;
};

// Example 3: Post with single image
export const examplePostWithImage = (
  title: string,
  content: string,
  image?: PickedImage,
  tags?: string[]
) => {
  const formData = createFormData({
    title,
    content,
    image, // Optional single image
    tags, // Array will be stringified
  });

  return formData;
};
