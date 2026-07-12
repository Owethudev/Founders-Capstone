#!/usr/bin/env bash
set -e

ROOT="backend"
echo "Checking repository readiness for Render deployment"
echo "Workspace root: $(pwd)"
echo

if [ ! -d "$ROOT" ]; then
  echo "ERROR: '$ROOT' directory not found."
  exit 1
fi

cd "$ROOT" || exit 1

echo "1) Node / npm versions"
node -v || echo "node not found"
npm -v || echo "npm not found"
echo

echo "2) package.json summary"
if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in $ROOT"
  exit 1
fi
echo " - start script:"
grep -n '"start"' -n package.json || true
echo
echo " - dependencies (direct):"
grep -A2 '"dependencies"' package.json | sed -n '1,120p'
echo

echo "3) Check for known-bad requested versions"
echo " - bcryptjs occurrences:"
grep -n '"bcryptjs"' -n package.json || true
echo " - jsonwebtoken occurrences:"
grep -n '"jsonwebtoken"' -n package.json || true
echo

echo "4) Inspect package-lock for pinned/invalid versions (if present)"
if [ -f package-lock.json ]; then
  echo " - Searching lockfile for problematic version strings"
  grep -n '"bcryptjs":' package-lock.json || true
  grep -n '"jsonwebtoken":' package-lock.json || true
else
  echo " - package-lock.json not found"
fi
echo

echo "5) server file checks (server.js or index.js)"
SERVER=""
for f in server.js index.js; do
  if [ -f "$f" ]; then SERVER="$f"; break; fi
done
if [ -z "$SERVER" ]; then
  echo "ERROR: no server.js or index.js found in $ROOT root. Check entrypoint location."
else
  echo " - Found server file: $SERVER"
  echo " - Checking for dotenv load, process.env.PORT, helmet, cors, rateLimit, mongoSanitize, xss:"
  grep -n "require('dotenv')" "$SERVER" || grep -n 'dotenv' "$SERVER" || true
  grep -n "process.env.PORT" "$SERVER" || true
  grep -n "helmet" "$SERVER" || true
  grep -n "cors" "$SERVER" || true
  grep -n "rateLimit" "$SERVER" || true
  grep -n "mongo-sanitize" "$SERVER" || grep -n "mongoSanitize" "$SERVER" || true
  grep -n "xss" "$SERVER" || true
  echo
  echo " - Checking for risky operations that reassign req.query or similar:"
  grep -n "req.query *=" "$SERVER" || true
  grep -n "req.query *= *" "$SERVER" || true
  grep -n "app.use(mongoSanitize" "$SERVER" || true
fi
echo

echo "6) .env / .env.example / .gitignore"
[ -f .env.example ] && echo " - .env.example exists" || echo " - .env.example MISSING"
[ -f .env ] && echo " - .env exists (local dev copy) (good, do not commit)" || echo " - .env does NOT exist"
if [ -f .gitignore ]; then
  echo " - .gitignore contains .env?"; grep -n "^\.env$" .gitignore || echo "   NO"
else
  echo " - .gitignore not found"
fi
echo

echo "7) Quick npm install dry-run (does not modify lockfile) - this may show ETARGET"
echo " -> running 'npm install --package-lock-only' to detect version resolution issues (no install of node_modules)"
if npm ci --package-lock-only 2>/tmp/npm_check_err.log; then
  echo " - npm dry check succeeded"
else
  echo " - npm dry check FAILED, showing first 200 lines of npm error log:"
  sed -n '1,200p' /tmp/npm_check_err.log || true
fi
echo

echo "---- End of check. Paste this output to the assistant for next steps. ----"
