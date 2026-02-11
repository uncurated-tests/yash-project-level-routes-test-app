# Project Level Routes Test App

A Next.js app designed to test all project-level routing rule types via the Vercel project-level routes API.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Managing Routes

All routing rules are managed via the `test-routes.sh` script, which calls the Vercel project-level routes API. The app itself contains **no routing logic** — it's intentionally a "dumb" set of pages.

```bash
export VERCEL_TOKEN="your-token"

# Add all rules at once
./test-routes.sh add-all

# Promote to production
./test-routes.sh promote

# List active rules
./test-routes.sh list

# Clean slate
./test-routes.sh delete-all
```

Run `./test-routes.sh help` for all commands.

---

## Test Scenarios

### 1. Rewrites (Internal, path-to-regexp)

**Pages:** `/blog/[slug]`, `/api-target/[...slug]`

```json
{
  "src": "^/posts/([^/]+)$",
  "dest": "/blog/$1"
}
```

**Test:** Visit `/posts/hello-world` — should show `/blog/hello-world` content while URL stays `/posts/hello-world`.

---

### 2. Redirects

**Pages:** `/old-page`

```json
{
  "src": "^/old-page$",
  "dest": "/",
  "status": 308
}
```

**Test:** Visit `/old-page` — browser should redirect to `/`.

---

### 3. Custom Headers

**Pages:** `/headers-test`

```json
{
  "src": "^/(.*)$",
  "headers": {
    "X-Custom-Header": "hello-from-project-routes"
  },
  "continue": true
}
```

**Test:** `curl -I https://your-app.vercel.app/headers-test` — response should include `X-Custom-Header`.

---

### 4. Has Condition (Cookie Auth)

**Pages:** `/protected`, `/login`

```json
{
  "src": "^/protected$",
  "dest": "/login",
  "missing": [{"type": "cookie", "key": "auth"}]
}
```

**Test:** Visit `/protected` without cookie — redirects to `/login`. Set `document.cookie = "auth=valid"` and reload — stays on `/protected`.

---

### 5. Missing Condition (Header)

**Pages:** `/api/data`, `/api/webhook`

```json
{
  "src": "^/api/(.*)$",
  "status": 401,
  "missing": [{"type": "header", "key": "Authorization"}]
}
```

**Test:** `curl https://your-app.vercel.app/api/data` (no header → 401). `curl -H "Authorization: Bearer x" https://your-app.vercel.app/api/data` (→ 200).

---

### 6. Method Restriction

**Pages:** `/api/webhook`

```json
{
  "src": "^/api/webhook$",
  "methods": ["POST"],
  "dest": "/api/webhook"
}
```

**Test:** `curl -X GET .../api/webhook` (should fail). `curl -X POST .../api/webhook` (should succeed).

---

### 7. Query String Match

**Pages:** `/search`, `/search-results`

```json
{
  "src": "^/search$",
  "dest": "/search-results",
  "has": [{"type": "query", "key": "q"}]
}
```

**Test:** Visit `/search?q=test` — should show search-results content. Visit `/search` (no query) — stays on search page.

---

### 8. Host Match

**Pages:** `/subdomain-home`

```json
{
  "src": "^/(.*)$",
  "dest": "/subdomain-home",
  "has": [{"type": "host", "value": {"pre": "app."}}]
}
```

**Test:** Visit `app.your-domain.com` — should show subdomain-home content.

---

### 9. Geo-based Routing

**Pages:** `/geo`, `/locale/[lang]`

```json
{
  "src": "^/$",
  "dest": "/locale/de",
  "has": [{"type": "header", "key": "x-vercel-ip-country", "value": "DE"}]
}
```

**Test:** `curl -H "x-vercel-ip-country: DE" https://your-app.vercel.app/` — should rewrite to `/locale/de`.

---

### 10. Continue (Non-terminating Match)

```json
{
  "src": "^/(.*)$",
  "headers": {"X-Matched": "true"},
  "continue": true
}
```

**Test:** Any page should include `X-Matched` header in the response while still serving the original page.

---

### 11. A/B Testing (Cookie-based Internal Rewrite)

**Pages:** `/experiment`, `/experiment/variant-a`, `/experiment/variant-b`

