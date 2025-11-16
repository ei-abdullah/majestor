# 🚀 Quick Start Guide - Majestor Mobile

## For You (Frontend Developer)

### What's Been Built So Far

✅ **Complete API Infrastructure**
- API client with auth token management
- Auth service (login, signup, verify email)
- University service (get universities + faculties)
- TypeScript types matching backend exactly
- React Query hooks for all API calls
- Mock API system (works without backend!)

✅ **Core Systems**
- AuthContext for global auth state
- Secure token storage (Expo Secure Store)
- Form validation with Zod
- Utility functions (date formatting, error handling, etc.)
- Environment configuration (.env support)

✅ **Documentation**
- Complete README with setup instructions
- API integration guide
- Testing checklist
- Troubleshooting section

### Your Next Steps

#### 1. Install Dependencies (if not done)
```bash
cd apps/mobile
npm install
```

#### 2. Quick Test with Mocks
```bash
# .env is already configured for mock mode
npm start
# Scan QR code with Expo Go on your phone
```

Test credentials (mock mode):
- Email: `student@cust.pk` (or any valid email)
- Password: anything except "wrongpassword"

#### 3. Connect to Real Backend
```bash
# In .env file, change:
USE_MOCKS=false
API_BASE_URL=http://localhost:8080

# If testing on phone, use ngrok:
ngrok http 8080
# Then use ngrok URL in API_BASE_URL
```

## 📂 Where to Find Things

### API Integration
- **API Client:** `src/services/apiClient.ts`
- **Auth API:** `src/services/auth.service.ts`
- **University API:** `src/services/university.service.ts`
- **React Query Hooks:** `src/hooks/useAuth.ts`, `src/hooks/useUniversity.ts`

### Types & Validation
- **API Types:** `src/schema/api-schemas.ts` (matches backend DTOs)
- **Form Validation:** `src/schema/zod-schemas.ts` (Zod schemas)
- **App Types:** `src/schema/types.ts` (navigation, features, etc.)

### State Management
- **Auth Context:** `src/contexts/AuthContext.tsx`
- **React Query Config:** `src/stores/queryClient.ts`

### Existing Screens (Need API Integration)
- `src/screens/LoginScreen.tsx` - Has form, needs API call
- `src/screens/CreateAccountScreen.tsx` - Has form, needs API call
- `src/screens/WelcomeScreen.tsx` - Ready
- `src/screens/RoleSelectionScreen.tsx` - Ready
- `src/screens/MainAppScreen.tsx` - Placeholder

### Mock Data (for offline dev)
- **Mock Data:** `src/mocks/mockData.ts`
- **Mock Services:** `src/mocks/mockApi.ts`
- Toggle: `USE_MOCKS=true` in `.env`

## 🎯 What You Should Work On

### Priority 1: Integrate Auth Screens
Update existing screens to use the new API infrastructure:

**LoginScreen.tsx:**
```typescript
// Use the React Query hook
import { useLogin } from '../hooks/useAuth';
import { useAuthContext } from '../contexts/AuthContext';

const { mutate: login, isLoading, error } = useLogin();
const { login: setAuth } = useAuthContext();

// On form submit:
login(formData, {
  onSuccess: (data) => {
    setAuth(data.token, data.authUserDTO);
    // Navigate to main app
  }
});
```

**CreateAccountScreen.tsx:**
```typescript
import { useSignup } from '../hooks/useAuth';
import { useUniversitiesWithFaculties } from '../hooks/useUniversity';

// Load universities for dropdown
const { data: universities, isLoading } = useUniversitiesWithFaculties();

// Use signup mutation
const { mutate: signup } = useSignup();
```

### Priority 2: Add React Navigation
```bash
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
```

Create:
- `src/navigation/RootNavigator.tsx`
- `src/navigation/AuthNavigator.tsx`
- `src/navigation/MainTabNavigator.tsx`

### Priority 3: Build Main App Screens
Based on features from system prompt:
- Discussions (posts, comments)
- Carpool (rides, bookings)
- Accommodation (listings)
- Events (discovery, registration)
- Lost & Found (reports)
- Document Sharing (upload, browse)

