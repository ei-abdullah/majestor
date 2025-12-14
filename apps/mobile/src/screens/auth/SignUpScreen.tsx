import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSignup } from '../../hooks/useAuth';

interface SignUpScreenProps {
  onSignUp: (fullName: string, email: string, password: string) => void;
  onLogin: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignUp,
  onLogin,
}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showUniversityPicker, setShowUniversityPicker] = useState(false);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  
  // Mock data - replace with actual API calls
  const universities = [
    { id: 1, name: 'FAST-NUCES' },
    { id: 2, name: 'NUST' },
    { id: 3, name: 'LUMS' },
    { id: 4, name: 'IBA' },
  ];

  const faculties = [
    { id: 1, name: 'Computer Science', universityId: 1 },
    { id: 2, name: 'Software Engineering', universityId: 1 },
    { id: 3, name: 'Electrical Engineering', universityId: 1 },
    { id: 4, name: 'Business Administration', universityId: 1 },
    { id: 5, name: 'Computer Science', universityId: 2 },
    { id: 6, name: 'Mechanical Engineering', universityId: 2 },
    { id: 7, name: 'Civil Engineering', universityId: 2 },
    { id: 8, name: 'Business Administration', universityId: 2 },
    { id: 9, name: 'Computer Science', universityId: 3 },
    { id: 10, name: 'Economics', universityId: 3 },
    { id: 11, name: 'Law', universityId: 3 },
    { id: 12, name: 'Business Administration', universityId: 3 },
    { id: 13, name: 'Business Administration', universityId: 4 },
    { id: 14, name: 'Economics', universityId: 4 },
    { id: 15, name: 'Accounting & Finance', universityId: 4 },
  ];

  const availableFaculties = selectedUniversity 
    ? faculties.filter(f => f.universityId === selectedUniversity)
    : [];
  
  const signupMutation = useSignup();

  const handleSignUp = () => {
    if (username && email && password && phoneNumber && selectedUniversity && selectedFaculty) {
      signupMutation.mutate(
        {
          email,
          password,
          username: username,
          phone: phoneNumber,
          universityId: selectedUniversity,
          facultyId: selectedFaculty,
        },
        {
          onSuccess: (data) => {
            console.log('Signup successful:', data);
            onSignUp(username, email, password);
          },
          onError: (error: any) => {
            console.error('Signup failed:', error);
            const errorMessage = error?.response?.data?.message 
              || error?.response?.data?.error
              || error?.message 
              || 'Signup failed. Please try again.';
            // Handle array of error messages from backend validation
            const displayMessage = Array.isArray(errorMessage) 
              ? errorMessage.join('\n') 
              : errorMessage;
            alert(displayMessage);
          },
        }
      );
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <LinearGradient
      colors={['#F0F4FF', '#FFFFFF']}
      style={styles.gradientContainer}
    >
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
            {/* Logo and Title */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <LinearGradient
                  colors={['#4A90E2', '#63B3ED']}
                  style={styles.logo}
                >
                  <Ionicons name="snow" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.brandName}>Majestor</Text>
              </View>
              <Text style={styles.tagline}>Your campus life, unified</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
              <TouchableOpacity style={styles.tab} onPress={onLogin}>
                <Text style={styles.inactiveTabText}>Login</Text>
              </TouchableOpacity>
              <View style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>Sign Up</Text>
              </View>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <View style={styles.form}>
                <Text style={styles.inputLabel}>Username</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="johndoe"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>

                <Text style={styles.inputLabel}>University Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="your@university.edu.pk"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+92 300 1234567"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>

                <Text style={styles.inputLabel}>University</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowUniversityPicker(!showUniversityPicker)}
                >
                  <Ionicons name="school-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <Text style={[styles.input, !selectedUniversity && styles.placeholderText]}>
                    {selectedUniversity 
                      ? universities.find(u => u.id === selectedUniversity)?.name 
                      : 'Select your university'
                    }
                  </Text>
                  <Ionicons name={showUniversityPicker ? "chevron-up" : "chevron-down"} size={20} color="#9CA3AF" />
                </TouchableOpacity>

                {showUniversityPicker && (
                  <View style={styles.pickerContainer}>
                    {universities.map((university) => (
                      <TouchableOpacity
                        key={university.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setSelectedUniversity(university.id);
                          setSelectedFaculty(null); // Reset faculty when university changes
                          setShowUniversityPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedUniversity === university.id && styles.pickerItemTextActive
                        ]}>
                          {university.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.inputLabel}>Faculty</Text>
                <TouchableOpacity
                  style={[styles.inputContainer, !selectedUniversity && styles.inputDisabled]}
                  onPress={() => selectedUniversity && setShowFacultyPicker(!showFacultyPicker)}
                  disabled={!selectedUniversity}
                >
                  <Ionicons name="book-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <Text style={[styles.input, !selectedFaculty && styles.placeholderText]}>
                    {selectedFaculty 
                      ? faculties.find(f => f.id === selectedFaculty)?.name 
                      : selectedUniversity ? 'Select your faculty' : 'Select university first'
                    }
                  </Text>
                  <Ionicons name={showFacultyPicker ? "chevron-up" : "chevron-down"} size={20} color="#9CA3AF" />
                </TouchableOpacity>

                {showFacultyPicker && selectedUniversity && (
                  <View style={styles.pickerContainer}>
                    {availableFaculties.map((faculty) => (
                      <TouchableOpacity
                        key={faculty.id}
                        style={styles.pickerItem}
                        onPress={() => {
                          setSelectedFaculty(faculty.id);
                          setShowFacultyPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedFaculty === faculty.id && styles.pickerItemTextActive
                        ]}>
                          {faculty.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a strong password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity 
                  style={styles.signupButton}
                  onPress={handleSignUp}
                  activeOpacity={0.8}
                  disabled={signupMutation.isPending || !username || !email || !password || !phoneNumber || !selectedUniversity || !selectedFaculty}
                >
                  <LinearGradient
                    colors={signupMutation.isPending ? ['#9CA3AF', '#6B7280'] : ['#4A90E2', '#50C9C3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                  >
                    {signupMutation.isPending ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.signupButtonText}>Create Account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Error Message */}
                {signupMutation.isError && (
                  <Text style={styles.errorText}>
                    {signupMutation.error?.message || 'Signup failed. Please try again.'}
                  </Text>
                )}

                {/* Terms and Privacy */}
                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>By signing up, you agree to our </Text>
                  <TouchableOpacity>
                    <Text style={styles.termsLink}>Terms</Text>
                  </TouchableOpacity>
                  <Text style={styles.termsText}> and </Text>
                  <TouchableOpacity>
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </TouchableOpacity>
                </View>

                {/* Login link */}
                <View style={styles.loginPrompt}>
                  <Text style={styles.loginPromptText}>Already have an account? </Text>
                  <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.loginLink}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  brandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '400',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  inactiveTabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  form: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  inputDisabled: {
    opacity: 0.5,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: -12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemText: {
    fontSize: 15,
    color: '#374151',
  },
  pickerItemTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  eyeIcon: {
    padding: 8,
  },
  eyeIconText: {
    fontSize: 20,
  },
  signupButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: -8,
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  termsText: {
    fontSize: 13,
    color: '#6B7280',
  },
  termsLink: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginPromptText: {
    fontSize: 15,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
  },
});
