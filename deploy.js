const { execSync } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables from .env
dotenv.config();

// Set secrets in Wrangler
const secrets = [
    'CLOUDFLARE_API_TOKEN'
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
    // First ensure theme is present
    if (!fs.existsSync('./themes')) {
        console.error('❌ Themes directory not found');
        process.exit(1);
    }
    
    // Verify API token exists
    if (!process.env.CLOUDFLARE_API_TOKEN) {
        console.error('❌ Missing CLOUDFLARE_API_TOKEN in .env file');
        process.exit(1);
    }
    
    console.log('🔨 Building Hugo site...');
    execSync('hugo --environment production', {
        env: {
            ...process.env,
            HUGO_ENV: 'production'
        },
        stdio: 'inherit'
    });
    
    // Verify build output
    if (!fs.existsSync('./public')) {
        console.error('❌ Build failed: public directory not created');
        process.exit(1);
    }
    
    // List contents of public directory
    console.log('📁 Built files:');
    execSync('ls -la public', { stdio: 'inherit' });
    
    console.log('✅ Hugo site built successfully');
} catch (error) {
    console.error('Failed to build Hugo site:', error);
    console.error('Build error details:', error.message);
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