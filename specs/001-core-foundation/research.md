# UI Library Selection: Material UI vs Tailwind CSS

**Project**: Sanchalak School Management System  
**Date**: 2026-02-11  
**React Version**: 19.2.0  
**TypeScript Version**: 5.9.3 (strict mode)  
**Build Tool**: Vite 7.2.4  

---

## 1. Decision

**RECOMMENDED: Tailwind CSS + shadcn/ui (Hybrid Approach)**

Use Tailwind CSS as the core styling framework with shadcn/ui for pre-built accessible components. This hybrid approach provides optimal bundle size control while delivering the component richness needed for an admin portal.

**Fallback Option**: Material UI v6 if team velocity and time-to-market are higher priorities than bundle size optimization.

---

## 2. Rationale

### Key Reasons for Tailwind CSS + shadcn/ui:

1. **Superior Bundle Size Performance** (Critical Requirement)
   - Production bundle: **30-60KB gzipped** vs Material UI's 85-120KB baseline
   - Only ships CSS for classes actually used in your HTML/JSX
   - Provides **40-60% bundle size savings**, crucial for 3G performance target

2. **Native Dark Mode Support** (New Requirement)
   - Built-in `dark:` variant for all utilities (`dark:bg-gray-900`, `dark:text-white`)
   - Supports `class` strategy (manual toggle) and `media` strategy (system preference)
   - No additional dependencies or runtime JS for theme switching
   - Zero bundle size impact (dark mode classes only included if used)

