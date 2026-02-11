#!/bin/bash

# Project Routes API Test Script
# ==============================
# 
# Usage:
#   export VERCEL_TOKEN="your-token"
#   ./test-routes.sh [command]
#
# Commands:
#   list              - List all routes
#   add               - Add a test rewrite rule
#   add-redirect      - Add a redirect rule  
#   add-headers       - Add a headers rule
#   add-auth          - Add auth condition rule
#   add-query         - Add query string match rule
#   add-api           - Add API catch-all rewrite
#   add-ab-test       - Add A/B test rules (cookie-based)
#   add-ab-test-header - Add A/B test rules (header-based)
#   add-external      - Add external rewrite (httpbin.org)
#   add-external-token - Add external rewrite with API key header
#   add-docs-rewrite  - Add multi-tenant docs rewrite (Mintlify)
#   add-locale-geo    - Add geo-based locale rewrites
#   add-microsite     - Add microsite domain rewrite
#   add-complex-redirect - Add complex redirect (drop date segments)
#   add-pattern-redirect - Add regex pattern redirect
#   add-wildcard-redirect - Add wildcard path migration redirect
#   add-cache-control - Add cache control headers
#   add-cache-tags    - Add cache tags
#   add-cache-api     - Add API cache headers
#   add-bot-skip      - Add bot detection skip-telemetry
#   add-bot-block     - Add bot blocking rule
#   add-all           - Add ALL rules at once (comprehensive test suite)
#   delete <id>       - Delete a route by ID
#   delete-all        - Delete ALL routes
#   versions          - List all versions
#   promote [id]      - Promote staging to production
#   help              - Show this help

set -e

# Configuration
PROJECT_ID="prj_j1FAuTXIWslhtnC2jKNmvfIj3zkS"
TEAM_ID="team_MtLD9hKuWAvoDd3KmiHs9zUg"
API_BASE="https://api.vercel.com/v1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check for token
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}Error: VERCEL_TOKEN environment variable is not set${NC}"
    echo "Run: export VERCEL_TOKEN=\"your-token\""
    exit 1
fi

# Helper function for API calls
api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    # Add teamId to query string
    local url="${API_BASE}${endpoint}"
    if [[ "$url" == *"?"* ]]; then
        url="${url}&teamId=${TEAM_ID}"
    else
        url="${url}?teamId=${TEAM_ID}"
    fi
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$url"
    else
        curl -s -X "$method" \
            -H "Authorization: Bearer $VERCEL_TOKEN" \
            "$url"
    fi
}

# Pretty print JSON
pretty() {
    if command -v jq &> /dev/null; then
        jq '.'
    else
        cat
    fi
}

# =============================================================================
# ORIGINAL COMMANDS
# =============================================================================

cmd_list() {
    echo -e "${BLUE}Listing routes for project ${PROJECT_ID}...${NC}"
    api GET "/projects/${PROJECT_ID}/routes" | pretty
}

cmd_add() {
    echo -e "${BLUE}Adding rewrite rule: /posts/* -> /blog/*${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Blog rewrite",
            "description": "Rewrite /posts/:slug to /blog/:slug",
            "route": {
                "src": "^/posts/([^/]+)$",
                "dest": "/blog/$1"
            }
        }
    }' | pretty
}

cmd_add_redirect() {
    echo -e "${BLUE}Adding redirect rule: /old-page -> / (308)${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Old page redirect",
            "description": "Redirect old-page to home",
            "route": {
                "src": "^/old-page$",
                "dest": "/",
                "status": 308
            }
        }
    }' | pretty
}

cmd_add_headers() {
    echo -e "${BLUE}Adding headers rule: X-Custom-Header on all routes${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Custom headers",
            "description": "Add custom header to all requests",
            "route": {
                "src": "^/(.*)$",
                "headers": {
                    "X-Custom-Header": "hello-from-project-routes"
                },
                "continue": true
            }
        }
    }' | pretty
}

