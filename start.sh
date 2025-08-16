#!/usr/bin/env bash

SESSION="learnsphere"

tmux new-session -d -s $SESSION -n "main"

if ! systemctl is-active --quiet docker; then
  echo "Starting Docker..."
  sudo systemctl start docker
else
  echo "Docker is already running."
fi

tmux new-window -t $SESSION:1 -n "docker"
tmux send-keys -t $SESSION:1 "cd ~/git/learnsphere/services && docker compose up -d" C-m

tmux new-window -t $SESSION -n "client"
tmux send-keys -t $SESSION:client "cd ~/git/learnsphere/client && pnpm dev" C-m

cd ~/git/learnsphere/services
for dir in *-service; do
  if [ -d "$dir" ]; then
    name="${dir%-service}"
    tmux new-window -t $SESSION -n "$name"
    tmux send-keys -t $SESSION:"$name" "cd ~/git/learnsphere/services/$dir && pnpm db && pnpm dev" C-m
  fi
done

tmux select-window -t $SESSION:0
tmux attach -t $SESSION