```json
{
  "src": "^/experiment$",
  "dest": "/experiment/variant-a",
  "has": [{"type": "cookie", "key": "ab_bucket", "value": "a"}]
}
```
```json
{
  "src": "^/experiment$",
  "dest": "/experiment/variant-b",
  "has": [{"type": "cookie", "key": "ab_bucket", "value": "b"}]
}
```

**Test:**
```bash
# Set cookie and visit
document.cookie = "ab_bucket=a"  # then visit /experiment -> variant A
document.cookie = "ab_bucket=b"  # then visit /experiment -> variant B

# Or via header
curl -H "x-ab-group: a" https://your-app.vercel.app/experiment
curl -H "x-ab-group: b" https://your-app.vercel.app/experiment
```

---

### 12. External Rewrites (Proxy to Another Domain)

**Pages:** `/external-api`, `/api/echo`

```json
{
  "src": "^/external/api/(.*)$",
  "dest": "https://httpbin.org/$1"
}
```

With security token:
```json
{
  "src": "^/external/api/(.*)$",
  "dest": "https://httpbin.org/$1",
  "headers": {
    "X-Api-Key": "secret-token-123",
    "X-Forwarded-Host": "your-app.vercel.app"
  }
}
```

**Test:**
```bash
# Should return httpbin.org response
curl https://your-app.vercel.app/external/api/get
curl https://your-app.vercel.app/external/api/headers  # should show injected X-Api-Key
```

---

### 13. Multi-Tenant Docs (Mintlify/Flint)

**Pages:** `/docs`, `/docs/[...slug]`

```json
{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://your-org.mintlify.dev/docs/$1"
}
```

Per-tenant:
```json
{
  "src": "^/docs(?:/(.*))?$",
  "dest": "https://tenant-a.mintlify.dev/docs/$1",
  "has": [{"type": "host", "value": {"pre": "tenant-a."}}]
}
```

**Test:** Visit `/docs` — should proxy to external docs provider. Visit `/docs/getting-started` — should proxy the subpath.

---

### 14. Microsites (Domain → Project)

**Pages:** `/microsite`

```json
{
  "src": "^/(.*)$",
  "dest": "/microsite/$1",
  "has": [{"type": "host", "value": {"pre": "promo."}}]
}
```

**Test:** Visit `promo.your-domain.com` — should show microsite content.

---

### 15. Complex Redirects (Wildcard/Pattern Matching)

**Pages:** `/new-blog/[...slug]`, `/products/[category]/[id]`

Drop date segments:
```json
{
  "src": "^/old-blog/[0-9]{4}/[0-9]{2}/(.+)$",
  "dest": "/new-blog/$1",
  "status": 308
}
```

Rename category prefix:
```json
{
  "src": "^/products/old-([^/]+)/(.+)$",
  "dest": "/products/$1/$2",
  "status": 308
}
```

Wildcard path migration:
```json
{
  "src": "^/v1/blog/(.*)$",
  "dest": "/new-blog/$1",
  "status": 308
}
```

**Test:**
```bash
curl -I https://your-app.vercel.app/old-blog/2024/01/hello-world
# -> 308 redirect to /new-blog/hello-world

curl -I https://your-app.vercel.app/v1/blog/some-article
# -> 308 redirect to /new-blog/some-article

curl -I https://your-app.vercel.app/products/old-electronics/12345
# -> 308 redirect to /products/electronics/12345
```

---

### 16. Dynamic Cache Control / Cache Tags

**Pages:** `/cached`, `/cached/[ttl]`, `/api/cached-data`

```json
{
  "src": "^/cached(/.*)?$",
  "headers": {
    "Cache-Control": "public, max-age=3600, s-maxage=86400",
    "CDN-Cache-Control": "public, max-age=86400",
    "Cache-Tag": "static-content, cached-pages"
  },
  "continue": true
}
```

API endpoint:
```json
{
  "src": "^/api/cached-data$",
  "headers": {
    "Cache-Control": "public, max-age=60, s-maxage=300",
    "Cache-Tag": "api-data"
  },
  "continue": true
}
```