3. **Mobile-First Architecture** (Core Requirement)
   - Built on mobile-first breakpoint system (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
   - Responsive utilities `(flex`, `grid`, `hidden`, `block) are` more granular than MUI's breakpoint system
   - Better control for 375px, 768px, 1920px+ breakpoint requirements

3. **Customization Flexibility**
   - Utility-first approach allows pixel-perfect matching to design samples
   - No fighting against Material Design opinions
   - Easy to create custom color schemes, spacing, and component variants

4. **Modern Developer Experience with shadcn/ui**
   - Components copied into your codebase (full ownership, no black box)
   - Built on Radix UI primitives (WAI-ARIA compliant, keyboard navigation)
   - Includes data tables, forms, modals, dialogs out-of-the-box
   - TypeScript-first with excellent type safety

5. **Performance at Scale**
   - No runtime JavaScript for styling (CSS-only)
   - Better performance for large data tables (no JS-in-CSS overhead)
   - Smaller JavaScript bundle = faster parse/compile time on mobile devices

6. **Built-in Dark Mode Support**
   - Native CSS-based dark mode using `dark:` variant classes
   - Zero JavaScript overhead for theme switching (CSS variables + `prefers-color-scheme`)
   - No flash of unstyled content (FOUC) with proper theme initialization
   - Easy theme customization through Tailwind config

---

## 3. Bundle Size Analysis

### Tailwind CSS + shadcn/ui
```
Core Dependencies:
├─ tailwindcss@4.1.0              ~6KB   (production CSS, only used utilities)
├─ @radix-ui/react-* (5-8 pkg)   ~35KB  (headless components: select, dialog, dropdown)
├─ class-variance-authority       ~2KB   (component variants)
├─ clsx                           ~0.5KB (className utilities)
└─ tailwind-merge                 ~4KB   (merge conflicting classes)
                                  ─────
TOTAL ESTIMATED (gzipped):        ~30-60KB depending on component usage

Additional for Data Tables:
└─ @tanstack/react-table          ~20KB  (headless table library)
                                  ─────
WITH DATA TABLES:                 ~50-80KB
```

### Material UI v6
```
Core Dependencies:
├─ @mui/material@6.2.0            ~85KB   (base components with tree-shaking)
├─ @mui/system                    ~15KB   (styling system)
├─ @emotion/react                 ~10KB   (CSS-in-JS runtime)
└─ @emotion/styled                ~5KB    (styled components API)
                                  ─────
BASE TOTAL (gzipped):             ~85-120KB

Additional for Advanced Tables:
└─ @mui/x-data-grid               ~80KB   (premium features require license)
                                  ─────
WITH DATA GRID:                   ~165-200KB
```

**Verdict**: Tailwind approach saves **55-60KB baseline** and **85-120KB with tables**, giving significant headroom under the 500KB constraint for other dependencies (charts, i18n, form validation libraries).

---

## 4. Alternatives Considered

### Material UI v6 (Not Recommended for This Project)

**Pros:**
- ✅ **Fast Development**: 100+ pre-built components (Button, TextField, Table, Modal, etc.)
- ✅ **Mature Ecosystem**: 93k+ GitHub stars, 10+ years of development
- ✅ **Built-in i18n**: Material UI locale provider with Hindi support
- ✅ **TypeScript-First**: Written in TypeScript with excellent type definitions
- ✅ **Accessibility**: WCAG 2.1 Level AA compliant by default
- ✅ **React 19 Compatible**: v6.2.0+ officially supports React 19
- ✅ **Lower Learning Curve**: Familiar component API for developers with MUI experience
- ✅ **Comprehensive Documentation**: Extensive examples and guides

**Cons:**
- ❌ **Bundle Size**: 85-120KB gzipped baseline (consumes 17-24% of 500KB budget)
- ❌ **Material Design Lock-in**: Harder to customize beyond Material Design aesthetics
- ❌ **CSS-in-JS Overhead**: Emotion runtime adds ~10-15KB + runtime performance cost
- ❌ **Proprietary Components**: Advanced data grid features require MUI X Premium license ($450/dev/year for commercial use)
- ❌ **Style Override Complexity**: `sx` prop and styled() API can be verbose for custom designs
- ❌ **Theme Configuration**: Deep theme object can be overwhelming for beginners

**When to Choose MUI Instead:**
- Team already experienced with Material UI
- Design follows Material Design principles closely
- Time-to-market is critical (weeks vs months)
- Budget allows for MUI X Pro/Premium licenses ($249-$450/dev)
- Bundle size constraint can be relaxed to 600-700KB

---

## 5. Component Richness Comparison

| Component Category | Material UI | Tailwind + shadcn/ui |
|---|---|---|
| **Data Tables** | ✅ Basic Table<br>💰 MUI X Data Grid (premium) | ✅ TanStack Table (free)<br>Requires custom styling |
| **Forms** | ✅ TextField, Select, Checkbox, Radio<br>❌ No form library (use react-hook-form) | ✅ Input, Select, Checkbox, Radio<br>✅ Integrates react-hook-form |
| **Modals/Dialogs** | ✅ Dialog, Modal, Drawer | ✅ Dialog, Sheet (drawer), AlertDialog |
| **Navigation** | ✅ AppBar, Drawer, Tabs, Menu, Breadcrumbs | ✅ Tabs, Dropdown Menu, Breadcrumbs<br>Roll your own nav/sidebar |
| **Feedback** | ✅ Snackbar, Alert, Progress, Skeleton | ✅ Toast (react-hot-toast), Alert, Progress, Skeleton |
| **Charts** | ❌ Use recharts/chart.js | ❌ Use recharts/chart.js |
| **Date Pickers** | 💰 MUI X Date Pickers | ❌ Use react-day-picker |

**Verdict**: Material UI has more out-of-the-box components, but shadcn/ui + ecosystem libraries cover all critical needs for an admin portal. The trade-off is 2-3 hours extra setup time upfront for 40-60KB bundle savings.

---

## 6. i18n Support Analysis

### Material UI Approach
```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { hiIN } from '@mui/material/locale';

const theme = createTheme({
  // ... your theme
}, hiIN);

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```
- Built-in Hindi locale for component labels (OK, Cancel, Close, etc.)
- Still need **react-i18next** (14KB gzipped) for app content translation
- **Total i18n cost**: ~14KB (react-i18next only)

### Tailwind CSS Approach
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Full control over all translations
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: {...} },
    hi: { translation: {...} }
  }
});
```
- Must translate all component labels manually (button text, aria labels)
- Use **react-i18next** (14KB gzipped) for all translations
- **Total i18n cost**: ~14KB (react-i18next)

**Verdict**: Material UI provides marginal i18n convenience (pre-translated component labels), but you still need react-i18next for actual content. The benefit is minimal (~1-2 hours saved vs manual translation of 50-100 component labels).

---

## 7. TypeScript Support Quality

### Material UI
```typescript
import { Button, ButtonProps } from '@mui/material';

