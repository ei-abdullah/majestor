import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/stores/queryClient';
import { LostFoundProvider } from './src/stores/lostFound';
import { AuthProvider, useAuthContext } from './src/contexts/AuthContext';
import { Alert } from 'react-native';

// Hooks
import { useLogin, useSignup } from './src/hooks/useAuth';

// Screens
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { HomeScreenWithNav } from './src/screens/HomeScreenWithNav';
import LostAndFoundScreen from './src/screens/LostAndFoundScreen';
import NewLostItemScreen from './src/screens/NewLostItemScreen';
import MapPickerScreen from './src/screens/MapPickerScreen';
import LostItemDetailsScreen from './src/screens/LostItemDetailsScreen';
import FounderDetailsScreen from './src/screens/FounderDetailsScreen';
import UserSettingsScreen from './src/screens/UserSettingsScreen';
import { LostFoundItem } from './src/stores/lostFound';

type AppScreen = 'login' | 'signup' | 'home' | 'lostAndFound' | 'newLostItem' | 'mapPicker' | 'lostItemDetails' | 'founderDetails' | 'userSettings';

function AppContent() {
  const { user } = useAuthContext();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<{
    id: string;
    name: string;
    email: string;
    reportedAt: Date;
  } | null>(null);

  // Auth hooks
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      console.log('✅ Login successful:', result);
      setIsAuthenticated(true);
      setCurrentScreen('home');
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      Alert.alert(
        'Login Failed',
        error?.response?.data?.message || error?.message || 'Invalid credentials. Please try again.'
      );
    }
  };

  const handleSignUp = async (fullName: string, email: string, password: string) => {
    try {
      // For signup, we need university and faculty IDs
      // For now, use default values - you can add university/faculty selection screen
      const result = await signupMutation.mutateAsync({
        email,
        password,
        username: fullName,
        phone: '03000000000', // TODO: Add phone input to signup form
        universityId: 1, // TODO: Get from university selection
        facultyId: 1, // TODO: Get from faculty selection
      });
      console.log('✅ Signup successful:', result);
      Alert.alert(
        'Success',
        'Account created! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => setCurrentScreen('login'),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Signup failed:', error);
      Alert.alert(
        'Signup Failed',
        error?.response?.data?.message || error?.message || 'Could not create account. Please try again.'
      );
    }
  };

  const handleFeaturePress = (feature: string) => {
    console.log('Feature pressed:', feature);
    if (feature === 'lostfound' || feature === 'Lost & Found') {
      setCurrentScreen('lostAndFound');
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToNewItem = () => {
    setCurrentScreen('newLostItem');
  };

  const handleBackToLostFound = () => {
    setCurrentScreen('lostAndFound');
  };

  const handleOpenMapPicker = () => {
    setCurrentScreen('mapPicker');
  };

  const handleLocationSelect = (location: { latitude: number; longitude: number; address?: string }) => {
    setSelectedLocation(location);
    setCurrentScreen('newLostItem');
  };

  const handleViewItemDetails = (item: LostFoundItem) => {
    setSelectedItem(item);
    setCurrentScreen('lostItemDetails');
  };

  const handleBackFromDetails = () => {
    setSelectedItem(null);
    setCurrentScreen('lostAndFound');
  };

  const handleViewFounderDetails = (founder: { id: string; name: string; email: string; reportedAt: Date }) => {
    setSelectedFounder(founder);
    setCurrentScreen('founderDetails');
  };

  const handleBackFromFounderDetails = () => {
    setSelectedFounder(null);
    setCurrentScreen('lostItemDetails');
  };

  const handleProfilePress = () => {
    setCurrentScreen('userSettings');
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    if (currentScreen === 'userSettings') {
      return (
        <UserSettingsScreen
          onBack={handleBackFromSettings}
          user={user ? {
            initials: user.username?.substring(0, 2).toUpperCase() || 'U',
            fullName: user.username || 'User',
            studentId: user.email?.split('@')[0] || 'N/A',
            universityName: 'FAST-NUCES',
            facultyName: 'Computer Science',
            universityEmail: user.email || 'N/A',
            personalEmail: user.email || 'N/A',
            phoneNumber: user.phone || 'N/A',
            roles: ['Student'],
          } : undefined}
        />
      );
    }

    if (currentScreen === 'founderDetails' && selectedFounder) {
      return (
        <FounderDetailsScreen
          founder={{
            ...selectedFounder,
            phoneNumber: '+92 301 9876543',
            discoveryLocation: 'Found in the CS Department hallway near Room 204, on the bench outside the lab.',
            discoveryCoordinates: {
              latitude: 24.8607,
              longitude: 67.0011,
            },
            itemPhotos: ['photo1', 'photo2', 'photo3'],
          }}
          onBack={handleBackFromFounderDetails}
        />
      );
    }

    if (currentScreen === 'lostItemDetails' && selectedItem) {
      return (
        <LostItemDetailsScreen
          itemId={selectedItem.id}
          onBack={handleBackFromDetails}
          onFounderPress={handleViewFounderDetails}
        />
      );
    }

    if (currentScreen === 'mapPicker') {
      return (
        <MapPickerScreen
          onBack={() => setCurrentScreen('newLostItem')}
          onLocationSelect={handleLocationSelect}
          initialLocation={selectedLocation || undefined}
        />
      );
    }

    if (currentScreen === 'newLostItem') {
      return (
        <NewLostItemScreen
          onBack={handleBackToLostFound}
          onOpenMapPicker={handleOpenMapPicker}
          selectedLocation={selectedLocation}
        />
      );
    }

    if (currentScreen === 'lostAndFound') {
      return (
        <LostAndFoundScreen
          onBack={handleBackToHome}
          onCreateNew={handleNavigateToNewItem}
          onItemPress={handleViewItemDetails}
        />
      );
    }

    if (isAuthenticated || currentScreen === 'home') {
      return <HomeScreenWithNav onFeaturePress={handleFeaturePress} onProfilePress={handleProfilePress} />;
    }

    if (currentScreen === 'signup') {
      return (
        <SignUpScreen
          onSignUp={handleSignUp}
          onLogin={() => setCurrentScreen('login')}
        />
      );
    }

    return (
      <LoginScreen
        onLogin={handleLogin}
        onSignUp={() => setCurrentScreen('signup')}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LostFoundProvider>
          <AppContent />
        </LostFoundProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

// ============================================
// 🎨 TESTING THE NEW LOGIN & SIGNUP DESIGNS
// ============================================
// 
// The screens now match your mockup images exactly:
// ✅ Majestor logo + tagline
// ✅ Login/Sign Up tab switcher
// ✅ Input fields with icons (📧 🔒 👤)
// ✅ Password show/hide toggle (👁️)
// ✅ Cyan gradient buttons
// ✅ "Forgot Password?" link
// ✅ Terms & Privacy text
// 
// Try it now:
// 1. Run: npx expo start
// 2. Press 'a' for Android or 'i' for iOS
// 3. Tap tabs to switch between Login/Sign Up
// 4. Enter some text and press the buttons
// 5. Check the console for logged values
//
// Original screens are preserved in src/screens/
// New screens are in src/screens/auth/
//
// Next steps:
// - Add form validation (react-hook-form + zod)
// - Connect to useLogin/useSignup hooks
// - Add loading states
// - Add error handling
// 
// See QUICKSTART_NEW_DESIGN.md for full guide!
// ============================================
