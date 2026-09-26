#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

play_success() { afplay /System/Library/Sounds/Glass.aiff 2>/dev/null || true; }
play_failure() { afplay /System/Library/Sounds/Sosumi.aiff 2>/dev/null || true; }
trap 'play_failure' ERR

git fetch origin
git rebase origin/main

CURRENT=$(node -p "require('./package.json').version")
if git rev-parse -q --verify "refs/tags/v$CURRENT" >/dev/null; then
	IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"
	NEXT="$MAJOR.$MINOR.$((PATCH + 1))"
else
	NEXT="$CURRENT"
fi

rollback_local() {
	play_failure
	echo "ship failed before deploy — rolling back local v$NEXT"
	git tag -d "v$NEXT" 2>/dev/null || true
	if [ "$(git log -1 --pretty=%s)" = "$NEXT" ]; then
		git reset --hard HEAD~1
	else
		git checkout -- package.json
	fi
}
trap rollback_local ERR

if [ "$NEXT" != "$CURRENT" ]; then
	node -e "
	  const fs = require('fs');
	  const pkg = JSON.parse(fs.readFileSync('package.json'));
	  pkg.version = '$NEXT';
	  fs.writeFileSync('package.json', JSON.stringify(pkg, null, '\t') + '\n');
	"
	git add package.json
	git -c core.hooksPath=/dev/null commit -m "$NEXT"
fi
git tag -a "v$NEXT" -m "v$NEXT"

pnpm exec turbo typecheck lint test

git archive --format=tar "v$NEXT" | gcloud compute ssh tomo --tunnel-through-iap --quiet --command \
	"sudo rm -rf /opt/tomo/src && sudo mkdir -p /opt/tomo/src && sudo tar -x -C /opt/tomo/src && cd /opt/tomo/src/infra && sudo VERSION=$NEXT docker compose up -d --build --remove-orphans"

trap - ERR

if ! git push --atomic --follow-tags; then
	play_failure
	echo
	echo "✗ deploy succeeded at v$NEXT but git push failed"
	echo "  retry with: git push --atomic --follow-tags"
	exit 1
fi

play_success
echo "✓ v$NEXT is live at https://tomo.computer"