// Excellent autocomplete and type safety
const MyButton: React.FC<ButtonProps> = (props) => (
  <Button variant="contained" color="primary" {...props}>
    Click Me
  </Button>
);
```
- **Grade: A+** - Written in TypeScript, full type definitions
- Autocomplete for all props, variants, colors
- Generic type support for data grids and selects

### Tailwind CSS + shadcn/ui
```typescript
import { Button, ButtonProps } from '@/components/ui/button';

// Excellent autocomplete, components are in your codebase
const MyButton: React.FC<ButtonProps> = (props) => (
  <Button variant="default" size="lg" {...props}>
    Click Me
  </Button>
);
```
- **Grade: A** - shadcn/ui components are TypeScript-first
- Radix UI primitives have excellent TypeScript support
- Full control since components are in your codebase (can add custom types)

**Verdict**: Both excellent, Material UI slightly ahead due to team's 10+ years of TypeScript refinement. Difference is negligible in practice.

---

## 8. Learning Curve Assessment

### Material UI
- **Timeframe**: 3-5 days for productive development
- **Concepts**: React + MUI component API + Theme system + sx prop
- **Difficulty**: ⭐⭐⭐☆☆ (3/5 - Medium)
- **Gotchas**: Theme overrides, specificity battles with sx prop, CSS-in-JS debugging

### Tailwind CSS + shadcn/ui
- **Timeframe**: 5-7 days for productive development (utility classes + component patterns)
- **Concepts**: Utility-first CSS + Responsive design + shadcn/ui component installation
- **Difficulty**: ⭐⭐⭐⭐☆ (4/5 - Medium-High initially, then very productive)
- **Gotchas**: Long className strings, remembering utility names, PurgeCSS configuration

**Verdict**: Material UI easier to start, Tailwind more productive long-term. For a 3-month project, Tailwind's 2-day extra learning curve is acceptable given bundle size benefits.

---

## 9. Performance for Large Data Tables

### Material UI (MUI X Data Grid)
- **Premium License Required**: $249-$450/dev for pagination, filtering, sorting
- **Bundle Size**: +80KB gzipped
- **Performance**: Good (virtualization for 10,000+ rows)
- **API**: React component with props
```typescript
<DataGrid 
  rows={students} 
  columns={columns} 
  pageSize={50}
  checkboxSelection
  onSelectionChange={handleSelect}
