# 🛍️ Product Explorer

A React Native mobile app built with Expo that lets you browse products, search and filter by category, and save your favourites — with a clean dark UI and persistent login.

---

## What it does

You log in once and stay logged in. Browse a product catalog, search for anything, filter by category, tap a product to see details, and heart the ones you like. Your favourites are saved even if you close the app.

---

## Screens

**Login** — Enter your username and password. Validates inputs on the client side before hitting the API. Shows a shake animation and error banner if credentials are wrong. Has a demo account button if you just want to try it quickly.

**Home / Catalog** — Loads all products from the Fake Store API. Search bar at the top filters in real time. Category chips (All, Electronics, Men's, Women's, Jewelry) let you narrow things down. Pull down to refresh. If something goes wrong fetching data, you get an error screen with a Retry button.

**Product Detail** — Full product page with image, title, price, category, star rating, review count, and description. Add or remove from favourites right from here. Heart icon in the top right does the same thing.

**Favourites** — All your saved products in one place. Shows your account info and a count of saved items. Tap the trash icon to remove one — it slides out with a nice animation. Empty state with a Browse button if your list is empty. Logout button is here too.

---

## Tech stack

- **React Native** with Expo
- **Redux Toolkit** for state management
- **redux-persist** + **AsyncStorage** to keep login and favourites across sessions
- **React Navigation** — native stack + bottom tabs
- **NativeWind** (Tailwind for React Native) for utility classes
- **DummyJSON API** for authentication
- **Fake Store API** for products

---

## Redux store

Three slices:

| Slice | What it manages |
|---|---|
| `auth` | `token`, `isLoggedIn`, `user`, `loading`, `error` |
| `products` | `items`, `filteredItems`, `searchQuery`, `selectedCategory`, `loading`, `error` |
| `favorites` | `items` |

`auth` and `favorites` are persisted to AsyncStorage. `products` is always fetched fresh.

---

## Getting started

**Clone and install**
```bash
git clone <your-repo-url>
cd Product-Explorer
npm install
npx expo install @react-native-async-storage/async-storage
```

**Start the app**
```bash
npx expo start
```

Scan the QR code with Expo Go on your phone, or press `i` for iOS simulator / `a` for Android emulator.

---

## Demo account

The app uses DummyJSON for auth. You can log in with:

```
Username: emilys
Password: emilyspass
```

Or tap the "Use demo account" button on the login screen.

---

## Project structure

```
Product-Explorer/
├── screens/
│   ├── Login.js
│   ├── HomeScreen.js
│   ├── ProductScreen.js
│   └── FavouritesScreen.js
├── store/
│   ├── index.js          ← Redux store + persist config
│   ├── authSlice.js
│   ├── productsSlice.js
│   └── favoritesSlice.js
├── components/
│   └── ProductCard.js
├── App.js                ← Navigation + Provider + PersistGate
└── global.css
```

---

## Features at a glance

- ✅ Login with real API authentication
- ✅ Token persisted — stay logged in after closing the app
- ✅ Product listing with search and category filter
- ✅ Pull-to-refresh
- ✅ Error states with retry
- ✅ Product detail with ratings
- ✅ Add / remove favourites with animation
- ✅ Favourites persisted across sessions
- ✅ Logout with confirmation dialog
- ✅ Floating tab bar with active state indicators
- ✅ Smooth animations throughout (spring, fade, shake, slide)

---

## APIs used

| API | Endpoint | Purpose |
|---|---|---|
| DummyJSON | `POST /auth/login` | User authentication |
| Fake Store | `GET /products` | Product catalog |

---

Built with React Native + Expo.