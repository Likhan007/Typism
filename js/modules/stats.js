// Stats Module - WPM and Accuracy calculations

class StatsCalculator {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.hasStarted = false;
        this.totalChars = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.currentStreak = 0;
        this.maxStreak = 0;
    }

    // Start tracking (activate but don't start timer yet)
    start() {
        this.hasStarted = false;
        this.startTime = null;
        this.reset();
    }

    // Reset stats (keep startTime)
    reset() {
        this.totalChars = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.currentStreak = 0;
        this.maxStreak = 0;
    }

    // Record a correct character
    recordCorrect() {
        // Start timer on first character
        if (!this.hasStarted) {
            this.startTime = Date.now();
            this.hasStarted = true;
        }

        this.totalChars++;
        this.correctChars++;
        this.currentStreak++;
        this.maxStreak = Math.max(this.maxStreak, this.currentStreak);
    }

    // Record an incorrect character
    recordIncorrect() {
        // Start timer on first character (even if incorrect)
        if (!this.hasStarted) {
            this.startTime = Date.now();
            this.hasStarted = true;
        }

        this.totalChars++;
        this.incorrectChars++;
        this.currentStreak = 0;
    }

    // Record a backspace
    recordBackspace() {
        if (this.totalChars > 0) {
            this.totalChars--;
            if (this.correctChars > 0) {
                this.correctChars--;
            }
        }
    }

    // Calculate WPM (Words Per Minute)
    calculateWPM() {
        if (!this.startTime) return 0;

        const timeElapsed = (Date.now() - this.startTime) / 1000; // seconds
        if (timeElapsed === 0) return 0;

        const minutes = timeElapsed / 60;
        const words = this.correctChars / 5; // Standard: 5 chars = 1 word
        const wpm = Math.round(words / minutes);

        return Math.max(0, wpm);
    }

    // Calculate Accuracy (percentage)
    calculateAccuracy() {
        if (this.totalChars === 0) return 100;

        const accuracy = (this.correctChars / this.totalChars) * 100;
        return Math.round(accuracy);
    }

    // Get elapsed time in seconds
    getElapsedTime() {
        if (!this.startTime) return 0;
        return Math.round((Date.now() - this.startTime) / 1000);
    }

    // Format time as MM:SS
    getFormattedTime() {
        const seconds = this.getElapsedTime();
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Get current streak
    getCurrentStreak() {
        return this.currentStreak;
    }

    // Get max streak
    getMaxStreak() {
        return this.maxStreak;
    }

    // End session and get final stats
    end() {
        this.endTime = Date.now();

        return {
            wpm: this.calculateWPM(),
            accuracy: this.calculateAccuracy(),
            time: this.getElapsedTime(),
            formattedTime: this.getFormattedTime(),
            totalChars: this.totalChars,
            correctChars: this.correctChars,
            incorrectChars: this.incorrectChars,
            maxStreak: this.maxStreak
        };
    }

    // Calculate bananas earned based on performance
    calculateBananas(stats) {
        let bananas = 0;

        // Base bananas from WPM (1 banana per 5 WPM)
        bananas += Math.floor(stats.wpm / 5);

        // Accuracy bonus (10 bananas for 100%, 5 for 95%+, 2 for 90%+)
        if (stats.accuracy === 100) {
            bananas += 10;
        } else if (stats.accuracy >= 95) {
            bananas += 5;
        } else if (stats.accuracy >= 90) {
            bananas += 2;
        }

        // Streak bonus (1 banana per 10 streak)
        bananas += Math.floor(stats.maxStreak / 10);

        // Minimum 1 banana for completing
        return Math.max(1, bananas);
    }

    // Get performance grade
    getGrade(wpm, accuracy) {
        if (wpm >= 70 && accuracy >= 95) return 'S'; // Perfect
        if (wpm >= 60 && accuracy >= 90) return 'A'; // Excellent
        if (wpm >= 50 && accuracy >= 85) return 'B'; // Great
        if (wpm >= 40 && accuracy >= 80) return 'C'; // Good
        if (wpm >= 30 && accuracy >= 75) return 'D'; // Fair
        return 'E'; // Keep practicing
    }

    // Get live stats for display during typing
    getLiveStats() {
        return {
            wpm: this.calculateWPM(),
            accuracy: this.calculateAccuracy(),
            time: this.getFormattedTime(),
            streak: this.currentStreak
        };
    }

    // Check if milestone reached (for achievements)
    checkMilestones(stats) {
        const milestones = [];

        // WPM milestones
        if (stats.wpm >= 50) milestones.push('speed_demon');
        if (stats.wpm >= 70) milestones.push('typing_master');

        // Accuracy milestones
        if (stats.accuracy === 100) milestones.push('perfect_accuracy');
        if (stats.accuracy >= 95) milestones.push('high_accuracy');

        // Streak milestones
        if (stats.maxStreak >= 50) milestones.push('streak_champion');
        if (stats.maxStreak >= 100) milestones.push('combo_master');

        return milestones;
    }

    // Calculate improvement percentage
    calculateImprovement(currentWPM, previousBest) {
        if (previousBest === 0) return 0;
        const improvement = ((currentWPM - previousBest) / previousBest) * 100;
        return Math.round(improvement);
    }
}

// Export singleton instance
const stats = new StatsCalculator();
export default stats;