/>
```

### Tailwind + TanStack Table
- **Free & Open Source**: MIT licensed
- **Bundle Size**: +20KB gzipped
- **Performance**: Excellent (headless, optimized for 100,000+ rows)
- **API**: Hooks-based (more control, more code)
```typescript
const table = useReactTable({
  data: students,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

// Manual JSX rendering with Tailwind classes
```

**Verdict**: TanStack Table is technically superior (lighter, faster, free) but requires 50-100 lines more code per table. For a school with <10,000 students, performance difference is negligible. Cost savings: **$0 vs $249-$450/dev**.

---

## 10. Maintenance & Ecosystem Maturity

### Material UI
- **First Release**: 2014 (12 years old)
- **GitHub Stars**: 93,000+
- **Weekly Downloads**: 4.5M+
- **Active Maintainers**: 20+ core team members
- **Company Backing**: MUI (formerly Material-UI) company with VC funding
- **Release Cadence**: Major versions every 1-2 years, patches bi-weekly
- **Breaking Changes**: Minimal (good upgrade path from v4 → v5 → v6)

### Tailwind CSS
- **First Release**: 2017 (9 years old)
- **GitHub Stars**: 84,000+
- **Weekly Downloads**: 8M+ (more than MUI)
- **Active Maintainers**: 10+ core team (Tailwind Labs company)
- **Company Backing**: Tailwind Labs (profitable, no VC pressure)
- **Release Cadence**: Major versions yearly, patches frequently
- **shadcn/ui**: 70k+ stars, copy-paste component library (you own the code)

**Verdict**: Both are mature, well-maintained, and have strong ecosystems. Material UI has longer history, Tailwind has stronger momentum (2x downloads). Risk is low for both.

---

## 11. Implementation Notes

### Recommended: Tailwind CSS + shadcn/ui Setup

#### Step 1: Install Core Dependencies
```bash
npm install -D tailwindcss@latest postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot
npx tailwindcss init -p
```

#### Step 2: Configure Tailwind (tailwind.config.js)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'mobile': '375px',
        'tablet': '768px',
        'desktop': '1920px',
      },
      colors: {
        // Based on sample-ui-images (customize after design review)
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

#### Step 3: Install shadcn/ui (One-time Setup)
```bash
npx shadcn@latest init
# Select: TypeScript, Vite, using CSS variables
npx shadcn@latest add button input label card dialog table
npx shadcn@latest add select checkbox radio-group textarea
npx shadcn@latest add dropdown-menu tabs alert toast
```

#### Step 4: Install Supporting Libraries
```bash
# Data tables
npm install @tanstack/react-table

# Forms (excellent TypeScript + React 19 support)
npm install react-hook-form@7.54.0 zod@3.24.0

# i18n (Hindi + English)
npm install react-i18next i18next i18next-browser-languagedetector

# Date handling (for attendance, fee due dates)
npm install date-fns

# Notifications
npm install react-hot-toast
```

#### Step 5: Expected Bundle Size Breakdown (Production Build)
```
Estimated Production Bundle (gzipped):
├─ React 19 + ReactDOM                ~45KB  (already in project)
├─ React Router v6                    ~12KB  
├─ Tailwind CSS (utilities)           ~25KB  (only used classes)
├─ shadcn/ui components (10-15 used)  ~30KB  (Radix UI primitives)
├─ TanStack Table                     ~20KB  
├─ react-hook-form + Zod              ~15KB  
├─ react-i18next                      ~14KB  
├─ date-fns (tree-shaken)             ~8KB   
├─ react-hot-toast                    ~3KB   
├─ Your application code              ~80KB  (estimated for Phase 1)
                                      ─────
TOTAL ESTIMATED:                      ~252KB (vs 500KB limit)
```

**Remaining Budget**: ~248KB for charts (recharts ~65KB), additional features, and future growth.

---

### Alternative: Material UI v6 Setup (If Chosen)

#### Step 1: Install Core Dependencies
```bash
npm install @mui/material@latest @emotion/react @emotion/styled
npm install @mui/icons-material  # 3,000+ icons
```

#### Step 2: Install Supporting Libraries
```bash
# Forms (MUI has no form library)
npm install react-hook-form@7.54.0 zod@3.24.0

# i18n
npm install react-i18next i18next i18next-browser-languagedetector

# Data tables (basic free version)
npm install @mui/x-data-grid  # Free version (limited features)

# OR premium version (requires license)
npm install @mui/x-data-grid-pro  # $249/dev
npm install @mui/x-data-grid-premium  # $450/dev (advanced features)
```

#### Step 3: Configure Theme (src/theme.ts)
```typescript
import { createTheme } from '@mui/material/styles';
import { hiIN } from '@mui/material/locale';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // Customize based on sample-ui-images
    },
    secondary: {
      main: '#dc004e',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 375,   // Mobile
      md: 768,   // Tablet
      lg: 1280,
      xl: 1920,  // Desktop
    },
  },
}, hiIN);  // Hindi locale for component labels
```

#### Step 4: Expected Bundle Size Breakdown (Production Build)
```
Estimated Production Bundle (gzipped):
├─ React 19 + ReactDOM                ~45KB  (already in project)
├─ React Router v6                    ~12KB  
├─ @mui/material                      ~95KB  (with tree-shaking)
├─ @emotion/react + styled            ~15KB  (CSS-in-JS runtime)
├─ @mui/icons-material (20 icons)     ~8KB   (tree-shaken)
├─ @mui/x-data-grid                   ~80KB  (basic free version)
├─ react-hook-form + Zod              ~15KB  
├─ react-i18next                      ~14KB  
├─ Your application code              ~80KB  
                                      ─────
