#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/gcp.sh"
cd "$(dirname "$0")/.."

COMPOSE="cd /opt/tomo/src/infra && sudo docker compose --profile tools run --rm"

case "${1:-}" in
	studio)
		echo "→ open https://local.drizzle.studio (ctrl+c to stop)"
		gcloud compute ssh "$VM_NAME" --project "$GCP_PROJECT" --zone "$GCP_ZONE" --tunnel-through-iap --quiet \
			--command "$COMPOSE --service-ports tools" \
			-- -t -L 4983:127.0.0.1:4983
		;;
	migrate)
		gcloud compute ssh "$VM_NAME" --project "$GCP_PROJECT" --zone "$GCP_ZONE" --tunnel-through-iap --quiet \
			--command "$COMPOSE tools pnpm exec drizzle-kit migrate" \
			-- -t
		;;
	*)
		echo "usage: $0 studio|migrate"
		exit 1
		;;
esac
