#!/bin/sh
# Replace string in static files
# sed -i "s/old-text/new-text/g" input.txt
# Example:
# docker run  -p 8081:80 -e API_URL="http://localhost:8000" -e SERVER_NAME="localhost" marcelomaia/terceirizadas_frontend:latest
set -xe
  : "${API_URL?Precisa de uma variavel de ambiente API_URL}"

set -xe
  : "${SERVER_NAME?Precisa de uma variavel de ambiente SERVER_NAME}"

set -xe
  : "${SENTRY_URL?Precisa de uma variavel de ambiente SENTRY_URL}"

set -xe
  : "${NODE_ENV?Precisa de uma variavel de ambiente NODE_ENV}"

set -xe
  : "${WEBSOCKET_SERVER?Precisa de uma variavel de ambiente WEBSOCKET_SERVER}"

set -xe
  : "${CES_URL?Precisa de uma variavel de ambiente CES_URL}"

set -xe
  : "${CES_TOKEN?Precisa de uma variavel de ambiente CES_TOKEN}"

envsubst '${WEBSOCKET_SERVER}' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf

for file in /usr/share/nginx/html/assets/*.js; do
  sed -i "s|API_URL_REPLACE_ME|$API_URL|g" "$file"
done


exec "$@"