TOTAL ESTIMATED:                      ~364KB (vs 500KB limit)
```

**Remaining Budget**: ~136KB for charts and future features (tighter constraint).

---

## 12. React 19 Compatibility Status

### Material UI
- **React 19 Support**: ✅ Official support since v6.2.0 (released Dec 2024)
- **Known Issues**: None reported for React 19.2.0
- **Documentation**: [MUI React 19 Migration Guide](https://mui.com/material-ui/migration/migration-v6/)

### Tailwind CSS
- **React 19 Support**: ✅ Framework-agnostic (CSS-only, no React dependency)
- **shadcn/ui**: ✅ Compatible (built on Radix UI which supports React 19)
- **Radix UI**: ✅ React 19 support confirmed in v1.17.0+ releases

**Verdict**: Both fully compatible with React 19.2.0. No blockers.

---

## 13. Mobile-First Responsive Capabilities

### Material UI Breakpoint System
```typescript
<Box
  sx={{
    display: { xs: 'block', md: 'flex' },  // block on mobile, flex on tablet+
    padding: { xs: 2, sm: 3, md: 4 },      // responsive padding
    width: { xs: '100%', md: '50%' },
  }}
>
```
- Uses `sx` prop with breakpoint objects
- Breakpoints: `xs` (0px), `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1536px)
- Can customize breakpoints in theme

### Tailwind CSS Responsive Utilities
```typescript
<div className="
  block md:flex 
  p-2 sm:p-3 md:p-4 
  w-full md:w-1/2
">
```
- Uses responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Mobile-first by default (unprefixed = mobile, `md:` = tablet+)
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px)
- Easily customizable in `tailwind.config.js`

**Verdict**: Tailwind's utility-first approach provides more granular control. MUI's `sx` prop is more verbose but type-safe. For strict pixel-perfect responsive design (375px, 768px, 1920px), Tailwind is superior.

---

## 14. Final Recommendation Summary

| Criterion | Weight | Material UI | Tailwind + shadcn/ui |
|---|---|---|---|
| Bundle Size (<500KB) | 🔴 Critical | ⭐⭐⭐☆☆ (3/5)<br>~364KB | ⭐⭐⭐⭐⭐ (5/5)<br>~252KB |
| Mobile-First | 🟠 High | ⭐⭐⭐⭐☆ (4/5)<br>Good breakpoint system | ⭐⭐⭐⭐⭐ (5/5)<br>Utility-first, granular |
| Component Richness | 🟠 High | ⭐⭐⭐⭐⭐ (5/5)<br>100+ components | ⭐⭐⭐⭐☆ (4/5)<br>20+ core, DIY tables |
| i18n Support | 🟡 Medium | ⭐⭐⭐⭐☆ (4/5)<br>Built-in Hindi locale | ⭐⭐⭐☆☆ (3/5)<br>Manual translation |
| TypeScript | 🟠 High | ⭐⭐⭐⭐⭐ (5/5)<br>Excellent types | ⭐⭐⭐⭐⭐ (5/5)<br>Excellent types |
| Learning Curve | 🟡 Medium | ⭐⭐⭐⭐☆ (4/5)<br>3-5 days | ⭐⭐⭐☆☆ (3/5)<br>5-7 days |
| Customization | 🟠 High | ⭐⭐⭐☆☆ (3/5)<br>Theme system | ⭐⭐⭐⭐⭐ (5/5)<br>Full control |
| Table Performance | 🟡 Medium | ⭐⭐⭐⭐☆ (4/5)<br>Good (premium $$) | ⭐⭐⭐⭐⭐ (5/5)<br>Excellent (free) |
| Ecosystem Maturity | 🟡 Medium | ⭐⭐⭐⭐⭐ (5/5)<br>12 years, stable | ⭐⭐⭐⭐☆ (4/5)<br>9 years, growing |

