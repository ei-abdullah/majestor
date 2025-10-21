# Majestor - Student Campus Life App

## Overview
Majestor is Pakistan's first student-exclusive mobile app focused on campus life, built with React Native (Expo) and TypeScript.

## Features
- User Registration with validation
- Discussions (posts, comments, upvoting)
- Carpooling (create and book rides)
- Accommodation listings
- Events discovery and registration
- Lost & Found system
- Document sharing

## Tech Stack
- **Framework**: React Native with Expo managed workflow
- **Language**: TypeScript
- **Form Handling**: react-hook-form + zod validation
- **API Client**: Axios
- **UI Components**: React Native Paper
- **Navigation**: React Navigation (to be added)
- **Data Fetching**: TanStack Query (React Query)

## Quick Start

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- For testing on device: Expo Go app

### Installation

1. **Install Expo CLI globally:**
   ```bash
   npm install -g expo-cli
   ```

2. **Install project dependencies:**
   ```bash
   cd majestor-app
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

### How to Test on Your Phone

#### Option 1: Using Expo Go (Recommended for Development)

1. **Install Expo Go on your device:**
   - iOS: Download from App Store
   - Android: Download from Google Play Store

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Connect your device:**
   - **iOS**: Open Camera app and scan the QR code displayed in terminal
   - **Android**: Open Expo Go app and scan the QR code

4. **The app will load directly on your device!**

#### Option 2: Using Emulator/Simulator

**For Android:**
1. Install Android Studio
2. Create an Android Virtual Device (AVD)
3. Start the AVD
4. Run: `npx expo start`
5. Press `a` to open on Android emulator

**For iOS (macOS only):**
1. Install Xcode
2. Open iOS Simulator
3. Run: `npx expo start`
4. Press `i` to open on iOS simulator

### Environment Configuration

1. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Configure API base URL in `.env`:**
   ```env
   API_BASE_URL=https://your-backend-url.com
   USE_MOCKS=false
   ```

3. **For local development with backend:**
   ```env
   API_BASE_URL=http://your-local-ip:8080
   USE_MOCKS=false
   ```

   Note: Use your computer's IP address, not `localhost`, when testing on physical devices.

### Current Features Implemented

#### ✅ Login Screen
- **Location**: `LoginScreen.tsx`
- **Features**:
  - Email and Password input fields
  - Real-time form validation using Zod
  - Email format validation, non-empty password validation
  - Inline error messages under each field
  - Button disabled until all validations pass
  - "Forgot Password?" link (ready for navigation)
  - "Don't have an account? Register" link with navigation
  - Console logging of form data on submit
  - Clean, modern UI consistent with Register screen

**Testing the Login Screen:**
1. Start the app: `npx expo start`
2. Open on device/emulator (defaults to Login screen)
3. Try invalid email formats to see validation
4. Leave password empty to see validation
5. Fill valid credentials and submit - check console for logged data
6. Use the "Switch to Register" button (top-right) to test navigation

#### Form Validation Rules:
- **Email**: Valid email format required
- **Password**: Cannot be empty (any length accepted for login)

#### ✅ Register Screen
- **Location**: `RegisterScreen.tsx`
- **Features**:
  - Full Name, Email, Password, Confirm Password fields
  - Real-time form validation using Zod
  - Inline error messages under each field if invalid
  - Button disabled until all validations pass
  - Console logging of form data on submit
  - Clean, modern UI with proper styling
  - Responsive design with KeyboardAvoidingView

**Testing the Register Screen:**
1. Use the "Switch to Register" button from Login screen
2. Fill in the form fields
3. Try invalid inputs to see validation messages
4. Submit valid form - check console for logged data
5. Button should be disabled until all fields are valid
4. Try invalid inputs to see validation messages
5. Submit valid form - check console for logged data
6. Button should be disabled until all fields are valid

#### Form Validation Rules:
- **Full Name**: Minimum 2 characters
- **Email**: Valid email format required
- **Password**: Minimum 8 characters
- **Confirm Password**: Must match password exactly

### Project Structure

```
/src
  /components       # Reusable UI components
  /screens          # App screens (Auth, Home, etc.)
  /services         # API services and HTTP client
  /schema           # TypeScript types and Zod schemas
  /constants        # Theme, colors, spacing
  /hooks            # Custom React hooks
  /navigation       # Navigation configuration
  /utils            # Helper functions
