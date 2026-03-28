document.addEventListener('DOMContentLoaded', () => {
    // Inject Loader HTML if not present
    if (!document.getElementById('warp-loader')) {
        const loaderDiv = document.createElement('div');
        loaderDiv.id = 'warp-loader';
        loaderDiv.innerHTML = \<div class='loader-ring'></div><div class='loader-text'>Initializing Protocol...</div>\;
        document.body.prepend(loaderDiv);

        // Inject Loader Styles if not present
        if (!document.querySelector('style#warp-loader-style')) {
            const style = document.createElement('style');
            style.id = 'warp-loader-style';
            style.textContent = \
                #warp-loader {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(2,2,4,0.9);
                    z-index: 9999;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .loader-ring {
                    width: 80px; height: 80px;
                    border: 2px solid rgba(0, 210, 255, 0.1);
                    border-top: 2px solid #00d2ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1.5rem;
                }
                .loader-text {
                    font-family: 'Courier New', monospace;
                    font-size: 1rem;
                    letter-spacing: 0.2rem;
                    color: #00d2ff;
                    text-transform: uppercase;
                    animation: neonPulse 1s infinite alternate;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes neonPulse {
                    0% { text-shadow: 0 0 5px rgba(255,255,255,0.8), 0 0 10px #00d2ff; }
                    50% { text-shadow: 0 0 10px #fff, 0 0 20px #00d2ff; }
                    100% { text-shadow: 0 0 5px rgba(255,255,255,0.8), 0 0 10px #00d2ff; }
                }
            \;
            document.head.appendChild(style);
        }
    }

    // Initialize Protocol on Menu Click
    const links = document.querySelectorAll('nav a, .mobile-dropdown a, .nav-links a');
    const loader = document.getElementById('warp-loader');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
             if (link.target === '_blank') return;

            e.preventDefault();
            
            loader.style.display = 'flex';
            
            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        });
    });

    // --- BACK TO TOP BUTTON MODULE ---
    let btn = document.getElementById('cBackToTop');
    
    // Create button if it doesn't exist
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'cBackToTop';
        btn.innerHTML = '&#8593;'; 
        btn.title = 'Back to Top';
        btn.setAttribute('aria-label', 'Back to Top');
        document.body.appendChild(btn);

        // Create and append styles
        const css = `
            #cBackToTop {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background-color: transparent;
                color: #00d2ff;
                border: 2px solid #00d2ff;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 0 10px rgba(0, 210, 255, 0.2);
                padding: 0;
                line-height: 1;
            }
            #cBackToTop:hover {
                background-color: #00d2ff;
                color: #000;
                box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
                transform: translateY(-5px);
            }
            @media (max-width: 768px) {
                #cBackToTop {
                    bottom: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    font-size: 20px;
                }
            }
        `;
        const style = document.createElement('style');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    const toggleBtn = () => {
        if (window.scrollY > 300) {
            btn.style.display = 'flex';
        } else {
            btn.style.display = 'none';
        }

        const nav = document.querySelector('nav');
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', toggleBtn);
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // --- SLIDER DUPLICATION LOGIC ---
    const sliders = document.querySelectorAll('.slider-auto-scroll');
    sliders.forEach(slider => {
        // Duplicate content for seamless loop
        // We only duplicate if children exist and not already duplicated
        if (slider.children.length > 0 && !slider.getAttribute('data-duplicated')) {
            const children = Array.from(slider.children);
            children.forEach(child => {
                const clone = child.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true'); // Accessibility: hide duplicate from screen readers
                clone.classList.add('slider-clone');
                slider.appendChild(clone);
            });
            slider.setAttribute('data-duplicated', 'true');
        }
    });

    // --- ENHANCED MOBILE TOUCH/SWIPE SUPPORT FOR ALL SLIDERS ---
    const allSliderViewports = document.querySelectorAll('.slider-viewport');

    allSliderViewports.forEach(viewport => {
        const track = viewport.querySelector('.slider-track');
        if (!track) return;

        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let translateX = 0;
        let startTranslateX = 0;

        // Touch Start
        const handleTouchStart = (e) => {
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;

            // Get current transform value
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            startTranslateX = matrix.m41;
            translateX = startTranslateX;

            track.style.transition = 'none';
            viewport.style.cursor = 'grabbing';
        };

        // Touch Move
        const handleTouchMove = (e) => {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const diff = currentX - startX;
            translateX = startTranslateX + diff;

            track.style.transform = `translateX(${translateX}px)`;
        };

        // Touch End
        const handleTouchEnd = (e) => {
            if (!isDragging) return;

            isDragging = false;
            viewport.style.cursor = 'grab';

            const diff = currentX - startX;
            const swipeThreshold = 50;

            // Restore smooth transition
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';

            // Snap to nearest card if swipe was significant
            if (Math.abs(diff) > swipeThreshold) {
                const cards = track.querySelectorAll('.card, .card-3d-scene, .tier-card');
                if (cards.length === 0) return;

                const cardWidth = cards[0].offsetWidth + 24; // Include gap
                const viewportWidth = viewport.clientWidth;
                const maxTranslate = -(track.scrollWidth - viewportWidth);

                if (diff > 0) {
                    // Swiped right - go previous
                    translateX = Math.min(translateX + cardWidth, 0);
                } else {
                    // Swiped left - go next
                    translateX = Math.max(translateX - cardWidth, maxTranslate);
                }

                track.style.transform = `translateX(${translateX}px)`;
            } else {
                // Revert to last position if swipe wasn't significant
                track.style.transform = `translateX(${startTranslateX}px)`;
            }
        };

        // Add event listeners for both touch and mouse
        viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
        viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
        viewport.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Mouse events for desktop dragging
        viewport.addEventListener('mousedown', handleTouchStart);
        viewport.addEventListener('mousemove', handleTouchMove);
        viewport.addEventListener('mouseup', handleTouchEnd);
        viewport.addEventListener('mouseleave', handleTouchEnd);

        // Prevent default drag behavior on images and links
        viewport.addEventListener('dragstart', (e) => e.preventDefault());

        // Set initial cursor
        viewport.style.cursor = 'grab';
    });

    toggleBtn(); // Initial check
});
