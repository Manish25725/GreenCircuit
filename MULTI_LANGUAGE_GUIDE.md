# E-Waste Multi-Language Implementation Guide

## ✅ Setup Complete

Your application now has a **complete multi-language system** with:
- **4 Languages**: English, Spanish, French, German
- **150+ Translation Keys** covering all major features
- **Global Language Context** that updates all pages instantly

## 🚀 Quick Start - Using Translations in Any Page

### Step 1: Import the useLanguage Hook

```tsx
import { useLanguage } from '../contexts/LanguageContext';
```

### Step 2: Use the t() Function

```tsx
const YourPage = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('welcomeBack')}</h1>
      <p>{t('schedulePickup')}</p>
      <button>{t('getStarted')}</button>
    </div>
  );
};
```

## 📖 Complete Examples

### Example 1: Dashboard with Translations

```tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('myDashboard')}</h1>
      <div className="stats">
        <div>
          <h3>{t('totalPickups')}</h3>
          <p>5</p>
        </div>
        <div>
          <h3>{t('pointsEarned')}</h3>
          <p>150</p>
        </div>
        <div>
          <h3>{t('carbonOffset')}</h3>
          <p>25 kg</p>
        </div>
      </div>
      
      <button>{t('schedulePickup')}</button>
      <button>{t('viewHistory')}</button>
    </div>
  );
};
```

### Example 2: Contact Form with Translations

```tsx
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ContactForm = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form
    alert(t('messageSent'));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>{t('contactUsTitle')}</h2>
      <p>{t('contactDesc')}</p>
      
      <input 
        placeholder={t('yourName')}
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
      />
      
      <input 
        placeholder={t('yourEmail')}
        type="email"
        value={form.email}
        onChange={(e) => setForm({...form, email: e.target.value})}
      />
      
      <textarea 
        placeholder={t('message')}
        value={form.message}
        onChange={(e) => setForm({...form, message: e.target.value})}
      />
      
      <button type="submit">{t('sendMessage')}</button>
    </form>
  );
};
```

### Example 3: Navigation with Translations

```tsx
const Navigation = () => {
  const { t } = useLanguage();
  
  return (
    <nav>
      <a href="#/dashboard">{t('dashboard')}</a>
      <a href="#/profile">{t('profile')}</a>
      <a href="#/rewards">{t('rewards')}</a>
      <a href="#/history">{t('history')}</a>
      <a href="#/certificates">{t('certificates')}</a>
      <a href="#/settings">{t('settings')}</a>
    </nav>
  );
};
```

## 📝 Available Translation Keys

### Common UI
- `welcome`, `loading`, `save`, `cancel`, `delete`, `edit`, `submit`
- `search`, `filter`, `yes`, `no`, `continue`, `back`, `next`

### Navigation
- `home`, `dashboard`, `profile`, `settings`, `notifications`
- `rewards`, `history`, `certificates`, `about`, `contact`
- `howItWorks`, `services`

### Dashboard
- `welcomeBack`, `totalPickups`, `pointsEarned`, `carbonOffset`
- `schedulePickup`, `viewHistory`, `recentActivity`
- `myDashboard`, `overview`, `kgRecycled`, `activePickups`
- `noActiveBookings`, `scheduleNewPickup`, `viewAllBookings`

### Profile
- `myProfile`, `editProfile`, `personalInfo`, `accountSettings`
- `securityPrivacy`, `name`, `email`, `phone`, `address`
- `updateProfile`, `changePassword`, `currentPassword`, `newPassword`

### Rewards
- `myRewards`, `availablePoints`, `redeemRewards`
- `rewardsCatalog`, `pointsRequired`, `redeem`, `redemptionHistory`

### Bookings
- `myBookings`, `upcomingBookings`, `pastBookings`
- `bookingDate`, `status`, `pending`, `confirmed`, `completed`, `cancelled`

### Landing Page
- `landingTitle`, `landingSubtitle`, `getStarted`, `learnMore`
- `whyChooseUs`, `easyScheduling`, `earnRewards`, `certifiedRecycling`

### About Us
- `aboutUsTitle`, `ourMission`, `ourVision`, `ourValues`
- `sustainability`, `transparency`, `innovation`, `community`

### Contact Us
- `contactUsTitle`, `getInTouch`, `contactDesc`
- `yourName`, `yourEmail`, `yourPhone`, `subject`, `message`
- `sendMessage`, `contactInfo`, `emailUs`, `callUs`, `visitUs`

### How It Works
- `howItWorksTitle`, `step`, `step1Title`, `step1Desc`
- `step2Title`, `step2Desc`, `step3Title`, `step3Desc`
- `step4Title`, `step4Desc`

### Auth
- `login`, `register`, `signIn`, `signUp`
- `forgotPassword`, `rememberMe`, `alreadyHaveAccount`, `dontHaveAccount`

### Messages
- `success`, `error`, `warning`, `info`
- `confirmAction`, `actionCannotBeUndone`

## 🎯 How Language Changes Work

1. **User selects language** in App Settings
2. **Language stored** in:
   - Global Context (instant UI update)
   - localStorage (persistence)
   - Database via API (sync across devices)
3. **All pages update** automatically that use `t()`
4. **No page reload needed**

## 🌍 Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English | ✅ Complete |
| `es` | Spanish | ✅ Complete |
| `fr` | French | ✅ Complete |
| `de` | German | ✅ Complete |

## ➕ Adding New Translation Keys

### 1. Add to translations.ts

```typescript
// In i18n/translations.ts
export const translations = {
  en: {
    // ... existing keys
    myNewKey: 'My New Text',
  },
  es: {
    // ... existing keys
    myNewKey: 'Mi Nuevo Texto',
  },
  // ... add to fr and de
};
```

### 2. Use in Your Component

```tsx
const MyComponent = () => {
  const { t } = useLanguage();
  return <div>{t('myNewKey')}</div>;
};
```

## 🔄 Getting/Setting Language Programmatically

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <p>Current: {language}</p>
      <button onClick={() => setLanguage('es')}>Spanish</button>
      <button onClick={() => setLanguage('fr')}>French</button>
      <button onClick={() => setLanguage('de')}>German</button>
    </div>
  );
};
```

## ⚠️ Important Notes

1. **Always use `t()`** - Never hardcode text
2. **Fallback to English** - If translation missing, shows English
3. **Type-safe** - TypeScript catches typos in translation keys
4. **User input fields** - Use `placeholder={t('key')}` for placeholders
5. **Dynamic content** - Mix translations with data:
   ```tsx
   <p>{t('welcome')}, {userName}!</p>
   ```

## 📂 File Locations

- **Translations**: `i18n/translations.ts`
- **Context Provider**: `contexts/LanguageContext.tsx`
- **App Wrapper**: `App.tsx` (LanguageProvider)
- **Settings**: `pages/AppSettings.tsx`

## 🎨 Best Practices

1. **Group related translations** with comments
2. **Keep keys descriptive** (e.g., `schedulePickupBtn` not `btn1`)
3. **Use consistent naming** (camelCase)
4. **Add new languages** by extending translations object
5. **Test all languages** after adding new keys

## 🚀 Next Steps

Update your pages with translations:
1. Import `useLanguage`
2. Use `const { t } = useLanguage()`
3. Replace all hardcoded text with `{t('key')}`
4. Test language switching in App Settings

Your app is now fully multi-lingual! 🌍
