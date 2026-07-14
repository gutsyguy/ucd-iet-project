# IET Take-Home — AggieFeed Viewer

A React Native (Expo) mobile app that fetches and displays the UC Davis AggieFeed public activity stream. Users can browse a paginated list of activities and tap any item to view its full detail.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [Running the App](#running-the-app)
4. [Environment Variables](#environment-variables)
5. [Project Structure](#project-structure)
6. [Architecture & Key Decisions](#architecture--key-decisions)
7. [Error Handling](#error-handling)
8. [Assumptions](#assumptions)
9. [Known Limitations](#known-limitations)

---

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Node.js | ≥ 18 | LTS recommended |
| Bun _or_ npm | any | Bun is used in this project (`bun install`) |
| Expo Go | latest | Install on a physical device from the App Store / Play Store |
| Android Studio | latest | Required only for Android emulator (`expo run:android`) |
| Xcode | ≥ 15 | Required only for iOS simulator (`expo run:ios`), macOS only |

> **No Expo account is required** to run the app in Expo Go via QR code.

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/gutsyguy/ucd-iet-project.git
cd iet-takehome
```

### 2. Install dependencies

```bash
bun install
# or
pnpm install
```

### 3. Create the environment file

Copy the template below and save it as **`.env.local`** in the project root:

```env
EXPO_PUBLIC_BASE_URL=https://aggiefeed.ucdavis.edu/api/v1/activity/public?s=0&l=25
```

> `.env.local` is listed in `.gitignore` and will never be committed. The `EXPO_PUBLIC_` prefix is required by Expo for variables that are inlined into the client bundle at build time.

---

## Running the App

### Expo Go (recommended for quick testing)

```bash
bun start
# or
npx expo start
```

Scan the QR code that appears in the terminal with:
- **iOS** — the default Camera app
- **Android** — the Expo Go app

### Android emulator

```bash
npx expo run:android
```

Requires Android Studio with at least one AVD (Android Virtual Device) created and running. The first build takes several minutes while Gradle downloads its dependencies.

### iOS simulator (macOS only)

```bash
npx expo run:ios
```

Requires Xcode with iOS simulator tools installed (`xcode-select --install`).

### Web

```bash
npx expo start --web
```

Opens the app in your default browser. Some native-only features (e.g. `expo-symbols`, native tab bar) will not render on the web.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_BASE_URL` | ✅ Yes | Full URL of the AggieFeed API endpoint, including query parameters (`s` = offset, `l` = limit) |

The app gracefully handles a missing variable — it will display an error screen immediately with a descriptive message rather than crashing.

---

## Project Structure

```
src/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Root navigator (Stack + ErrorBoundary)
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Tab navigator shell
│   │   └── index.tsx       # Home screen — activity feed list
│   └── activity/
│       └── [id].tsx        # Activity detail screen
├── components/
│   ├── animated-icon.tsx   # Animated splash overlay
│   ├── app-tabs.tsx        # Native tab bar configuration
│   ├── error-boundary.tsx  # Global React error boundary
│   ├── hint-row.tsx        # Utility label/value row
│   ├── themed-text.tsx     # Theme-aware Text component
│   └── themed-view.tsx     # Theme-aware View component
├── constants/
│   └── theme.ts            # Color palette, spacing scale, font stacks
├── hooks/
│   ├── use-color-scheme.ts
│   └── use-theme.ts
└── types/
    └── types.ts            # AggieFeedResponse TypeScript interface
```

---

## Architecture & Key Decisions

### Expo Router (file-based routing)
Routes are defined by file paths under `src/app/`. No manual route registration is needed. Typed routes are enabled via `experiments.typedRoutes` in `app.json`.

### React Compiler
`experiments.reactCompiler` is enabled in `app.json`. The compiler handles memoization automatically; manual `useCallback` is still used where the dependency is a stable primitive (e.g. wrapping the async `fetchData` so it can be passed to a retry button).

### Native Tab Bar
`NativeTabs` from `expo-router/unstable-native-tabs` renders the platform's native bottom tab control. This API is currently unstable and may change between Expo SDK versions.

### Theme
Light and dark mode are supported via `useColorScheme()`. Color tokens are defined in `src/constants/theme.ts`; all screens read from that single source of truth.

### Navigation parameters
The detail screen (`activity/[id].tsx`) receives data through URL params passed by the router. This avoids the need for global state for a simple master–detail flow, with the implication that only serializable string values can be passed.

---

## Error Handling

Three layers protect the user from crashes and blank screens:

| Layer | Location | What it handles |
|---|---|---|
| **Global ErrorBoundary** | `_layout.tsx` / `error-boundary.tsx` | Any unhandled JavaScript render error anywhere in the component tree. Shows a "Something went wrong" screen with a reset button. |
| **Fetch error handling** | `(tabs)/index.tsx` | Network failures, non-2xx HTTP status codes, missing env var, and non-array API responses. Shows an inline error screen with a **Try Again** button that re-triggers the request. |
| **Null-safe rendering** | `(tabs)/index.tsx`, `activity/[id].tsx` | Missing or `null` fields in API response items (e.g. `item.actor?.displayName ?? "Unknown actor"`). Falls back to `"—"` or a sensible placeholder rather than crashing. |

### Loading states

- A centered `ActivityIndicator` with a label is displayed while the initial fetch is in progress.
- The list shows `"No activities found."` if the API returns a valid but empty array.

---

## Assumptions

1. **API contract** — The AggieFeed endpoint returns a JSON array of objects matching the `AggieFeedResponse` shape in `src/types/types.ts`. Fields not present in the type definition are ignored.
2. **Public API** — No authentication is required. The endpoint is publicly accessible and does not require an API key or session token.
3. **Pagination is static** — The `s` (offset) and `l` (limit) query parameters are baked into `EXPO_PUBLIC_BASE_URL`. The app does not implement infinite scroll or page navigation; it displays whichever slice the URL points to.
4. **Portrait orientation** — `app.json` locks the app to portrait (`"orientation": "portrait"`). Landscape layouts are untested.
5. **Single data source** — There is one feed endpoint. The app does not support switching between multiple feeds or user accounts.

---

## Known Limitations

- **No offline support** — There is no caching layer. If the device has no network connection the error screen is shown and the user must retry manually once connectivity is restored.
- **No pull-to-refresh** — The list does not support `FlatList`'s `onRefresh`/`refreshing` props. A full reload requires navigating away and back, or restarting the app.
- **Params-only detail screen** — The detail screen only displays the fields that are serializable as URL params (`id`, `title`, `actorDisplayName`, `objectType`, `published`). Richer fields from the API response (e.g. `object.content`, `ucdEdusMeta.labels`) are not shown.
- **Light-mode-only styling on the feed list** — The home screen card styles use `Colors.light.*` directly instead of reading from `useColorScheme()`. Dark mode is supported on the detail screen and themed components but not on the feed cards.
- **`NativeTabs` is unstable** — `expo-router/unstable-native-tabs` is an experimental API. It may break on future Expo SDK upgrades.
- **Android Gradle build** — `expo run:android` requires a correctly configured Android SDK environment. The Gradle wrapper will download `gradle-9.3.1` on first run, which may fail behind certain firewalls or proxies.
- **No automated tests** — There are no unit, integration, or end-to-end tests in this project.