cmd_add_auth() {
    echo -e "${BLUE}Adding auth rule: Redirect /protected to /login if no auth cookie${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Auth redirect",
            "description": "Redirect to login if not authenticated",
            "route": {
                "src": "^/protected$",
                "dest": "/login",
                "missing": [{"type": "cookie", "key": "auth"}]
            }
        }
    }' | pretty
}

cmd_add_query() {
    echo -e "${BLUE}Adding query rule: Rewrite /search to /search-results if q param present${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Search rewrite",
            "description": "Rewrite search to results when query present",
            "route": {
                "src": "^/search$",
                "dest": "/search-results",
                "has": [{"type": "query", "key": "q"}]
            }
        }
    }' | pretty
}

cmd_add_api() {
    echo -e "${BLUE}Adding API catch-all: /v1/api/* -> /api-target/*${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "API catch-all rewrite",
            "description": "Rewrite /v1/api/* to /api-target/*",
            "route": {
                "src": "^/v1/api/(.*)$",
                "dest": "/api-target/$1"
            }
        }
    }' | pretty
}

# =============================================================================
# A/B TESTING
# =============================================================================

cmd_add_ab_test() {
    echo -e "${BLUE}Adding A/B test rules (cookie-based): /experiment -> variant-a or variant-b${NC}"
    
    echo -e "${CYAN}  Rule 1: ab_bucket=a -> variant-a${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "A/B test: variant A (cookie)",
            "description": "Rewrite /experiment to variant-a when ab_bucket cookie is a",
            "route": {
                "src": "^/experiment$",
                "dest": "/experiment/variant-a",
                "has": [{"type": "cookie", "key": "ab_bucket", "value": "a"}]
            }
        }
    }' | pretty
    
    echo -e "${CYAN}  Rule 2: ab_bucket=b -> variant-b${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "A/B test: variant B (cookie)",
            "description": "Rewrite /experiment to variant-b when ab_bucket cookie is b",
            "route": {
                "src": "^/experiment$",
                "dest": "/experiment/variant-b",
                "has": [{"type": "cookie", "key": "ab_bucket", "value": "b"}]
            }
        }
    }' | pretty
}

cmd_add_ab_test_header() {
    echo -e "${BLUE}Adding A/B test rules (header-based): /experiment -> variant-a or variant-b${NC}"
    
    echo -e "${CYAN}  Rule 1: x-ab-group=a -> variant-a${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "A/B test: variant A (header)",
            "description": "Rewrite /experiment to variant-a when x-ab-group header is a",
            "route": {
                "src": "^/experiment$",
                "dest": "/experiment/variant-a",
                "has": [{"type": "header", "key": "x-ab-group", "value": "a"}]
            }
        }
    }' | pretty
    
    echo -e "${CYAN}  Rule 2: x-ab-group=b -> variant-b${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "A/B test: variant B (header)",
            "description": "Rewrite /experiment to variant-b when x-ab-group header is b",
            "route": {
                "src": "^/experiment$",
                "dest": "/experiment/variant-b",
                "has": [{"type": "header", "key": "x-ab-group", "value": "b"}]
            }
        }
    }' | pretty
}

# =============================================================================
# EXTERNAL REWRITES
# =============================================================================

cmd_add_external() {
    echo -e "${BLUE}Adding external rewrite: /external/api/* -> https://httpbin.org/*${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "External rewrite (httpbin)",
            "description": "Proxy /external/api/* to httpbin.org",
            "route": {
                "src": "^/external/api/(.*)$",
                "dest": "https://httpbin.org/$1"
            }
        }
    }' | pretty
}

cmd_add_external_token() {
    echo -e "${BLUE}Adding external rewrite with API key: /external/api/* -> https://httpbin.org/*${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "External rewrite with token",
            "description": "Proxy /external/api/* to httpbin.org with X-Api-Key header",
            "route": {
                "src": "^/external/api/(.*)$",
                "dest": "https://httpbin.org/$1",
                "headers": {
                    "X-Api-Key": "secret-token-123",
                    "X-Forwarded-Host": "project-routes-test.vercel.app"
                }
            }
        }
    }' | pretty
}

