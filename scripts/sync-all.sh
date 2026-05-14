#!/usr/bin/env bash
# sync-all.sh — Sync agents to all known projects + user-level (~/.claude)
#
# Cross-platform: paths use $HOME, so works on macOS and Windows Git Bash / WSL.
#
# Discovery:
#   - User-level: $HOME/.claude/agent-config.yaml → $HOME/.claude/agents/
#   - Projects:   auto-discovers ANY directory matching $HOME/Desktop/*/.claude/agent-config.yaml
#                 (one level deep; deeper nesting must be added to EXTRA_PROJECTS)
#
# To add a project that's not under ~/Desktop, append to EXTRA_PROJECTS below.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYNC="$SCRIPT_DIR/sync-agents.sh"

if [[ ! -x "$SYNC" && ! -f "$SYNC" ]]; then
  echo "ERROR: sync-agents.sh not found next to sync-all.sh"
  exit 1
fi

# Extra projects (outside ~/Desktop or under non-standard paths)
EXTRA_PROJECTS=(
  # Add absolute paths here, e.g.:
  # "$HOME/code/some-repo"
)

declare -a TARGETS=()

# 1. User-level (~/.claude)
if [[ -f "$HOME/.claude/agent-config.yaml" ]]; then
  TARGETS+=("$HOME")
fi

# 2. Auto-discover ~/Desktop/*/.claude/agent-config.yaml
if [[ -d "$HOME/Desktop" ]]; then
  while IFS= read -r cfg; do
    proj="$(dirname "$(dirname "$cfg")")"
    TARGETS+=("$proj")
  done < <(find "$HOME/Desktop" -mindepth 3 -maxdepth 3 -path "*/.claude/agent-config.yaml" -type f 2>/dev/null)
fi

# 3. EXTRA_PROJECTS
for proj in "${EXTRA_PROJECTS[@]:-}"; do
  [[ -z "$proj" ]] && continue
  if [[ -f "$proj/.claude/agent-config.yaml" ]]; then
    TARGETS+=("$proj")
  else
    echo "SKIP extra: $proj (no .claude/agent-config.yaml)"
  fi
done

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  echo "No targets found. Create $HOME/.claude/agent-config.yaml or add a project under ~/Desktop with .claude/agent-config.yaml."
  exit 0
fi

# Dedupe (bash 3.2 compatible — no readarray)
DEDUPED=()
while IFS= read -r t; do
  DEDUPED+=("$t")
done < <(printf '%s\n' "${TARGETS[@]}" | sort -u)
TARGETS=("${DEDUPED[@]}")

for target in "${TARGETS[@]}"; do
  if [[ "$target" == "$HOME" ]]; then
    echo "=== Syncing: ~/.claude (user-level) ==="
  else
    echo "=== Syncing: $target ==="
  fi
  bash "$SYNC" "$target"
  echo ""
done
