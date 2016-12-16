#!/bin/bash

set -e

sleep 10
npm run migratedb
node run.js

exit 0