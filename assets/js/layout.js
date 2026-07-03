/**
 * Layout Management System
 * Handles navigation, responsive behaviors, and common UI interactions
 * Part of Ionity Ecosystem - Antwerp Designs
 */

(function() {
    'use strict';

    // Layout Manager
    const Layout = {
        // Configuration
        config: {
            scrollThreshold: 100,
            mobileBreakpoint: 768,
            debounceDelay: 250
        },

        // Initialize all layout components
        init() {
            this.setupNavigation();
            this.setupScrollEffects();
            this.setupMobileMenu();
            this.setupBackToTop();
            this.setupActiveLink();
            this.setupResponsiveImages();
            this.setupScrollBounceHint();
            console.log('Layout Manager initialized');
        },

        // Navigation Menu Management
        setupNavigation() {
            const nav = document.querySelector('nav');
            const header = document.querySelector('header');
            
            if (!nav || !header) return;

            // Add sticky header on scroll
            let lastScroll = 0;
            window.addEventListener('scroll', this.debounce(() => {
                const currentScroll = window.pageYOffset;

                if (currentScroll > this.config.scrollThreshold) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Hide/show header based on scroll direction
                if (currentScroll > lastScroll && currentScroll > 500) {
                    header.classList.add('header-hidden');
                } else {
                    header.classList.remove('header-hidden');
                }

                lastScroll = currentScroll;
            }, this.config.debounceDelay));
        },

        // Mobile Menu Toggle
        setupMobileMenu() {
            const menuToggle = document.querySelector('.menu-toggle, .hamburger, .mobile-menu-btn');
            const mobileMenu = document.querySelector('.mobile-menu, .nav-menu, nav ul');
            const menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            
            if (!menuToggle || !mobileMenu) return;

            // Add overlay to body
            document.body.appendChild(menuOverlay);

            // Toggle menu
            menuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = mobileMenu.classList.toggle('active');
                menuToggle.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                document.body.classList.toggle('menu-open');

                // Update aria attributes
                menuToggle.setAttribute('aria-expanded', isOpen);
                mobileMenu.setAttribute('aria-hidden', !isOpen);
            });

            // Close menu when clicking overlay
            menuOverlay.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });

            // Close menu when clicking a link
            const menuLinks = mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= this.config.mobileBreakpoint) {
                        mobileMenu.classList.remove('active');
                        menuToggle.classList.remove('active');
                        menuOverlay.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            });
        },

        // Scroll Effects
        setupScrollEffects() {
            const scrollElements = document.querySelectorAll('.fade-in, .slide-in, [data-scroll]');
            
            if (scrollElements.length === 0) return;

            const elementInView = (el, offset = 0) => {
                const elementTop = el.getBoundingClientRect().top;
                return elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset;
            };

            const displayScrollElement = (element) => {
                element.classList.add('scrolled-into-view');
            };

            const handleScrollAnimation = () => {
                scrollElements.forEach((el) => {
                    if (elementInView(el, 100)) {
                        displayScrollElement(el);
                    }
                });
            };

            window.addEventListener('scroll', this.debounce(handleScrollAnimation, 100));
            handleScrollAnimation(); // Initial check
        },

        // Back to Top Button
        setupBackToTop() {
            let backToTopBtn = document.querySelector('.back-to-top');
            
            // Create button if it doesn't exist
            if (!backToTopBtn) {
                backToTopBtn = document.createElement('button');
                backToTopBtn.className = 'back-to-top';
                backToTopBtn.innerHTML = '↑';
                backToTopBtn.setAttribute('aria-label', 'Back to top');
                backToTopBtn.setAttribute('title', 'Back to top');
                document.body.appendChild(backToTopBtn);
            }

            // Show/hide based on scroll position
            window.addEventListener('scroll', this.debounce(() => {
                if (window.pageYOffset > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }, 200));

            // Scroll to top on click
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        // Active Link Highlighting
        setupActiveLink() {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('nav a, .nav-menu a');

            navLinks.forEach(link => {
                const linkPath = new URL(link.href).pathname;
                
                if (linkPath === currentPath || 
                    (currentPath === '/' && linkPath === '/index.html') ||
                    (currentPath.includes(linkPath) && linkPath !== '/')) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                }
            });
        },

        // Responsive Images
        setupResponsiveImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                images.forEach(img => {
                    img.src = img.dataset.src;
                });
            }
        },

        // Scroll Bounce Hint – subtle nudge so users know the page scrolls
        setupScrollBounceHint() {
            let userHasInteracted = false;
            let bounceTimer = null;
            const idleDelay = 6000;  // ms before first nudge
            const bounceAmount = 28; // px to bounce down
            const bounceDuration = 600; // ms per half-bounce

            const markInteracted = () => { userHasInteracted = true; };
            window.addEventListener('scroll', markInteracted, { once: true, passive: true });
            window.addEventListener('wheel', markInteracted, { once: true, passive: true });
            window.addEventListener('touchmove', markInteracted, { once: true, passive: true });
            window.addEventListener('keydown', (e) => {
                if (['ArrowDown','ArrowUp','PageDown','PageUp','Space'].includes(e.code)) markInteracted();
            }, { once: true, passive: true });

            const doBounce = () => {
                if (userHasInteracted || window.scrollY > 10) return;
                // Page must actually be scrollable
                if (document.documentElement.scrollHeight <= window.innerHeight) return;

                const start = window.scrollY;
                const peak = start + bounceAmount;
                let phase = 'down';
                let startTime = null;

                const animate = (ts) => {
                    if (!startTime) startTime = ts;
                    const elapsed = ts - startTime;

                    if (phase === 'down') {
                        const progress = Math.min(elapsed / bounceDuration, 1);
                        const ease = progress < 0.5
                            ? 2 * progress * progress
                            : -1 + (4 - 2 * progress) * progress;
                        window.scrollTo(0, start + bounceAmount * ease);
                        if (progress >= 1) {
                            phase = 'up';
                            startTime = null;
                        }
                    } else {
                        const progress = Math.min(elapsed / bounceDuration, 1);
                        const ease = progress < 0.5
                            ? 2 * progress * progress
                            : -1 + (4 - 2 * progress) * progress;
                        window.scrollTo(0, peak - bounceAmount * ease);
                        if (progress >= 1) return; // done
                    }
                    requestAnimationFrame(animate);
                };

                requestAnimationFrame(animate);
            };

            bounceTimer = setTimeout(doBounce, idleDelay);
        },

        // Utility: Debounce function
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func.apply(this, args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Smooth scroll for anchor links
        setupSmoothScroll() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without scrolling
                        history.pushState(null, null, targetId);
                    }
                });
            });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Layout.init());
    } else {
        Layout.init();
    }

    // Expose Layout object globally if needed
    window.IonityLayout = Layout;

})();
