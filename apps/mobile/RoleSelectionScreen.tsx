import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: 'student' | 'accommodater') => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onRoleSelect }) => {
  const handleStudentPress = () => {
    console.log('Selected role: Student');
    onRoleSelect('student');
  };

  const handleAccommodaterPress = () => {
    console.log('Selected role: Accommodater');
    onRoleSelect('accommodater');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Welcome to Majestor</Text>
          <Text style={styles.subtitle}>
            Pakistan's first student-exclusive campus life app
          </Text>
          <Text style={styles.description}>
            Choose your role to get started and connect with your campus community
          </Text>
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={[styles.roleButton, styles.studentButton]}
            onPress={handleStudentPress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🎓</Text>
              <Text style={styles.buttonTitle}>Sign Up as Student</Text>
              <Text style={styles.buttonDescription}>
                Join discussions, find rides, discover events, and connect with fellow students
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.accommodaterButton]}
            onPress={handleAccommodaterPress}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.buttonIcon}>🏠</Text>
              <Text style={styles.buttonTitle}>Sign Up as Accommodater</Text>
              <Text style={styles.buttonDescription}>
                List your properties, manage bookings, and help students find housing
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => onRoleSelect('login' as any)}>
            <Text style={styles.loginLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Theme colors (consistent with other screens)
const theme = {
  colors: {
    primary: '#2563EB', // Blue
    primaryDark: '#1D4ED8',
    secondary: '#10B981', // Green for accommodater
    secondaryDark: '#059669',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    border: '#E5E7EB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: screenWidth - theme.spacing.xl * 2,
  },
  buttonsSection: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  roleButton: {
    borderRadius: theme.borderRadius.xl,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentButton: {
    backgroundColor: theme.colors.primary,
  },
  accommodaterButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.md,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  buttonDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: screenWidth - theme.spacing.xl * 4,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: theme.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default RoleSelectionScreen;