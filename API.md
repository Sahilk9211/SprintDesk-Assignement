# SprintDesk — API Documentation

SprintDesk talks to three data sources, each wrapped by its own axios client in `src/api/clients.ts` and accessed only through the service layer in `src/api/`.

---

## 1. Mock Data Source

**Base:** served as a static file from `/public/mock-data.json`, fetched via the `mockClient` axios instance (`baseURL: "/"`).

### GET /mock-data.json

Returns the full seed dataset. Fetched once and cached in memory by `mockDataService.ts`; individual accessor functions filter/slice this cached object.

**Response shape:**

```typescript
{
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: AppNotification[];
}
```

**Consumed via:**

| Service function            | Returns                          |
| --------------------------- | -------------------------------- |
| `getUsers()`                | `User[]`                         |
| `getSprints()`              | `Sprint[]`                       |
| `getTasks()`                | First 30 `Task[]`                |
| `getComments(taskId)`       | `Comment[]` filtered by `taskId` |
| `getInitialNotifications()` | `AppNotification[]`              |

No further requests are made against this source after the initial fetch — task edits, new comments, and new tasks are handled entirely client-side (Zustand), since this is a static mock, not a real backend. See `ARCHITECTURE.md` §4 for why.

---

## 2. Authentication — DummyJSON

**Base URL:** `https://dummyjson.com`

### POST /auth/login

**Request body:**

```json
{
  "username": "emilys",
  "password": "emilyspass",
  "expiresInMins": 30
}
```

**Response:**

```json
{
  "id": 1,
  "username": "emilys",
  "email": "emily.johnson@x.dummyjson.com",
  "firstName": "Emily",
  "lastName": "Johnson",
  "gender": "female",
  "image": "https://dummyjson.com/icon/emilys/128",
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

`accessToken` is kept in memory only; `refreshToken` and the profile fields are persisted to `localStorage` via Zustand.

### POST /auth/refresh

**Request body:**

```json
{
  "refreshToken": "<jwt>",
  "expiresInMins": 30
}
```

**Response:**

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>"
}
```

Called in two situations:

1. **Reactively**, by the response interceptor, when any request to `mockClient` or `authClient` returns `401`.
2. **Proactively**, once on app load, to silently restore a session from the persisted `refreshToken`.

### Request interceptor (applies to `mockClient` and `authClient`)

Every outgoing request receives:

```
Authorization: Bearer <current accessToken>
```

### Response interceptor (401 handling)

```
Request → 401
  → is a refresh already in flight?
      yes → queue this request, wait for the new token
      no  → call POST /auth/refresh
              success → apply new accessToken, retry original request
              failure → clear auth state, request rejected
```

Each original request is retried at most once (`_retry` flag) to prevent infinite loops if the refresh token itself is invalid.

---

## 3. Notification Polling — JSONPlaceholder

**Base URL:** `https://jsonplaceholder.typicode.com`

### GET /posts?\_limit=5

Polled every 15 seconds while the browser tab is visible (paused via the Page Visibility API when hidden).

**Response:**

```json
[
  { "userId": 1, "id": 1, "title": "...", "body": "..." },
  ...
]
```

Each post `id` not already seen (tracked in `notificationStore.seenPollIds`) is transformed into an `AppNotification` via `postToNotification()` and prepended to the notification list. This endpoint carries no auth — it's not routed through the Bearer-token interceptor.

---

## 4. Error Handling

All three clients surface errors as standard axios errors; hooks consuming them via TanStack Query expose `isError` / `error` for the UI to branch on. The only endpoint with custom recovery logic is DummyJSON's auth flow (see the 401 handling above) — mock-data and JSONPlaceholder failures are treated as plain fetch failures with no retry-with-side-effects behavior.
