#!/bin/bash

# (c) nickbclifford
# Thanks to https://gist.github.com/nickbclifford/16c5be884c8a15dca02dca09f65f97bd

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 /tmp/deploy_rsa # Allow read access to the private key
ssh-add /tmp/deploy_rsa # Add the private key to SSH

git config --global push.default matching
git remote add deploy ssh://git@$IP:$PORT$DEPLOY_STAGING_DIR
git push deploy master

# Skip this command if you don't need to execute any additional commands after deploying.
ssh apps@$IP -p $PORT <<EOF
  cd $DEPLOY_STAGING_DIR
  npm install
  npm run build
EOF
