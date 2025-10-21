import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { CharacterImage } from '../components/CharacterImage';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back button placeholder - can be added if needed */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>Welcome to,</Text>
          <Text style={styles.appName}>Majestor.</Text>
          
          {/* Character illustration */}
          <CharacterImage type="welcome" style={styles.illustration} />
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Let's get Started"
            onPress={onContinue}
            style={styles.startButton}
          />
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
    paddingTop: theme.spacing.xl, // Add proper top spacing below status bar
  },
  backButton: {
    marginTop: theme.spacing.sm, // Reduced top margin
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginTop: -theme.spacing.xxl, // Pull content up slightly for better balance
  },
  welcomeText: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.normal,
    color: theme.colors.text,
    textAlign: 'center',
  },
  appName: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  illustration: {
    marginVertical: theme.spacing.xl, // Reduced vertical spacing
  },
  bottomSection: {
    paddingBottom: theme.spacing.xxxl, // Increased bottom padding for safe area
    marginBottom: theme.spacing.lg,
  },
  startButton: {
    marginHorizontal: theme.spacing.lg,
  },
});