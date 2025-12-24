// Sound Controller Module - Web Audio API for game sounds

class SoundController {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.isMuted = false;
        this.isMusicMuted = false;
        this.backgroundMusic = null;
        this.init();
    }

    // Initialize Web Audio API
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3; // Default volume 30%
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Resume audio context (needed for autoplay policy)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Create oscillator for simple sounds
    createOscillator(frequency, type = 'sine') {
        if (!this.audioContext) return null;

        const oscillator = this.audioContext.createOscillator();
        oscillator.type = type;
        oscillator.frequency.value = frequency;

        return oscillator;
    }

    // Create gain node for volume control
    createGain(initialValue = 1) {
        if (!this.audioContext) return null;

        const gain = this.audioContext.createGain();
        gain.gain.value = initialValue;

        return gain;
    }

    // Play keypress sound (short beep)
    playKeypress() {
        if (!this.audioContext || this.isMuted) return;

        this.resume();

        const oscillator = this.createOscillator(800, 'sine');
        const gain = this.createGain(0.05);

        oscillator.connect(gain);
        gain.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.05);
    }

    // Play success sound (cheerful tone)
    playSuccess() {
        if (!this.audioContext || this.isMuted) return;

        this.resume();

        const frequencies = [523, 659, 784]; // C, E, G (major chord)

        frequencies.forEach((freq, index) => {
            const oscillator = this.createOscillator(freq, 'sine');
            const gain = this.createGain(0.1);

            oscillator.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.audioContext.currentTime + (index * 0.1);
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    // Play mistake sound (gentle error)
    playMistake() {
        if (!this.audioContext || this.isMuted) return;

        this.resume();

        const oscillator = this.createOscillator(200, 'sawtooth');
        const gain = this.createGain(0.08);

        oscillator.connect(gain);
        gain.connect(this.masterGain);

        // Descending frequency for "oops" effect
        oscillator.frequency.exponentialRampToValueAtTime(
            150,
            this.audioContext.currentTime + 0.15
        );

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    // Play unlock celebration sound
    playUnlock() {
        if (!this.audioContext || this.isMuted) return;

        this.resume();

        // Ascending arpeggio
        const frequencies = [523, 659, 784, 1047]; // C, E, G, C (octave)

        frequencies.forEach((freq, index) => {
            const oscillator = this.createOscillator(freq, 'triangle');
            const gain = this.createGain(0.15);

            oscillator.connect(gain);
            gain.connect(this.masterGain);

            const startTime = this.audioContext.currentTime + (index * 0.08);
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    }

    // Play combo/streak sound
    playCombo(streakLevel) {
        if (!this.audioContext || this.isMuted) return;

        this.resume();

        const baseFreq = 400 + (streakLevel * 50);
        const oscillator = this.createOscillator(baseFreq, 'square');
        const gain = this.createGain(0.1);

        oscillator.connect(gain);
        gain.connect(this.masterGain);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Start ambient jungle background music
    startAmbience() {
        if (!this.audioContext || this.isMusicMuted || this.backgroundMusic) return;

        this.resume();

        // Create simple ambient loop using multiple oscillators
        const oscillators = [];
        const frequencies = [65, 130, 195]; // Low ambient tones

        frequencies.forEach(freq => {
            const osc = this.createOscillator(freq, 'sine');
            const gain = this.createGain(0.02);

            osc.connect(gain);
            gain.connect(this.masterGain);

            // Add slight modulation for organic feel
            const lfo = this.createOscillator(0.2, 'sine');
            const lfoGain = this.createGain(5);
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);

            osc.start();
            lfo.start();

            oscillators.push({ osc, lfo, gain });
        });

        this.backgroundMusic = oscillators;
    }

    // Stop background music
    stopAmbience() {
        if (!this.backgroundMusic) return;

        this.backgroundMusic.forEach(({ osc, lfo }) => {
            osc.stop();
            lfo.stop();
        });

        this.backgroundMusic = null;
    }

    // Toggle sound effects mute
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // Toggle music mute
    toggleMusic() {
        this.isMusicMuted = !this.isMusicMuted;

        if (this.isMusicMuted) {
            this.stopAmbience();
        } else {
            this.startAmbience();
        }

        return this.isMusicMuted;
    }

    // Set master volume (0-1)
    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    // Set mute state from settings
    setMuteState(soundMuted, musicMuted) {
        this.isMuted = soundMuted;
        this.isMusicMuted = musicMuted;

        if (musicMuted) {
            this.stopAmbience();
        }
    }
}

// Export singleton instance
const sound = new SoundController();
export default sound;