# =============================================================================
# MULTI-TENANT DOCS
# =============================================================================

cmd_add_docs_rewrite() {
    echo -e "${BLUE}Adding docs rewrite: /docs/* -> Mintlify${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Docs rewrite (Mintlify)",
            "description": "Proxy /docs/* to Mintlify-hosted docs",
            "route": {
                "src": "^/docs(?:/(.*))?$",
                "dest": "https://mintlify.com/docs/$1"
            }
        }
    }' | pretty
}

# =============================================================================
# LOCALE / GEO ROUTING
# =============================================================================

cmd_add_locale_geo() {
    echo -e "${BLUE}Adding geo-based locale rewrites${NC}"
    
    echo -e "${CYAN}  Rule 1: Germany -> /locale/de${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Locale: German (geo)",
            "description": "Rewrite root to /locale/de for German users",
            "route": {
                "src": "^/$",
                "dest": "/locale/de",
                "has": [{"type": "header", "key": "x-vercel-ip-country", "value": "DE"}]
            }
        }
    }' | pretty
    
    echo -e "${CYAN}  Rule 2: France -> /locale/fr${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Locale: French (geo)",
            "description": "Rewrite root to /locale/fr for French users",
            "route": {
                "src": "^/$",
                "dest": "/locale/fr",
                "has": [{"type": "header", "key": "x-vercel-ip-country", "value": "FR"}]
            }
        }
    }' | pretty
    
    echo -e "${CYAN}  Rule 3: Spain -> /locale/es${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Locale: Spanish (geo)",
            "description": "Rewrite root to /locale/es for Spanish users",
            "route": {
                "src": "^/$",
                "dest": "/locale/es",
                "has": [{"type": "header", "key": "x-vercel-ip-country", "value": "ES"}]
            }
        }
    }' | pretty
    
    echo -e "${CYAN}  Rule 4: Japan -> /locale/ja${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Locale: Japanese (geo)",
            "description": "Rewrite root to /locale/ja for Japanese users",
            "route": {
                "src": "^/$",
                "dest": "/locale/ja",
                "has": [{"type": "header", "key": "x-vercel-ip-country", "value": "JP"}]
            }
        }
    }' | pretty
}

# =============================================================================
# MICROSITES
# =============================================================================

cmd_add_microsite() {
    echo -e "${BLUE}Adding microsite domain rewrite: promo.* -> /microsite${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Microsite domain rewrite",
            "description": "Route promo subdomain to /microsite",
            "route": {
                "src": "^/(.*)$",
                "dest": "/microsite/$1",
                "has": [{"type": "host", "value": {"pre": "promo."}}]
            }
        }
    }' | pretty
}

# =============================================================================
# COMPLEX REDIRECTS
# =============================================================================

cmd_add_complex_redirect() {
    echo -e "${BLUE}Adding complex redirect: /old-blog/YYYY/MM/slug -> /new-blog/slug${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Complex redirect (drop date)",
            "description": "Redirect old blog URLs with date segments to simplified paths",
            "route": {
                "src": "^/old-blog/[0-9]{4}/[0-9]{2}/(.+)$",
                "dest": "/new-blog/$1",
                "status": 308
            }
        }
    }' | pretty
}

cmd_add_pattern_redirect() {
    echo -e "${BLUE}Adding pattern redirect: /products/old-* -> /products/*${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Pattern redirect (rename prefix)",
            "description": "Redirect /products/old-category/id to /products/category/id",
            "route": {
                "src": "^/products/old-([^/]+)/(.+)$",
                "dest": "/products/$1/$2",
                "status": 308
            }
        }
    }' | pretty
}

cmd_add_wildcard_redirect() {
    echo -e "${BLUE}Adding wildcard redirect: /v1/blog/* -> /new-blog/*${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Wildcard path migration",
            "description": "Redirect entire /v1/blog/ tree to /new-blog/",
            "route": {
                "src": "^/v1/blog/(.*)$",
                "dest": "/new-blog/$1",
                "status": 308
            }
        }
    }' | pretty
}

