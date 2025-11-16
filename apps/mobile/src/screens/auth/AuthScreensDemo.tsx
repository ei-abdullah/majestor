import React, { useState } from 'react';
import { LoginScreen, SignUpScreen } from './index';

/**
 * Simple example showing how to use the new auth screens
 * 
 * To test the new designs:
 * 1. Replace the content of App.tsx with this file
 * 2. Run: npx expo start
 * 3. Open on your device/simulator
 * 
 * The screens will toggle between Login and Sign Up when you tap the tabs or links.
 */

export default function AuthScreensDemo() {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogin = (email: string, password: string) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('====================');
    
    // TODO: Integrate with useLogin hook
    // Example:
    // const loginMutation = useLogin();
    // loginMutation.mutate({ email, password });
    
    alert(`Login attempt:\nEmail: ${email}\nPassword: ${'*'.repeat(password.length)}`);
  };

  const handleSignUp = (fullName: string, email: string, password: string) => {
    console.log('=== SIGN UP ATTEMPT ===');
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('=======================');
    
    // TODO: Integrate with useSignup hook
    // Example:
    // const signupMutation = useSignup();
    // signupMutation.mutate({
    //   email,
    //   password,
    //   username: fullName,
    //   phone: '', // Add later
    //   universityId: 0, // Add later
    //   facultyId: 0, // Add later
    // });
    
    alert(`Sign up attempt:\nName: ${fullName}\nEmail: ${email}\nPassword: ${'*'.repeat(password.length)}`);
  };

  if (showSignUp) {
    return (
      <SignUpScreen
        onSignUp={handleSignUp}
        onLogin={() => setShowSignUp(false)}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onSignUp={() => setShowSignUp(true)}
    />
  );
}
