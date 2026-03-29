document.addEventListener('DOMContentLoaded', () => {
    // Premium Audio Context for Transitions
    let audioCtx;
    const playWarpSound = () => {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(40, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.6);
            
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.7);
        } catch (e) { console.warn("Audio Context blocked."); }
    };

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
                <div class="loader-text">NEURAL LINK // SYNCING</div>
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
                    50% { opacity: 0.8; }
                    100% { transform: translateZ(500px) scale(15); opacity: 0; }
                }

                @keyframes corePulse {
                    from { transform: scale(1); opacity: 0.8; }
                    to { transform: scale(1.5); opacity: 1; }
                }

                #warp-loader {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(2, 2, 5, 0.85);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    z-index: 20000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    overflow: hidden;
                    perspective: 1200px;
                    transition: opacity 0.4s ease;
                }
                #warp-loader .portal-container {
                    position: relative;
                    width: 300px; height: 300px;
                    display: flex; align-items: center; justify-content: center;
                    transform-style: preserve-3d;
                }
                #warp-loader .portal-ring {
                    position: absolute;
                    border: 1.5px solid rgba(0, 210, 255, 0.6);
                    border-radius: 50%;
                    box-shadow: 0 0 40px rgba(0, 210, 255, 0.4);
                    opacity: 0;
                }
                #warp-loader .ring-1 { width: 50px; height: 50px; animation: portalWarp 1s infinite linear; }
                #warp-loader .ring-2 { width: 50px; height: 50px; animation: portalWarp 1s infinite linear 0.3s; }
                #warp-loader .ring-3 { width: 50px; height: 50px; animation: portalWarp 1s infinite linear 0.6s; }
                
                #warp-loader .portal-core {
                    width: 6px; height: 6px;
                    background: #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 60px 25px rgba(255,255,255,0.4), 0 0 120px 50px rgba(0, 210, 255, 0.3);
                    animation: corePulse 0.4s infinite alternate;
                }

                #warp-loader .loader-text {
                    position: absolute;
                    bottom: -80px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.65rem;
                    letter-spacing: 0.5rem;
                    color: rgba(255,255,255,0.9);
                    text-transform: uppercase;
                    width: 100%;
                    text-align: center;
                    text-shadow: 0 0 15px rgba(0, 210, 255, 0.8);
                    font-weight: 700;
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
            playWarpSound();
            
            if (loader) {
                loader.style.display = 'flex';
                loader.style.opacity = '1';
                
                setTimeout(() => {
                    window.location.href = href;
                }, 700); // Reduced delay for faster flow
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

    // --- SCROLL DIRECTION BOUNCE HINT ---
    // Inject bounce styles (self-contained so it works on all pages)
    if (!document.querySelector('style#scroll-bounce-style')) {
        const bounceStyle = document.createElement('style');
        bounceStyle.id = 'scroll-bounce-style';
        bounceStyle.textContent = `
            @keyframes scrollBounceHint {
                0%   { transform: translateY(0); }
                20%  { transform: translateY(12px); }
                40%  { transform: translateY(-4px); }
                60%  { transform: translateY(5px); }
                80%  { transform: translateY(-2px); }
                100% { transform: translateY(0); }
            }
            @keyframes chevronPulse {
                0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.8; }
                50%      { transform: translateX(-50%) translateY(10px); opacity: 1; }
            }
            body.scroll-bounce-active {
                animation: scrollBounceHint 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s 1 both;
            }
            .scroll-hint-indicator {
                position: fixed;
                bottom: 28px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                animation: chevronPulse 1.4s ease-in-out infinite;
                transition: opacity 0.5s ease;
                pointer-events: none;
            }
            .scroll-hint-indicator .chevron {
                width: 14px;
                height: 14px;
                border-right: 2px solid rgba(0, 210, 255, 0.7);
                border-bottom: 2px solid rgba(0, 210, 255, 0.7);
                transform: rotate(45deg);
                filter: drop-shadow(0 0 6px rgba(0, 210, 255, 0.4));
            }
            .scroll-hint-indicator .chevron:nth-child(2) {
                opacity: 0.5;
                margin-top: -8px;
            }
            .scroll-hint-indicator.hidden {
                opacity: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(bounceStyle);
    }

    // Subtle bounce on load to indicate page is scrollable
    const canScroll = document.documentElement.scrollHeight > window.innerHeight;
    if (canScroll) {
        // Delay bounce until after any loader has finished
        const bounceDelay = loader ? 1400 : 300;

        setTimeout(() => {
            document.body.classList.add('scroll-bounce-active');

            // Create scroll chevron indicator
            const hint = document.createElement('div');
            hint.className = 'scroll-hint-indicator';
            hint.setAttribute('aria-hidden', 'true');
            hint.innerHTML = '<span class="chevron"></span><span class="chevron"></span>';
            document.body.appendChild(hint);

            // Hide indicator on first scroll or touch
            const dismissHint = () => {
                hint.classList.add('hidden');
                setTimeout(() => hint.remove(), 600);
                window.removeEventListener('scroll', dismissHint);
                window.removeEventListener('touchstart', dismissHint);
                window.removeEventListener('wheel', dismissHint);
            };
            window.addEventListener('scroll', dismissHint, { once: true });
            window.addEventListener('touchstart', dismissHint, { once: true });
            window.addEventListener('wheel', dismissHint, { once: true });

            // Auto-hide after 4 seconds if user doesn't scroll
            setTimeout(() => {
                if (document.body.contains(hint)) {
                    hint.classList.add('hidden');
                    setTimeout(() => { if (document.body.contains(hint)) hint.remove(); }, 600);
                }
            }, 4000);
        }, bounceDelay);

        // Remove bounce class after animation ends
        document.body.addEventListener('animationend', (e) => {
            if (e.animationName === 'scrollBounceHint') {
                document.body.classList.remove('scroll-bounce-active');
            }
        });
    }
});
