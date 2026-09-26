#!/bin/sh
set -eu
cd "$(dirname "$0")/.."

image="$(tofu -chdir=infra output -raw image)"
tag="$(git rev-parse --short HEAD)"
mkdir -p .tmp

docker build --platform linux/amd64 -t "$image:$tag" .
docker push "$image:$tag"

printf 'IMAGE=%s:%s\n' "$image" "$tag" > .tmp/.env
gcloud compute scp infra/compose.yml infra/Caddyfile .tmp/.env tomo:~ --tunnel-through-iap
gcloud compute ssh tomo --tunnel-through-iap --command \
	'sudo mv ~/compose.yml ~/Caddyfile ~/.env /opt/tomo/ && cd /opt/tomo && sudo docker compose pull -q && sudo docker compose up -d --remove-orphans'