**Test:**
```bash
curl -I https://your-app.vercel.app/cached
# -> Should include Cache-Control, CDN-Cache-Control, Cache-Tag headers

curl -I https://your-app.vercel.app/api/cached-data
# -> Should include short-TTL cache headers

# Verify caching: timestamp in response should stay the same on repeated requests
curl https://your-app.vercel.app/api/cached-data | jq .timestamp
# wait, then:
curl https://your-app.vercel.app/api/cached-data | jq .timestamp
```

---

### 17. Bot Detection / Skip Observability

**Pages:** `/bot-test`

```json
{
  "src": "^/(.*)$",
  "headers": {
    "x-skip-telemetry": "1",
    "x-bot-detected": "true"
  },
  "has": [{
    "type": "header",
    "key": "user-agent",
    "value": {"re": "(?i).*(bot|crawl|spider|slurp|feed|fetch).*"}
  }],
  "continue": true
}
```

Block aggressive bots:
```json
{
  "src": "^/(.*)$",
  "status": 403,
  "has": [{
    "type": "header",
    "key": "user-agent",
    "value": {"re": "(?i).*(AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|bytespider|GPTBot).*"}
  }]
}
```

**Test:**
```bash
# Bot request - should have x-skip-telemetry header in response
curl -I -H "User-Agent: Googlebot/2.1" https://your-app.vercel.app/bot-test

# Normal request - should NOT have x-skip-telemetry
curl -I -H "User-Agent: Mozilla/5.0" https://your-app.vercel.app/bot-test

# Aggressive bot - should get 403
curl -I -H "User-Agent: AhrefsBot/7.0" https://your-app.vercel.app/bot-test
```

---

## All Test Pages

| Route | Purpose |
|-------|---------|
| `/` | Home — index of all test scenarios |
| `/blog` | Blog index |
| `/blog/[slug]` | Dynamic blog post (rewrite target) |
| `/api-target` | Rewrite destination |
| `/api-target/[...slug]` | Catch-all rewrite destination |
| `/headers-test` | Displays request headers |
| `/protected` | Auth-gated page |
| `/login` | Login page (redirect target) |
| `/geo` | Geo routing test |
| `/search` | Search page (query condition source) |
| `/search-results` | Search results (query condition target) |
| `/subdomain-home` | Host-based routing target |
| `/old-page` | Redirect source |
| `/experiment` | A/B test landing |
| `/experiment/variant-a` | A/B variant A |
| `/experiment/variant-b` | A/B variant B |
| `/external-api` | External rewrite documentation |
| `/api/echo` | Echo API (returns full request details) |
| `/docs` | Multi-tenant docs target |
| `/docs/[...slug]` | Docs subpath catch-all |
| `/locale/[lang]` | Locale landing page |
| `/locale/[lang]/[...slug]` | Locale subpath catch-all |
| `/microsite` | Microsite target |
| `/new-blog/[...slug]` | Complex redirect target |
| `/products/[category]/[id]` | Multi-segment redirect target |
| `/cached` | Cache control test |
| `/cached/[ttl]` | Dynamic cache test |
| `/api/cached-data` | Cached API endpoint |
| `/bot-test` | Bot detection / skip o11y test |
| `/api/data` | GET/POST API endpoint |
| `/api/webhook` | POST-only webhook endpoint |

## API Routes

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/data` | GET, POST | General data endpoint |
| `/api/webhook` | POST | POST-only webhook |
| `/api/echo` | GET, POST, PUT, DELETE | Echo endpoint (returns full request info) |
| `/api/cached-data` | GET | Returns data with timestamp (for cache testing) |

## test-routes.sh Commands

Run `./test-routes.sh help` for the full list. Key commands:

| Command | Description |
|---------|-------------|
| `add-all` | Add ALL routing rules at once |
| `add-ab-test` | Cookie-based A/B test rules |
| `add-external-token` | External rewrite with API key |
| `add-docs-rewrite` | Multi-tenant docs proxy |
| `add-locale-geo` | Geo-based locale rewrites |
| `add-cache-control` | Cache-Control headers |
| `add-cache-tags` | Cache-Tag headers |
| `add-bot-skip` | Bot UA -> skip telemetry header |
| `delete-all` | Remove all rules |
| `promote` | Push staging rules to production |