# =============================================================================
# CACHE CONTROL
# =============================================================================

cmd_add_cache_control() {
    echo -e "${BLUE}Adding cache control headers: /cached/* -> Cache-Control + CDN-Cache-Control${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Cache control headers",
            "description": "Set Cache-Control and CDN-Cache-Control on /cached/* pages",
            "route": {
                "src": "^/cached(/.*)?$",
                "headers": {
                    "Cache-Control": "public, max-age=3600, s-maxage=86400",
                    "CDN-Cache-Control": "public, max-age=86400"
                },
                "continue": true
            }
        }
    }' | pretty
}

cmd_add_cache_tags() {
    echo -e "${BLUE}Adding cache tags: /cached/* -> Cache-Tag header${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Cache tags",
            "description": "Set Cache-Tag header on /cached/* pages for selective purging",
            "route": {
                "src": "^/cached(/.*)?$",
                "headers": {
                    "Cache-Tag": "static-content, cached-pages"
                },
                "continue": true
            }
        }
    }' | pretty
}

cmd_add_cache_api() {
    echo -e "${BLUE}Adding API cache headers: /api/cached-data -> short TTL cache${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "API cache headers",
            "description": "Set cache headers on /api/cached-data with short TTL",
            "route": {
                "src": "^/api/cached-data$",
                "headers": {
                    "Cache-Control": "public, max-age=60, s-maxage=300",
                    "CDN-Cache-Control": "public, max-age=300",
                    "Cache-Tag": "api-data"
                },
                "continue": true
            }
        }
    }' | pretty
}

# =============================================================================
# BOT DETECTION / SKIP O11Y
# =============================================================================

cmd_add_bot_skip() {
    echo -e "${BLUE}Adding bot skip-telemetry rule: bot UA -> x-skip-telemetry header${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Bot skip telemetry",
            "description": "Set x-skip-telemetry header for known bot user-agents",
            "route": {
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
        }
    }' | pretty
}

cmd_add_bot_block() {
    echo -e "${BLUE}Adding bot block rule: aggressive bots -> 403${NC}"
    api POST "/projects/${PROJECT_ID}/routes" '{
        "route": {
            "name": "Block aggressive bots",
            "description": "Return 403 for known aggressive crawler bots",
            "route": {
                "src": "^/(.*)$",
                "status": 403,
                "has": [{
                    "type": "header",
                    "key": "user-agent",
                    "value": {"re": "(?i).*(AhrefsBot|SemrushBot|MJ12bot|DotBot|PetalBot|bytespider|GPTBot).*"}
                }]
            }
        }
    }' | pretty
}

# =============================================================================
# ADD ALL (COMPREHENSIVE TEST SUITE)
# =============================================================================

cmd_add_all() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN} Adding ALL routing rules${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    
    echo -e "${YELLOW}--- Original Rules ---${NC}"
    cmd_add
    echo ""
    cmd_add_redirect
    echo ""
    cmd_add_headers
    echo ""
    cmd_add_auth
    echo ""
    cmd_add_query
    echo ""
    cmd_add_api
    echo ""
    
    echo -e "${YELLOW}--- A/B Testing ---${NC}"
    cmd_add_ab_test
    echo ""
    
    echo -e "${YELLOW}--- External Rewrites ---${NC}"
    cmd_add_external_token
    echo ""
    
    echo -e "${YELLOW}--- Multi-Tenant Docs ---${NC}"
    cmd_add_docs_rewrite
    echo ""
    
    echo -e "${YELLOW}--- Locale / Geo ---${NC}"
    cmd_add_locale_geo
    echo ""
    
    echo -e "${YELLOW}--- Microsites ---${NC}"
    cmd_add_microsite
    echo ""
    
    echo -e "${YELLOW}--- Complex Redirects ---${NC}"
    cmd_add_complex_redirect
    echo ""
    cmd_add_pattern_redirect
    echo ""
    cmd_add_wildcard_redirect
    echo ""
    
    echo -e "${YELLOW}--- Cache Control ---${NC}"
    cmd_add_cache_control
    echo ""
    cmd_add_cache_tags
    echo ""
    cmd_add_cache_api
    echo ""
    
    echo -e "${YELLOW}--- Bot Detection ---${NC}"
    cmd_add_bot_skip
    echo ""
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN} All rules added! Run 'promote' to push to production.${NC}"
    echo -e "${GREEN}========================================${NC}"
}

