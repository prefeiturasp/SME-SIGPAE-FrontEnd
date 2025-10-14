#!/bin/sh
# Replace string in static files
# Example:
# docker run -p 8081:80 -e API_URL="http://localhost:8000" -e SERVER_NAME="localhost" marcelomaia/terceirizadas_frontend:latest

set -xe

: "${API_URL?Precisa de uma variavel de ambiente API_URL}"
: "${SERVER_NAME?Precisa de uma variavel de ambiente SERVER_NAME}"
: "${SENTRY_URL?Precisa de uma variavel de ambiente SENTRY_URL}"
: "${NODE_ENV?Precisa de uma variavel de ambiente NODE_ENV}"
: "${WEBSOCKET_SERVER?Precisa de uma variavel de ambiente WEBSOCKET_SERVER}"
: "${CES_URL?Precisa de uma variavel de ambiente CES_URL}"
: "${CES_TOKEN?Precisa de uma variavel de ambiente CES_TOKEN}"

TMP_CONF=$(mktemp)
envsubst '${WEBSOCKET_SERVER} ${SERVER_NAME}' < /etc/nginx/conf.d/default.conf.template > "$TMP_CONF"
cat "$TMP_CONF" > /etc/nginx/conf.d/default.conf
rm -f "$TMP_CONF"

for file in /usr/share/nginx/html/assets/*.js; do
  if [ -f "$file" ]; then
    TMP_FILE=$(mktemp)
    sed \
      -e "s|API_URL_REPLACE_ME|$API_URL|g" \
      -e "s|SENTRY_URL_REPLACE_ME|$SENTRY_URL|g" \
      -e "s|NODE_ENV_REPLACE_ME|$NODE_ENV|g" \
      -e "s|CES_URL_REPLACE_ME|$CES_URL|g" \
      -e "s|CES_TOKEN_REPLACE_ME|$CES_TOKEN|g" \
      "$file" > "$TMP_FILE"
    cat "$TMP_FILE" > "$file"
    rm -f "$TMP_FILE"
  fi
done

exec "$@"
