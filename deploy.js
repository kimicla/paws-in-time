const { execSync } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env
dotenv.config();

// Set secrets in Wrangler
const secrets = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_API_TOKEN',
    'CLOUDFLARE_ACCOUNT_HASH'
];

// Deploy worker
secrets.forEach(secret => {
    const value = process.env[secret];
    if (!value) {
        console.error(`Missing ${secret} in .env file`);
        process.exit(1);
    }
    
    try {
        execSync(`echo "${value}" | wrangler secret put ${secret}`, { stdio: 'inherit' });
        console.log(`✅ Set ${secret}`);
    } catch (error) {
        console.error(`Failed to set ${secret}:`, error);
        process.exit(1);
    }
});

// Build Hugo with environment variables
try {
    execSync('hugo --environment production', {
        env: {
            ...process.env,
            HUGO_ENV: 'production'
        },
        stdio: 'inherit'
    });
    console.log('✅ Hugo site built successfully');
} catch (error) {
    console.error('Failed to build Hugo site:', error);
    process.exit(1);
}

// Deploy worker
try {
    execSync('wrangler deploy', { stdio: 'inherit' });
    console.log('✅ Worker deployed successfully');
} catch (error) {
    console.error('Failed to deploy worker:', error);
    process.exit(1);
} 