# =============================================================================
# MANAGEMENT COMMANDS
# =============================================================================

cmd_delete() {
    local route_id=$1
    if [ -z "$route_id" ]; then
        echo -e "${RED}Error: Route ID required${NC}"
        echo "Usage: ./test-routes.sh delete <route-id>"
        exit 1
    fi
    echo -e "${BLUE}Deleting route ${route_id}...${NC}"
    api DELETE "/projects/${PROJECT_ID}/routes" "{\"routeIds\": [\"${route_id}\"]}" | pretty
}

cmd_delete_all() {
    echo -e "${YELLOW}Fetching all route IDs...${NC}"
    local route_ids=$(api GET "/projects/${PROJECT_ID}/routes" | jq -r '.routes[].id' | tr '\n' ',' | sed 's/,$//')
    
    if [ -z "$route_ids" ] || [ "$route_ids" = "null" ]; then
        echo -e "${GREEN}No routes to delete${NC}"
        return
    fi
    
    echo -e "${BLUE}Deleting all routes: ${route_ids}${NC}"
    local json_array=$(echo "$route_ids" | sed 's/,/","/g' | sed 's/^/["/' | sed 's/$/"]/')
    api DELETE "/projects/${PROJECT_ID}/routes" "{\"routeIds\": ${json_array}}" | pretty
}

cmd_versions() {
    echo -e "${BLUE}Listing versions for project ${PROJECT_ID}...${NC}"
    api GET "/projects/${PROJECT_ID}/routes/versions" | pretty
}

cmd_promote() {
    local version_id=$1
    if [ -z "$version_id" ]; then
        echo -e "${YELLOW}No version ID provided, fetching latest staging version...${NC}"
        version_id=$(api GET "/projects/${PROJECT_ID}/routes/versions" | jq -r '.versions[0].id')
        if [ -z "$version_id" ] || [ "$version_id" = "null" ]; then
            echo -e "${RED}No staging version found to promote${NC}"
            exit 1
        fi
        echo -e "${BLUE}Found version: ${version_id}${NC}"
    fi
    echo -e "${BLUE}Promoting version ${version_id} to production...${NC}"
    api POST "/projects/${PROJECT_ID}/routes/versions" "{\"action\": \"promote\", \"id\": \"${version_id}\"}" | pretty
}

# =============================================================================
# HELP
# =============================================================================

