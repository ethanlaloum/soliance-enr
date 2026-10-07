#!/bin/sh
set -eu

cd "$(dirname "$0")/.."

env_file=.env
ovh_host=ftp.cluster100.hosting.ovh.net
ovh_user=soliand
remote_file=soliance-mail.php
endpoint=https://soliance-enr.fr/api/lead.php

if [ ! -f "$env_file" ]; then
  echo "mail-config: $env_file is missing, copy .env.example first" >&2
  exit 1
fi

read_env() {
  sed -n "s/^$1=//p" "$env_file" | tail -n 1 | sed -e 's/^"\(.*\)"$/\1/' -e "s/^'\(.*\)'\$/\1/"
}

api_key="$(read_env RESEND_API_KEY)"
from="$(read_env RESEND_FROM)"

if ! printf '%s' "$api_key" | grep -Eq '^re_[A-Za-z0-9_]+$'; then
  echo "mail-config: RESEND_API_KEY in $env_file must be a Resend key (re_...)" >&2
  exit 1
fi

if [ -z "$from" ] || printf '%s' "$from" | grep -q "['\\]"; then
  echo "mail-config: RESEND_FROM in $env_file must look like: Site Soliance ENR <site@soliance-enr.fr>" >&2
  exit 1
fi

config="$(mktemp)"
trap 'rm -f "$config"' EXIT
chmod 600 "$config"
cat > "$config" <<PHP
<?php

return [
    'resend_api_key' => '$api_key',
    'resend_from' => '$from',
];
PHP

echo "mail-config: uploading $remote_file to the OVH hosting home, outside the web root (OVH FTP password asked)"
scp -p -q "$config" "$ovh_user@$ovh_host:$remote_file"

status="$(curl -s -o /dev/null -w '%{http_code}' -X POST -H 'Content-Type: application/json' -d '{}' "$endpoint" || true)"
case "$status" in
  400) echo "mail-config: done, $endpoint reads the config" ;;
  503) echo "mail-config: uploaded, but $endpoint still answers NOT_CONFIGURED" >&2; exit 1 ;;
  *) echo "mail-config: uploaded; $endpoint answered $status, run pnpm deploy:ovh if the endpoint is not deployed yet" ;;
esac
