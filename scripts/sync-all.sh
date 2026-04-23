#!/usr/bin/env bash
# sync-all.sh — Sync agents to all known projects + user-level (~/.claude)
# Run from anywhere. Edit PROJECT_LIST below to add/remove projects.
#
# For ~/.claude (user-level), agent-config.yaml lives at ~/.claude/agent-config.yaml
# and agents sync to ~/.claude/agents/.
# For projects, agent-config.yaml lives at <project>/.claude/agent-config.yaml
# and agents sync to <project>/.claude/agents/.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SYNC="$SCRIPT_DIR/sync-agents.sh"

# Project list — add paths here
# Use special token "USER_LEVEL" for ~/.claude (handled separately)
PROJECT_LIST=(
  "USER_LEVEL"
  "/c/Users/Colar/Desktop/lucid"
  "/c/Users/Colar/Desktop/colar-wiki"
  # agentconfig — archived, no longer active
  # flagbet — abandoned (VC 四问全红)
)

for proj in "${PROJECT_LIST[@]}"; do
  if [[ "$proj" == "USER_LEVEL" ]]; then
    # Special case: ~/.claude/agent-config.yaml → ~/.claude/agents/
    USER_CONFIG="/c/Users/Colar/.claude/agent-config.yaml"
    if [[ -f "$USER_CONFIG" ]]; then
      echo "=== Syncing: ~/.claude (user-level universal agents) ==="
      # sync-agents.sh expects PROJECT/.claude/agent-config.yaml
      # For user-level, the "project" is the parent of .claude
      bash "$SYNC" "/c/Users/Colar"
    else
      echo "SKIP: ~/.claude (no agent-config.yaml)"
    fi
  elif [[ -f "$proj/.claude/agent-config.yaml" ]]; then
    echo "=== Syncing: $proj ==="
    bash "$SYNC" "$proj"
  else
    echo "SKIP: $proj (no agent-config.yaml)"
  fi
done
