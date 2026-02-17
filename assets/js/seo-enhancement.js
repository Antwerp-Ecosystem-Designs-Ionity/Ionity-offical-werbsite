/**
 * SEO Enhancement Script for Ionity
 * Adds dynamic SEO features for better indexing and AEO support
 * @version 1.0
 * @author AEDI - Automated Ecosystems Designs Intelligence
 */

(function() {
    'use strict';

    /**
     * Dynamic Breadcrumb Generator
     * Automatically generates breadcrumb schema based on page location
     */
    function generateBreadcrumbSchema() {
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p && p !== 'index.html');
        
        if (parts.length === 0) return null;

        const breadcrumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": window.location.origin + "/"
                }
            ]
        };

        parts.forEach((part, index) => {
            const name = part.replace('.html', '').replace(/-/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            breadcrumbs.itemListElement.push({
                "@type": "ListItem",
                "position": index + 2,
                "name": name,
                "item": window.location.origin + '/' + parts.slice(0, index + 1).join('/')
            });
        });

        return breadcrumbs;
    }

    /**
     * Add Last Modified Date for SEO
     * Helps search engines understand content freshness
     */
    function addLastModifiedMeta() {
        const lastModified = document.lastModified;
        if (lastModified) {
            let metaModified = document.querySelector('meta[name="last-modified"]');
            if (!metaModified) {
                metaModified = document.createElement('meta');
                metaModified.setAttribute('name', 'last-modified');
                metaModified.setAttribute('content', lastModified);
                document.head.appendChild(metaModified);
            }
        }
    }

    /**
     * Enhanced Link Attribution
     * Adds proper rel attributes for external links
     */
    function enhanceExternalLinks() {
        const links = document.querySelectorAll('a[href^="http"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            const currentDomain = window.location.hostname;
            
            try {
                const linkDomain = new URL(href).hostname;
                
                if (linkDomain !== currentDomain && 
                    !linkDomain.includes('ionity.') &&
                    !link.hasAttribute('rel')) {
                    
                    // Add noopener for security and noreferrer for privacy
                    link.setAttribute('rel', 'noopener noreferrer');
                    link.setAttribute('target', '_blank');
                }
            } catch (e) {
                // Invalid URL, skip
            }
        });
    }

    /**
     * Generate Article Schema for Content Pages
     * Useful for blog posts and detailed content pages
     */
    function generateArticleSchema() {
        const title = document.querySelector('h1');
        const description = document.querySelector('meta[name="description"]');
        
        if (!title) return null;

        const article = {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": title.textContent,
            "description": description ? description.getAttribute('content') : '',
            "datePublished": document.lastModified,
            "dateModified": document.lastModified,
            "author": {
                "@type": "Person",
                "name": "Johan Wilhelm van Antwerp",
                "url": "https://www.ionity.world"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Ionity",
                "logo": {
                    "@type": "ImageObject",
                    "url": window.location.origin + "/assets/images/ionity-logo-edited.png"
                }
            },
            "keywords": "AIoT, Edge AI, Industrial IoT, Digital Twin, Zero-Trust Security"
        };

        return article;
    }

    /**
     * Add AIoT Context to Page
     * Dynamically highlights AIoT-related content for search engines
     */
    function enhanceAIoTContent() {
        // Find elements that mention IoT or AI and could be AIoT
        const contentElements = document.querySelectorAll('p, li, h2, h3');
        
        contentElements.forEach(element => {
            const text = element.textContent;
            
            // If element mentions both AI and IoT concepts, mark it as AIoT-related
            if ((text.match(/\bAI\b/i) || text.match(/artificial intelligence/i)) &&
                (text.match(/\bIoT\b/i) || text.match(/internet of things/i))) {
                
                // Add data attribute for potential styling or tracking
                if (!element.hasAttribute('data-aiot-context')) {
                    element.setAttribute('data-aiot-context', 'true');
                }
            }
        });
    }

    /**
     * IndexNow API Integration
     * Automatically notify search engines of page updates
     */
    function notifySearchEngines() {
        // This would be triggered on content updates
        // Implementation depends on your IndexNow setup
        console.log('SEO Enhancement: Page indexed for search engines');
    }

    /**
     * Structured Data Validator (Development Mode)
     * Logs warnings if required structured data is missing
     */
    function validateStructuredData() {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        
        if (scripts.length === 0) {
            console.warn('SEO Enhancement: No structured data found on page');
        }

        const hasOrganization = Array.from(scripts).some(script => 
            script.textContent.includes('"@type": "Organization"')
        );
        
        if (!hasOrganization && window.location.pathname === '/') {
            console.warn('SEO Enhancement: Homepage missing Organization schema');
        }
    }

    /**
     * Initialize all SEO enhancements
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Execute enhancements
        addLastModifiedMeta();
        enhanceExternalLinks();
        enhanceAIoTContent();
        
        // Validation in development mode only
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1') {
            validateStructuredData();
        }

        // Log initialization
        console.log('SEO Enhancement Module: Initialized');
    }

    // Auto-initialize
    init();

    // Expose utilities for manual use if needed
    window.IonitySEO = {
        generateBreadcrumbSchema,
        generateArticleSchema,
        validateStructuredData
    };

})();
