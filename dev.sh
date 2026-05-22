#!/usr/bin/env bash
# Start `vercel dev` with .env.local pre-loaded into the shell.
# Vercel CLI 54.x stopped auto-reading .env.local, so we export it ourselves.
set -e
cd "$(dirname "$0")"
if [ ! -f .env.local ]; then
  echo "ERROR: .env.local not found. Restore it before running dev.sh." >&2
  exit 1
fi
set -a
. ./.env.local
set +a
exec vercel dev --listen 3000 --yes
