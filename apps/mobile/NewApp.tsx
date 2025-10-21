import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { RoleSelectionScreen } from './src/screens/RoleSelectionScreen';
import { CreateAccountScreen } from './src/screens/CreateAccountScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MainAppScreen } from './src/screens/MainAppScreen';

type ScreenType = 'welcome' | 'roleSelection' | 'login' | 'createAccount' | 'mainApp';
type UserRole = 'student' | 'accommodator' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [userRole, setUserRole] = useState<UserRole>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onContinue={() => setCurrentScreen('roleSelection')} 
          />
        );
        
      case 'roleSelection':
        return (
          <RoleSelectionScreen
            onBack={() => setCurrentScreen('welcome')}
            onLogin={() => setCurrentScreen('login')}
            onStudentSignup={() => {
              setUserRole('student');
              setCurrentScreen('createAccount');
            }}
            onAccommodatorSignup={() => {
              setUserRole('accommodator');
              setCurrentScreen('createAccount');
            }}
          />
        );
        
      case 'login':
        return (
          <LoginScreen
            onBack={() => setCurrentScreen('roleSelection')}
            onLogin={(data) => {
              console.log('Login successful:', data);
              setCurrentScreen('mainApp');
            }}
            onSignUp={() => setCurrentScreen('roleSelection')}
          />
        );
        
      case 'createAccount':
        return (
          <CreateAccountScreen
            onBack={() => setCurrentScreen('roleSelection')}
            onSignUp={(data) => {
              console.log('Registration successful:', data);
              setCurrentScreen('mainApp');
            }}
            userRole={userRole || 'student'}
          />
        );
        
      case 'mainApp':
        return (
          <MainAppScreen
            onLogout={() => {
              setCurrentScreen('welcome');
              setUserRole(null);
            }}
          />
        );
        
      default:
        return (
          <WelcomeScreen 
            onContinue={() => setCurrentScreen('roleSelection')} 
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {renderScreen()}
    </SafeAreaProvider>
  );
}