(function () {
    const API_BASE_URL = 'https://url-1sr3.onrender.com/url';

    async function shortenUrl(originalUrl, expiresAt) {
        const body = { originalUrl };
        if (expiresAt) body.expiresAt = expiresAt;
        const response = await fetch(`${API_BASE_URL}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return response.json();
    }

    async function getUrlStats(shortCode) {
        const response = await fetch(`${API_BASE_URL}/stats`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ shortCode }),
        });

        return response.json();
    }

    window.api = {
        API_BASE_URL,
        shortenUrl,
        getUrlStats,
    };

    // Backwards compat (optional):
    window.shortenUrl = shortenUrl;
    window.getUrlStats = getUrlStats;
})();
