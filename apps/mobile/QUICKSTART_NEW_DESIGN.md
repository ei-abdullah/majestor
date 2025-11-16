# 🎨 Quick Start: Testing New Auth Screens

## Your New Login & Sign Up Screens Are Ready!

### What Was Created
✅ **LoginScreen** - Matches your mockup exactly (Majestor logo, tabs, cyan gradient button, icons)
✅ **SignUpScreen** - Matches your mockup exactly (same styling, Full Name + Email + Password)
✅ **Demo Component** - Ready to test immediately
✅ **Zero Errors** - All TypeScript checks passing

---

## 🚀 Test the Screens NOW (3 Steps)

### Option 1: Quick Demo (Recommended)

1. **Open `App.tsx`**
   
2. **Replace its content with:**
   ```tsx
   import AuthScreensDemo from './src/screens/auth/AuthScreensDemo';
   export default AuthScreensDemo;
   ```

3. **Run the app:**
   ```bash
   npx expo start
   ```

Press `a` for Android, `i` for iOS, or scan QR code with Expo Go.

### Option 2: Custom Integration

If you already have navigation setup:

```tsx
import { LoginScreen, SignUpScreen } from './src/screens/auth';
import { useState } from 'react';

function YourAuthFlow() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  if (mode === 'signup') {
    return (
      <SignUpScreen
        onSignUp={(fullName, email, password) => {
          console.log('Sign up:', { fullName, email, password });
          // Your signup logic here
        }}
        onLogin={() => setMode('login')}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={(email, password) => {
        console.log('Login:', { email, password });
        // Your login logic here
      }}
      onSignUp={() => setMode('signup')}
    />
  );
}
```

---

## 📁 Where Are the Files?

```
apps/mobile/src/screens/auth/
├── LoginScreen.tsx        ← New login design
├── SignUpScreen.tsx       ← New signup design
├── AuthScreensDemo.tsx    ← Demo component (use this to test)
├── index.ts               ← Export file
└── README.md              ← Detailed documentation
```

**Original screens are preserved** in `src/screens/` (not touched).

---

## 🎯 What You'll See

### Login Screen
- **Majestor logo** (purple circle with "M") + brand name
- **"Your campus life, unified"** tagline
- **Login/Sign Up tabs** with cyan underline
- **Email or Student ID** input with 📧 icon
- **Password** input with 🔒 icon and 👁️ show/hide toggle
- **Forgot Password?** link
- **Cyan gradient button** "Login to Majestor"
- **"New to Majestor? Join now"** link → switches to Sign Up

### Sign Up Screen
- **Same logo and tagline**
- **Login/Sign Up tabs** (Sign Up active)
- **Full Name** input with 👤 icon
- **University Email** input with 📧 icon
- **Password** input with 🔒 icon and 👁️ toggle
- **Cyan gradient button** "Create Account"
- **Terms & Privacy Policy** text with links
- **"Already have an account? Login"** link → switches to Login

---

## ⚡ Features Working

- ✅ Tab switching (Login ↔ Sign Up)
- ✅ Password show/hide toggle
- ✅ Keyboard auto-dismiss
- ✅ Scroll support (for small screens)
- ✅ Form data collection (email, password, full name)
- ✅ Callbacks fire on button press

---

## 🔄 Next Steps After Testing

### 1. Add Validation (react-hook-form + zod)

Already have the schemas in `src/schema/zod-schemas.ts`:

```tsx
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schema/zod-schemas';

const { control, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
});
```

### 2. Connect to Auth Hooks

Already have hooks in `src/hooks/useAuth.ts`:

```tsx
import { useLogin, useSignup } from '../../hooks/useAuth';

const loginMutation = useLogin();

onLogin={(email, password) => {
  loginMutation.mutate({ email, password });
}}
```

### 3. Add Loading States

```tsx
{loginMutation.isLoading && (
  <ActivityIndicator size="small" color="#22D3EE" />
)}
```

### 4. Add Error Messages

```tsx
{loginMutation.isError && (
  <Text style={styles.error}>
    {loginMutation.error.message}
  </Text>
)}
```

---

## 🎨 Design Specs

| Element | Value |
|---------|-------|
| **Logo Background** | `#8B5CF6` (Purple) |
| **Button Gradient** | `#22D3EE` → `#06B6D4` (Cyan) |
| **Active Tab** | `#22D3EE` (Cyan) |
| **Input Background** | `#F8FAFC` (Light Gray) |
| **Input Border** | `#E2E8F0` (Gray) |
| **Border Radius** | `12px` |
| **Container Padding** | `24px` |

---

## 💡 Pro Tips

1. **Testing on Physical Device**: Expo Go shows exact colors/gradients
2. **Keyboard Behavior**: `KeyboardAvoidingView` handles iOS/Android automatically
3. **Icons**: Currently using emoji (📧 🔒 👤 👁️), can replace with `react-native-vector-icons` later
4. **Gradients**: Using `expo-linear-gradient` (already installed)
5. **Safe Areas**: Using `react-native-safe-area-context` for notches/home indicators

---

## 🐛 Troubleshooting

### "Cannot find module './src/screens/auth/AuthScreensDemo'"

Make sure you're in the `apps/mobile` directory:
```bash
cd apps/mobile
npx expo start
```

### "LinearGradient not found"

Already installed! But if issues:
```bash
npm install expo-linear-gradient
```

### "Screens look different on iOS/Android"

This is normal - React Native has slight platform differences. The design adapts automatically.

---

## 📸 Want to See Before Running?

The screens match these mockup specs:

**Login**: Logo → Tagline → Tabs → Email Input → Password Input → Forgot Password → Gradient Button → Sign Up Link

**Sign Up**: Logo → Tagline → Tabs → Name Input → Email Input → Password Input → Gradient Button → Terms Text → Login Link

---

## 🎉 You're Ready!

Just open `App.tsx`, import `AuthScreensDemo`, and run `npx expo start`.

The exact designs from your mockups are now live and functional! 🚀

---

**Questions?** Check:
- `src/screens/auth/README.md` - Full documentation
- `DESIGN_IMPLEMENTATION.md` - Design comparison
- `src/screens/auth/LoginScreen.tsx` - Source code

**Happy testing!** 🎨
