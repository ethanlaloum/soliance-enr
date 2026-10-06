#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

if ! git diff --quiet HEAD; then
  echo "deploy-ovh: commit or stash your changes first, the build must match a commit" >&2
  exit 1
fi

pnpm --filter soliance-site build

git fetch -q origin ovh-deploy
index="$(mktemp)"
rm -f "$index"
GIT_INDEX_FILE="$index" git --work-tree=apps/site/dist add -A -f .
tree="$(GIT_INDEX_FILE="$index" git write-tree)"
rm -f "$index"

if [ "$tree" = "$(git rev-parse 'origin/ovh-deploy^{tree}')" ]; then
  echo "deploy-ovh: ovh-deploy already holds this build"
  exit 0
fi

commit="$(git commit-tree "$tree" -p origin/ovh-deploy -m "build: soliance-site from $(git rev-parse --short HEAD)")"
git push origin "${commit}:refs/heads/ovh-deploy"
echo "deploy-ovh: pushed ${commit}, OVH pulls it through the GitHub webhook"