**Weighted Score**:
- **Material UI**: 4.1/5 (Strong all-rounder, but bundle size concern)
- **Tailwind + shadcn/ui**: 4.4/5 (Best for bundle size, mobile-first, customization)

---

## 15. Decision Factors Summary

### Choose Tailwind CSS + shadcn/ui if:
✅ Bundle size is critical (<500KB strict requirement)  
✅ Design requires custom styling beyond Material Design  
✅ Team values flexibility and control over components  
✅ Performance on 3G networks is top priority  
✅ Budget-conscious (avoid $249-$450 premium table licenses)  
✅ Long-term project (3+ months) where 2-day learning curve is acceptable  

### Choose Material UI if:
✅ Time-to-market is critical (launch in 4-6 weeks)  
✅ Team already familiar with Material UI  
✅ Design closely follows Material Design principles  
✅ Budget allows for MUI X Pro/Premium ($249-$450/dev)  
✅ Bundle size constraint can flex to 600-700KB  
✅ Prefer less decision-making (batteries-included approach)  

---

## 16. Dark Mode / Theme Implementation

### Decision: Tailwind CSS Class-Based Strategy

**Approach**: Use Tailwind's `dark:` variant with manual class toggling on `<html>` or `<body>` element.

### Rationale:

1. **User Control**: Allows users to override system preference (FR-041 requirement)
2. **Persistence**: Easy to save preference in `localStorage` (FR-042 requirement)
3. **No FOUC**: Can inject theme class before first paint using inline script
4. **Framework Agnostic**: Works with React Context, Zustand, or any state solution

### Implementation Strategy:

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        background: '#ffffff',
        foreground: '#0a0a0a',
        primary: '#3b82f6',    // blue-500
        secondary: '#64748b',  // slate-500
        
        // Dark theme equivalents defined via CSS variables
        // Applied automatically via dark: classes
      }
    }
  }
}
```

#### Theme Context (`src/contexts/ThemeContext.tsx`)
```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark'; // Actual applied theme
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) return stored;
    
    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'system';
    }
    
    return 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Resolve 'system' to actual theme
    let applied: 'light' | 'dark' = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;

    // Apply theme
    root.classList.remove('light', 'dark');
    root.classList.add(applied);
    setResolvedTheme(applied);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      const newTheme = e.matches ? 'dark' : 'light';
      root.classList.remove('light', 'dark');
      root.classList.add(newTheme);
      setResolvedTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

