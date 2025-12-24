// Typing Engine Module - Core typing logic

class TypingEngine {
    constructor() {
        this.currentText = '';
        this.currentIndex = 0;
        this.isActive = false;
        this.keystrokes = [];
        this.startTime = null;
        this.textSpans = [];
        this.onCorrect = null;
        this.onIncorrect = null;
        this.onComplete = null;
    }

    // Initialize with text to type
    init(text) {
        this.currentText = text;
        this.currentIndex = 0;
        this.isActive = false;
        this.hasStarted = false;
        this.keystrokes = [];
        this.startTime = null;
        this.textSpans = [];
    }

    // Start typing session (activate but don't start timer yet)
    start() {
        this.isActive = true;
        // Timer will start on first keystroke
    }

    // Process keystroke
    processKey(key, stats) {
        if (!this.isActive) return null;

        // Start timer on first keystroke
        if (!this.hasStarted) {
            this.startTime = Date.now();
            this.hasStarted = true;
        }

        const timestamp = Date.now() - this.startTime;
        const expectedChar = this.currentText[this.currentIndex];
        let result = {
            correct: false,
            completed: false,
            char: key,
            expectedChar: expectedChar,
            index: this.currentIndex
        };

        // Handle backspace
        if (key === 'Backspace') {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                stats.recordBackspace();

                // Remove highlighting from previous character
                result.action = 'backspace';
                result.index = this.currentIndex;
            }
            return result;
        }

        // Ignore non-character keys
        if (key.length > 1 && key !== 'Space') {
            return null;
        }

        // Convert Space to actual space character
        const typedChar = key === 'Space' ? ' ' : key;

        // Check if correct
        if (typedChar === expectedChar) {
            result.correct = true;
            stats.recordCorrect();

            // Record keystroke for ghost
            this.keystrokes.push({
                timestamp: timestamp,
                char: typedChar,
                correct: true
            });

            this.currentIndex++;

            // Check if completed
            if (this.currentIndex >= this.currentText.length) {
                result.completed = true;
                this.isActive = false;
                if (this.onComplete) {
                    this.onComplete();
                }
            }

            if (this.onCorrect) {
                this.onCorrect(stats.getCurrentStreak());
            }
        } else {
            result.correct = false;
            stats.recordIncorrect();

            // Record incorrect keystroke
            this.keystrokes.push({
                timestamp: timestamp,
                char: typedChar,
                correct: false
            });

            if (this.onIncorrect) {
                this.onIncorrect();
            }
        }

        return result;
    }

    // Get current progress percentage
    getProgress() {
        return (this.currentIndex / this.currentText.length) * 100;
    }

    // Get current position
    getCurrentIndex() {
        return this.currentIndex;
    }

    // Get text length
    getTextLength() {
        return this.currentText.length;
    }

    // Get keystrokes for ghost recording
    getKeystrokes() {
        return this.keystrokes;
    }

    // Check if typing is active
    isTypingActive() {
        return this.isActive;
    }

    // Stop typing
    stop() {
        this.isActive = false;
    }

    // Get remaining text
    getRemainingText() {
        return this.currentText.substring(this.currentIndex);
    }

    // Get typed text
    getTypedText() {
        return this.currentText.substring(0, this.currentIndex);
    }

    // Set event callbacks
    setCallbacks(onCorrect, onIncorrect, onComplete) {
        this.onCorrect = onCorrect;
        this.onIncorrect = onIncorrect;
        this.onComplete = onComplete;
    }

    // Reset engine
    reset() {
        this.currentIndex = 0;
        this.isActive = false;
        this.hasStarted = false;
        this.keystrokes = [];
        this.startTime = null;
    }
}

// Export singleton instance
const typingEngine = new TypingEngine();
export default typingEngine;
