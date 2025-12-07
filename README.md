# Frontend CBT - React.js App

Frontend aplikasi CBT (Computer-Based Test) yang dibangun dengan React.js, Vite, TailwindCSS, dan React Router.

## 📁 Struktur Project

```
front_end_cbt/
├── src/
│   ├── components/
│   │   ├── common/          # Komponen reusable (Button, Input, Card, Loading)
│   │   └── layout/          # Komponen layout (Navbar, MainLayout)
│   ├── pages/               # Halaman aplikasi (Login, Dashboard, Profile, NotFound)
│   ├── context/             # React Context untuk state management (AuthContext)
│   ├── hooks/               # Custom hooks (useLocalStorage, useDebounce)
│   ├── services/            # API service layer (api, authService)
│   ├── utils/               # Utility functions (helpers)
│   ├── constants/           # Konstanta aplikasi (routes, storage keys)
│   ├── styles/              # Global styles
│   ├── assets/              # Static assets (images, icons)
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global CSS with TailwindCSS
├── public/                  # Public assets
├── .env                     # Environment variables
├── .env.example             # Environment variables example
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # TailwindCSS configuration (TailwindCSS v4)
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies
```

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Konfigurasi Environment Variables

Copy file `.env.example` ke `.env` dan sesuaikan dengan konfigurasi backend Anda:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173/`

## 📦 Dependencies

### Core
- **React** - UI library
- **React DOM** - React renderer
- **React Router DOM** - Routing

### Styling
- **TailwindCSS v4** - Utility-first CSS framework
- **@tailwindcss/postcss** - PostCSS plugin for TailwindCSS v4

### API & HTTP
- **Axios** - HTTP client

### Build Tools
- **Vite** - Fast build tool
- **@vitejs/plugin-react** - Vite plugin for React

## 🎨 Features

### ✅ Authentication
- Login page dengan glassmorphism design
- Protected routes
- JWT token management
- AuthContext untuk global state
- Auto-redirect untuk authenticated/unauthenticated users

### ✅ Components
**Common Components:**
- `Button` - Multiple variants (primary, secondary, outline, ghost, danger)
- `Input` - With label, icon, dan error handling
- `Card` - Glassmorphism card container
- `Loading` - Spinner dengan berbagai size

**Layout Components:**
- `Navbar` - Navigation bar dengan auth-aware menu
- `MainLayout` - Main layout dengan animated background

### ✅ Pages
- **Login** - Modern login page dengan glassmorphism
- **Dashboard** - Dashboard dengan stats cards
- **Profile** - Profile page dengan edit mode
- **NotFound** - 404 error page

### ✅ Services
- **API Client** - Axios instance dengan interceptors
- **Auth Service** - Login, register, logout methods

### ✅ Custom Hooks
- `useLocalStorage` - LocalStorage dengan React state
- `useDebounce` - Debounce untuk input optimization

### ✅ Utils
- Date formatting
- Email & password validation
- Text manipulation
- ID generation

## 🔐 Protected Routes

Routes dilindungi menggunakan `ProtectedRoute` component:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

Public routes menggunakan `PublicRoute` untuk redirect user yang sudah login:

```jsx
<PublicRoute>
  <Login />
</PublicRoute>
```

## 🎯 Routing

- `/` - Redirect to dashboard (protected)
- `/login` - Login page (public)
- `/dashboard` - Dashboard (protected)
- `/profile` - Profile page (protected)
- `*` - 404 Not Found

## 🎨 Design System

### Colors
- Primary: Purple gradient (from-purple-600 to-pink-600)
- Secondary: White with transparency
- Background: Dark gradient (slate-900 via purple-900)

### Effects
- Glassmorphism dengan backdrop-blur
- Animated blob backgrounds
- Smooth transitions
- Hover effects

## 📝 Available Scripts

- `npm run dev` - Jalankan development server
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Environment Variables

Semua environment variables harus diawali dengan `VITE_`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Akses di code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🔧 Customization

### Menambah Route Baru
1. Buat page component di `src/pages/`
2. Tambahkan route di `src/App.jsx`
3. Update `APP_ROUTES` di `src/constants/index.js`

### Menambah Service Baru
1. Buat service file di `src/services/`
2. Import `api` dari `src/services/api.js`
3. Export service functions

### Menambah Component Baru
1. Buat component di `src/components/common/` atau `src/components/layout/`
2. Export dari `index.js` di folder tersebut

## 📄 License

ISC
