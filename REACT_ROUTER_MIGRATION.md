# React Router Migration Guide

The application has been migrated from hash-based routing to React Router. This guide explains the changes needed throughout the application.

## Changes Made

### 1. App.tsx
- Replaced hash-based routing with React Router (BrowserRouter, Routes, Route)
- Created `ProtectedRoute` component for role-based authentication
- Created role-specific route components: `ProfileRoute`, `NotificationsRoute`, `SecurityRoute`, `SettingsRoute`
- Added `ScrollToTop` component to handle scroll behavior on route changes

### 2. Required Changes Across All Files

#### Import React Router hooks in components:
```typescript
import { useNavigate, Link } from 'react-router-dom';
```

#### Replace window.location.hash with useNavigate:

**Before:**
```typescript
window.location.hash = '#/dashboard';
```

**After:**
```typescript
const navigate = useNavigate();
navigate('/dashboard');
```

#### Replace hash-based links with Link component:

**Before:**
```tsx
<button onClick={() => window.location.hash = '#/profile'}>Profile</button>
```

**After:**
```tsx
import { Link } from 'react-router-dom';
<Link to="/profile"><button>Profile</button></Link>
// OR
<button onClick={() => navigate('/profile')}>Profile</button>
```

#### Check current route:

**Before:**
```typescript
window.location.hash === '#/dashboard'
```

**After:**
```typescript
import { useLocation } from 'react-router-dom';
const location = useLocation();
location.pathname === '/dashboard'
```

## Files That Need Updates

All files with `window.location.hash` need to be updated (100+ instances found):

### Components:
- Layout.tsx
- ProfileHeader.tsx
- ProfileSidebar.tsx
- NotificationBell.tsx

### Pages:
- Landing.tsx (most instances)
- All Dashboard pages (User, Business, Agency, Admin)
- All Profile pages
- Login.tsx
- AdminLogin.tsx
- All other page components

## Step-by-Step Migration for Each File

1. Add React Router imports
2. Replace all `window.location.hash = '#/path'` with `navigate('/path')`
3. Replace all `window.location.hash === '#/path'` with `location.pathname === '/path'`
4. Replace hash links in href attributes with Link components or navigate functions
5. Test navigation in each section

## Important Notes

- Routes now use `/` instead of `#/`
- All route paths have been defined in App.tsx
- Protected routes automatically redirect based on user role
- Use `navigate('/path', { replace: true })` for redirects (equivalent to hash replacement)
- Use `navigate(-1)` to go back (equivalent to history.back())

## Example Component Migration

### Before:
```tsx
const MyComponent = () => {
  const handleClick = () => {
    window.location.hash = '#/dashboard';
  };

  return (
    <div>
      <button onClick={handleClick}>Go to Dashboard</button>
      <a onClick={() => window.location.hash = '#/profile'}>Profile</a>
    </div>
  );
};
```

### After:
```tsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <button onClick={handleClick}>Go to Dashboard</button>
      <a onClick={() => navigate('/profile')}>Profile</a>
    </div>
  );
};
```
