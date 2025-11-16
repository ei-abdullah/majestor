/**
 * Lost & Found Screen
 * Main screen for Lost & Found feature
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLostFoundStore, LostFoundItem } from '../stores/lostFound';

interface LostItem {
  id: string;
  title: string;
  location: string;
  email: string;
  time: string;
  status: 'LOST' | 'FOUND';
  imageUri?: string;
}

interface LostAndFoundScreenProps {
  onBack?: () => void;
  onCreateNew?: () => void;
  onItemPress?: (item: LostFoundItem) => void;
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}

export default function LostAndFoundScreen({ onBack, onCreateNew, onItemPress }: LostAndFoundScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'All' | 'Yours'>('All');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Get items from store
  const { items } = useLostFoundStore();

  // Filter items based on active tab and status filter
  const filteredItems = items.filter((item) => {
    // For "Yours" tab, return empty array (user hasn't posted anything)
    if (activeTab === 'Yours') return false;
    
    // For "All" tab, apply status filter
    if (statusFilter === 'ALL') return true;
    return item.status === statusFilter;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lost & Found</Text>
        <TouchableOpacity style={styles.homeButton} onPress={onBack}>
          <Ionicons name="home-outline" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'All' && styles.activeTab]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabText, activeTab === 'All' && styles.activeTabText]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Yours' && styles.activeTab]}
          onPress={() => setActiveTab('Yours')}
        >
          <Text style={[styles.tabText, activeTab === 'Yours' && styles.activeTabText]}>
            Yours
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterDropdown(!showFilterDropdown)}
        >
          <Text style={styles.filterLabel}>Status:</Text>
          <Text style={styles.filterValue}>
            {statusFilter}
          </Text>
          <Ionicons 
            name={showFilterDropdown ? "chevron-up" : "chevron-down"} 
            size={16} 
            color="#666666" 
          />
        </TouchableOpacity>

        {/* Dropdown Menu */}
        {showFilterDropdown && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setStatusFilter('ALL');
                setShowFilterDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, statusFilter === 'ALL' && styles.dropdownTextActive]}>
                ALL
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setStatusFilter('LOST');
                setShowFilterDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, statusFilter === 'LOST' && styles.dropdownTextActive]}>
                LOST
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setStatusFilter('FOUND');
                setShowFilterDropdown(false);
              }}
            >
              <Text style={[styles.dropdownText, statusFilter === 'FOUND' && styles.dropdownTextActive]}>
                FOUND
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Items List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#C4C4C4" />
            <Text style={styles.emptyStateText}>No items found</Text>
            {activeTab === 'Yours' && (
              <TouchableOpacity 
                style={styles.createButton} 
                onPress={() => {
                  console.log('Create New Request button pressed!');
                  onCreateNew?.();
                }}
              >
                <Text style={styles.createButtonText}>Create a New Request</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            {filteredItems.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                activeOpacity={0.7}
                onPress={() => onItemPress?.(item)}
              >
                {/* Item Image */}
                <View style={styles.imageContainer}>
                  {item.imageUri ? (
                    <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="cube-outline" size={32} color="#C4C4C4" />
                    </View>
                  )}
                </View>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {item.status === 'LOST' ? (
                      <View style={styles.lostBadge}>
                        <Text style={styles.lostBadgeText}>LOST</Text>
                      </View>
                    ) : (
                      <View style={styles.foundBadge}>
                        <Text style={styles.foundBadgeText}>FOUND</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.itemRow}>
                    <Ionicons name="location-outline" size={14} color="#666666" />
                    <Text style={styles.itemLocation} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>

                  <View style={styles.itemRow}>
                    <Ionicons name="mail-outline" size={14} color="#666666" />
                    <Text style={styles.itemPrice} numberOfLines={1}>
                      {item.email}
                    </Text>
                  </View>

                  <View style={styles.itemRow}>
                    <Ionicons name="time-outline" size={14} color="#666666" />
                    <Text style={styles.itemTime}>{getTimeAgo(item.createdAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity 
        style={styles.addButton} 
        activeOpacity={0.8} 
        onPress={() => {
          console.log('Plus button pressed!');
          onCreateNew?.();
        }}
      >
        <LinearGradient
          colors={['#4A90E2', '#50C9C3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.addButtonGradient}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  lostBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lostBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  foundBadge: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  foundBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemLocation: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    color: '#666666',
    marginLeft: 6,
    flex: 1,
  },
  itemTime: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 6,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    zIndex: 1,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
  },
  filterValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dropdownText: {
    fontSize: 14,
    color: '#666666',
  },
  dropdownTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
