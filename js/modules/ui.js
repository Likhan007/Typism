// UI Module - DOM manipulation and rendering

class UIRenderer {
    constructor() {
        this.elements = {};
    }

    // Cache DOM elements
    cacheElements() {
        // Screens
        this.elements.homeScreen = document.getElementById('home-screen');
        this.elements.typingScreen = document.getElementById('typing-screen');
        this.elements.resultsScreen = document.getElementById('results-screen');
        this.elements.collectionScreen = document.getElementById('collection-screen');
        this.elements.settingsScreen = document.getElementById('settings-screen');

        // Home screen elements
        this.elements.bestWPM = document.getElementById('best-wpm');
        this.elements.animalsUnlocked = document.getElementById('animals-unlocked');
        this.elements.bananaCount = document.getElementById('banana-count');
        this.elements.typingTree = document.getElementById('typing-tree');
        this.elements.treeLeaves = document.getElementById('tree-leaves');

        // Typing screen elements
        this.elements.textDisplay = document.getElementById('text-display');
        this.elements.ghostOverlay = document.getElementById('ghost-overlay');
        this.elements.liveWPM = document.getElementById('live-wpm');
        this.elements.liveAccuracy = document.getElementById('live-accuracy');
        this.elements.liveTimer = document.getElementById('live-timer');
        this.elements.liveStreak = document.getElementById('live-streak');
        this.elements.animalAvatar = document.getElementById('animal-avatar');
        this.elements.avatarImage = document.getElementById('avatar-image');
        this.elements.ghostAvatar = document.getElementById('ghost-avatar');
        this.elements.ghostAvatarImage = document.getElementById('ghost-avatar-image');
        this.elements.comboEffect = document.getElementById('combo-effect');
        this.elements.powerUpsContainer = document.getElementById('power-ups-container');

        // Results screen elements
        this.elements.resultWPM = document.getElementById('result-wpm');
        this.elements.resultAccuracy = document.getElementById('result-accuracy');
        this.elements.resultTime = document.getElementById('result-time');
        this.elements.resultBananas = document.getElementById('result-bananas');
        this.elements.animalUnlockContainer = document.getElementById('animal-unlock-container');

        // Collection screen elements
        this.elements.animalsGrid = document.getElementById('animals-grid');
        this.elements.eggsContainer = document.getElementById('eggs-container');
    }

    // Show specific screen
    showScreen(screenName) {
        // Hide all screens
        Object.entries(this.elements).forEach(([key, element]) => {
            if (key.includes('Screen') && element) {
                element.classList.remove('active');
            }
        });

        // Show requested screen
        const screenElement = this.elements[`${screenName}Screen`];
        if (screenElement) {
            screenElement.classList.add('active');
        }
    }

    // Update home screen stats
    updateHomeStats(bestWPM, animalsUnlocked, bananas) {
        if (this.elements.bestWPM) {
            this.elements.bestWPM.textContent = bestWPM;
        }
        if (this.elements.animalsUnlocked) {
            this.elements.animalsUnlocked.textContent = animalsUnlocked;
        }
        if (this.elements.bananaCount) {
            this.elements.bananaCount.textContent = bananas;
        }
    }

