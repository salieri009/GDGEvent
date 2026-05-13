#!/bin/sh
set -e

: "${BACKEND_URL:=http://localhost:4000}"

envsubst '${BACKEND_URL}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
