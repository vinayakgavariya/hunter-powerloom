#!/bin/bash

#This script is run from high level docker-compose. Refer to https://github.com/PowerLoom/deploy
set -e

echo 'populating settings from environment values...';

cp  env.example .env

if [ "$POOLER_API_PREFIX" ]; then
    echo "Found POOLER_API_PREFIX ${POOLER_API_PREFIX}";
    sed -i'.backup' "s#http://localhost:8002#$POOLER_API_PREFIX#" .env
fi

cat .env

echo 'settings has been populated!'
