#!/bin/bash

# Exit on error
set -e

# Load environment variables
source .env

# Set secrets
echo "Setting secrets..."
echo "$CLOUDFLARE_ACCOUNT_ID" | wrangler secret put CLOUDFLARE_ACCOUNT_ID
echo "$CLOUDFLARE_API_TOKEN" | wrangler secret put CLOUDFLARE_API_TOKEN
echo "$CLOUDFLARE_ACCOUNT_HASH" | wrangler secret put CLOUDFLARE_ACCOUNT_HASH

# Deploy worker
echo "Deploying worker..."
wrangler deploy

echo "✅ Deployment complete!" 