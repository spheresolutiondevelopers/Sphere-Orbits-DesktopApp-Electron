# Sphere Orbits – Desktop App

Offline-first Electron client for Sphere Schedule.

## Development

- `pnpm install`
- `pnpm dev` – starts all packages in watch mode
- `pnpm build` – builds all packages
- `pnpm start` – runs the built app

## Project Structure

- `packages/shared` – DTOs, schemas, types, utilities
- `packages/domain` – pure business logic (use cases)
- `packages/data` – SQLite repositories and API clients
- `packages/main` – Electron main process
- `packages/preload` – secure IPC bridge
- `packages/renderer` – React frontend

## Licensing

Proprietary – Sphere Solution Developers.