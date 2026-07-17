#!/usr/bin/env bash
# Deploy the Link'd Up member app.
#   bash scripts/go-live.sh preview   → safe test URL (does NOT touch linkdup.club)
#   bash scripts/go-live.sh prod      → publishes to live www.linkdup.club
set -e
cd "$(dirname "$0")/.."

SCOPE="ad-vantage-9c42d7ec"
MODE="${1:-preview}"

# Pull VAPID push keys from .env.local
getval() { grep -E "^$1=" .env.local | head -1 | cut -d= -f2- | sed -E 's/^"//; s/"$//'; }
PUB="$(getval NEXT_PUBLIC_VAPID_PUBLIC_KEY)"
PRIV="$(getval VAPID_PRIVATE_KEY)"
ORKEY="$(getval OPENROUTER_API_KEY)"
ORMODEL="$(getval OPENROUTER_MODEL)"

echo "→ Adding push (VAPID) + assistant (OpenRouter) keys to Vercel env…"
addvar() { printf '%s' "$2" | npx vercel env add "$1" "$3" --scope "$SCOPE" --force >/dev/null 2>&1 \
  && echo "  ✓ $1 → $3" || echo "  • $1 → $3 (already set or skipped)"; }
for target in production preview; do
  addvar VAPID_PUBLIC_KEY "$PUB" "$target"
  addvar NEXT_PUBLIC_VAPID_PUBLIC_KEY "$PUB" "$target"
  addvar VAPID_PRIVATE_KEY "$PRIV" "$target"
  addvar VAPID_SUBJECT "mailto:hello@linkdup.club" "$target"
  [ -n "$ORKEY" ] && addvar OPENROUTER_API_KEY "$ORKEY" "$target"
  [ -n "$ORMODEL" ] && addvar OPENROUTER_MODEL "$ORMODEL" "$target"
done

echo ""
if [ "$MODE" = "prod" ] || [ "$MODE" = "production" ]; then
  echo "🚀 Deploying to PRODUCTION (www.linkdup.club)…"
  npx vercel deploy --prod --yes --scope "$SCOPE"
else
  echo "🧪 Deploying a PREVIEW (safe test URL, live site untouched)…"
  npx vercel deploy --yes --scope "$SCOPE"
fi
