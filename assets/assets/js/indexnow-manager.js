/**
 * IndexNow Manager - Instant Search Engine Notification
 * Automatically notifies search engines about page updates
 */

window.ionity = window.ionity || {};

window.ionity.indexNow = {
    // IndexNow Configuration
    config: {
        key: '0f9618673fb644b9b2767ca592a39673',
        keyLocation: 'https://ionity.eu/0f9618673fb644b9b2767ca592a39673.txt',
        host: 'https://ionity.eu',
        
        // Search engines that support IndexNow
        searchEngines: [
            'https://www.bing.com/indexnow',
            'https://api.indexnow.org/indexnow',
            'https://yandex.com/indexnow'
        ]
    },

    /**
     * Submit a single URL to IndexNow
     * @param {string} url - Full URL to submit
     * @param {string} searchEngine - Search engine endpoint (optional)
     */
    submitUrl: function(url, searchEngine) {
        const endpoint = searchEngine || this.config.searchEngines[0];
        const params = new URLSearchParams({
            url: url,
            key: this.config.key,
            keyLocation: this.config.keyLocation
        });

        const indexNowUrl = `${endpoint}?${params.toString()}`;

        // Use fetch to submit (no-cors mode to avoid CORS issues)
        fetch(indexNowUrl, {
            method: 'GET',
            mode: 'no-cors'
        }).then(() => {
            console.log(`IndexNow: Submitted ${url} to ${endpoint}`);
            
            // Track submission via GTM if available
            if (window.dataLayer) {
                window.dataLayer.push({
                    event: 'indexnow_submission',
                    url: url,
                    search_engine: endpoint
                });
            }
            
            // Store submission in cookie for tracking
            if (window.$yum) {
                window.$yum.addValue('ionity_indexnow', 'lastSubmission', {
                    url: url,
                    timestamp: new Date().toISOString(),
                    engine: endpoint
                }, 30);
            }
        }).catch(error => {
            console.warn('IndexNow submission error:', error);
        });
    },

    /**
     * Submit multiple URLs in batch
     * @param {array} urls - Array of URLs to submit
     */
    submitBatch: function(urls) {
        if (!Array.isArray(urls) || urls.length === 0) {
            console.warn('IndexNow: No URLs provided for batch submission');
            return;
        }

        // Submit to primary search engine using POST for batch
        const endpoint = this.config.searchEngines[0];
        
        const payload = {
            host: this.config.host.replace('https://', '').replace('http://', ''),
            key: this.config.key,
            keyLocation: this.config.keyLocation,
            urlList: urls
        };

        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        }).then(response => {
            console.log(`IndexNow: Batch submitted ${urls.length} URLs`);
            
            if (window.dataLayer) {
                window.dataLayer.push({
                    event: 'indexnow_batch_submission',
                    url_count: urls.length
                });
            }
        }).catch(error => {
            console.warn('IndexNow batch submission error:', error);
        });
    },

    /**
     * Submit current page to all search engines
     */
    submitCurrentPage: function() {
        const currentUrl = window.location.href;
        
        this.config.searchEngines.forEach(engine => {
            this.submitUrl(currentUrl, engine);
        });

        console.log(`IndexNow: Current page submitted to ${this.config.searchEngines.length} search engines`);
    },

    /**
     * Auto-submit current page if content has been updated
     * Call this after significant page updates
     */
    autoSubmit: function() {
        // Check if page was recently submitted
        if (window.$yum) {
            const lastSubmission = window.$yum.readValue('ionity_indexnow', 'lastSubmission');
            
            if (lastSubmission) {
                const lastUrl = lastSubmission.url;
                const lastTime = new Date(lastSubmission.timestamp);
                const hoursSinceSubmission = (new Date() - lastTime) / (1000 * 60 * 60);
                
                // Don't resubmit same URL within 24 hours
                if (lastUrl === window.location.href && hoursSinceSubmission < 24) {
                    console.log('IndexNow: Page already submitted recently');
                    return;
                }
            }
        }

        // Submit to primary search engine only for auto-submit
        this.submitUrl(window.location.href);
    },

    /**
     * Submit all site pages (call from admin/update script)
     */
    submitAllPages: function() {
        const sitePages = [
            'https://ionity.eu/index.html',
            'https://ionity.eu/about.html',
            'https://ionity.eu/services.html',
            'https://ionity.eu/products.html',
            'https://ionity.eu/contact.html',
            'https://ionity.eu/aedi-online.html',
            'https://ionity.eu/ai-innovation.html',
            'https://ionity.eu/firmware-development.html',
            'https://ionity.eu/gateway.html',
            'https://ionity.eu/license.html',
            'https://ionity.eu/roadmap.html',
            'https://ionity.eu/system-architecture.html'
        ];

        this.submitBatch(sitePages);
    },

    /**
     * Initialize IndexNow auto-submission on page load
     * Only submits if user has accepted analytics cookies
     */
    init: function() {
        // Only auto-submit if analytics cookies are accepted
        const consent = localStorage.getItem('ionity_cookie_consent');
        
        if (consent === 'granted') {
            // Don't auto-submit on every page load - too aggressive
            // Instead, only submit on specific trigger events
            console.log('IndexNow: Ready for manual submission');
        }
    }
};

// Shorthand alias
window.$indexNow = window.ionity.indexNow;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ionity.indexNow.init();
    });
} else {
    window.ionity.indexNow.init();
}
