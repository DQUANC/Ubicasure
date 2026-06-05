## [0.2.3] - 2026-06-05

- fix: replace invalid Maps API key and harden admin password seeding
- fix(map): replace invalid Maps API key with key from ubicasure-43ef4 project
- fix(backend): require ADMIN_PASSWORD env var, remove weak fallback

## [0.2.2] - 2026-06-05

- fix: resolve production deployment issues across backend and frontend
- chore(backend): update SuperAdmin name and email in seed data
- fix(backend): upsert admin on startup instead of skipping if exists
- fix(map): remove invalid mapId causing blank map tiles
- fix(map): move map init to ngAfterViewInit so DOM is ready
- fix(map): render map when geolocation is blocked or denied

## [0.2.1] - 2026-06-05

- Merge pull request #3 from DQUANC/feat/modernization-update-plan
- fix(backend): fix createAdmin crash and DB race condition on startup

## [0.2.0] - 2026-06-05

- feat: modernize full stack, harden CI, and ship to production
- chore(deploy): migrate Firebase project to ubicasure-43ef4
- chore(deploy): set production baseUri to Render backend URL
- feat(deploy): wire deployment to Render + Firebase Hosting

# Changelog

## [0.1.0] - 2026-06-05

- feat: modernize full stack and harden CI pipeline
- fix(ci): resolve type-check finding no tsconfig in monorepo root
- fix(ci): resolve pnpm version conflict and missing lock file errors
- feat: modernize full stack — Angular 19, pnpm, security hardening, CI/CD
- Add the front and missing configurations for the monorepo

