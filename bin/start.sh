#!/bin/bash

export UID

mkdir -p node_modules .quasar

docker-compose pull || exit 1
docker-compose build || exit 1
./npm install || exit 1
docker-compose up || { docker-compose down; exit 0; }
