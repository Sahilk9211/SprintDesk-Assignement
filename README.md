# SprintDesk

A sprint management dashboard for software teams — Kanban board with drag-and-drop, analytics, real-time notification polling, and a from-scratch component library.

Built as a frontend engineering assignment for GrubPac Technologies.

## Live Demo

- **Live app:** https://sprint-desk-assignement.vercel.app/
- **Screen recording:** [add link]
- **Repository:** https://github.com/Sahilk9211/SprintDesk-Assignement

## Tech Stack

| Area                 | Technology                          |
| -------------------- | ----------------------------------- |
| Framework            | React 18 + TypeScript (strict mode) |
| Build tool           | Vite                                |
| Server state         | TanStack Query v5                   |
| Client state         | Zustand (with `persist` middleware) |
| Styling              | Tailwind CSS v3                     |
| Routing              | React Router v6                     |
| Charts               | Recharts                            |
| Drag & drop          | @dnd-kit/core, @dnd-kit/sortable    |
| Testing              | Vitest + React Testing Library      |
| Auth API             | DummyJSON                           |
| Notification polling | JSONPlaceholder                     |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/Sahilk9211/SprintDesk-Assignement.git
cd SprintDesk-Assignement
npm install
```

### Environment Variables

None required — all API base URLs (DummyJSON, JSONPlaceholder) are hardcoded in `src/api/clients.ts` since they're public demo APIs with no keys.

### Running Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### Test Login Credentials

DummyJSON's public demo user:

```
username: emilys
password: emilyspass
```

### Running Tests

```bash
npm run test
```

Covers: `useToast` hook, board Zustand store (add/move/delete), and the auth interceptor's refresh-and-retry flow.

### Building for Production

```bash
npm run build
npm run preview
```

## Features

### Authentication

- Login via DummyJSON, access token held in memory, refresh token persisted in localStorage
- Axios interceptor auto-attaches the Bearer token and silently refreshes + retries on 401
- Protected routes, session restored on page refresh, full-screen loader during session validation

### Kanban Board

- Four columns (Backlog, In Progress, Review, Done), drag-and-drop within and across columns via @dnd-kit
- Keyboard-accessible dragging (arrow keys once a card is focused and grabbed)
- Board state persisted across refreshes (Zustand `persist`)
- Task drawer for viewing/editing details and adding comments
- Create and delete tasks (with confirmation)

### Analytics

- Sprint Velocity, Task Status Distribution, Priority Breakdown, Completion Trend — all derived live from board state, not hardcoded
- Fully responsive, including 375px mobile

### Design System

Built from scratch with Tailwind: `Button`, `Input`, `Select`, `Modal` (center + right-drawer variants), `Badge`, `Toast`, `Skeleton`, `DataTable`.

### Notifications

- Polls JSONPlaceholder every 15s, treats new post IDs as new notifications
- Bell with unread count, panel with pagination (20/page), mark read / mark all read
- Polling pauses when the browser tab is hidden, resumes when visible
- Toast shown for new notifications only while the panel is closed

### Theming

- Light/dark mode toggle, persisted, applied via Tailwind's `class` strategy

### Performance & Accessibility

- Route-level code splitting (`React.lazy` + `Suspense`) for Dashboard, Board, Analytics
- `React.memo` on `TaskCard`/`Column`, `useMemo`/`useCallback` on board-page derived data and handlers
- Lighthouse: Performance 90+, Accessibility 98 (audited in incognito, storage-clear disabled — see note below)

## Known Limitations / What I'd Improve With More Time

- **Remember Me (30-day) and password strength indicator** — bonus features, not implemented; prioritized the required task list under the deadline.
- **`DataTable` component** — built as part of the design system (Task 04 requirement) but not currently wired into a specific page; no natural data-table use case emerged in the required screens.
- **Recharts axis/tooltip theming** — charts sit inside dark-mode-aware cards, but Recharts' internal SVG text does not automatically pick up the app's dark palette; a follow-up pass would theme axis ticks and tooltips explicitly.
- **Comments and newly-created tasks are client-only** — since there's no real backend, new comments and tasks live in Zustand (persisted to localStorage) rather than a server; this is intentional per the assignment's "simulate a backend" framing, documented here for transparency.

## A Note on Lighthouse Auditing

Chrome DevTools' Lighthouse panel clears `localStorage` by default before running, which logs the app out mid-audit (since the refresh token lives there) and can affect scores. Audits for this project were run with **"Clear storage" unchecked** and in an **incognito window** (to exclude browser extension interference), against the production build (`npm run preview`).
