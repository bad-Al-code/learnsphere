#/bin/bash

cd auth-service
pnpm db
pnpm dev
cd user-service
pnpm db
pnpm dev
cd course-service
pnpm db
pnpm dev
cd notification-service
pnpm db
pnpm dev
cd media-service
pnpm db
pnpm dev
