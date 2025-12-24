// Storage Manager Module - Handles localStorage operations

const STORAGE_KEYS = {
    BEST_WPM: 'jta_bestWPM',
    ACCURACY_HISTORY: 'jta_accuracyHistory',
    UNLOCKED_ANIMALS: 'jta_unlockedAnimals',
    GHOST_DATA: 'jta_ghostData',
    SETTINGS: 'jta_settings',
    BANANAS: 'jta_bananas',
    SESSIONS_COMPLETED: 'jta_sessionsCompleted',
    MYSTERY_EGGS: 'jta_mysteryEggs',
    DAILY_CHALLENGE: 'jta_dailyChallenge',
    TREE_LEVEL: 'jta_treeLevel'
};

class StorageManager {
    constructor() {
        this.isAvailable = this.checkLocalStorage();
    }

    checkLocalStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    }

    // Get data with fallback
    get(key, defaultValue = null) {
        if (!this.isAvailable) return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    }

    // Set data
    set(key, value) {
        if (!this.isAvailable) return false;
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    }

    // Best WPM
    getBestWPM() {
        return this.get(STORAGE_KEYS.BEST_WPM, 0);
    }

    saveBestWPM(wpm) {
        const currentBest = this.getBestWPM();
        if (wpm > currentBest) {
            this.set(STORAGE_KEYS.BEST_WPM, wpm);
            return true; // New record!
        }
        return false;
    }

    // Accuracy History
    getAccuracyHistory() {
        return this.get(STORAGE_KEYS.ACCURACY_HISTORY, []);
    }

    saveAccuracyHistory(accuracy) {
        const history = this.getAccuracyHistory();
        history.push({
            accuracy: accuracy,
            timestamp: Date.now()
        });
        // Keep only last 50 entries
        if (history.length > 50) {
            history.shift();
        }
        this.set(STORAGE_KEYS.ACCURACY_HISTORY, history);
    }

    // Unlocked Animals
    getUnlockedAnimals() {
        return this.get(STORAGE_KEYS.UNLOCKED_ANIMALS, ['snail']);
    }

    unlockAnimal(animalId) {
        const unlocked = new Set(this.getUnlockedAnimals());
        const wasLocked = !unlocked.has(animalId);
        unlocked.add(animalId);
        this.set(STORAGE_KEYS.UNLOCKED_ANIMALS, Array.from(unlocked));
        return wasLocked; // Return true if this is a new unlock
    }

    isAnimalUnlocked(animalId) {
        const unlocked = new Set(this.getUnlockedAnimals());
        return unlocked.has(animalId);
    }

    // Ghost Data (keystroke timestamps from best run)
    getGhostData() {
        return this.get(STORAGE_KEYS.GHOST_DATA, null);
    }

    saveGhostData(data) {
        // Cap at 1000 keystrokes to prevent bloat
        if (data.keystrokes && data.keystrokes.length > 1000) {
            data.keystrokes = data.keystrokes.slice(0, 1000);
        }
        this.set(STORAGE_KEYS.GHOST_DATA, data);
    }

    // Settings
    getSettings() {
        return this.get(STORAGE_KEYS.SETTINGS, {
            soundEnabled: true,
            musicEnabled: true,
            nightMode: false,
            difficulty: 'medium',
            fontSize: 'medium'
        });
    }

    saveSettings(settings) {
        this.set(STORAGE_KEYS.SETTINGS, settings);
    }

    // Bananas (points)
    getBananas() {
        return this.get(STORAGE_KEYS.BANANAS, 0);
    }

    addBananas(amount) {
        const current = this.getBananas();
        this.set(STORAGE_KEYS.BANANAS, current + amount);
        return current + amount;
    }

    // Sessions Completed
    getSessionsCompleted() {
        return this.get(STORAGE_KEYS.SESSIONS_COMPLETED, 0);
    }

    incrementSessions() {
        const count = this.getSessionsCompleted() + 1;
        this.set(STORAGE_KEYS.SESSIONS_COMPLETED, count);
        return count;
    }

    // Mystery Eggs
    getMysteryEggs() {
        return this.get(STORAGE_KEYS.MYSTERY_EGGS, []);
    }

    addMysteryEgg() {
        const eggs = this.getMysteryEggs();
        const eggId = `egg_${Date.now()}`;
        eggs.push({ id: eggId, hatched: false });
        this.set(STORAGE_KEYS.MYSTERY_EGGS, eggs);
        return eggId;
    }

    hatchEgg(eggId) {
        const eggs = this.getMysteryEggs();
        const egg = eggs.find(e => e.id === eggId);
        if (egg) {
            egg.hatched = true;
            egg.animal = this.getRandomLegendaryAnimal();
            this.set(STORAGE_KEYS.MYSTERY_EGGS, eggs);
            return egg.animal;
        }
        return null;
    }

    getRandomLegendaryAnimal() {
        const legendary = ['parrot', 'butterfly', 'chameleon'];
        return legendary[Math.floor(Math.random() * legendary.length)];
    }

    // Daily Challenge
    getDailyChallenge() {
        return this.get(STORAGE_KEYS.DAILY_CHALLENGE, {
            lastDate: null,
            completed: false
        });
    }

    checkDailyChallenge() {
        const today = new Date().toDateString();
        const challenge = this.getDailyChallenge();

        if (challenge.lastDate !== today) {
            // New day, reset challenge
            this.set(STORAGE_KEYS.DAILY_CHALLENGE, {
                lastDate: today,
                completed: false
            });
            return false; // Not completed
        }

        return challenge.completed;
    }

    completeDailyChallenge() {
        const today = new Date().toDateString();
        this.set(STORAGE_KEYS.DAILY_CHALLENGE, {
            lastDate: today,
            completed: true
        });
    }

    // Typing Tree Level
    getTreeLevel() {
        return this.get(STORAGE_KEYS.TREE_LEVEL, 1);
    }

    growTree() {
        const currentLevel = this.getTreeLevel();
        const newLevel = Math.min(currentLevel + 1, 5);
        this.set(STORAGE_KEYS.TREE_LEVEL, newLevel);
        return newLevel;
    }

    // Clear all data (for testing)
    clearAll() {
        if (!this.isAvailable) return;
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}

// Export singleton instance
const storage = new StorageManager();
export default storage;
