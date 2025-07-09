#!/bin/bash 

echo "Starting Media Service API..."
node dist/api.js &

echo "Starting Media Service Worker..."
node dist/worker.js 