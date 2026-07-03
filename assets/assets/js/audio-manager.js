/**
 * Ionity Audio Manager
 * Handles synthesized sound effects and ambient background audio.
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.initialized = false;
        
        // Configuration
        this.volume = 0.3;
        
        // Bindings
        this.init = this.init.bind(this);
        this.playHoverSound = this.playUIHover.bind(this);
        this.playClickSound = this.playUIClick.bind(this);
    }

    init() {
        if (this.initialized) return;
        
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
            console.log("Audio System Initialized");
            
            // Start ambience if requested (can be toggled)
            this.startAmbience();
            
        } catch (e) {
            console.warn("Audio Context not supported", e);
        }
    }

    startAmbience() {
        if (!this.ctx) return;
        
        // Create a dark, low drone
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.value = 50; // Low drone
        
        osc2.type = 'sine';
        osc2.frequency.value = 52; // Slight detune for beating effect

        filter.type = 'lowpass';
        filter.frequency.value = 200;
        
        // LFO for filter
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.1; // Slow breathing
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 100;
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        gain.gain.value = 0.05; // Very quiet
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc1.start();
        osc2.start();
        lfo.start();
        
        this.ambienceNodes = { osc1, osc2, lfo, gain };
    }

    playUIClick() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
    
    playUIHover() {
        if (!this.ctx) return; // Don't auto-init on hover, annoying if not ready
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playPortalOpen() {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        // Big sweep sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 2.0);
        
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 1.0);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 3.0);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 3.0);
    }

    attachToDOM() {
        // Attach to all links and buttons
        const elements = document.querySelectorAll('a, button, .card, .btn-container');
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => this.playHoverSound());
            el.addEventListener('click', () => this.playClickSound());
        });
    }
}

// Global Instance
window.ionityAudio = new AudioManager();

// Init interactions
document.addEventListener('DOMContentLoaded', () => {
    // We can't auto-play audio without interaction, so we wait for first click
    const startAudio = () => {
        window.ionityAudio.init();
        // Listeners are already attached below, so no need to attach again
        document.removeEventListener('click', startAudio);
        document.removeEventListener('keydown', startAudio);
    };
    
    document.addEventListener('click', startAudio);
    document.addEventListener('keydown', startAudio);
    
    // Also try attaching listeners immediately for visual effects even if audio isn't ready
    window.ionityAudio.attachToDOM();
});
