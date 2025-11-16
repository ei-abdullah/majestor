/**
 * Image Picker Hook
 * Handles image selection from gallery or camera
 * Provides picked images in format ready for FormData upload
 */

import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export interface PickedImage {
  uri: string;
  type: string;
  name: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

interface UseImagePickerReturn {
  images: PickedImage[];
  pickImage: (allowsMultiple?: boolean) => Promise<PickedImage | PickedImage[] | undefined>;
  takePhoto: () => Promise<PickedImage | undefined>;
  removeImage: (index: number) => void;
  clearImages: () => void;
  isLoading: boolean;
}

/**
 * Hook for picking images from library or camera
 * 
 * @example
 * const { images, pickImage, takePhoto } = useImagePicker();
 * 
 * // Pick single image
 * const image = await pickImage(false);
 * 
 * // Pick multiple images
 * const images = await pickImage(true);
 * 
 * // Take photo
 * const photo = await takePhoto();
 */
export const useImagePicker = (): UseImagePickerReturn => {
  const [images, setImages] = useState<PickedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Pick image(s) from library
   */
  const pickImage = async (allowsMultiple = false): Promise<PickedImage | PickedImage[] | undefined> => {
    try {
      setIsLoading(true);

      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload images!');
        return;
      }

      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: allowsMultiple,
        quality: 0.8,
        allowsEditing: !allowsMultiple,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        const pickedImages: PickedImage[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          type: asset.type === 'image' ? 'image/jpeg' : 'image/jpeg', // Default to jpeg
          name: `image_${Date.now()}_${index}.jpg`,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
        }));

        setImages(allowsMultiple ? pickedImages : [pickedImages[0]]);
        return allowsMultiple ? pickedImages : pickedImages[0];
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Take photo with camera
   */
  const takePhoto = async (): Promise<PickedImage | undefined> => {
    try {
      setIsLoading(true);

      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        const photo: PickedImage = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
          width: result.assets[0].width,
          height: result.assets[0].height,
          fileSize: result.assets[0].fileSize,
        };

        setImages([photo]);
        return photo;
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Failed to take photo');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove image at index
   */
  const removeImage = (index: number): void => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Clear all images
   */
  const clearImages = (): void => {
    setImages([]);
  };

  return {
    images,
    pickImage,
    takePhoto,
    removeImage,
    clearImages,
    isLoading,
  };
};

export default useImagePicker;
