# Production Roadmap

## Phase 1 — Hardening

- Add environment validation at startup
- Add structured request logging
- Add smoke tests for health endpoints
- Ensure deployment config uses the correct backend entrypoint

## Phase 2 — Security

- Add stricter validation for create/update payloads
- Introduce centralized permission checks
- Add file upload size and type restrictions
- Rotate secrets and store them securely

## Phase 3 — Reliability

- Add integration tests for auth, tools, and borrow requests
- Add CI checks for linting and tests
- Add observability and error tracking hooks
- Document rollback steps and operational runbook

## Phase 4 — Scale

- Move background jobs out of request handlers
- Add caching and search improvements
- Introduce queue-based notifications and image processing
