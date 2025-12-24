// Main App Controller - Ties all modules together

import storage from './modules/storage.js';
import sound from './modules/sound.js';
import stats from './modules/stats.js';
import animals from './modules/animals.js';
import ghost from './modules/ghost.js';
import typingEngine from './modules/typing-engine.js';
import ui from './modules/ui.js';
import textContent from './data/text-content.js';

class JungleTypingApp {
    constructor() {
        this.currentText = '';
        this.liveStatsInterval = null;
        this.isDailyChallenge = false;
    }

    // Initialize the app
    init() {
        console.log('🐾 Jungle Typing Adventure - Initializing...');

        // Cache UI elements
        ui.cacheElements();

        // Load settings
        this.loadSettings();

        // Set up event listeners
        this.setupEventListeners();

        // Update home screen stats
        this.updateHomeScreen();

        // Show home screen
        ui.showScreen('home');

        console.log('✅ App ready!');
    }

    // Load and apply settings
    loadSettings() {
        const settings = storage.getSettings();

        // Apply font size
        document.body.className = `font-${settings.fontSize}`;

        // Apply night mode
        if (settings.nightMode) {
            document.body.classList.add('night-mode');
            ui.addFireflies();
        }

        // Apply sound settings
        sound.setMuteState(!settings.soundEnabled, !settings.musicEnabled);

        // Set text difficulty
        textContent.setDifficulty(settings.difficulty);

        // Update settings UI
        document.getElementById('sound-toggle').checked = settings.soundEnabled;
        document.getElementById('music-toggle').checked = settings.musicEnabled;
        document.getElementById('nightmode-toggle').checked = settings.nightMode;
        document.getElementById('difficulty-select').value = settings.difficulty;
        document.getElementById('font-size-select').value = settings.fontSize;
    }

