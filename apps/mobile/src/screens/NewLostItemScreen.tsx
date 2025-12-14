/**
 * New Lost Item Request Screen
 * Form for creating a new lost/found item request
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useLostFoundStore } from '../stores/lostFound';
import { useAuthContext } from '../contexts/AuthContext';

interface NewLostItemScreenProps {
  onBack?: () => void;
  onOpenMapPicker?: () => void;
  selectedLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  } | null;
}

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function NewLostItemScreen({ onBack, onOpenMapPicker, selectedLocation: initialSelectedLocation }: NewLostItemScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const { addItem } = useLostFoundStore();
  const [itemTitle, setItemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialSelectedLocation || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update selectedLocation when prop changes
  React.useEffect(() => {
    if (initialSelectedLocation) {
      setSelectedLocation(initialSelectedLocation);
    }
  }, [initialSelectedLocation]);

  // Handle image picking
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to upload photos.'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages(prev => [...prev, result.assets[0].uri]);
        console.log('Image selected:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Handle camera
  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera permissions to take photos.'
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImages(prev => [...prev, result.assets[0].uri]);
        console.log('Photo taken:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Show image picker options
  const showImageOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  // Handle map selection
  const selectLocation = () => {
    if (onOpenMapPicker) {
      onOpenMapPicker();
    } else {
      Alert.alert(
        'Select Location',
        'Map integration coming soon! For now, please describe the location in the text field.',
        [{ text: 'OK' }]
      );
    }
    console.log('Location selection requested');
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate user is logged in
    if (!user) {
      Alert.alert('Not Logged In', 'Please login to report a lost item.');
      return;
    }

    // Validate required fields
    if (!itemTitle.trim()) {
      Alert.alert('Missing Information', 'Please enter an item title.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description.');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Missing Information', 'Please enter your phone number.');
      return;
    }
    
    // Validate phone format (03XXXXXXXXX)
    const phoneRegex = /^03[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber.trim())) {
      Alert.alert('Invalid Phone', 'Phone number must be in format: 03XXXXXXXXX (11 digits)');
      return;
    }

    if (!locationDescription.trim() && !selectedLocation) {
      Alert.alert('Missing Information', 'Please enter a location or select one from the map.');
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert('Missing Images', 'Please add at least one photo of the lost item.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert image URIs to File objects for upload
      const imageFiles = await Promise.all(
        selectedImages.map(async (uri) => {
          const response = await fetch(uri);
          const blob = await response.blob();
          const filename = uri.split('/').pop() || 'image.jpg';
          return new File([blob], filename, { type: 'image/jpeg' });
        })
      );

      // Create the item via API
      await addItem({
        title: itemTitle.trim(),
        description: description.trim(),
        location: locationDescription.trim() || selectedLocation?.address || 'Location selected on map',
        locationCoordinates: selectedLocation ? {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        } : undefined,
        phoneNumber: phoneNumber.trim(),
        email: user.email,
        status: 'LOST',
        userId: user.id,
        images: imageFiles,
      });

      // Show success message
      Alert.alert(
        'Success',
        'Your lost item has been reported successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setItemTitle('');
            setDescription('');
            setPhoneNumber('');
            setLocationDescription('');
            setSelectedImages([]);
            setSelectedLocation(null);

            // Navigate back to Lost & Found
            if (onBack) {
              onBack();
            }
          },
        },
      ]
      );
    } catch (error: any) {
      console.error('Failed to submit lost item:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || error.message || 'Failed to submit lost item. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Lost Item Request</Text>
        <TouchableOpacity style={styles.homeButton} onPress={onBack}>
          <Ionicons name="home-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Upload Images */}
          <View style={styles.section}>
          <Text style={styles.sectionLabel}>Upload Images <Text style={styles.required}>*</Text></Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.uploadedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageBox} onPress={showImageOptions}>
              <View style={styles.uploadIconContainer}>
                <Ionicons name="camera-outline" size={32} color="#4A90E2" />
              </View>
              <Text style={styles.uploadText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Item Title */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Item Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Black Backpack with Laptop"
            placeholderTextColor="#C4C4C4"
            value={itemTitle}
            onChangeText={setItemTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the item in detail (color, brand, unique features)"
            placeholderTextColor="#C4C4C4"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Phone Number */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Phone Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="03001234567 (11 digits)"
            placeholderTextColor="#C4C4C4"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Last Location Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Last Location Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Main Library, 2nd Floor near..."
            placeholderTextColor="#C4C4C4"
            value={locationDescription}
            onChangeText={setLocationDescription}
          />
        </View>

        {/* Select on Map */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select on Map</Text>
          <TouchableOpacity style={styles.mapBox} onPress={selectLocation}>
            <View style={styles.mapIconContainer}>
              <Ionicons name="location" size={32} color="#4A90E2" />
            </View>
            <Text style={styles.mapText}>Tap to select location</Text>
            <Text style={styles.mapSubtext}>
              {selectedLocation 
                ? `Location selected: ${selectedLocation.address || `${selectedLocation.latitude.toFixed(4)}, ${selectedLocation.longitude.toFixed(4)}`}`
                : 'No location selected'
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
          activeOpacity={0.8} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Request</Text>
          )}
        </TouchableOpacity>

        {/* Tip Message */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Tip:</Text> Include as many details as possible to help others identify your item. Your contact information will only be visible to verified users.
          </Text>
        </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  homeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  imagesScroll: {
    marginBottom: 8,
  },
  imageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  addImageBox: {
    width: 120,
    height: 120,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
  },
  uploadBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  uploadIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: '#666666',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  mapBox: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mapText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#999999',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  tipContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  tipText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
  },
  tipBold: {
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 40,
  },
});
