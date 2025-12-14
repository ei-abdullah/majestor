import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from './HomeScreen';
import { BottomNavBar } from '../components/BottomNavBar';
import { useAuthContext } from '../contexts/AuthContext';

type TabType = 'home' | 'search' | 'add' | 'calendar' | 'profile';

interface HomeScreenWithNavProps {
  onFeaturePress?: (feature: string) => void;
  onProfilePress?: () => void;
}

export const HomeScreenWithNav: React.FC<HomeScreenWithNavProps> = ({ onFeaturePress: onFeaturePressExternal, onProfilePress }) => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const handleTabPress = (tab: TabType) => {
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
    
    // TODO: Navigate to different screens based on tab
    // For now, just log the tab press
  };

  const handleFeaturePress = (feature: string) => {
    console.log('Feature pressed:', feature);
    if (onFeaturePressExternal) {
      onFeaturePressExternal(feature);
    }
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
    // TODO: Navigate to notifications screen
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
    setActiveTab('search');
    // TODO: Navigate to search screen
  };

  return (
    <View style={styles.container}>
      <HomeScreen
        userName={user?.username || 'User'}
        onNotificationPress={handleNotificationPress}
        onSearchPress={handleSearchPress}
        onFeaturePress={handleFeaturePress}
        onProfilePress={onProfilePress}
      />
      <BottomNavBar
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
