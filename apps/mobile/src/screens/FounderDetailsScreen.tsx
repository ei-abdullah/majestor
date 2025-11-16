/**
 * Founder Details Screen
 * Shows detailed information about a person who found an item
 * including contact info, item photos carousel, and discovery location
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = 72;

interface FounderDetailsScreenProps {
  founder: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    reportedAt: Date;
    discoveryLocation?: string;
    discoveryCoordinates?: {
      latitude: number;
      longitude: number;
    };
    itemPhotos?: string[];
  };
  onBack?: () => void;
}

export default function FounderDetailsScreen({ founder, onBack }: FounderDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mock photos if none provided
  const photos = founder.itemPhotos || [];
  const hasPhotos = photos.length > 0;

  const handlePreviousPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Founder Details</Text>
        <TouchableOpacity style={styles.homeButton}>
          <Ionicons name="home-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Founder Info Card */}
        <View style={styles.founderCard}>
          <View style={styles.founderAvatar}>
            <Text style={styles.founderAvatarText}>{getInitials(founder.name)}</Text>
          </View>
          <Text style={styles.founderName}>{founder.name}</Text>
          <Text style={styles.founderRole}>Founder</Text>
        </View>

        {/* Contact Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {founder.phoneNumber && (
            <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.contactText}>{founder.phoneNumber}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
            <View style={styles.contactIconContainer}>
              <Ionicons name="mail-outline" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.contactText}>{founder.email}</Text>
          </TouchableOpacity>
        </View>

        {/* Item Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Photos</Text>

          {hasPhotos ? (
            <>
              {/* Main Photo Carousel */}
              <View style={styles.carouselContainer}>
                <TouchableOpacity
                  style={[styles.carouselButton, styles.carouselButtonLeft]}
                  onPress={handlePreviousPhoto}
                  disabled={currentPhotoIndex === 0}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color={currentPhotoIndex === 0 ? '#D1D5DB' : '#1F2937'} 
                  />
                </TouchableOpacity>

                <View style={styles.mainPhotoContainer}>
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="camera" size={48} color="#9CA3AF" />
                  </View>
                  <Text style={styles.photoLabel}>Photo {currentPhotoIndex + 1}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.carouselButton, styles.carouselButtonRight]}
                  onPress={handleNextPhoto}
                  disabled={currentPhotoIndex === photos.length - 1}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name="chevron-forward" 
                    size={24} 
                    color={currentPhotoIndex === photos.length - 1 ? '#D1D5DB' : '#1F2937'} 
                  />
                </TouchableOpacity>
              </View>

              {/* Photo Count Badge */}
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>{photos.length}</Text>
              </View>

              {/* Thumbnail Row */}
              <View style={styles.thumbnailRow}>
                {photos.slice(0, 3).map((photo, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.thumbnail,
                      currentPhotoIndex === index && styles.thumbnailActive,
                    ]}
                    onPress={() => setCurrentPhotoIndex(index)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.thumbnailPlaceholder}>
                      <Ionicons name="image" size={24} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.noPhotosContainer}>
              <Ionicons name="camera-outline" size={48} color="#D1D5DB" />
              <Text style={styles.noPhotosText}>No photos available</Text>
            </View>
          )}
        </View>

        {/* Discovery Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discovery Location</Text>

          {founder.discoveryLocation && (
            <View style={styles.locationTextContainer}>
              <Ionicons name="location-outline" size={20} color="#3B82F6" />
              <Text style={styles.locationText}>{founder.discoveryLocation}</Text>
            </View>
          )}

          {/* Map */}
          {founder.discoveryCoordinates ? (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: founder.discoveryCoordinates.latitude,
                  longitude: founder.discoveryCoordinates.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: founder.discoveryCoordinates.latitude,
                    longitude: founder.discoveryCoordinates.longitude,
                  }}
                  pinColor="#3B82F6"
                />
              </MapView>
              <View style={styles.mapOverlay}>
                <Ionicons name="location" size={20} color="#3B82F6" />
                <Text style={styles.mapOverlayText}>
                  {founder.discoveryLocation || 'Discovery location'}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noMapContainer}>
              <Ionicons name="map-outline" size={48} color="#D1D5DB" />
              <Text style={styles.noMapText}>Location not available</Text>
            </View>
          )}

          {/* Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Note:</Text>
            <Text style={styles.noteText}>
              Please contact the founder directly to arrange item recovery. Verify item ownership before meeting.
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
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
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
  contentContainer: {
    padding: 16,
  },
  founderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  founderAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  founderAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  founderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  founderRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  contactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
  },
  carouselButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carouselButtonLeft: {
    marginRight: 12,
  },
  carouselButtonRight: {
    marginLeft: 12,
  },
  mainPhotoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  photoCountBadge: {
    alignSelf: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  photoCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  thumbnail: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  thumbnailActive: {
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
  },
  thumbnailPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPhotosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  noPhotosText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapOverlayText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  noMapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  noMapText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  noteContainer: {
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  noteLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 24,
  },
});
