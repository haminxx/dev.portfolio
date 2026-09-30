#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/gcp.sh"
exec gcloud compute ssh "$VM_NAME" --project "$GCP_PROJECT" --zone "$GCP_ZONE" --tunnel-through-iap "$@"