cmd_help() {
    echo -e "${GREEN}Project Routes API Test Script${NC}"
    echo ""
    echo "Usage: ./test-routes.sh [command] [args]"
    echo ""
    echo -e "${YELLOW}Original Commands:${NC}"
    echo "  list              List all routes (staging)"
    echo "  add               Add a rewrite: /posts/* -> /blog/*"
    echo "  add-redirect      Add a redirect: /old-page -> / (308)"
    echo "  add-headers       Add headers rule with X-Custom-Header"
    echo "  add-auth          Add auth rule: /protected -> /login (if no cookie)"
    echo "  add-query         Add query rule: /search -> /search-results (if ?q=)"
    echo "  add-api           Add API catch-all: /v1/api/* -> /api-target/*"
    echo ""
    echo -e "${YELLOW}A/B Testing:${NC}"
    echo "  add-ab-test       Add cookie-based A/B: /experiment -> variant-a|b"
    echo "  add-ab-test-header Add header-based A/B: /experiment -> variant-a|b"
    echo ""
    echo -e "${YELLOW}External Rewrites:${NC}"
    echo "  add-external      Add external rewrite: /external/api/* -> httpbin.org"
    echo "  add-external-token Add external rewrite with X-Api-Key header"
    echo ""
    echo -e "${YELLOW}Multi-Tenant / Docs:${NC}"
    echo "  add-docs-rewrite  Add docs proxy: /docs/* -> mintlify.com"
    echo ""
    echo -e "${YELLOW}Locale / Geo:${NC}"
    echo "  add-locale-geo    Add geo rewrites: / -> /locale/{lang} per country"
    echo ""
    echo -e "${YELLOW}Microsites:${NC}"
    echo "  add-microsite     Add domain rewrite: promo.* -> /microsite"
    echo ""
    echo -e "${YELLOW}Complex Redirects:${NC}"
    echo "  add-complex-redirect  Redirect /old-blog/YYYY/MM/slug -> /new-blog/slug"
    echo "  add-pattern-redirect  Redirect /products/old-cat/id -> /products/cat/id"
    echo "  add-wildcard-redirect Redirect /v1/blog/* -> /new-blog/*"
    echo ""
    echo -e "${YELLOW}Cache Control:${NC}"
    echo "  add-cache-control Add Cache-Control + CDN-Cache-Control on /cached/*"
    echo "  add-cache-tags    Add Cache-Tag header on /cached/*"
    echo "  add-cache-api     Add cache headers on /api/cached-data"
    echo ""
    echo -e "${YELLOW}Bot Detection:${NC}"
    echo "  add-bot-skip      Add bot UA -> x-skip-telemetry header"
    echo "  add-bot-block     Block aggressive bots with 403"
    echo ""
    echo -e "${YELLOW}Bulk Operations:${NC}"
    echo "  add-all           Add ALL rules at once (full test suite)"
    echo "  delete <id>       Delete a route by ID"
    echo "  delete-all        Delete ALL routes (careful!)"
    echo ""
    echo -e "${YELLOW}Version Management:${NC}"
    echo "  versions          List all versions"
    echo "  promote [id]      Promote staging (or specific version) to production"
    echo ""
    echo "Environment:"
    echo "  VERCEL_TOKEN      Required. Your Vercel API token."
    echo ""
    echo "Examples:"
    echo "  ./test-routes.sh list"
    echo "  ./test-routes.sh add-all"
    echo "  ./test-routes.sh promote"
    echo "  ./test-routes.sh delete abc-123-def"
}

# Main
case "${1:-help}" in
    list)                cmd_list ;;
    add)                 cmd_add ;;
    add-redirect)        cmd_add_redirect ;;
    add-headers)         cmd_add_headers ;;
    add-auth)            cmd_add_auth ;;
    add-query)           cmd_add_query ;;
    add-api)             cmd_add_api ;;
    add-ab-test)         cmd_add_ab_test ;;
    add-ab-test-header)  cmd_add_ab_test_header ;;
    add-external)        cmd_add_external ;;
    add-external-token)  cmd_add_external_token ;;
    add-docs-rewrite)    cmd_add_docs_rewrite ;;
    add-locale-geo)      cmd_add_locale_geo ;;
    add-microsite)       cmd_add_microsite ;;
    add-complex-redirect)  cmd_add_complex_redirect ;;
    add-pattern-redirect)  cmd_add_pattern_redirect ;;
    add-wildcard-redirect) cmd_add_wildcard_redirect ;;
    add-cache-control)   cmd_add_cache_control ;;
    add-cache-tags)      cmd_add_cache_tags ;;
    add-cache-api)       cmd_add_cache_api ;;
    add-bot-skip)        cmd_add_bot_skip ;;
    add-bot-block)       cmd_add_bot_block ;;
    add-all)             cmd_add_all ;;
    delete)              cmd_delete "$2" ;;
    delete-all)          cmd_delete_all ;;
    versions)            cmd_versions ;;
    promote)             cmd_promote "$2" ;;
    help|*)              cmd_help ;;
esac