```

### API Integration

The app is configured to work with mock data by default. To connect to a real backend:

1. **Update `.env` file:**
   ```env
   API_BASE_URL=https://your-backend-api.com
   USE_MOCKS=false
   ```

2. **API Client Configuration:**
   - Base client: `src/services/apiClient.ts`
   - Auth service: `src/services/auth.service.ts`

3. **Expected Login API Endpoint:**
   ```
   POST /api/auth/login
   
   Request Body:
   {
     "email": "string",
     "password": "string"
   }
   
   Response:
   {
     "success": true,
     "user": { ... },
     "token": "jwt-token"
   }
   ```

4. **Expected Register API Endpoint:**
   ```
   POST /api/auth/register
   
   Request Body:
   {
     "fullName": "string",
     "email": "string",
     "password": "string"
   }
   
   Response:
   {
     "success": true,
     "user": { ... },
     "token": "jwt-token"
   }
   ```

### Testing with Backend Developer

**Checklist for backend integration:**

1. **Confirm backend is running and accessible**
   - Test: `curl http://your-backend-url/health` (if health endpoint exists)
   - Check: Backend logs show incoming requests

2. **Test login endpoint:**
   ```bash
   curl -X POST http://your-backend-url/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass123"}'
   ```

3. **Test registration endpoint:**
   ```bash
   curl -X POST http://your-backend-url/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@example.com","password":"testpass123"}'
   ```

3. **Debug network requests:**
   - Enable React Native debugging
   - Check Network tab in Chrome DevTools
   - Use Expo Dev Tools → Network inspector

4. **Common issues:**
   - CORS errors (backend configuration needed)
   - IP address issues (use computer IP, not localhost)
   - Firewall blocking connections

### Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feat/feature-name
   ```

2. **Make changes and test**

3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Feat/Auth - implemented registration screen"
   git push origin feat/feature-name
   ```

### Native Modules (When Needed)

For features requiring native modules (camera, payments, biometrics):

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure app.json plugins** (example for camera):
   ```json
   {
     "plugins": [
       "expo-camera"
     ]
   }
   ```

3. **Build custom dev client:**
   ```bash
   eas build --profile development --platform ios
   eas build --profile development --platform android
   ```

4. **Install dev client and start:**
   ```bash
   eas dev --platform ios
   ```

⚠️ **Note**: Expo Go won't work with native modules. Custom dev client required.

### Troubleshooting

**App won't start:**
- Clear Expo cache: `expo r -c`
- Clear npm cache: `npm start -- --clear`
- Restart Metro: `npx expo start --clear`

**Device not connecting:**
- Ensure device and computer on same WiFi
- Check IP address in `.env` file
- Try restarting Expo dev server

**TypeScript errors:**
- Run: `npx tsc --noEmit` to check types
- Ensure all dependencies installed: `npm install`

**Form validation not working:**
- Check browser console for errors
- Verify Zod schema syntax
- Test form submission in debugger

### Next Steps

1. **Implement authentication service** (`src/services/auth.service.ts`)
2. **Add navigation** (React Navigation stack)
3. **Create login screen** (similar to register)
4. **Add other core screens** (Home, Discussions, etc.)
5. **Integrate with backend APIs**
6. **Add proper error handling and loading states**

### Support

For questions or issues:
1. Check this README first
2. Review the system prompt in `systemprompt.md`
3. Test with mock data to isolate API issues
4. Use React Native debugger for detailed error info

---

**Happy coding! 🚀**
