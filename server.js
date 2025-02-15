const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env
const result = dotenv.config();
if (result.error) {
    console.warn('No .env file found. Using existing environment variables.');
}

// Verify required environment variables
const requiredEnvVars = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_API_TOKEN',
    'CLOUDFLARE_ACCOUNT_HASH'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('\x1b[31mError: Missing required environment variables:\x1b[0m');
    console.error(missingVars.join(', '));
    console.error('\nPlease set these variables in your .env file or environment.');
    console.error('You can use .env.example as a template.');
    process.exit(1);
}

// Start Hugo server with environment variables
try {
    console.log('\x1b[32mStarting Hugo server with Cloudflare credentials...\x1b[0m');
    
    // Create Hugo-prefixed environment variables
    execSync('hugo server -D', {
        env: {
            ...process.env,
            // Prefix with HUGO_ to make them accessible in templates
            HUGO_CLOUDFLARE_ACCOUNT_HASH: process.env.CLOUDFLARE_ACCOUNT_HASH,
            HUGO_CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
            HUGO_CLOUDFLARE_API_TOKEN: process.env.CLOUDFLARE_API_TOKEN
        },
        stdio: 'inherit'
    });
} catch (error) {
    console.error('\x1b[31mFailed to start Hugo server:\x1b[0m', error.message);
    process.exit(1);
} 