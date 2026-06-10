#!/bin/sh
# Substitute BACKEND_URL env var into nginx config at runtime
# Default to gigconnect-api on Render if not set
export BACKEND_URL=${BACKEND_URL:-https://gigconnect-api.onrender.com}

envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "Starting nginx with BACKEND_URL=$BACKEND_URL"
nginx -g "daemon off;"