#### Theme Toggle Component (`src/components/common/ThemeToggle.tsx`)
```typescript
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
      <button
        onClick={() => setTheme('light')}
        className={`rounded p-2 ${
          theme === 'light'
            ? 'bg-white text-blue-600 shadow dark:bg-gray-700'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        aria-label="Light theme"
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`rounded p-2 ${
          theme === 'dark'
            ? 'bg-white text-blue-600 shadow dark:bg-gray-700'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        aria-label="Dark theme"
      >
        <Moon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`rounded p-2 ${
          theme === 'system'
            ? 'bg-white text-blue-600 shadow dark:bg-gray-700'
            : 'text-gray-600 dark:text-gray-400'
        }`}
        aria-label="System theme"
      >
        <Monitor className="h-5 w-5" />
      </button>
    </div>
  );
}
```

#### Prevent Flash of Unstyled Content (`index.html`)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sanchalak - School Management System</title>
    
    <!-- Inject theme before page render to prevent FOUC -->
    <script>
      (function() {
        const theme = localStorage.getItem('theme') || 'light';
        const resolvedTheme = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        document.documentElement.classList.add(resolvedTheme);
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### Component Example with Dark Mode

```typescript
export function StudentCard({ student }: { student: Student }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {student.firstName} {student.lastName}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Admission: {student.admissionNumber}
      </p>
      <span className="mt-2 inline-block rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
        Active
      </span>
    </div>
  );
}
```

### Color Palette Design

**Light Theme**:
- Background: `bg-white`, `bg-gray-50`, `bg-gray-100`
- Text: `text-gray-900`, `text-gray-700`, `text-gray-600`
- Primary: `bg-blue-600`, `text-blue-600`
- Borders: `border-gray-200`, `border-gray-300`

**Dark Theme** (via `dark:` prefix):
- Background: `dark:bg-gray-900`, `dark:bg-gray-800`, `dark:bg-gray-700`
- Text: `dark:text-white`, `dark:text-gray-300`, `dark:text-gray-400`
- Primary: `dark:bg-blue-500`, `dark:text-blue-400`
- Borders: `dark:border-gray-700`, `dark:border-gray-600`

### Accessibility Considerations (FR-043)

**Contrast Ratios** (WCAG AA Compliance):
- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

**Testing Tools**:
- Chrome DevTools: Lighthouse accessibility audit
- Browser extension: axe DevTools
- Online tool: WebAIM Contrast Checker

**shadcn/ui Advantage**: Components come with WCAG AA compliant colors out of the box for both themes.

### Bundle Size Impact

**Zero-cost dark mode**: Tailwind only includes dark mode classes if you use them. If a component uses `dark:bg-gray-800`, both light and dark variants are included. Typical overhead: **2-5KB gzipped** for comprehensive dark mode support.

**Alternative: CSS Variables Approach** (Not Recommended)
```css
:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ffffff;
}
```
This adds ~1KB but requires custom utilities and loses Tailwind's intellisense benefits.

### Testing Strategy

**Manual Testing**:
1. Toggle theme switch → verify instant application
2. Refresh page → verify theme persists
3. Change system preference → verify 'system' mode updates
4. Test all components in both themes → verify readability

**Automated Testing** (Phase 2):
```typescript
// Vitest test example
describe('ThemeProvider', () => {
  it('persists theme selection to localStorage', () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });
    act(() => result.current.setTheme('dark'));
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
```

### Material UI Alternative (If Chosen Instead)

Material UI uses `ThemeProvider` with `createTheme()`:

```typescript
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const theme = mode === 'light' ? lightTheme : darkTheme;
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* App content */}
    </ThemeProvider>
  );
}
```

**Bundle Impact**: +8-12KB gzipped for theme switching logic (included in MUI core bundle).

---

## 17. Next Steps

### For Tailwind CSS + shadcn/ui (Recommended):
1. ✅ Run installation commands from Section 11
2. ✅ Review sample-ui-images to define color palette in `tailwind.config.js`
3. ✅ Install shadcn/ui components: `button`, `input`, `table`, `dialog`, `select`, `tabs`
4. ✅ Set up TanStack Table for student/staff data tables
5. ✅ Configure react-i18next with Hindi translations
6. ✅ Build first component (Login form) to validate setup

### For Material UI (Alternative):
1. ✅ Run installation commands from Section 11
2. ✅ Create theme.ts with custom colors from sample-ui-images
3. ✅ Set up ThemeProvider with Hindi locale (hiIN)
4. ✅ Install @mui/x-data-grid (free version) or budget for Pro ($249)
5. ✅ Configure react-i18next for content translation
6. ✅ Build first component (Login form) to validate setup

---

## 17. References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Component Library](https://ui.shadcn.com/)
- [Material UI v6 Documentation](https://mui.com/material-ui/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [TanStack Table v8](https://tanstack.com/table/latest)
- [React 19 Release Notes](https://react.dev/blog/2025/01/23/react-19)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)

---

**Document Version**: 1.0  
**Author**: Research Analysis for Sanchalak Project  
**Last Updated**: 2026-02-11
