/**
 * Cookie Consent & Management System for Ionity
 * Handles cookie consent, preferences, and cookie operations
 */

class CookieManager {
    constructor() {
        this.cookieName = 'ionity_cookie_consent';
        this.cookieExpiry = 365; // days
        this.consentGiven = false;
        this.preferences = {
            necessary: true, // Always true
            security: true, // Always true - essential for site protection
            analytics: false,
            marketing: false,
            preferences: false
        };
        
        this.init();
    }

    init() {
        // Check if consent already exists
        const consent = this.getCookie(this.cookieName);
        
        if (consent) {
            this.preferences = JSON.parse(consent);
            this.consentGiven = true;
            this.applyPreferences();
        } else {
            // Show cookie banner after a short delay
            setTimeout(() => this.showCookieBanner(), 1000);
        }
    }

    showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }

    hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }

    acceptAll() {
        this.preferences = {
            necessary: true,
            security: true,
            analytics: true,
            marketing: true,
            preferences: true
        };
        this.savePreferences();
        this.hideCookieBanner();
        this.applyPreferences();
    }

    acceptNecessary() {
        this.preferences = {
            necessary: true,
            security: true,
            analytics: false,
            marketing: false,
            preferences: false
        };
        this.savePreferences();
        this.hideCookieBanner();
        this.applyPreferences();
    }

    saveCustomPreferences() {
        // Get custom preferences from settings modal
        this.preferences.analytics = document.getElementById('cookie-analytics')?.checked || false;
        this.preferences.marketing = document.getElementById('cookie-marketing')?.checked || false;
        this.preferences.preferences = document.getElementById('cookie-preferences')?.checked || false;
        
        this.savePreferences();
        this.closeSettings();
        this.hideCookieBanner();
        this.applyPreferences();
    }

    savePreferences() {
        this.setCookie(this.cookieName, JSON.stringify(this.preferences), this.cookieExpiry);
        this.consentGiven = true;
    }

    applyPreferences() {
        // Apply security cookies (always enabled)
        if (this.preferences.security) {
            this.enableSecurity();
        }

        // Apply analytics cookies
        if (this.preferences.analytics) {
            this.enableAnalytics();
        }

        // Apply marketing cookies
        if (this.preferences.marketing) {
            this.enableMarketing();
        }

        // Apply preference cookies
        if (this.preferences.preferences) {
            this.enablePreferences();
        }

        // Dispatch event for other scripts to listen to
        const event = new CustomEvent('cookieConsentChanged', {
            detail: this.preferences
        });
        document.dispatchEvent(event);
    }

    enableSecurity() {
        // Enable security cookies for CSRF protection, session security, etc.
        console.log('Security cookies enabled');
        
        // Set CSRF token cookie
        this.setSecurityCookie('ionity_csrf_token', this.generateToken(), 1);
        
        // Set security headers flag
        this.setSecurityCookie('ionity_security_enabled', 'true', 365);
        
        // Set session security cookie
        this.setSecurityCookie('ionity_session_secure', 'true', 1);
    }

    enableAnalytics() {
        // Add Google Analytics or other analytics here
        console.log('Analytics cookies enabled');
        
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('consent', 'update', {
        //         'analytics_storage': 'granted'
        //     });
        // }
    }

    enableMarketing() {
        // Add marketing pixels here
        console.log('Marketing cookies enabled');
        
        // Example: Facebook Pixel, Google Ads, etc.
    }

    enablePreferences() {
        // Enable preference cookies
        console.log('Preference cookies enabled');
    }

    openSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            // Set current preferences
            if (document.getElementById('cookie-analytics')) {
                document.getElementById('cookie-analytics').checked = this.preferences.analytics;
            }
            if (document.getElementById('cookie-marketing')) {
                document.getElementById('cookie-marketing').checked = this.preferences.marketing;
            }
            if (document.getElementById('cookie-preferences')) {
                document.getElementById('cookie-preferences').checked = this.preferences.preferences;
            }
            
            modal.classList.add('show');
        }
    }

    closeSettings() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    // Cookie utility methods
    setCookie(name, value, days) {
        try {
            localStorage.setItem(name, value);
        } catch (e) { console.warn('localStorage not available'); }

        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        const secureFlag = location.protocol === 'https:' ? ';Secure' : '';
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax" + secureFlag;
    }

    setSecurityCookie(name, value, days) {
        // Security cookies with stricter settings
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        // Use SameSite=Strict and Secure for enhanced security
        const secureFlag = location.protocol === 'https:' ? ';Secure' : '';
        document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Strict" + secureFlag;
    }

    generateToken() {
        // Generate a random token for CSRF protection
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    getCookie(name) {
        try {
            const localVal = localStorage.getItem(name);
            if (localVal) return localVal;
        } catch (e) {}

        const nameEQ = name + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    }

    // Clear all cookies (for testing or reset)
    clearAllCookies() {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            this.deleteCookie(name);
        }
    }
}

// Initialize cookie manager when DOM is ready
let cookieManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cookieManager = new CookieManager();
    });
} else {
    cookieManager = new CookieManager();
}

// Make it globally accessible
window.cookieManager = cookieManager;
