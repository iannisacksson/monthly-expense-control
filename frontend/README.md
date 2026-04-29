# Frontend

## Purpose

This workspace contains the React frontend for the monthly expense control application.

The frontend is part of the repository monorepo and should be managed through the root npm workspaces setup.

## Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack React Query
- Zustand

## Monorepo Commands

Run these commands from the repository root:

```bash
npm install
npm run dev:frontend
npm run build:frontend
npm run lint:frontend
```

You can still run workspace-local scripts from `frontend/`, but the root commands are the default entrypoint.

## Folder Overview

```text
frontend/
├ public/
├ src/
│ ├ assets/
│ ├ components/
│ ├ config/
│ ├ hooks/
│ ├ layouts/
│ ├ pages/
│ ├ routes/
│ ├ services/
│ ├ store/
│ ├ styles/
│ ├ types/
│ └ utils/
├ index.html
├ package.json
└ vite.config.ts
```

## Architectural Notes

- server state is handled with React Query
- client-side global state uses Zustand where needed
- API communication goes through `src/services`
- route composition lives in `src/routes`
- pages compose hooks and UI components

## Product State

The frontend is in a transition from legacy family-based navigation to user-centered monthly flows.

Current code includes both:

- target user-scoped flows
- legacy family compatibility screens and routes still present during migration

When updating screens, prefer the user-centered flow unless the change is explicitly about legacy compatibility.

## Related Documentation

- `docs/architecture/frontend/architecture.md`
- `docs/ai/frontend/development-workflow.md`
- `docs/product/vision.md`
- `docs/adr/ADR-003-user-month-refactor.md`
