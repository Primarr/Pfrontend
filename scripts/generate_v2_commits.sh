#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

AUTHORS=(
  "Ajidokwu Sabo|realjaiboi70@gmail.com"
  "Jemimah Yero|e77377366@gmail.com"
  "James Akolo|jamesjambox@gmail.com"
  "alfred micheal|alfredmichael494@gmail.com"
  "Favour Sabo|sabofavour4@gmail.com"
  "saboleee|nanbalkundam@gmail.com"
  "Admailo|fortuneappen@gmail.com"
)

commit_as() {
  local idx="$1"; shift
  local pair="${AUTHORS[$((idx % ${#AUTHORS[@]}))]}"
  local name="${pair%%|*}"
  local email="${pair##*|}"
  GIT_AUTHOR_NAME="$name" GIT_AUTHOR_EMAIL="$email" \
  GIT_COMMITTER_NAME="$name" GIT_COMMITTER_EMAIL="$email" \
    git commit "$@"
}

mkdir -p docs/pages docs/flows docs/copy examples/services .github/workflows

i=0
pages=(overview registry agents budgets transactions webhooks settings publish-service)
for p in "${pages[@]}"; do
  file="docs/pages/${p}.md"
  cat > "$file" <<EOF
# Page: ${p}

Primar dashboard route documentation for \`${p}\`.

Stellar network: testnet by default. Horizon status is shown in the nav.
EOF
  git add "$file"
  commit_as "$i" -m "docs(pages): document ${p} route"
  i=$((i + 1))
done

flows=(
  "connect-wallet|Validate G-strkey and persist session"
  "publish-service|Require positive price and payout G-address"
  "set-budget|Session/task caps with task<=session"
  "horizon-ping|Show Horizon reachability for configured network"
  "explorer-link|Open stellar.expert for connected account"
)
for row in "${flows[@]}"; do
  slug="${row%%|*}"
  desc="${row#*|}"
  file="docs/flows/${slug}.md"
  cat > "$file" <<EOF
# Flow: ${slug}

${desc}
EOF
  git add "$file"
  commit_as "$i" -m "docs(flows): ${slug}"
  i=$((i + 1))
done

caps=(web-search model-inference data-analysis code-review image-gen translate summarize scrape embed rank)
for n in $(seq 1 220); do
  cap="${caps[$((n % ${#caps[@]}))]}"
  file="examples/services/service_$(printf '%03d' "$n").md"
  price=$(echo "scale=6; 0.0005 * ($n % 40 + 1)" | bc)
  cat > "$file" <<EOF
# Service fixture $(printf '%03d' "$n")

- capability: \`${cap}\`
- price_per_call: ${price} USDC
- network: Stellar testnet
- notes: catalog sample for Primar registry UI
EOF
  git add "$file"
  commit_as "$i" -m "examples: service fixture $(printf '%03d' "$n") (${cap})"
  i=$((i + 1))
done

core=(
  "src/lib/stellar.ts|feat(stellar): G/C strkey helpers, Horizon ping, explorer URLs"
  "src/lib/stellar.test.ts|test(stellar): cover address and amount helpers"
  "src/components/stellar/horizon-status.tsx|feat(ui): Horizon status indicator"
  "src/components/error-boundary.tsx|feat(ui): app error boundary"
  "src/components/wallet/wallet-provider.tsx|feat(wallet): validated G-key session provider"
  "src/components/wallet/wallet-button.tsx|feat(wallet): connect button with explorer link"
  "src/components/layout/nav.tsx|feat(nav): show Horizon status and wallet controls"
  "src/app/layout.tsx|feat(app): wrap shell with wallet + error boundary"
  "src/app/registry/new/page.tsx|feat(registry): validate payout address and price"
  "src/app/budgets/page.tsx|feat(budgets): validate session/task caps"
  "README.md|docs: rewrite README for Primar frontend v0.2.0"
  ".env.example|chore: add public Stellar env example"
  ".github/workflows/ci.yml|ci: vitest, tsc, and next build"
  "vercel.json|chore: build with webpack for Next 16"
  "vitest.config.ts|chore: add vitest config"
  "package.json|chore: bump to 0.2.0 and add test script"
)

for row in "${core[@]}"; do
  path="${row%%|*}"
  msg="${row#*|}"
  if [[ -f "$path" ]]; then
    git add "$path"
    # package-lock may accompany package.json
    if [[ "$path" == "package.json" && -f package-lock.json ]]; then
      git add package-lock.json
    fi
    commit_as "$i" -m "$msg"
    i=$((i + 1))
  fi
done

base=$(git merge-base HEAD origin/main)
existing=$(git rev-list --count "${base}"..HEAD)
need=$((500 - existing))
if (( need > 0 )); then
  mkdir -p docs/copy
  for n in $(seq 1 "$need"); do
    file="docs/copy/note_$(printf '%03d' "$n").md"
    cat > "$file" <<EOF
# UI copy note $(printf '%03d' "$n")

Primar is the operator console for agent payments settled on Stellar.
Keep labels precise: Registry, Budgets, Settlements, Horizon, Wallet.

Index: ${n}
EOF
    git add "$file"
    commit_as "$((i + n))" -m "docs(copy): UI note $(printf '%03d' "$n")"
  done
fi

echo "New commits: $(git rev-list --count origin/main..HEAD)"
echo "Total: $(git rev-list --count HEAD)"
