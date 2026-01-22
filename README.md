# Project Level Routes Test App

A Next.js app designed to test all project-level routing rule types.

## Getting Started

```bash
npm install
npm run dev
```

## Test Routes

### Rewrite Targets
- `/api-target` - Target for rewrites
- `/api-target/[...slug]` - Catch-all target for path params
- `/blog/[slug]` - Dynamic blog post page

### Header Tests
- `/headers-test` - Displays all request headers

### Condition Tests (has/missing)
- `/protected` - For testing cookie/header conditions
- `/geo` - For testing geo-based routing
- `/login` - Redirect target for auth rules

### Query Tests
- `/search` - Search page with query form
- `/search-results` - Target for query-based rewrites

### Host Tests
- `/subdomain-home` - Target for host-based routing

### Method Tests
- `/api/webhook` - POST-only endpoint
- `/api/data` - GET/POST endpoint

### Redirect Sources
- `/old-page` - Source for redirect tests

## Routing Rule Types to Test

### 1. Rewrites (path-to-regexp)
```json
{
  "src": "/posts/:slug",
  "dest": "/blog/:slug"
}
```

### 2. Redirects
```json
{
  "src": "/old-blog/:slug",
  "dest": "/blog/:slug",
  "status": 308
}
```

### 3. Headers
```json
{
  "src": "/api/(.*)",
  "headers": {
    "X-Custom-Header": "value",
    "Cache-Control": "no-store"
  },
  "continue": true
}
```

### 4. Has Condition (Cookie)
```json
{
  "src": "/protected",
  "dest": "/login",
  "has": [{ "type": "cookie", "key": "auth", "value": { "neq": "valid" } }]
}
```

### 5. Missing Condition (Header)
```json
{
  "src": "/api/(.*)",
  "status": 401,
  "missing": [{ "type": "header", "key": "Authorization" }]
}
```

### 6. Method Restriction
```json
{
  "src": "/api/webhook",
  "methods": ["POST"],
  "dest": "/api/webhook"
}
```

### 7. Query String Match
```json
{
  "src": "/search",
  "dest": "/search-results",
  "has": [{ "type": "query", "key": "q" }]
}
```

### 8. Host Match
```json
{
  "src": "/(.*)",
  "dest": "/subdomain-home",
  "has": [{ "type": "host", "value": { "pre": "app." } }]
}
```

### 9. Geo-based Routing
```json
{
  "src": "/(.*)",
  "dest": "/eu/$1",
  "has": [{
    "type": "header",
    "key": "x-vercel-ip-country",
    "value": { "inc": ["DE", "FR", "IT", "ES"] }
  }]
}
```

### 10. Continue (Match but don't terminate)
```json
{
  "src": "/(.*)",
  "headers": { "X-Matched": "true" },
  "continue": true
}
```
