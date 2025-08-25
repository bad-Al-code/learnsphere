#!/bin/bash

set -e

echo "Starting the complete microservice database seeding process..."
echo "This will generate a vast amount of data and will take approximately 10-15 minutes."
echo ""

echo "--- [1/4] Starting listener services in the background ---"

echo "  -> Starting user-service listener..."
(cd user-service && pnpm db && pnpm db:seed) &

echo "  -> Starting enrollment-service listener..."
(cd enrollment-service &&  pnpm db && pnpm db:seed) &

echo "  -> Starting payment-service listener..."
(cd payment-service &&  pnpm db && pnpm db:seed) &

echo "  -> Starting notification-service listener..."
(cd notification-service &&  pnpm db && pnpm db:seed) &

echo ""

echo "--- [2/4] Waiting 15 seconds for listeners to connect to RabbitMQ... ---"
sleep 15
echo ""

echo "--- [3/4] Starting publisher services (this is the data generation phase) ---"

echo "  -> Running auth-service seeder (publishes 'user.registered'). This will take a moment..."
(cd auth-service && pnpm db && pnpm db:seed)
echo "  -> Auth-service seeder finished."
echo ""

echo "  -> Running course-service seeder (publishes 'course.created'). This will be intensive..."
(cd course-service &&  pnpm db && pnpm db:seed)
echo "  -> Course-service seeder finished."
echo ""

echo "--- [4/4] Publishers finished. The script will now wait for listeners to complete their timeouts and process all events. ---"
echo "This is the final step. Please be patient."
wait

echo ""
echo "All microservice seeders have completed successfully!"
echo "Your databases are now populated with a vast amount of historical data."