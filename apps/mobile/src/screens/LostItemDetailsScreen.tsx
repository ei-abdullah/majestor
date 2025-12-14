/**
 * Lost Item Details Screen
 * Shows detailed information about a lost/found item with two tabs:
 * 1. Lost Item - Item details, description, contact info, location
 * 2. Founders - List of people who reported finding this item
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { lostItemService, founderService, LostItemDetailed, Founder } from '../services/lostfound.service';
import { useAuthContext } from '../contexts/AuthContext';

interface LostItemDetailsScreenProps {
  itemId: string | number;
  onBack?: () => void;
  onFounderPress?: (founder: Founder) => void;
}

export default function LostItemDetailsScreen({ itemId, onBack, onFounderPress }: LostItemDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'lostItem' | 'founders'>('lostItem');
  const [item, setItem] = useState<LostItemDetailed | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingFound, setIsMarkingFound] = useState(false);

  // Fetch item details on mount
  useEffect(() => {
    loadItemDetails();
  }, [itemId]);

  const loadItemDetails = async () => {
    try {
      setIsLoading(true);
      const data = await lostItemService.getLostItemWithFounders(Number(itemId));
      setItem(data);
      console.log('✅ Loaded item details with', data.itemFounders.length, 'founders');
    } catch (error: any) {
      console.error('❌ Failed to load item details:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to load item details'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${Math.floor(seconds / 60) === 1 ? 'minute' : 'minutes'} ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ${Math.floor(seconds / 3600) === 1 ? 'hour' : 'hours'} ago`;
    return `${Math.floor(seconds / 86400)} ${Math.floor(seconds / 86400) === 1 ? 'day' : 'days'} ago`;
  };

  const handleMarkFound = async () => {
    if (!user || !item) return;
    
    // Only owner can mark as found
    if (item.ownerId !== user.id) {
      Alert.alert('Not Authorized', 'Only the item owner can mark it as found.');
      return;
    }

    Alert.alert(
      'Mark as Found',
      'Have you recovered this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Mark Found',
          onPress: async () => {
            try {
              setIsMarkingFound(true);
              await lostItemService.markItemAsFound(Number(itemId));
              Alert.alert('Success', 'Item marked as found!');
              // Reload details to get updated status
              await loadItemDetails();
            } catch (error: any) {
              console.error('❌ Failed to mark item as found:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'Failed to mark item as found'
              );
            } finally {
              setIsMarkingFound(false);
            }
          },
        },
      ]
    );
  };

  const handleReportIt = () => {
    Alert.alert(
      'Report Found Item',
      'Have you found this item? You can report it to help the owner recover it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report Found',
          onPress: () => {
            // TODO: Navigate to report found item screen or call API
            Alert.alert('Report Submitted', 'Thank you for reporting! The owner will be notified.');
            console.log('Report found item:', item.id);
          },
        },
      ]
    );
  };

  const handleOpenMap = () => {
    if (item?.lastLocation) {
      const { lat, lng } = item.lastLocation;
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      Alert.alert(
        'Open in Maps',
        'View this location in Google Maps?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open', onPress: () => console.log('Open map:', url) },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lost Item Details</Text>
        <TouchableOpacity style={styles.homeButton}>
          <Ionicons name="home-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      ) : !item ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load item details</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadItemDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'lostItem' && styles.activeTab]}
          onPress={() => setActiveTab('lostItem')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'lostItem' && styles.activeTabText]}>
            Lost Item
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'founders' && styles.activeTab]}
          onPress={() => setActiveTab('founders')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'founders' && styles.activeTabText]}>
            Founders
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'lostItem' ? (
          // Lost Item Tab
          <View style={styles.lostItemContent}>
            {/* First Card - Item Details */}
            <View style={styles.detailsCard}>
              {/* Item Title and Status */}
              <View style={styles.titleSection}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <View style={[styles.statusBadge, item.status === 'LOST' ? styles.lostBadge : styles.foundBadge]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              {/* Posted Time */}
              <View style={styles.timeRow}>
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text style={styles.timeText}>Posted {getTimeAgo(item.createdAt)}</Text>
              </View>

              {/* Description Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
              </View>

              {/* Contact Information */}
              <View style={styles.sectionLast}>
                <Text style={styles.sectionTitle}>Contact Information</Text>
                
                <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="call-outline" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.contactText}>{item.phone}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactItem} activeOpacity={0.7}>
                  <View style={styles.contactIconContainer}>
                    <Ionicons name="mail-outline" size={20} color="#3B82F6" />
                  </View>
                  <Text style={styles.contactText}>{item.ownerEmail}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Second Card - Location */}
            <View style={styles.locationCard}>
              <Text style={styles.sectionTitle}>Last Known Location</Text>
              
              <View style={styles.locationTextContainer}>
                <Ionicons name="location-outline" size={20} color="#10B981" />
                <Text style={styles.locationText}>{item.location}</Text>
              </View>

              {/* Map */}
              <View style={styles.mapContainer}>
                {item.lastLocation ? (
                  <>
                    <MapView
                      style={styles.map}
                      initialRegion={{
                        latitude: item.lastLocation.lat,
                        longitude: item.lastLocation.lng,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                      }}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      pitchEnabled={false}
                      rotateEnabled={false}
                    >
                      <Marker
                        coordinate={{
                          latitude: item.lastLocation.lat,
                          longitude: item.lastLocation.lng,
                        }}
                        pinColor="#10B981"
                      />
                    </MapView>
                    <TouchableOpacity 
                      style={styles.mapTouchOverlay}
                      activeOpacity={0.9}
                      onPress={handleOpenMap}
                    >
                      <View style={styles.mapTextOverlay}>
                        <Text style={styles.mapLocationText}>{item.lastLocationDescription}</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity 
                    style={styles.mapPlaceholder}
                    activeOpacity={0.9}
                    onPress={handleOpenMap}
                  >
                    <Ionicons name="location" size={48} color="#10B981" />
                    <Text style={styles.mapPlaceholderText}>{item.lastLocationDescription}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleMarkFound}>
                <Text style={styles.primaryButtonText}>Mark Found</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={handleReportIt}>
                <Text style={styles.secondaryButtonText}>Found It</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Founders Tab
          <View style={styles.foundersContent}>
            {item.itemFounders.length > 0 ? (
              item.itemFounders.map((founder) => (
                <TouchableOpacity
                  key={founder.id}
                  style={styles.founderCard}
                  activeOpacity={0.7}
                  onPress={() => onFounderPress?.(founder)}
                >
                  <View style={styles.founderAvatar}>
                    <Text style={styles.founderAvatarText}>
                      {founder.username.substring(0, 2).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.founderInfo}>
                    <Text style={styles.founderName}>{founder.username}</Text>
                    <View style={styles.founderEmailRow}>
                      <Ionicons name="mail-outline" size={14} color="#6B7280" />
                      <Text style={styles.founderEmail}>{founder.founderEmail}</Text>
                    </View>
                    <View style={styles.founderTimeRow}>
                      <Ionicons name="call-outline" size={14} color="#6B7280" />
                      <Text style={styles.founderTime}>{founder.phone}</Text>
                    </View>
                    <View style={styles.founderTimeRow}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.founderTime}>Reported {getTimeAgo(new Date(founder.createdAt))}</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyStateTitle}>No Founders Yet</Text>
                <Text style={styles.emptyStateText}>
                  No one has reported finding this item yet.
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  lostItemContent: {
    padding: 16,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lostBadge: {
    backgroundColor: '#FEE2E2',
  },
  foundBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionLast: {
    marginBottom: 0,
  },
  itemImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
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
  locationTextContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#166534',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  mapContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapTouchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTextOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    maxWidth: '80%',
  },
  mapLocationText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'center',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    height: 180,
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#166534',
    marginTop: 8,
    fontWeight: '500',
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
  },
  mapOverlayText: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3B82F6',
  },
  foundersContent: {
    padding: 16,
  },
  founderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  founderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  founderAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  founderEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  founderEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },
  founderTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  founderTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 24,
  },
});
