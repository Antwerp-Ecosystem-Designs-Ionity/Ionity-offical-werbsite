document.addEventListener('DOMContentLoaded', () => {
    // Inject Loader HTML if not present
    if (!document.getElementById('warp-loader')) {
        const loaderDiv = document.createElement('div');
        loaderDiv.id = 'warp-loader';
        loaderDiv.innerHTML = `
            <div class="portal-container">
                <div class="portal-ring ring-1"></div>
                <div class="portal-ring ring-2"></div>
                <div class="portal-ring ring-3"></div>
                <div class="portal-core"></div>
                <div class="loader-text">NEURAL LINK ESTABLISHED // WARPING</div>
            </div>
        `;
        document.body.prepend(loaderDiv);

        // Inject Loader Styles if not present
        if (!document.querySelector('style#warp-loader-style')) {
            const style = document.createElement('style');
            style.id = 'warp-loader-style';
            style.textContent = `
                @keyframes portalWarp {
                    0% { transform: translateZ(-500px) scale(0.1); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateZ(500px) scale(15); opacity: 0; }
                }

                @keyframes corePulse {
                    from { transform: scale(1); opacity: 0.8; }
                    to { transform: scale(1.5); opacity: 1; }
                }

                #warp-loader {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: #020204;
                    z-index: 20000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    overflow: hidden;
                    perspective: 1000px;
                }
                .portal-container {
                    position: relative;
                    width: 300px;
                    height: 300px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transform-style: preserve-3d;
                }
                .portal-ring {
                    position: absolute;
                    border: 2px solid #00d2ff;
                    border-radius: 50%;
                    box-shadow: 0 0 30px #00d2ff, inset 0 0 30px #00d2ff;
                    opacity: 0;
                }
                .ring-1 { width: 40px; height: 40px; animation: portalWarp 1.2s infinite linear; }
                .ring-2 { width: 40px; height: 40px; animation: portalWarp 1.2s infinite linear 0.4s; }
                .ring-3 { width: 40px; height: 40px; animation: portalWarp 1.2s infinite linear 0.8s; }
                
                .portal-core {
                    width: 4px; height: 4px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 50px 20px #fff, 0 0 100px 40px #00d2ff;
                    animation: corePulse 0.5s infinite alternate;
                }

                .loader-text {
                    position: absolute;
                    bottom: -60px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.7rem;
                    letter-spacing: 0.4rem;
                    color: #00d2ff;
                    text-transform: uppercase;
                    width: 100%;
                    text-align: center;
                    text-shadow: 0 0 10px #00d2ff;
                }
            `;
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
            
            if (loader) {
                loader.style.display = 'flex';
                loader.style.opacity = '1';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 1000);
            } else {
                window.location.href = href;
            }
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
        if (slider.children.length > 0 && !slider.getAttribute('data-duplicated')) {
            const children = Array.from(slider.children);
            children.forEach(child => {
                const clone = child.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
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

        const handleTouchStart = (e) => {
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            const style = window.getComputedStyle(track);
            const matrix = new DOMMatrix(style.transform);
            startTranslateX = matrix.m41;
            translateX = startTranslateX;
            track.style.transition = 'none';
            viewport.style.cursor = 'grabbing';
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const diff = currentX - startX;
            translateX = startTranslateX + diff;
            track.style.transform = `translateX(${translateX}px)`;
        };

        const handleTouchEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            viewport.style.cursor = 'grab';
            const diff = currentX - startX;
            const swipeThreshold = 50;
            track.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            if (Math.abs(diff) > swipeThreshold) {
                const cards = track.querySelectorAll('.card, .card-3d-scene, .tier-card');
                if (cards.length === 0) return;
                const cardWidth = cards[0].offsetWidth + 24;
                const viewportWidth = viewport.clientWidth;
                const maxTranslate = -(track.scrollWidth - viewportWidth);
                if (diff > 0) {
                    translateX = Math.min(translateX + cardWidth, 0);
                } else {
                    translateX = Math.max(translateX - cardWidth, maxTranslate);
                }
                track.style.transform = `translateX(${translateX}px)`;
            } else {
                track.style.transform = `translateX(${startTranslateX}px)`;
            }
        };

        viewport.addEventListener('touchstart', handleTouchStart, { passive: false });
        viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
        viewport.addEventListener('touchend', handleTouchEnd, { passive: true });
        viewport.addEventListener('mousedown', handleTouchStart);
        viewport.addEventListener('mousemove', handleTouchMove);
        viewport.addEventListener('mouseup', handleTouchEnd);
        viewport.addEventListener('mouseleave', handleTouchEnd);
        viewport.addEventListener('dragstart', (e) => e.preventDefault());
        viewport.style.cursor = 'grab';
    });

    toggleBtn();
});
