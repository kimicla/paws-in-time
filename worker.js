// Configuration management
const CONFIG = {
    cors: {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        }
    },
    api: {
        baseURL: 'https://api.cloudflare.com/client/v4',
        pagination: {
            minPerPage: 10,
            maxPerPage: 100,
            defaultPerPage: 30
        }
    },
    cache: {
        ttl: 300 // 5 minutes
    },
    images: {
        baseURL: 'https://imagedelivery.net',
        variants: {
            thumbnail: 'thumbnail',
            public: 'public',
            preview: 'preview'
        }
    }
};

// Handle OPTIONS request for CORS preflight
function handleOptions() {
    return new Response(null, {
        headers: CONFIG.cors.headers
    });
}

// Get images from Cloudflare API
async function getImages(page, perPage) {
    try {
        const url = `${CONFIG.api.baseURL}/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: perPage.toString()
        });

        const response = await fetch(`${url}?${params}`, {
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        
        // Transform the response to include proper URLs
        if (data.result && Array.isArray(data.result.images)) {
            data.result.images = data.result.images.map(image => ({
                ...image,
                variants: {
                    thumbnail: getImageUrl(image.id, 'thumbnail'),
                    preview: getImageUrl(image.id, 'preview'),
                    public: getImageUrl(image.id, 'public')
                }
            }));
        }

        return data;
    } catch (error) {
        console.error('Error fetching images:', error);
        throw error;
    }
}

// Add this helper function
function getImageUrl(imageId, variant = 'public') {
    return `${CONFIG.images.baseURL}/${CLOUDFLARE_ACCOUNT_HASH}/${imageId}/${variant}`;
}

// Main request handler
async function handleRequest(request) {
    try {
        if (request.method === 'OPTIONS') {
            return handleOptions();
        }

        const url = new URL(request.url);
        const page = Math.max(1, parseInt(url.searchParams.get('page')) || 1);
        const perPage = Math.min(
            CONFIG.api.pagination.maxPerPage,
            Math.max(
                CONFIG.api.pagination.minPerPage,
                parseInt(url.searchParams.get('per_page')) || CONFIG.api.pagination.defaultPerPage
            )
        );

        // Get images data
        const data = await getImages(page, perPage);

        // Generate ETag based on response data
        const etag = `"${page}-${perPage}-${Date.now()}"`;

        // Return response with production-appropriate headers
        return new Response(JSON.stringify(data), {
            headers: {
                ...CONFIG.cors.headers,
                'Content-Type': 'application/json',
                'Cache-Control': `public, max-age=${CONFIG.cache.ttl}, stale-while-revalidate=60`,
                'ETag': etag,
                'Vary': 'Accept-Encoding',
                'X-Content-Type-Options': 'nosniff',
                'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                'X-Frame-Options': 'DENY'
            }
        });

    } catch (error) {
        console.error('Error:', error);
        
        return new Response(JSON.stringify({
            success: false,
            errors: [{
                code: error.status || 500,
                message: 'An internal error occurred'
            }]
        }), {
            status: error.status || 500,
            headers: {
                ...CONFIG.cors.headers,
                'Content-Type': 'application/json'
            }
        });
    }
}

// Register event listener
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
