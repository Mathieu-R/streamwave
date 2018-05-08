#!/bin/bash
set -e
git config --global push.default simple
git remote add deploy ssh://git@$IP:$PORT$DEPLOY_STAGING_DIR
git push deploy dev

ssh apps@$IP -p $PORT <<EOF
  cd $DEPLOY_STAGING_DIR
  npm install
  npm run build
EOF
