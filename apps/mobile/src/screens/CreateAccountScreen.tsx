import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { theme } from '../constants/theme';
import { PrimaryButton } from '../components/PrimaryButton';
import { FormInput } from '../components/FormInput';
import { Dropdown } from '../components/Dropdown';

// Zod schema for registration
const registerSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .refine((email) => {
      // Allow @cust.pk and @gmail.com (for testing)
      return email.endsWith('@cust.pk') || email.endsWith('@gmail.com');
    }, 'Email must be from @cust.pk or @gmail.com (for testing)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  university: z.string().min(1, 'Please select your university'),
  faculty: z.string().min(1, 'Please select your faculty'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface CreateAccountScreenProps {
  onBack: () => void;
  onSignUp: (data: RegisterFormData) => void;
  userRole: 'student' | 'accommodator';
}

// Mock data - in real app, these would come from API
const universities = [
  { label: 'Capital University of Science & Technology', value: 'cust' },
  { label: 'University of Punjab', value: 'pu' },
  { label: 'Lahore University of Management Sciences', value: 'lums' },
];

const faculties = [
  { label: 'Computer Science', value: 'cs' },
  { label: 'Engineering', value: 'eng' },
  { label: 'Business Administration', value: 'ba' },
  { label: 'Social Sciences', value: 'ss' },
];

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  onBack,
  onSignUp,
  userRole,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      university: '',
      faculty: '',
    },
  });

  const watchedFields = watch();
  const allFieldsFilled = Object.values(watchedFields).every(value => value.length > 0);
  const canSubmit = isValid && allFieldsFilled && !isSubmitting;

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration data:', { ...data, role: userRole });
      onSignUp(data);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
              
              <Text style={styles.title}>Create Account</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    placeholder="Your University Mail"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    placeholder="Enter Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    placeholder="Enter Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="university"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    options={universities}
                    selectedValue={value}
                    onSelect={onChange}
                    placeholder="Choose Your University"
                    error={errors.university?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="faculty"
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    options={faculties}
                    selectedValue={value}
                    onSelect={onChange}
                    placeholder="Choose Your Faculty"
                    error={errors.faculty?.message}
                  />
                )}
              />

              <PrimaryButton
                title={isSubmitting ? 'Creating Account...' : 'Sign up'}
                onPress={handleSubmit(onSubmit)}
                disabled={!canSubmit}
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl, // Added proper top spacing
  },
  content: {
    flex: 1,
    paddingTop: theme.spacing.md, // Reduced since SafeAreaView handles top spacing
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xl, // Reduced bottom margin
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  backButtonText: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
    marginRight: 56, // Compensate for back button width
  },
  form: {
    flex: 1,
    paddingBottom: theme.spacing.xxxl, // Increased bottom padding for safe area
  },
  submitButton: {
    marginTop: theme.spacing.lg,
  },
});