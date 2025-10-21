import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Step 1 - Basic Info Schema
const step1Schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type Step1FormData = z.infer<typeof step1Schema>;

interface MultiStepRegisterScreenProps {
  userRole: 'student' | 'accommodater';
  onBack: () => void;
  onLogin?: () => void;
}

interface FormInputProps {
  control: any;
  name: keyof Step1FormData;
  placeholder: string;
  secureTextEntry?: boolean;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  error,
  autoCapitalize = 'sentences',
  keyboardType = 'default',
}) => (
  <View style={styles.inputContainer}>
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          placeholderTextColor={theme.colors.textSecondary}
        />
      )}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const MultiStepRegisterScreen: React.FC<MultiStepRegisterScreenProps> = ({ 
  userRole, 
  onBack,
  onLogin
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch all form values to enable/disable next button
  const watchedFields = watch();
  const allFieldsFilled = Object.values(watchedFields).every(value => value.length > 0);
  const canProceed = isValid && allFieldsFilled && !isSubmitting;

  const onStep1Submit = (data: Step1FormData) => {
    console.log('Step 1 Data:', data);
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleBackToStep1 = () => {
    setCurrentStep(1);
  };

  if (currentStep === 2 && step1Data) {
    return (
      <Step2UniversityScreen
        userRole={userRole}
        step1Data={step1Data}
        onBack={handleBackToStep1}
        onComplete={onBack} // This will go back to role selection for now
        onLogin={onLogin}
      />
    );
  }

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
          <View style={styles.formContainer}>
            {/* Header */}
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressStep, styles.activeStep]} />
                <View style={[styles.progressStep]} />
              </View>
              <Text style={styles.progressText}>Step 1 of 2</Text>
            </View>

            <Text style={styles.title}>
              Create {userRole === 'student' ? 'Student' : 'Accommodater'} Account
            </Text>
            <Text style={styles.subtitle}>
              Let's start with your basic information
            </Text>

            <View style={styles.formContent}>
              <FormInput
                control={control}
                name="email"
                placeholder="Email Address"
                error={errors.email?.message}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <FormInput
                control={control}
                name="username"
                placeholder="Username"
                error={errors.username?.message}
                autoCapitalize="none"
              />

              <FormInput
                control={control}
                name="password"
                placeholder="Password"
                secureTextEntry
                error={errors.password?.message}
                autoCapitalize="none"
              />

              <FormInput
                control={control}
                name="confirmPassword"
                placeholder="Confirm Password"
                secureTextEntry
                error={errors.confirmPassword?.message}
                autoCapitalize="none"
              />

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !canProceed && styles.nextButtonDisabled
                ]}
                onPress={handleSubmit(onStep1Submit)}
                disabled={!canProceed}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.nextButtonText,
                  !canProceed && styles.nextButtonTextDisabled
                ]}>
                  Next: University Info
                </Text>
              </TouchableOpacity>

              {onLogin && (
                <View style={styles.loginPrompt}>
                  <Text style={styles.loginPromptText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Step 2 Component
interface Step2UniversityScreenProps {
  userRole: 'student' | 'accommodater';
  step1Data: Step1FormData;
  onBack: () => void;
  onComplete: () => void;
  onLogin?: () => void;
}

const Step2UniversityScreen: React.FC<Step2UniversityScreenProps> = ({
  userRole,
  step1Data,
  onBack,
  onComplete,
  onLogin,
}) => {
  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [universityDropdownLayout, setUniversityDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [facultyDropdownLayout, setFacultyDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Universities in Islamabad
  const universities = [
    'COMSATS University Islamabad',
    'National University of Sciences and Technology (NUST)',
    'Quaid-i-Azam University',
    'International Islamic University, Islamabad (IIUI)',
    'Pakistan Institute of Engineering and Applied Sciences (PIEAS)',
    'Air University',
    'Federal Urdu University of Arts, Sciences and Technology',
    'Capital University of Science and Technology (CUST)',
    'Foundation University Islamabad',
    'Riphah International University',
    'Bahria University Islamabad',
    'Preston University',
    'Iqra University Islamabad',
    'Arid Agriculture University',
    'Allama Iqbal Open University',
  ];

  // Faculties
  const faculties = [
    'Faculty of Computing',
    'Faculty of Engineering',
    'Faculty of Medical Sciences',
    'Faculty of Business Administration',
    'Faculty of Social Sciences',
    'Faculty of Natural Sciences',
    'Faculty of Arts and Humanities',
    'Faculty of Law',
    'Faculty of Education',
    'Faculty of Agriculture',
    'Faculty of Architecture and Design',
    'Faculty of Economics',
    'Faculty of Psychology',
    'Faculty of Mathematics',
    'Faculty of Physics',
    'Faculty of Chemistry',
    'Faculty of Biology',
    'Faculty of Environmental Sciences',
    'Faculty of Management Sciences',
    'Faculty of Communication and Media Studies',
  ];

  const canComplete = selectedUniversity && selectedFaculty;

  const handleComplete = () => {
    const completeRegistrationData = {
      ...step1Data,
      university: selectedUniversity,
      faculty: selectedFaculty,
      userRole,
    };

    console.log('Complete Registration Data:', completeRegistrationData);

    // TODO: Send to API
    // await authService.register(completeRegistrationData);

    onComplete();
  };

  const DropdownModal = ({ 
    visible, 
    items, 
    onSelect, 
    onClose, 
    selectedValue 
  }: {
    visible: boolean;
    items: string[];
    onSelect: (item: string) => void;
    onClose: () => void;
    selectedValue: string;
  }) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={true}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  selectedValue === item && styles.modalItemSelected,
                  index === items.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedValue === item && styles.modalItemTextSelected
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
          <View style={styles.formContainer}>
            {/* Header */}
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressStep, styles.completedStep]} />
                <View style={[styles.progressStep, styles.activeStep]} />
              </View>
              <Text style={styles.progressText}>Step 2 of 2</Text>
            </View>

            <Text style={styles.title}>University Information</Text>
            <Text style={styles.subtitle}>
              Select your university and faculty
            </Text>

            <View style={styles.formContent}>
              {/* University Dropdown */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>University *</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowUniversityDropdown(true)}
                >
                  <Text style={[
                    styles.dropdownText,
                    !selectedUniversity && styles.dropdownPlaceholder
                  ]}>
                    {selectedUniversity || 'Select your university'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              {/* Faculty Dropdown */}
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownLabel}>Faculty *</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowFacultyDropdown(true)}
                >
                  <Text style={[
                    styles.dropdownText,
                    !selectedFaculty && styles.dropdownPlaceholder
                  ]}>
                    {selectedFaculty || 'Select your faculty'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !canComplete && styles.nextButtonDisabled
                ]}
                onPress={handleComplete}
                disabled={!canComplete}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.nextButtonText,
                  !canComplete && styles.nextButtonTextDisabled
                ]}>
                  Complete Registration
                </Text>
              </TouchableOpacity>

              {onLogin && (
                <View style={styles.loginPrompt}>
                  <Text style={styles.loginPromptText}>
                    Already have an account?{' '}
                  </Text>
                  <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.loginLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* University Dropdown Modal */}
      <DropdownModal
        visible={showUniversityDropdown}
        items={universities}
        onSelect={setSelectedUniversity}
        onClose={() => setShowUniversityDropdown(false)}
        selectedValue={selectedUniversity}
      />

      {/* Faculty Dropdown Modal */}
      <DropdownModal
        visible={showFacultyDropdown}
        items={faculties}
        onSelect={setSelectedFaculty}
        onClose={() => setShowFacultyDropdown(false)}
        selectedValue={selectedFaculty}
      />
    </SafeAreaView>
  );
};

