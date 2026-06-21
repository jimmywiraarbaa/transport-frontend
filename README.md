# Transport Frontend

React SPA frontend for **Transport Care** — a vehicle maintenance management system with dashboard, vehicle tracking, maintenance records, and master data management.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build Tool | Vite 5 |
| UI Library | MUI v9 (Material UI) |
| State (server) | TanStack Query v5 |
| State (client) | Zustand |
| Routing | React Router v6 |
| Styling | MUI sx prop + Emotion |

## Features

- **Dashboard** — Overview of all vehicles with maintenance alert status chips, bold odometer readings, and quick navigation
- **Vehicle Management** — List, create, edit, delete vehicles with responsive card layout on mobile
- **Vehicle Detail** — Full vehicle info with maintenance alert breakdown per part
- **Maintenance Records** — Log and track service history with cost, technician, and odometer at time of service
- **Master Data** — Three tabs: vehicle types, maintenance parts, and schedule rules (with vehicle type filter)
- **Auth** — JWT-based login with auto-refresh, route protection, and session persistence
- **Responsive** — Desktop tables, mobile card layouts across all pages

## Project Structure

```
transport-frontend/
  src/
    api/                HTTP client + auth/token management
      client.ts         Axios-like fetch wrapper with auto-refresh
      endpoints.ts      API URL builder
      auth.ts           Auth API calls
      tokens.ts         Token storage (localStorage)
    components/          Shared UI components
      ConfirmDialog.tsx
      RecordFormDialog.tsx
      StatusChip.tsx    Alert status → color mapping
      ToastProvider.tsx
    hooks/              TanStack Query hooks
      useAuthBootstrap.ts
      useVehicles.ts
      useMaintenance.ts
      useAlerts.ts
    layouts/            Route layouts
      AppLayout.tsx     Authenticated layout (sidebar + topbar)
      AuthLayout.tsx    Login layout
    pages/              Route-level pages
      DashboardPage.tsx
      VehiclesPage.tsx
      VehicleFormPage.tsx
      VehicleDetailPage.tsx
      RecordsPage.tsx
      MastersPage.tsx
      LoginPage.tsx
    store/              Zustand stores
      authStore.ts      User session state
      toastStore.ts     Toast notifications
    theme/              MUI theme
      theme.ts          Lilac palette, typography, component overrides
    types/              TypeScript interfaces
      index.ts          Vehicle, ScheduleRule, MaintenanceRecord, etc.
    App.tsx             Root: routes, providers, lazy loading
    main.tsx            Vite entry point
```

## Routing

| Path | Page | Access |
|---|---|---|
| `/login` | LoginPage | Public |
| `/` | DashboardPage | Protected |
| `/vehicles` | VehiclesPage | Protected |
| `/vehicles/new` | VehicleFormPage | Protected |
| `/vehicles/:id` | VehicleDetailPage | Protected |
| `/vehicles/:id/edit` | VehicleFormPage | Protected |
| `/records` | RecordsPage | Protected |
| `/masters` | MastersPage | Protected |

Feature pages are lazy-loaded via `React.lazy` for code splitting.

## Quick Start

### Docker (recommended)

Backend API must be running first (creates the `transport-net` Docker network):

```bash
# 1. Start backend (from project root)
cd transport-api
docker compose up -d --build

# 2. Start frontend
cd ../transport-frontend
docker compose up -d --build
```

Frontend available at http://localhost:5173

The Dockerfile builds the SPA with Vite, then serves static files via Nginx with:
- SPA fallback (`try_files → /index.html`)
- API reverse proxy (`/api/ → transport-api:8080`)

### Local Development

```bash
cd transport-frontend
cp .env.example .env.local
npm install
npm run dev
```

Vite dev server runs on http://localhost:5173 with proxy to `http://localhost:8080` for `/api` requests.

### Build

```bash
npm run build         # tsc typecheck + vite build → dist/
npm run preview       # preview production build locally
```

## Configuration

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | API base URL (dev only; Docker uses Nginx proxy) |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript type check (no emit) |

## Auth Flow

1. User logs in → API returns `access_token` + `refresh_token`
2. Tokens stored in `localStorage` via `tokens.ts`
3. API client (`client.ts`) attaches `Authorization: Bearer <access_token>` to all requests
4. On 401 response → client auto-calls `/auth/refresh` and retries the original request
5. On refresh failure → redirects to `/login`
6. Auth state managed by Zustand `authStore.ts`

## Alert Status Colors

| Status | MUI Color | Meaning |
|---|---|---|
| `ok` | `success` (green) | Comfortably within thresholds |
| `due_soon` | `warning` (amber) | Within 500 km or 14 days |
| `overdue` | `error` (red) | Threshold passed |

Handled by `StatusChip.tsx` component.

## Theme

Custom lilac/purple theme defined in `theme.ts`:
- Primary: Purple shades
- Typography: Inter font family
- Component overrides for buttons, cards, chips
- Responsive breakpoints for mobile card layouts