    // Set up all event listeners
    setupEventListeners() {
        // Home screen buttons
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.startGame(false);
        });

        document.getElementById('view-animals-btn').addEventListener('click', () => {
            this.showAnimalCollection();
        });

        document.getElementById('daily-challenge-btn').addEventListener('click', () => {
            this.startDailyChallenge();
        });

        document.getElementById('settings-btn').addEventListener('click', () => {
            ui.showScreen('settings');
        });

        // Typing screen
        document.getElementById('quit-typing-btn').addEventListener('click', () => {
            this.quitTyping();
        });

        // Results screen buttons
        document.getElementById('retry-btn').addEventListener('click', () => {
            this.startGame(false);
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.startGame(false);
        });

        document.getElementById('home-from-results-btn').addEventListener('click', () => {
            this.updateHomeScreen();
            ui.showScreen('home');
        });

        // Collection screen
        document.getElementById('back-from-collection-btn').addEventListener('click', () => {
            ui.showScreen('home');
        });

        // Settings screen
        document.getElementById('back-from-settings-btn').addEventListener('click', () => {
            this.saveSettings();
            ui.showScreen('home');
        });

        // Settings toggles
        document.getElementById('sound-toggle').addEventListener('change', (e) => {
            sound.setMuteState(!e.target.checked, sound.isMusicMuted);
        });

        document.getElementById('music-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                sound.startAmbience();
            } else {
                sound.stopAmbience();
            }
        });

        document.getElementById('nightmode-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('night-mode');
                ui.addFireflies();
            } else {
                document.body.classList.remove('night-mode');
                ui.removeFireflies();
            }
        });

        document.getElementById('difficulty-select').addEventListener('change', (e) => {
            textContent.setDifficulty(e.target.value);
        });

        document.getElementById('font-size-select').addEventListener('change', (e) => {
            document.body.className = document.body.className.replace(/font-\w+/, `font-${e.target.value}`);
        });

        // Reset progress button
        document.getElementById('reset-progress-btn').addEventListener('click', () => {
            this.resetProgress();
        });

        // Global keydown for typing
        document.addEventListener('keydown', (e) => {
            if (typingEngine.isTypingActive()) {
                e.preventDefault();
                this.handleKeyPress(e.key);
            }
        });

        // Click anywhere to start typing (user interaction for audio)
        document.addEventListener('click', () => {
            sound.resume();
        }, { once: true });
    }

    // Update home screen with latest stats
    updateHomeScreen() {
        const bestWPM = storage.getBestWPM();
        const unlockedAnimals = storage.getUnlockedAnimals();
        const bananas = storage.getBananas();
        const treeLevel = storage.getTreeLevel();

        // Convert to Set if it's an array from localStorage
        const unlockedSet = Array.isArray(unlockedAnimals) ? new Set(unlockedAnimals) : unlockedAnimals;
        ui.updateHomeStats(bestWPM, `${unlockedSet.size}/${animals.getTotalAnimals()}`, bananas);
        ui.updateTreeGrowth(treeLevel);
    }

    // Start regular game
    startGame(isDailyChallenge = false) {
        this.isDailyChallenge = isDailyChallenge;

        // Get text
        this.currentText = isDailyChallenge ?
            textContent.getDailyChallengeText() :
            textContent.getRandomText();

        // Initialize typing engine
        typingEngine.init(this.currentText);

        // Initialize stats
        stats.start();

        // Set up typing engine callbacks
        typingEngine.setCallbacks(
            (streak) => this.onCorrectKey(streak),
            () => this.onIncorrectKey(),
            () => this.onTypingComplete()
        );

        // Render text
        ui.renderTextDisplay(this.currentText);
        ui.updateCurrentCharacter(0);

        // Load and start ghost
        ghost.load(storage);
        const hasGhost = ghost.start(this.currentText.length);

        // Set avatar image
        const currentAnimal = animals.getAnimalForWPM(storage.getBestWPM());
        ui.setAnimalAvatar(currentAnimal.image);

        // Reset positions
        ui.updateAnimalPosition(0);
        if (hasGhost) {
            ui.updateGhostPosition(0);
        }

        // Show typing screen
        ui.showScreen('typing');

        // Start live stats updates
        this.startLiveStatsUpdate();

        // Activate typing (timer starts on first keystroke)
        typingEngine.start();

        console.log('🎮 Game started!', { text: this.currentText });
    }

    // Start daily challenge
    startDailyChallenge() {
        const completed = storage.checkDailyChallenge();

        if (completed) {
            alert('🎉 You already completed today\'s challenge! Come back tomorrow for a new one!');
            return;
        }

        this.startGame(true);
    }

    // Handle key press
    handleKeyPress(key) {
        const result = typingEngine.processKey(key, stats);

        if (!result) return;

        if (result.action === 'backspace') {
            ui.updateCharHighlight(result.index, 'current');
            ui.updateCurrentCharacter(result.index);
        } else {
            ui.updateCharHighlight(result.index, result.correct ? 'correct' : 'incorrect');
            ui.updateCurrentCharacter(result.index + 1);

            // Play sound
            if (result.correct) {
                sound.playKeypress();
            } else {
                sound.playMistake();
            }
        }

        // Update progress
        const progress = typingEngine.getProgress();
        ui.updateAnimalPosition(progress);
    }

    // On correct key
    onCorrectKey(streak) {
        // Show combo effect for streaks
        if (streak > 0 && streak % 10 === 0) {
            ui.showComboEffect(streak);
            sound.playCombo(streak / 10);
        }
    }

    // On incorrect key
    onIncorrectKey() {
        // Visual feedback handled in handleKeyPress
    }

    // On typing complete
    onTypingComplete() {
        console.log('✅ Typing complete!');

        // Stop live stats
        this.stopLiveStatsUpdate();

        // Get final stats
        const finalStats = stats.end();

        // Calculate bananas
        const bananasEarned = stats.calculateBananas(finalStats);
        const totalBananas = storage.addBananas(bananasEarned);

        // Save best WPM
        const isNewRecord = storage.saveBestWPM(finalStats.wpm);

        // Save accuracy history
        storage.saveAccuracyHistory(finalStats.accuracy);

        // Check for new animal unlock
        const unlockedAnimals = storage.getUnlockedAnimals();
        const newAnimal = animals.checkUnlock(finalStats.wpm, unlockedAnimals);

        if (newAnimal) {
            storage.unlockAnimal(newAnimal.id);
            sound.playUnlock();
            ui.showConfetti();
        } else {
            sound.playSuccess();
        }

        // Save ghost data if better
        if (ghost.shouldSave(finalStats.wpm)) {
            const ghostData = ghost.recordSession(
                typingEngine.getKeystrokes(),
                this.currentText.length,
                finalStats.wpm
            );
            storage.saveGhostData(ghostData);
        }

        // Increment sessions and check for mystery egg
        const sessionsCompleted = storage.incrementSessions();
        if (sessionsCompleted % 5 === 0) {
            storage.addMysteryEgg();
            console.log('🥚 Mystery egg earned!');
        }

        // Grow typing tree
        if (sessionsCompleted % 3 === 0) {
            storage.growTree();
        }

        // Complete daily challenge
        if (this.isDailyChallenge) {
            storage.completeDailyChallenge();
        }

        // Show results
        ui.showResults(finalStats, bananasEarned, newAnimal);

        console.log('📊 Final Stats:', finalStats);
    }

    // Start live stats update
    startLiveStatsUpdate() {
        this.liveStatsInterval = setInterval(() => {
            const liveStats = stats.getLiveStats();
            ui.updateLiveStats(liveStats);

            // Update ghost position
            const ghostUpdate = ghost.update();
            if (ghostUpdate) {
                ui.updateGhostPosition(ghostUpdate.percentage);
            }
        }, 100);
    }

    // Stop live stats update
    stopLiveStatsUpdate() {
        if (this.liveStatsInterval) {
            clearInterval(this.liveStatsInterval);
            this.liveStatsInterval = null;
        }
    }

    // Quit typing session
    quitTyping() {
        typingEngine.stop();
        this.stopLiveStatsUpdate();
        ui.showScreen('home');
    }

    // Show animal collection
    showAnimalCollection() {
        const allAnimals = animals.getAllAnimals();
        const unlockedAnimals = Array.from(storage.getUnlockedAnimals());

        ui.renderAnimalCollection(allAnimals, unlockedAnimals);
        ui.showScreen('collection');
    }

    // Save settings
    saveSettings() {
        const settings = {
            soundEnabled: document.getElementById('sound-toggle').checked,
            musicEnabled: document.getElementById('music-toggle').checked,
            nightMode: document.getElementById('nightmode-toggle').checked,
            difficulty: document.getElementById('difficulty-select').value,
            fontSize: document.getElementById('font-size-select').value
        };

        storage.saveSettings(settings);
        console.log('⚙️ Settings saved:', settings);
    }

    // Reset all progress
    resetProgress() {
        const confirmed = confirm('⚠️ Are you sure you want to reset ALL progress?\n\nThis will clear:\n- All unlocked animals\n- Best WPM score\n- Banana count\n- All achievements\n- Ghost data\n\nThis action cannot be undone!');

        if (confirmed) {
            // Clear all data
            storage.clearAll();

            // Show success message
            alert('✅ All progress has been reset!\n\nThe game will reload with fresh data.');

            // Reload the page
            window.location.reload();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new JungleTypingApp();
    app.init();
});
