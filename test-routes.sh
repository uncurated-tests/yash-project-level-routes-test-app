#!/bin/bash

# Project Routes API Test Script
# ==============================
# 
# Usage:
#   export VERCEL_TOKEN="your-token"
#   ./test-routes.sh [command]
#
# Commands:
#   list        - List all routes
#   add         - Add a test rewrite rule
#   add-redirect - Add a redirect rule  
#   add-headers - Add a headers rule
#   delete      - Delete a route by ID
#   versions    - List all versions
#   promote     - Promote staging to production
#   help        - Show this help

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

# Commands
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

cmd_help() {
    echo -e "${GREEN}Project Routes API Test Script${NC}"
    echo ""
    echo "Usage: ./test-routes.sh [command] [args]"
    echo ""
    echo "Commands:"
    echo "  list          List all routes (staging)"
    echo "  add           Add a rewrite: /posts/* -> /blog/*"
    echo "  add-redirect  Add a redirect: /old-page -> / (308)"
    echo "  add-headers   Add headers rule with X-Custom-Header"
    echo "  add-auth      Add auth rule: /protected -> /login (if no cookie)"
    echo "  add-query     Add query rule: /search -> /search-results (if ?q=)"
    echo "  add-api       Add API catch-all: /v1/api/* -> /api-target/*"
    echo "  delete <id>   Delete a route by ID"
    echo "  delete-all    Delete ALL routes (careful!)"
    echo "  versions      List all versions"
    echo "  promote [id]  Promote staging (or specific version) to production"
    echo "  help          Show this help"
    echo ""
    echo "Environment:"
    echo "  VERCEL_TOKEN  Required. Your Vercel API token."
    echo ""
    echo "Examples:"
    echo "  ./test-routes.sh list"
    echo "  ./test-routes.sh add"
    echo "  ./test-routes.sh delete abc-123-def"
    echo "  ./test-routes.sh promote"
    echo "  ./test-routes.sh promote abc-123-def"
}

# Main
case "${1:-help}" in
    list)        cmd_list ;;
    add)         cmd_add ;;
    add-redirect) cmd_add_redirect ;;
    add-headers) cmd_add_headers ;;
    add-auth)    cmd_add_auth ;;
    add-query)   cmd_add_query ;;
    add-api)     cmd_add_api ;;
    delete)      cmd_delete "$2" ;;
    delete-all)  cmd_delete_all ;;
    versions)    cmd_versions ;;
    promote)     cmd_promote "$2" ;;
    help|*)      cmd_help ;;
esac
