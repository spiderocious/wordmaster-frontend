# 🎮 AlphaGame

**Unleash Your Inner Wordsmith!**

An interactive alphabet category game where players race against time to fill in words that start with a given letter across different categories like Names, Places, Animals, Food, and more.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Project Architecture

This project follows **Feature-Sliced Design (FSD)** architecture for maximum scalability and maintainability.

### **Folder Structure**

```
src/
├── features/              # Business features
│   ├── entrypoint/       # Landing page
│   │   ├── screen/
│   │   │   ├── parts/    # Screen components
│   │   │   └── entrypoint-screen.tsx
│   │   └── entrypoint.routes.ts
│   └── home/             # Example feature
├── shared/               # Cross-feature resources
│   ├── constants/
│   │   ├── routes.ts     # Route definitions
│   │   └── endpoints.ts  # API endpoints
│   ├── helpers/          # Pure functions
│   └── utils/            # Stateful utilities
├── ui/                   # Reusable UI components
├── components/           # App-level components
│   └── page/
├── icons/                # react-icons proxy
├── app.tsx               # Root component
├── app.routes.tsx        # Route configuration
├── app.provider.tsx      # Global providers
├── app.entrypoint.tsx    # App with providers
└── main.tsx              # React DOM entry
```

---

## 🎯 Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
// Available aliases:
import { Component } from '@app/...'           // src/
import { Button } from '@components/...'       // src/components/
import { HomeScreen } from '@features/...'     // src/features/
import { ROUTES } from '@shared/...'           // src/shared/
import { Icon } from '@ui/...'                 // src/ui/
import { FaHome } from '@icons'                // src/icons/ (react-icons proxy)
```

---

## 🎨 Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 6.0
- **Language**: TypeScript 5.6
- **Routing**: React Router v6
- **Styling**: Tailwind CSS 3.4
- **Icons**: react-icons 5.4 (proxied via `@icons`)
- **Animations**: framer-motion (smooth, spring-based animations)
- **Effects**: react-confetti (celebration effects)

---

## 📁 Feature-Sliced Design Principles

### **1. Feature Structure**

Each feature follows this pattern:

```
features/[feature-name]/
├── features/              # Nested sub-features
├── screen/                # Main screen component
│   ├── __tests__/        # Tests
│   ├── parts/            # Screen-specific components
│   └── [feature-name]-screen.tsx
├── api/                   # Data fetching hooks
├── providers/             # Feature state (Context)
├── guards/                # Route protection
├── helpers/               # Pure utility functions
├── widgets/               # Reusable feature components
└── [feature-name].routes.ts
```

### **2. Adding New Routes**

Routes are JSON-based and centralized in `src/app.routes.tsx`:

```typescript
// 1. Create your feature route file
// features/my-feature/my-feature.routes.ts

// 2. Add route constant in shared/constants/routes.ts
export const ROUTES = {
  MY_FEATURE: route('my-feature'),
};

// 3. Import and register in app.routes.tsx
import { myFeatureRoutes } from '@features/my-feature/my-feature.routes';

export const routes: RouteObject[] = [
  {
    path: ROUTES.ROOT.absPath,
    Component: AppEntrypoint,
    children: [
      myFeatureRoutes, // ← Add here
    ],
  },
];
```

---

## 🎮 Game Architecture (Coming Soon)

The game will be **backend-driven** with a service layer pattern:

### **Service Layer Pattern**

```typescript
// Real API service (when backend is ready)
class GameService {
  getGameLetter() {
    return axios.post('/api/game/letter');
  }

  validateAnswer(category, answer, letter) {
    return axios.post('/api/game/validate', { category, answer, letter });
  }
}

// Mock service for development
class GameServiceMock {
  getGameLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return Promise.resolve({
      data: { letter: letters[Math.floor(Math.random() * 26)] }
    });
  }

  validateAnswer(category, answer, letter) {
    return Promise.resolve({
      data: { isValid: answer.toLowerCase().startsWith(letter.toLowerCase()) }
    });
  }
}

// Toggle with config
export const gameService = config.USE_MOCK
  ? new GameServiceMock()
  : new GameService();
```

---

## 📋 Current Features

### ✅ **Entrypoint Screen** (`/`)
- Hero illustration with character and scattered letters
- "Play as Guest" button (single-player)
- "Play Guest Multiplayer" button
- "Sign Up / Sign In" option
- "How to Play" link
- Responsive design

---

## 🚧 Next Steps

1. **Game Flow Features**
   - Game start screen
   - Round screen with category inputs
   - Validation feedback
   - Results screen
   - Score tracking

2. **Backend Integration**
   - API service layer
   - Mock service for development
   - Configuration toggle

3. **Authentication**
   - Sign up / Sign in screens
   - User profile

4. **Multiplayer**
   - Lobby system
   - Real-time gameplay

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Build
npm run build            # TypeScript check + production build
npm run preview          # Preview production build

# Type Checking
tsc --noEmit             # Check types without building
```

---

## 📖 Code Style

### **Naming Conventions**

| Type | Pattern | Example |
|------|---------|---------|
| Screen | `[feature-name]-screen.tsx` | `entrypoint-screen.tsx` |
| API Hook | `use-[resource-name].ts` | `use-game-letter.ts` |
| Provider | `[feature-name]-provider.tsx` | `game-provider.tsx` |
| Guard | `[feature-name]-guard.tsx` | `game-guard.tsx` |
| Route File | `[feature-name].routes.ts` | `entrypoint.routes.ts` |
| Widget | `[feature-name]-widget.tsx` | `category-widget.tsx` |
| Helper | `[function-name].ts` | `validate-word.ts` |

### **Import Order**

```typescript
// 1. External packages
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Shared packages (@app aliases)
import { ROUTES } from '@shared/constants/routes';
import { FaPlay } from '@icons';

// 3. Feature imports (relative)
import { HeroIllustration } from './parts/hero-illustration';
```

### **Rules**
- ✅ No `any` type in TypeScript
- ✅ Use react-icons (via `@icons`)
- ✅ Prefer inline errors over toasts
- ✅ All new code must have tests
- ✅ Follow FSD architecture strictly

---

## 📄 License

© 2024 AlphaGame. All rights reserved.

---

## 🎯 Game Concept

**AlphaGame** is an alphabet category word game where:
- Players receive a random letter each round
- They must fill in words for different categories (Animal, Food, Place, Bible Name, etc.)
- Each answer must start with the given letter
- Backend validates all answers
- Race against the clock for points!

**Example Round:**
```
Letter: B
Categories:
- Animal: Bear ✅
- Food: Banana ✅
- Place: Boston ✅
- Bible Name: Bartholomew ✅
```

---

**Happy Gaming! 🎮**
