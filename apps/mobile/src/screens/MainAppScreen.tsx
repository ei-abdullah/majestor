import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { NavIcon } from '../components/NavIcon';

interface MainAppScreenProps {
  onLogout: () => void;
}

export const MainAppScreen: React.FC<MainAppScreenProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const tabs = [
    { type: 'home' as const, label: 'Home' },
    { type: 'discussions' as const, label: 'Discussions' },
    { type: 'posts' as const, label: 'Posts' },
    { type: 'search' as const, label: 'Search' },
    { type: 'carpool' as const, label: 'Carpool' },
    { type: 'accommodation' as const, label: 'Accommodation' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Main content area */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to Majestor!</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.mainContent}>
          <Text style={styles.tabContent}>
            {tabs[activeTab].label} Screen
          </Text>
          <Text style={styles.tabDescription}>
            This is where the {tabs[activeTab].label.toLowerCase()} content will be displayed.
          </Text>
        </View>
      </View>

      {/* Floating Bottom Navigation */}
      <View style={styles.floatingNavContainer}>
        <View style={styles.floatingNavigation}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              onPress={() => setActiveTab(index)}
              activeOpacity={0.7}
            >
              <NavIcon 
                type={tab.type}
                isActive={activeTab === index}
                size={20}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg, // Added proper top spacing
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    marginTop: theme.spacing.md, // Added top margin for better spacing
  },
  welcomeText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  logoutButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.gray[100],
  },
  logoutText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.weights.medium,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl, // Extra bottom padding for floating nav
  },
  tabContent: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  tabDescription: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  floatingNavContainer: {
    position: 'absolute',
    bottom: theme.spacing.lg, // Reduced bottom spacing to match Figma
    left: theme.spacing.sm, // Reduced side spacing
    right: theme.spacing.sm,
    alignItems: 'center',
  },
  floatingNavigation: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary, // Use primary purple color like in Figma
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.sm, // Reduced vertical padding for more compact look
    paddingHorizontal: theme.spacing.md, // Reduced horizontal padding
    ...theme.shadows.lg,
    elevation: 8,
    minHeight: 56, // Fixed height to match Figma proportions
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs, // Add horizontal padding
  },
});