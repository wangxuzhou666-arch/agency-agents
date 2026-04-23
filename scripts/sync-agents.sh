#!/usr/bin/env bash
# sync-agents.sh — Sync agent files from master library to project .claude/agents/
# Usage: ./sync-agents.sh [project-path]  (defaults to current dir)
# Reads: <project>/.claude/agent-config.yaml

set -uo pipefail

MASTER_LIB="/c/Users/Colar/Desktop/agency-agents"
PROJECT="${1:-.}"
CONFIG="$PROJECT/.claude/agent-config.yaml"

if [[ ! -f "$CONFIG" ]]; then
  echo "ERROR: No agent-config.yaml found at $CONFIG"
  exit 1
fi

TARGET="$PROJECT/.claude/agents"
mkdir -p "$TARGET"

# Track what we sync to report stats
SYNCED=0
SKIPPED=0
ERRORS=0

# Parse YAML without dependencies — simple line-based parser
MODE=""
declare -a FILES=()

while IFS= read -r line || [[ -n "$line" ]]; do
  # Strip comments and trailing whitespace
  line="${line%%#*}"
  line="${line%"${line##*[![:space:]]}"}"
  [[ -z "$line" ]] && continue

  if [[ "$line" == "include:" ]]; then
    MODE="include"
    continue
  elif [[ "$line" == "categories:" ]]; then
    MODE="categories"
    continue
  elif [[ "$line" =~ ^[a-z] ]]; then
    MODE=""
    continue
  fi

  if [[ "$MODE" == "include" && "$line" =~ ^[[:space:]]*-[[:space:]]+(.*) ]]; then
    FILES+=("${BASH_REMATCH[1]}")
  elif [[ "$MODE" == "categories" && "$line" =~ ^[[:space:]]*-[[:space:]]+(.*) ]]; then
    category="${BASH_REMATCH[1]}"
    if [[ -d "$MASTER_LIB/$category" ]]; then
      for f in "$MASTER_LIB/$category"/*.md; do
        [[ -f "$f" ]] && FILES+=("$category/$(basename "$f")")
      done
    else
      echo "WARN: category '$category' not found in master library"
      ((ERRORS++))
    fi
  fi
done < "$CONFIG"

# Deduplicate
readarray -t FILES < <(printf '%s\n' "${FILES[@]}" | sort -u)

# Sync files
for rel in "${FILES[@]}"; do
  src="$MASTER_LIB/$rel"
  dest="$TARGET/$(basename "$rel")"

  if [[ ! -f "$src" ]]; then
    echo "WARN: $rel not found"
    ((ERRORS++))
    continue
  fi

  # Skip if destination is identical (idempotent)
  if [[ -f "$dest" ]] && cmp -s "$src" "$dest"; then
    ((SKIPPED++))
    continue
  fi

  cp "$src" "$dest"
  ((SYNCED++))
done

echo "Done: $SYNCED synced, $SKIPPED unchanged, $ERRORS errors"
echo "Target: $TARGET ($(ls "$TARGET"/*.md 2>/dev/null | wc -l) agents total)"
