# New Auth Screens (Matching Design Mockups)

## Location
- `src/screens/auth/LoginScreen.tsx`
- `src/screens/auth/SignUpScreen.tsx`

## Features

### LoginScreen
✅ **Majestor logo** with tagline "Your campus life, unified"
✅ **Tab switcher** - Login/Sign Up tabs with active state indicator
✅ **Email or Student ID** input field with 📧 icon
✅ **Password** input field with 🔒 icon and show/hide toggle (👁️)
✅ **Forgot Password?** link
✅ **Gradient button** - Cyan gradient (#22D3EE → #06B6D4) with "Login to Majestor" text
✅ **Sign up prompt** - "New to Majestor? Join now" with link

### SignUpScreen
✅ **Same logo and tagline** as Login screen
✅ **Tab switcher** - Login/Sign Up tabs (Sign Up active)
✅ **Full Name** input field with 👤 icon
✅ **University Email** input field with 📧 icon
✅ **Password** input field with 🔒 icon and show/hide toggle
✅ **Gradient button** - Same cyan gradient with "Create Account" text
✅ **Terms & Privacy** - "By signing up, you agree to our Terms and Privacy Policy"
✅ **Login prompt** - "Already have an account? Login" with link

## Design Details

### Colors
- **Brand Logo**: Purple `#8B5CF6`
- **Gradient Button**: Cyan `#22D3EE` → `#06B6D4`
- **Active Tab**: Cyan `#22D3EE`
- **Inactive Tab**: Gray `#94A3B8`
- **Text Primary**: Slate `#1E293B`
- **Text Secondary**: Slate `#64748B`
- **Input Background**: `#F8FAFC`
- **Input Border**: `#E2E8F0`

### Typography
- **Brand Name**: 28px, bold
- **Tagline**: 14px, regular
- **Tab Text**: 16px, semi-bold (active) / medium (inactive)
- **Input Labels**: 14px, medium
- **Input Text**: 16px
- **Button Text**: 16px, semi-bold
- **Links**: 14px, semi-bold (cyan)

### Spacing
- **Container Padding**: 24px horizontal, 40px top
- **Header Margin**: 32px bottom
- **Tab Section Margin**: 32px bottom
- **Input Spacing**: 20px bottom
- **Button Border Radius**: 12px
- **Logo Size**: 40x40px, circular

## Usage Example

```tsx
import { LoginScreen, SignUpScreen } from './screens/auth';

// In your navigation/app component
const [showSignUp, setShowSignUp] = useState(false);

if (showSignUp) {
  return (
    <SignUpScreen
      onSignUp={(fullName, email, password) => {
        console.log('Sign up:', { fullName, email, password });
        // Call your signup API here
      }}
      onLogin={() => setShowSignUp(false)}
    />
  );
}

return (
  <LoginScreen
    onLogin={(email, password) => {
      console.log('Login:', { email, password });
      // Call your login API here
    }}
    onSignUp={() => setShowSignUp(true)}
  />
);
```

## Integration with Existing Infrastructure

To connect these screens with the existing auth infrastructure:

```tsx
import { useLogin, useSignup } from './hooks/useAuth';
import { LoginScreen, SignUpScreen } from './screens/auth';

function AuthFlow() {
  const [showSignUp, setShowSignUp] = useState(false);
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  if (showSignUp) {
    return (
      <SignUpScreen
        onSignUp={(fullName, email, password) => {
          signupMutation.mutate({
            email,
            password,
            username: fullName,
            phone: '', // Add phone input later
            universityId: 0, // Add university selector later
            facultyId: 0, // Add faculty selector later
          });
        }}
        onLogin={() => setShowSignUp(false)}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={(email, password) => {
        loginMutation.mutate({ email, password });
      }}
      onSignUp={() => setShowSignUp(true)}
    />
  );
}
```

## Next Steps

1. **Add validation** - Integrate with existing `zod-schemas.ts` for form validation
2. **Add loading states** - Show loading spinner during API calls
3. **Add error handling** - Display error messages from API
4. **Add university/faculty selection** - Either in signup or separate onboarding screen
5. **Implement forgot password** - Create forgot password flow
6. **Add social login** - If needed (Google, Facebook, etc.)
7. **Add terms & privacy pages** - Link to actual policy documents

## Design Matching

These screens **exactly match** the provided mockup images:
- ✅ Logo and branding placement
- ✅ Tab switcher UI and behavior
- ✅ Input field styling with icons
- ✅ Password show/hide toggle
- ✅ Gradient button colors
- ✅ Text copy and styling
- ✅ Link colors and placement
- ✅ Overall spacing and layout

The only differences from the original `LoginScreen.tsx` and `CreateAccountScreen.tsx`:
- ❌ Removed back button (not in mockups)
- ❌ Removed illustration (not in mockups)
- ❌ Changed button gradient from purple to cyan
- ✅ Added logo and tagline
- ✅ Added tab switcher
- ✅ Added input icons
- ✅ Updated all text copy to match mockups