    // Render text for typing
    renderTextDisplay(text) {
        if (!this.elements.textDisplay) return;

        this.elements.textDisplay.innerHTML = '';

        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.dataset.index = index;
            this.elements.textDisplay.appendChild(span);
        });
    }

    // Update character highlighting
    updateCharHighlight(index, status) {
        if (!this.elements.textDisplay) return;

        const span = this.elements.textDisplay.querySelector(`[data-index="${index}"]`);
        if (!span) return;

        // Remove all status classes
        span.classList.remove('correct', 'incorrect', 'current');

        // Add appropriate class
        if (status === 'correct') {
            span.classList.add('correct');
        } else if (status === 'incorrect') {
            span.classList.add('incorrect');
            span.classList.add('error-wobble');
        } else if (status === 'current') {
            span.classList.add('current');
        }
    }

    // Update current character cursor
    updateCurrentCharacter(index) {
        if (!this.elements.textDisplay) return;

        // Remove current class from all spans
        const spans = this.elements.textDisplay.querySelectorAll('span');
        spans.forEach(span => span.classList.remove('current'));

        // Add current class to active span
        const currentSpan = this.elements.textDisplay.querySelector(`[data-index="${index}"]`);
        if (currentSpan) {
            currentSpan.classList.add('current');
        }
    }

    // Update live stats
    updateLiveStats(stats) {
        if (this.elements.liveWPM) {
            this.elements.liveWPM.textContent = stats.wpm;
        }
        if (this.elements.liveAccuracy) {
            this.elements.liveAccuracy.textContent = `${stats.accuracy}%`;
        }
        if (this.elements.liveTimer) {
            this.elements.liveTimer.textContent = stats.time;
        }
        if (this.elements.liveStreak) {
            this.elements.liveStreak.textContent = `${stats.streak}🔥`;
        }
    }

    // Show combo effect
    showComboEffect(streak) {
        if (!this.elements.comboEffect) return;

        const messages = [
            'Great!',
            'Amazing!',
            'Fantastic!',
            'On Fire! 🔥',
            'Unstoppable! ⚡',
            'LEGENDARY! 🏆'
        ];

        const messageIndex = Math.min(Math.floor(streak / 10), messages.length - 1);
        this.elements.comboEffect.textContent = messages[messageIndex];
        this.elements.comboEffect.classList.remove('show');

        // Trigger reflow to restart animation
        void this.elements.comboEffect.offsetWidth;

        this.elements.comboEffect.classList.add('show');
    }

    // Update animal avatar position
    updateAnimalPosition(percentage) {
        if (!this.elements.animalAvatar) return;
        this.elements.animalAvatar.style.left = `${Math.min(percentage, 95)}%`;
    }

    // Update ghost avatar position
    updateGhostPosition(percentage) {
        if (!this.elements.ghostAvatar) return;
        this.elements.ghostAvatar.style.left = `${Math.min(percentage, 95)}%`;
    }

    // Set animal avatar image
    setAnimalAvatar(imagePath) {
        // Find or create sprite divs
        let avatarSprite = this.elements.animalAvatar?.querySelector('.sprite');
        let ghostSprite = this.elements.ghostAvatar?.querySelector('.sprite');

        if (!avatarSprite && this.elements.avatarImage) {
            // Convert img to sprite div
            avatarSprite = document.createElement('div');
            avatarSprite.className = 'sprite';
            this.elements.avatarImage.replaceWith(avatarSprite);
            this.elements.avatarImage = avatarSprite;
        }

        if (!ghostSprite && this.elements.ghostAvatarImage) {
            // Convert img to sprite div
            ghostSprite = document.createElement('div');
            ghostSprite.className = 'sprite';
            this.elements.ghostAvatarImage.replaceWith(ghostSprite);
            this.elements.ghostAvatarImage = ghostSprite;
        }

        // Set background image
        if (avatarSprite) {
            avatarSprite.style.backgroundImage = `url('${imagePath}')`;
        }
        if (ghostSprite) {
            ghostSprite.style.backgroundImage = `url('${imagePath}')`;
        }
    }

    // Show results screen with stats
    showResults(stats, bananas, newAnimal) {
        if (this.elements.resultWPM) {
            this.elements.resultWPM.textContent = stats.wpm;
        }
        if (this.elements.resultAccuracy) {
            this.elements.resultAccuracy.textContent = `${stats.accuracy}%`;
        }
        if (this.elements.resultTime) {
            this.elements.resultTime.textContent = stats.formattedTime;
        }
        if (this.elements.resultBananas) {
            this.elements.resultBananas.textContent = `+${bananas} 🍌`;
        }

        // Show animal unlock if new
        if (newAnimal && this.elements.animalUnlockContainer) {
            this.elements.animalUnlockContainer.innerHTML = `
                <div class="animal-unlock">
                    <img src="${newAnimal.image}" alt="${newAnimal.name}" class="unlock-animal-image">
                    <h3 class="unlock-title">🎉 New Animal Unlocked!</h3>
                    <p class="unlock-description">${newAnimal.emoji} ${newAnimal.name}</p>
                    <p class="unlock-description">${newAnimal.description}</p>
                </div>
            `;
        } else {
            this.elements.animalUnlockContainer.innerHTML = '';
        }

        this.showScreen('results');
    }

    // Render animal collection grid
    renderAnimalCollection(animals, unlockedAnimals) {
        if (!this.elements.animalsGrid) return;

        this.elements.animalsGrid.innerHTML = '';
        const unlockedSet = new Set(unlockedAnimals);

        animals.forEach(animal => {
            const isUnlocked = unlockedSet.has(animal.id);
            const card = document.createElement('div');
            card.className = `animal-card ${isUnlocked ? '' : 'locked'}`;
            card.dataset.animalId = animal.id;

            card.innerHTML = `
                ${isUnlocked ? '' : '<div class="lock-icon" style="position: absolute; top: 10px; right: 10px; font-size: 2rem;">🔒</div>'}
                <div class="sprite" style="width: 100%; height: 150px; background-image: url('${animal.image}'); background-size: 200% 200%; background-repeat: no-repeat; background-position: 0% 0%;"></div>
                <div class="animal-name">${animal.emoji} ${animal.name}</div>
                <div class="animal-requirement">
                    ${isUnlocked ?
                    '<span style="color: #66ff66;">✅ Unlocked</span>' :
                    `${animal.minWPM} WPM to unlock`
                }
                </div>
                <div class="animal-description">${animal.description}</div>
            `;

            this.elements.animalsGrid.appendChild(card);
        });
    }

    // Update typing tree growth
    updateTreeGrowth(level) {
        if (!this.elements.typingTree) return;
        this.elements.typingTree.setAttribute('data-level', level);

        if (this.elements.treeLeaves) {
            this.elements.treeLeaves.classList.add('growing');
            setTimeout(() => {
                this.elements.treeLeaves.classList.remove('growing');
            }, 1000);
        }
    }

    // Add fireflies for night mode
    addFireflies() {
        const backgrounds = document.querySelectorAll('.jungle-background');
        backgrounds.forEach(bg => {
            for (let i = 0; i < 6; i++) {
                const firefly = document.createElement('div');
                firefly.className = 'firefly';
                firefly.style.left = `${Math.random() * 100}%`;
                firefly.style.top = `${Math.random() * 100}%`;
                bg.appendChild(firefly);
            }
        });
    }

    // Remove fireflies
    removeFireflies() {
        const fireflies = document.querySelectorAll('.firefly');
        fireflies.forEach(f => f.remove());
    }

    // Show confetti effect
    showConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }
}

// Export singleton instance
const ui = new UIRenderer();
export default ui;
