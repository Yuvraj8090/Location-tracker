# FieldTrack Enterprise – React Native App

## Project Structure

```
fieldtrack/
├── app/
│   ├── _layout.tsx              ← Root layout (auth gate)
│   ├── task-detail.tsx          ← Task detail modal screen
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx            ← Login screen
│   └── (tabs)/
│       ├── _layout.tsx          ← Bottom tab navigator
│       ├── index.tsx            ← Home dashboard
│       ├── tasks.tsx            ← Tasks list
│       ├── map.tsx              ← Live map (OSM-based)
│       ├── security.tsx         ← Device security checks
│       └── profile.tsx          ← User profile
├── components/
│   ├── Badge.tsx                ← Status badge
│   ├── StatCard.tsx             ← Dashboard stat card
│   ├── TaskCard.tsx             ← Reusable task card
│   └── SecurityBanner.tsx       ← Security status strip
├── constants/
│   ├── theme.ts                 ← Colors, typography
│   └── data.ts                  ← Dummy data (replace with API)
├── store/
│   └── useAuth.ts               ← Auth context
├── app.json
├── package.json
├── tsconfig.json
└── babel.config.js
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run on Android
npx expo run:android

# 3. Run on iOS
npx expo run:ios

# 4. Expo Go (quick test)
npx expo start
```

## Key Technologies
- **Expo Router** – File-based navigation
- **@expo/vector-icons** – Ionicons (included in Expo)
- **OpenStreetMap** – Free map tiles (no billing)
- **React Native StyleSheet** – No external CSS

## Production Upgrades (Phase 2)

### Real Map
```bash
npm install @maplibre/maplibre-react-native
# Replace <SimulatedMap> in map.tsx with <MapLibreGL.MapView>
# Tile URL: https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

### Background GPS
```bash
npx expo install expo-location expo-task-manager
```

### Security (Anti-tamper)
```bash
npm install react-native-device-info
npm install @dr.pogodin/react-native-root-detection
# Implement checks in hooks/useSecurityCheck.ts
```

### JWT Auth (replace dummy)
```bash
npm install axios @react-native-async-storage/async-storage
# Update store/useAuth.ts to call your API
```

### Real-time Tracking
```bash
npm install socket.io-client
# Connect to your Node.js WebSocket server
```

## Backend API Endpoints (to be implemented)

| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| POST   | /api/auth/login             | JWT login                 |
| GET    | /api/tasks                  | Get assigned tasks        |
| PUT    | /api/tasks/:id/status       | Update task status        |
| POST   | /api/location/update        | Live GPS update           |
| POST   | /api/security/violation     | Report security event     |
| GET    | /api/routes/:taskId         | Get allowed route         |

## Environment Variables (.env)

```
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_MAP_TILE_URL=https://tile.openstreetmap.org/{z}/{x}/{y}.png
```

## License
Enterprise Internal Use Only
