1: # Task Manager
2: 
3: React Native (Expo) mobile app for managing personal tasks. Built with TanStack Query for optimistic cache-first UX and AsyncStorage for local persistence.
4: 
5: ## Repositories
6: 
7: | Package | Path | Description |
8: |---------|------|-------------|
9: | **API** | [`task-api/`](./task-api) | Express/Sequelize backend (port 3001) |
10: | **App** | [`task-app/`](./task-app) | React Native (Expo) mobile app |
11: 
12: ## Quick Start
13: 
14: ```bash
15: # API (already running on port 3001)
16: cd task-api
17: npm install
18: npm run dev
19: 
20: # App
21: cd task-app
22: npm install
23: npx expo start
24: ```
25: 
26: ## Setup
27: 
28: 1. Ensure the backend is running on `http://localhost:3001`.
29: 2. The app reads the API URL from `API_BASE_URL` in `.env`.
30: 3. Because the app runs on an emulator/device, `localhost` in `.env` refers to the emulator itself, not your machine. Update `API_URL` to use your machine's LAN IP or the Android emulator alias.
4: 
5: Example `.env`:
6: 
7: ```env
8: API_BASE_URL=http://10.20.131.169:3001
9: API_BASE_URL=http://10.20.131.169:3001
10: ```
11: 
12: Fallbacks if the emulator/device cannot reach the LAN IP:
13: 
14: - Android emulator alias: `http://10.0.2.2:3001`
15: - Machine LAN IP (find with `hostname -I` on Linux/macOS or `ipconfig` on Windows)
16: 
17: ## Backend Summary
18: 
19: The backend is an Express + Sequelize API running on port 3001. It exposes tasks and categories through a `{ success, message, data }` envelope. Key routes:
20: 
21: - `GET /api/tasks` — list with optional `search`, `categoryId`, `status` filters
22: - `GET /api/tasks/:id` — single task
23: - `POST /api/tasks` — create task
24: - `PUT /api/tasks/:id` — partial update
25: - `PATCH /api/tasks/:id/status` — toggle `open` / `done`
26: - `DELETE /api/tasks/:id` — delete task
27: - `GET /api/categories` — list categories
28: - `POST /api/categories` — create category
29: 
30: Seed data is pre-loaded. Example categories: Work, Personal, Shopping.
31: 
32: ## Architecture Decisions
33: 
34: ### Local Storage: AsyncStorage
35: 
36: The app uses `@react-native-async-storage/async-storage` for offline-first caching. Reasoning: no native module rebuild risk on Expo managed workflow, sufficient for a small dataset (tens to low hundreds of tasks), and the synchronous JSON schema is easy to reason about and test. The spec does not require complex querying that would justify SQLite.
37: 
38: Three separate storage keys are used:
39: - `taskCache` — raw task list from the server
40: - `starredMap` — local-only `Record<taskId, boolean>` (survives cache refresh)
41: - `categoryCache` — raw category list from the server
42: 
43: ### State Management: TanStack Query
44: 
45: The existing TV app already used React Query, so we kept consistency. Its `staleTime`/background-refetch/`isFetching` model maps directly onto "render cache first, refresh in background, show loading state" without hand-rolling that logic in Context/Reducer.
46: 
47: `usePersistedTasksQuery` seeds `initialData` from AsyncStorage on mount, then lets TanStack Query handle refetching. On success, it writes raw tasks (without the local `starred` flag) back to the cache and updates `lastRefreshedAt`.
48: 
49: ### How `starred` Survives a Refresh
50: 
51: `starred` is stored in its own AsyncStorage key (`starredMap`), separate from the task cache. After every background refresh, fresh backend tasks are merged with the existing `starredMap` via `mergeTasksWithStarred`. The raw task cache is never overwritten with starred state, so a refresh can never clear stars.
52: 
53: ## Testing
54: 
55: Tests run with Jest + `@testing-library/react-native`.
56: 
57: ```bash
58: npx jest --no-watch
59: ```
60: 
61: Test coverage:
62: 1. `src/utils/__tests__/taskFilters.test.ts` — filtering by category, status, search, and sorting by `dueDate` / `createdAt` in both directions.
63: 2. `src/utils/__tests__/mergeTasks.test.ts` — starred preservation across a simulated refresh.
64: 3. `src/components/__tests__/TaskCard.test.tsx` — renders title, status badge, and starred indicator.
65: 
66: ## Known Limitations
67: 
68: - No bidirectional sync / offline write queue (mutations fail when offline).
69: - No conflict resolution if the same task is edited on two devices.
70: - No optimistic updates with rollback on failure.
71: - No authentication — all data is treated as local/anonymous.
72: - No dark mode.
73: - Sorting is client-side only after fetch.
74: 
75: ## What I'd Do With Another Day
76: 
77: 1. Add a proper form modal for creating/editing tasks instead of inline placeholders.
78: 2. Implement pull-to-refresh + skeleton loaders.
79: 3. Add swipe-to-delete and swipe-to-complete gestures.
80: 4. Persist filter/sort preferences so they survive app restarts.
81: 5. Add date-picker for `dueDate` instead of raw text.
82: 
83: ## AI Usage
84: 
85: This file was generated as part of an AI-assisted build session. The overall structure, migration plan, and detailed implementation spec were provided as build instructions; the code was written iteratively under that spec.
