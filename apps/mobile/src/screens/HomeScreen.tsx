import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  userName?: string;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
  onFeaturePress?: (feature: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'Ahmed',
  onNotificationPress,
  onSearchPress,
  onFeaturePress,
}) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {userName}! 👋</Text>
            <Text style={styles.subGreeting}>FAST-NUCES, Karachi</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={onNotificationPress}
          >
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={onSearchPress}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <Text style={styles.searchPlaceholder}>Search anything...</Text>
        </TouchableOpacity>

        {/* Analytics Card */}
        <LinearGradient
          colors={['#4A90E2', '#50C9C3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.analyticsCard}
        >
          <View style={styles.analyticsHeader}>
            <Text style={styles.analyticsTitle}>Your Analytics</Text>
            <Text style={styles.analyticsSubtitle}>Made</Text>
          </View>
          <View style={styles.analyticsStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Trending Now */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.trendingScroll}
        >
          <TouchableOpacity style={styles.trendingCard}>
            <Ionicons name="bulb-outline" size={24} color="#4A90E2" />
            <Text style={styles.trendingTitle}>Influence Prep Tips</Text>
            <Text style={styles.trendingSubtitle}>297 Students</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.trendingCard}>
            <Ionicons name="book-outline" size={24} color="#4A90E2" />
            <Text style={styles.trendingTitle}>Best Way To Revise</Text>
            <Text style={styles.trendingSubtitle}>47 Students</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.trendingCard}>
            <View style={styles.hotBadge}>
              <Text style={styles.hotBadgeText}>HOT</Text>
            </View>
            <Ionicons name="people-outline" size={24} color="#4A90E2" />
            <Text style={styles.trendingTitle}>CS Study Group</Text>
            <Text style={styles.trendingSubtitle}>33 Students</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Explore Features */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Features</Text>
        </View>

        <View style={styles.featuresGrid}>
          {/* Discussions */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => onFeaturePress?.('discussions')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="chatbubbles-outline" size={28} color="#4A90E2" />
            </View>
            <Text style={styles.featureTitle}>Discussions</Text>
            <Text style={styles.featureSubtitle}>297 conversations</Text>
          </TouchableOpacity>

          {/* Carpooling */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => onFeaturePress?.('carpooling')}
          >
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
            <View style={[styles.featureIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="car-outline" size={28} color="#F59E0B" />
            </View>
            <Text style={styles.featureTitle}>Carpooling</Text>
            <Text style={styles.featureSubtitle}>Ready-2-ride</Text>
          </TouchableOpacity>

          {/* Accommodation */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => onFeaturePress?.('accommodation')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="home-outline" size={28} color="#EC4899" />
            </View>
            <Text style={styles.featureTitle}>Accommodation</Text>
            <Text style={styles.featureSubtitle}>Finding roommates</Text>
          </TouchableOpacity>

          {/* Events */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => onFeaturePress?.('events')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="calendar-outline" size={28} color="#3B82F6" />
            </View>
            <Text style={styles.featureTitle}>Events</Text>
            <Text style={styles.featureSubtitle}>23 upcoming</Text>
          </TouchableOpacity>

          {/* Lost & Found */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => onFeaturePress?.('lostfound')}
          >
            <View style={styles.exchangeBadge}>
              <Text style={styles.exchangeBadgeText}>Exchange</Text>
            </View>
            <View style={[styles.featureIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="search-outline" size={28} color="#A855F7" />
            </View>
            <Text style={styles.featureTitle}>Lost & Found</Text>
            <Text style={styles.featureSubtitle}>18 items</Text>
          </TouchableOpacity>

          {/* Documents */}
          <TouchableOpacity 
            style={styles.featureCard}
            onPress={() => onFeaturePress?.('documents')}
          >
            <View style={[styles.featureIcon, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="document-text-outline" size={28} color="#10B981" />
            </View>
            <Text style={styles.featureTitle}>Documents</Text>
            <Text style={styles.featureSubtitle}>Share notes</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for nav bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15,
    color: '#9CA3AF',
  },
  analyticsCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  analyticsHeader: {
    marginBottom: 16,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  analyticsSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  analyticsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#E0F2FE',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  trendingScroll: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  trendingCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  hotBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  hotBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  trendingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 6,
  },
  trendingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exchangeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  exchangeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 100,
  },
});