## 🔍 Backend Endpoints Available

Check backend to see what's implemented:

**Auth:**
- ✅ POST `/api/v1/auth/login`
- ✅ POST `/api/v1/auth/signup`
- ✅ GET `/api/v1/auth/signup/verify?token=xxx`

**Universities:**
- ✅ GET `/api/v1/university/getWithFaculties`

**Lost & Found:**
- ✅ LostItem endpoints exist (check `apps/api/src/main/java/com/majestor/api/modules/lostfound/`)

**TODO - Ask backend team:**
- Discussions endpoints?
- Carpool endpoints?
- Accommodation endpoints?
- Events endpoints?
- Documents endpoints?

## 🛠 Common Tasks

### Test API Endpoint
```bash
# From apps/mobile directory
curl http://localhost:8080/api/v1/university/getWithFaculties
```

### Check Backend API Structure
```bash
# Backend controllers are in:
cd apps/api/src/main/java/com/majestor/api/modules/
ls -la
# Look at *Controller.java files
```

### Run Backend
```bash
cd apps/api
./mvnw spring-boot:run
```

### Clear Expo Cache
```bash
npx expo start --clear
```

### Check TypeScript Errors
```bash
npx tsc --noEmit
```

## 📖 Important Files to Read

1. **System Prompt:** `systemprompt.md` (at repo root) - Full project requirements
2. **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md` - What's been built
3. **README:** `README.md` - Setup and testing guide
4. **API Schemas:** `src/schema/api-schemas.ts` - All backend types
5. **Image Upload Guide:** `IMAGE_UPLOAD_GUIDE.md` - How to handle images (FormData) ⭐

## 🎨 UI/Design

Existing theme in `src/constants/theme.ts`:
- Purple primary color (#8B5CF6)
- Consistent spacing, typography, shadows
- Modify as needed for your designs

Components in `src/components/`:
- `FormInput.tsx`
- `PrimaryButton.tsx`
- `Dropdown.tsx`
- Add more as needed!

## ⚡ Pro Tips

1. **Always use TypeScript types** from `src/schema/api-schemas.ts`
2. **Use React Query hooks** instead of raw axios calls
3. **Test with mocks first** (`USE_MOCKS=true`) before connecting to backend
4. **Check backend code** if unsure about API request/response format
5. **Use AuthContext** for auth state, not local state
6. **Run on phone** for best testing experience (Expo Go is fast!)

## 🐛 Common Issues

**"Cannot find module" errors:**
```bash
rm -rf node_modules
npm install
```

**TypeScript errors about Promise:**
Already fixed in `tsconfig.json` - just reload VS Code

**API calls failing:**
1. Check `USE_MOCKS` setting in `.env`
2. Verify backend is running
3. Check `API_BASE_URL` is correct
4. Use ngrok for phone testing

**Phone can't connect to localhost:**
```bash
# Use ngrok
ngrok http 8080
# Update API_BASE_URL in .env with ngrok URL
```

## 📞 When You Need Help

**For Frontend:**
- Check existing code in `src/` folder
- Read `IMPLEMENTATION_SUMMARY.md`
- Look at React Query examples in `src/hooks/useAuth.ts`

**For Backend:**
- Check Java controllers in `apps/api/src/main/java/com/majestor/api/modules/`
- Look at DTOs to understand request/response format
- Ask backend team about missing endpoints

**For API Types:**
- Always refer to `src/schema/api-schemas.ts`
- Types match backend DTOs exactly
- Add new types when backend adds new endpoints

---

## 🎯 Your Mission

Build an amazing student app! You have:
- ✅ Solid API foundation
- ✅ Type-safe code
- ✅ Mock data for fast development
- ✅ Backend reference to check endpoints

Focus on:
1. Integrating existing auth screens with API
2. Adding navigation
3. Building feature screens (Discussions, Carpool, etc.)
4. Making it look great!

**Remember:** You're ONLY doing frontend. If you need a new backend endpoint, ask the backend team. Don't modify anything in `apps/api/`.

Good luck! 🚀
