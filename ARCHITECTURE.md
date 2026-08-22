# SprintDesk — Architecture Document

## 1. Overview

SprintDesk is a single-page application with four main screens (Login, Dashboard, Board, Analytics) built around one core architectural idea: **server state and client state are kept in clearly separate layers, and client state "seeds" itself from server state exactly once per session.**

This document explains why, and how the pieces fit together.

## 2. Folder Structure

```
src/
├── api/            # Service layer — the ONLY place that talks to the network
│   ├── clients.ts          # 3 axios instances (mock data, DummyJSON, JSONPlaceholder)
│   ├── interceptors.ts     # Bearer-token attach + silent refresh + retry
│   ├── authService.ts
│   ├── mockDataService.ts
│   └── notificationService.ts
├── hooks/          # TanStack Query hooks + bridging hooks (query → store)
├── stores/         # Zustand stores — client-owned state, several with persist
├── components/
│   ├── ui/         # Design system: Button, Input, Select, Modal, Badge, Toast, Skeleton, DataTable
│   ├── layout/     # Navbar, AppLayout, ProtectedRoute
│   ├── board/      # TaskCard, Column, TaskDrawer, CreateTaskModal
│   ├── analytics/  # (chart usage lives directly in the Analytics page)
│   └── notifications/
├── pages/          # Route-level screens (lazy-loaded except Login)
├── types/          # Shared TypeScript interfaces
└── utils/          # Pure functions: taskDisplay.ts, analytics.ts
```

## 3. Data Flow

```
UI Components
    ↓  (call hooks, never fetch() directly)
Hooks Layer (TanStack Query hooks / bridging hooks)
    ↓
API / Service Layer (src/api/*)
    ↓
Data Source (mock-data.json served from /public, or DummyJSON / JSONPlaceholder)
```

No component imports from `src/api/` directly. This means the mock JSON file can be replaced with a real backend by changing only the service layer — the UI and hooks are untouched.

## 4. State Management Strategy

Three tiers, matching the assignment's required separation:

### Server state — TanStack Query

Used for anything that originates from an API call: `getTasks`, `getUsers`, `getSprints`, `getComments`, `getInitialNotifications`, the DummyJSON login/refresh calls, and the JSONPlaceholder poll. TanStack Query owns loading/error/caching/refetch for these.

### Client state — Zustand

Used for state the UI owns and mutates locally, since there's no real backend to persist mutations to:

- `authStore` — user, tokens, auth flags
- `boardStore` — the live, editable task list (status, order, edits)
- `commentsStore` — client-added comments
- `notificationStore` — notification read/unread state, seen-poll-ID tracking
- `toastStore` — ephemeral UI feedback (not persisted)
- `themeStore` — light/dark preference

### Local component state

Form inputs (`Login`, `CreateTaskModal`), UI toggles (mobile menu open, delete-confirmation open) — kept with `useState`, never promoted to Zustand.

### The "hydrate-once" pattern

This is the key architectural decision in the whole app. `boardStore` and `notificationStore` both work like this:

1. On first load, a TanStack Query hook fetches the initial list from the mock data source.
2. A `hydrate()` action seeds the Zustand store with that data — but **only if the store hasn't already been hydrated** (`isHydrated` flag).
3. From that point on, all reads and mutations (drag-and-drop, edits, new comments, notification read-state) go through Zustand, which persists to `localStorage`.

**Why:** there's no real backend to PATCH. If the store re-seeded from the server on every load, a user's board layout or read notifications would reset on every refresh, since the mock JSON is static. Hydrate-once means the server data is only ever a _starting point_ — after that, the persisted client state is the source of truth.

### The hydration-timing bug (and its fix)

Zustand's `persist` middleware reads from `localStorage` asynchronously relative to store creation, so an effect that runs on mount can read stale defaults before the persisted values load. `authStore` addresses this with an explicit `hasHydrated` flag, set via `onRehydrateStorage`, which the app's session-restore `useEffect` waits on before deciding whether a user is logged in. Without this, a page refresh could incorrectly appear to log the user out even though valid tokens were sitting in `localStorage`.

## 5. Authentication Flow

```
Login form → POST /auth/login (DummyJSON)
    → accessToken kept in memory only (Zustand state, not persisted)
    → refreshToken persisted to localStorage (via Zustand `partialize`)

Every outgoing request (mockClient, authClient)
    → request interceptor attaches `Authorization: Bearer <accessToken>`

On 401 response
    → response interceptor calls /auth/refresh with the stored refreshToken
    → new accessToken applied, original request retried once
    → concurrent 401s are queued so only one refresh call fires
    → refresh failure → clearAuth() → redirect to /login

On page load / refresh
    → accessToken is gone (never persisted)
    → app waits for Zustand hydration, then calls /auth/refresh proactively
      to silently re-establish a session from the persisted refreshToken
```

## 6. Component Design System

Every interactive primitive (`Button`, `Input`, `Select`, `Modal`, `Badge`, `Toast`, `Skeleton`, `DataTable`) lives in `components/ui/` and is used everywhere in the app — no raw `<input>`/`<button>`/`<select>` elements appear in feature code. `Modal` is a single component with a `position` prop (`center` | `right`) rather than separate Modal/Drawer components, since they share all dialog behavior (portal rendering, Escape-to-close, focus trap/restore).

## 7. Drag and Drop

`@dnd-kit/core` + `@dnd-kit/sortable` power the board. `PointerSensor` uses an activation distance (5px) so that a plain click (to open the task drawer) doesn't get misinterpreted as a drag start. `KeyboardSensor` is wired in alongside it for keyboard-accessible reordering.

## 8. Performance Decisions

- Dashboard, Board, and Analytics are route-level code-split with `React.lazy` + `Suspense`; Login stays eager since it's the first screen unauthenticated users see.
- `TaskCard` and `Column` are wrapped in `React.memo`; the Board page memoizes its per-status task grouping (`useMemo`) and stabilizes the task-click handler (`useCallback`) so memoization on the children actually holds.

## 9. Testing Strategy

Three unit-test suites, matching the assignment's required scope:

- `useToast` — verifies toast creation, typing, and auto-dismiss timing (via fake timers).
- `boardStore` — add/move/delete actions, and the hydrate-once guarantee.
- Auth interceptor — Bearer-token attachment, 401 → refresh → retry, and refresh-failure → logout, using `axios-mock-adapter` so no real network calls are made in tests.

## 10. Known Trade-offs

See the README's "Known Limitations" section for the full list. The central trade-off worth calling out here: because the app has no real backend, "server state" for tasks/comments/notifications is really "an initial snapshot of server state, after which the client takes over." This was a deliberate simplification given the assignment's mock-data constraint, and is called out explicitly rather than left implicit.
