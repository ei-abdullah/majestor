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

interface RoleSelectionScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onStudentSignup: () => void;
  onAccommodatorSignup: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onBack,
  onLogin,
  onStudentSignup,
  onAccommodatorSignup,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.welcomeText}>Welcome to,</Text>
          <Text style={styles.appName}>Majestor.</Text>
          
          {/* Character illustration */}
          <CharacterImage type="welcome" style={styles.illustration} />

          {/* Already a user section */}
          <View style={styles.loginSection}>
            <Text style={styles.alreadyUserText}>Already a user?</Text>
            <PrimaryButton
              title="Login"
              onPress={onLogin}
              style={styles.loginButton}
            />
          </View>

          {/* Divider line */}
          <View style={styles.divider} />

          {/* Sign up section */}
          <View style={styles.signupSection}>
            <Text style={styles.signupAsText}>Sign up as</Text>
            
            <PrimaryButton
              title="Student"
              onPress={onStudentSignup}
              style={styles.roleButton}
            />
            
            <PrimaryButton
              title="Accommodator"
              onPress={onAccommodatorSignup}
              style={styles.roleButton}
            />
          </View>
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
    paddingTop: theme.spacing.xl, // Proper safe area spacing
  },
  backButton: {
    marginTop: theme.spacing.sm,
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
    alignItems: 'center',
    paddingTop: theme.spacing.lg, // Reduced top padding
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
    marginBottom: theme.spacing.lg,
  },
  illustration: {
    marginBottom: theme.spacing.lg, // Reduced spacing
  },
  loginSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  alreadyUserText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    minWidth: 200,
  },
  divider: {
    width: '60%',
    height: 1,
    backgroundColor: theme.colors.gray[200],
    marginVertical: theme.spacing.lg,
  },
  signupSection: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: theme.spacing.xxl, // Add bottom spacing for safe area
  },
  signupAsText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  roleButton: {
    minWidth: 200,
    marginBottom: theme.spacing.md,
  },
});