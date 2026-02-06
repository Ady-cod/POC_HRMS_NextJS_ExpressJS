---
name: dns-override-email-validation
overview: Add an optional DNS_SERVERS override at backend startup and make email domain validation fail-open on DNS lookup errors to avoid blocking teammates with restricted resolvers.
todos: []
isProject: false
---

# DNS Resolver Override + Fail-Open Email Validation

## Decisions / Assumptions

- Use a custom `Resolver` only for email validation when `DNS_SERVERS` is set (no global DNS override).
- Control DNS validation behavior via `EMAIL_DOMAIN_VALIDATION_MODE` (`strict|warn|off`); if unset, default to `strict` in production and `warn` otherwise.
- Add A/AAAA fallback when MX is empty to reduce false negatives.
- Add a 5s DNS lookup timeout and treat timeouts as “unavailable” (mode-dependent).
- No schema changes: when DNS is unavailable and a bypass is used, record via logs/audit only.

## Plan

### 1) Add DNS_SERVERS handling in email validation

- Update `[hrms-backend-expressjs/src/schemas/employeeSchema.ts](hrms-backend-expressjs/src/schemas/employeeSchema.ts)` to create a `Resolver` once (module scope) when `DNS_SERVERS` is set and use it for MX lookups.
- Keep default Node resolver when env var is unset (no global override).
- Example snippet:

```ts
import { Resolver } from "node:dns/promises";

const raw = process.env.DNS_SERVERS; // e.g. "1.1.1.1,8.8.8.8"
const resolver = raw ? new Resolver() : null;

if (raw && resolver) {
  const servers = raw.split(",").map((s) => s.trim()).filter(Boolean);
  resolver.setServers(servers);
}
```

### 2) Add validation mode + MX fallback

- Update `[hrms-backend-expressjs/src/schemas/employeeSchema.ts](hrms-backend-expressjs/src/schemas/employeeSchema.ts)` in `isDomainValid` to:
  - Read `EMAIL_DOMAIN_VALIDATION_MODE` and apply: `strict` (fail-closed), `warn` (fail-open + warning), `off` (skip DNS checks).
  - Apply a consistent 5s timeout to DNS lookups (MX and A/AAAA).
  - Error matrix:
    - `ENOTFOUND` (NXDOMAIN) → invalid in all modes except `off`.
    - `ENODATA` (no MX) → fall back to `resolve4`/`resolve6`.
    - `ECONNREFUSED`, `ETIMEOUT`, `EAI_AGAIN`, `SERVFAIL`, timeout → treat as “unavailable” and follow mode (`warn` allows with warning; `strict` rejects).
  - Log a warning when DNS lookup fails (include error code) in `warn` mode.

### 3) Log resolver mode on startup

- Add a one-time log line on server startup indicating whether DNS override is enabled and the active validation mode (`strict|warn|off`).
- Throttle repeated DNS failure warnings (e.g., once per minute) to avoid log spam.

### 4) Document the env vars

- Update `[hrms-backend-expressjs/.env.example](hrms-backend-expressjs/.env.example)` with `DNS_SERVERS` and `EMAIL_DOMAIN_VALIDATION_MODE` descriptions and examples.
- Update `[hrms-backend-expressjs/README.md](hrms-backend-expressjs/README.md)` to mention optional DNS override and validation modes.

### 5) Quick validation steps

- Run backend and try employee create/update with an email domain on a machine that previously failed.
- Confirm logs show a warning (if DNS fails) but validation proceeds.

## Definition of Done

- `DNS_SERVERS` override applies only when set.
- Email validation follows `EMAIL_DOMAIN_VALIDATION_MODE` rules.
- Docs updated with env var usage and expected behavior.
