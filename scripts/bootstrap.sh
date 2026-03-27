#!/usr/bin/env bash
set -e

echo "Bootstrapping app-deploy workspace..."

cd "$(dirname "$0")/.."

[ -f .env ] || cp .env.example .env

echo "Bootstrap complete."
echo "Next:"
echo "1. Update .env"
echo "2. Build frontend"
echo "3. Build backend"
echo "4. Add Dockerfiles and workflows"
