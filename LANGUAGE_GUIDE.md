# Multi-Language Support - Usage Guide

## Overview
The application now supports multiple languages (English, Spanish, French, German) across all pages using a global Language Context.

## Setup Complete ✅

### Files Created:
1. **`i18n/translations.ts`** - Contains all translations for 4 languages
2. **`contexts/LanguageContext.tsx`** - Global language state management
3. **`App.tsx`** - Wrapped with LanguageProvider

### Translations Include:
- Common UI elements (buttons, labels, messages)
- Navigation items
- Dashboard content
- Profile sections
- Rewards, Certificates, Bookings
- App Settings
- Auth pages
- Error/Success messages

## How to Use in Any Page

### 1. Import the hook
```tsx
import { useLanguage } from '../contexts/LanguageContext';
```

### 2. Use the translation function
```tsx
const MyPage = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('dashboard')}</p>
      <button>{t('save')}</button>
    </div>
  );
};
```

### 3. Available Translation Keys

#### Common
- `welcome`, `loading`, `save`, `cancel`, `delete`, `edit`, `submit`
- `search`, `filter`, `yes`, `no`, `continue`, `back`, `next`

#### Navigation
- `home`, `dashboard`, `profile`, `settings`, `notifications`
- `rewards`, `history`, `certificates`, `about`, `contact`

#### Dashboard
- `welcomeBack`, `totalPickups`, `pointsEarned`, `carbonOffset`
- `schedulePickup`, `viewHistory`, `recentActivity`

#### Profile
- `myProfile`, `editProfile`, `personalInfo`, `accountSettings`
- `name`, `email`, `phone`, `address`, `updateProfile`
- `changePassword`, `currentPassword`, `newPassword`

#### Rewards
- `myRewards`, `availablePoints`, `redeemRewards`
- `rewardsCatalog`, `pointsRequired`, `redeem`

#### Bookings
- `myBookings`, `upcomingBookings`, `pastBookings`
- `bookingDate`, `status`, `pending`, `confirmed`, `completed`

#### Messages
- `success`, `error`, `warning`, `info`
- `confirmAction`, `actionCannotBeUndone`

## Example: Update a Page

### Before:
```tsx
<h1>My Dashboard</h1>
<button>Schedule Pickup</button>
<p>Welcome back, {user.name}!</p>
```

### After:
```tsx
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const user = getCurrentUser();
  
  return (
    <div>
      <h1>{t('dashboard')}</h1>
      <button>{t('schedulePickup')}</button>
      <p>{t('welcomeBack')}, {user.name}!</p>
    </div>
  );
};
```

## Language Selection

Language is automatically loaded from:
1. **User preferences** (from API)
2. **Local storage** (fallback)
3. **Default**: English ('en')

Users can change language in **App Settings** → **Language Selection**

Changes apply **immediately across the entire app**!

## Adding New Translations

1. Open `i18n/translations.ts`
2. Add the key to all 4 language objects:

```typescript
en: {
  myNewKey: 'My English Text',
  // ... other keys
},
es: {
  myNewKey: 'Mi Texto en Español',
  // ... other keys
},
fr: {
  myNewKey: 'Mon Texte en Français',
  // ... other keys
},
de: {
  myNewKey: 'Mein Deutscher Text',
  // ... other keys
}
```

3. Use it anywhere: `{t('myNewKey')}`

## Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English (US) | ✅ Complete |
| `es` | Español (Spanish) | ✅ Complete |
| `fr` | Français (French) | ✅ Complete |
| `de` | Deutsch (German) | ✅ Complete |

## Notes

- Translations are **type-safe** - TypeScript will catch typos
- Language persists across sessions (saved to API + localStorage)
- All pages share the same language state
- No page refresh needed when changing language!

## Current Implementation

✅ App Settings page - Fully translated
🔄 Other pages - Ready to be updated (use the hook as shown above)

To translate any page, just:
1. Import `useLanguage`
2. Get the `t` function
3. Replace hardcoded text with `t('key')`