// Theme colors (consistent with other screens)
const theme = {
  colors: {
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1F2937',
    textSecondary: '#6B7280',
    error: '#EF4444',
    border: '#E5E7EB',
    borderError: '#FCA5A5',
    disabled: '#F3F4F6',
    disabledText: '#9CA3AF',
    success: '#10B981',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
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
    paddingVertical: theme.spacing.lg,
  },
  formContainer: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressBar: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  progressStep: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  completedStep: {
    backgroundColor: theme.colors.success,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  formContent: {
    gap: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    minHeight: 50,
  },
  inputError: {
    borderColor: theme.colors.borderError,
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  nextButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    minHeight: 50,
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  nextButtonDisabled: {
    backgroundColor: theme.colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: theme.colors.disabledText,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  loginPromptText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  // Dropdown Styles
  dropdownContainer: {
    marginBottom: theme.spacing.lg,
    position: 'relative',
    zIndex: 2,
  },
  dropdownLabel: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  dropdown: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 50,
    position: 'relative',
  },
  dropdownText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  dropdownPlaceholder: {
    color: theme.colors.textSecondary,
  },
  dropdownArrow: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.borderRadius.md,
    borderBottomRightRadius: theme.borderRadius.md,
    marginTop: -1,
    maxHeight: 150,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 1000,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 150,
    flexGrow: 0,
  },
  dropdownItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  dropdownItemText: {
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 20,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    maxHeight: Dimensions.get('window').height * 0.6,
    width: '100%',
    maxWidth: 350,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalScrollView: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  modalItemSelected: {
    backgroundColor: '#EBF4FF',
  },
  modalItemText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 20,
  },
  modalItemTextSelected: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default MultiStepRegisterScreen;