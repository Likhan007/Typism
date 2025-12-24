// Ghost Replay Module - Show previous best run as a "ghost" opponent

class GhostReplay {
    constructor() {
        this.ghostData = null;
        this.isActive = false;
        this.ghostIndex = 0;
        this.ghostElement = null;
        this.startTime = null;
    }

    // Load ghost data from storage
    load(storage) {
        this.ghostData = storage.getGhostData();
        return this.ghostData !== null;
    }

    // Start ghost replay
    start(textLength) {
        if (!this.ghostData || !this.ghostData.keystrokes) {
            this.isActive = false;
            return false;
        }

        // Only show ghost if text length matches (or is close)
        const lengthDiff = Math.abs(this.ghostData.textLength - textLength);
        if (lengthDiff > 20) {
            this.isActive = false;
            return false;
        }

        this.isActive = true;
        this.ghostIndex = 0;
        this.startTime = Date.now();
        return true;
    }

    // Stop ghost replay
    stop() {
        this.isActive = false;
        this.ghostIndex = 0;
        this.startTime = null;
    }

    // Update ghost position based on time elapsed
    update() {
        if (!this.isActive || !this.ghostData) return null;

        const elapsed = Date.now() - this.startTime;
        const keystrokes = this.ghostData.keystrokes;

        // Find the current ghost position
        while (this.ghostIndex < keystrokes.length &&
            keystrokes[this.ghostIndex].timestamp <= elapsed) {
            this.ghostIndex++;
        }

        return {
            position: this.ghostIndex,
            percentage: (this.ghostIndex / keystrokes.length) * 100
        };
    }

    // Get ghost position for display
    getPosition() {
        return this.ghostIndex;
    }

    // Get ghost progress percentage
    getProgress() {
        if (!this.ghostData || !this.ghostData.keystrokes) return 0;
        return (this.ghostIndex / this.ghostData.keystrokes.length) * 100;
    }

    // Record current session for future ghost
    recordSession(keystrokes, textLength, wpm) {
        const ghostData = {
            keystrokes: keystrokes,
            textLength: textLength,
            wpm: wpm,
            timestamp: Date.now()
        };

        return ghostData;
    }

    // Check if ghost should be saved (better than previous)
    shouldSave(currentWPM) {
        if (!this.ghostData) return true;
        return currentWPM > this.ghostData.wpm;
    }

    // Get ghost stats for display
    getGhostStats() {
        if (!this.ghostData) return null;

        return {
            wpm: this.ghostData.wpm,
            timestamp: this.ghostData.timestamp
        };
    }

    // Check if player is ahead of ghost
    isPlayerAhead(playerPosition) {
        return playerPosition > this.ghostIndex;
    }

    // Reset ghost to beginning
    reset() {
        this.ghostIndex = 0;
        this.startTime = Date.now();
    }
}

// Export singleton instance
const ghost = new GhostReplay();
export default ghost;
