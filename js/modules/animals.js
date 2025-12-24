// Animals Module - Animal data and unlock logic

const ANIMALS = [
    {
        id: 'snail',
        name: 'Snail',
        emoji: '🐌',
        minWPM: 0,
        maxWPM: 10,
        description: 'Slow and steady wins the race!',
        image: 'assets/animals/snail.png'
    },
    {
        id: 'sloth',
        name: 'Sloth',
        emoji: '🦥',
        minWPM: 10,
        maxWPM: 20,
        description: 'Taking it easy in the jungle',
        image: 'assets/animals/sloth.png'
    },
    {
        id: 'turtle',
        name: 'Turtle',
        emoji: '🐢',
        minWPM: 20,
        maxWPM: 30,
        description: 'Steady progress through the forest',
        image: 'assets/animals/turtle.png'
    },
    {
        id: 'rabbit',
        name: 'Rabbit',
        emoji: '🐰',
        minWPM: 30,
        maxWPM: 40,
        description: 'Hopping along nicely!',
        image: 'assets/animals/rabbit.png'
    },
    {
        id: 'dog',
        name: 'Dog',
        emoji: '🐕',
        minWPM: 40,
        maxWPM: 50,
        description: 'Running with enthusiasm!',
        image: 'assets/animals/dog.png'
    },
    {
        id: 'deer',
        name: 'Deer',
        emoji: '🦌',
        minWPM: 50,
        maxWPM: 60,
        description: 'Graceful and fast',
        image: 'assets/animals/deer.png'
    },
    {
        id: 'cheetah',
        name: 'Cheetah',
        emoji: '🐆',
        minWPM: 60,
        maxWPM: 70,
        description: 'Lightning speed through the jungle!',
        image: 'assets/animals/cheetah.png'
    },
    {
        id: 'horse',
        name: 'Horse',
        emoji: '🐎',
        minWPM: 70,
        maxWPM: 999,
        description: 'Champion of the jungle!',
        image: 'assets/animals/horse.png'
    }
];

// Legendary animals from mystery eggs
const LEGENDARY_ANIMALS = [
    {
        id: 'parrot',
        name: 'Parrot',
        emoji: '🦜',
        description: 'A colorful friend from the canopy!',
        image: 'assets/animals/parrot.png'
    },
    {
        id: 'butterfly',
        name: 'Butterfly',
        emoji: '🦋',
        description: 'Beautiful and graceful!',
        image: 'assets/animals/butterfly.png'
    },
    {
        id: 'chameleon',
        name: 'Chameleon',
        emoji: '🦎',
        description: 'Master of disguise!',
        image: 'assets/animals/chameleon.png'
    }
];

class AnimalsManager {
    constructor() {
        this.animals = ANIMALS;
        this.legendaryAnimals = LEGENDARY_ANIMALS;
    }

    // Get all animals
    getAllAnimals() {
        return this.animals;
    }

    // Get legendary animals
    getLegendaryAnimals() {
        return this.legendaryAnimals;
    }

    // Get animal for a specific WPM
    getAnimalForWPM(wpm) {
        return this.animals.find(animal =>
            wpm >= animal.minWPM && wpm < animal.maxWPM
        ) || this.animals[0];
    }

    // Get animal by ID
    getAnimalById(id) {
        let animal = this.animals.find(a => a.id === id);
        if (!animal) {
            animal = this.legendaryAnimals.find(a => a.id === id);
        }
        return animal || this.animals[0];
    }

    // Check if WPM unlocks new animal
    checkUnlock(wpm, currentUnlocked) {
        const animal = this.getAnimalForWPM(wpm);
        const unlockedSet = new Set(currentUnlocked);

        if (!unlockedSet.has(animal.id)) {
            return animal; // New unlock!
        }

        return null; // Already unlocked
    }

    // Get next animal to unlock
    getNextAnimalToUnlock(currentUnlocked) {
        const unlockedSet = new Set(currentUnlocked);
        return this.animals.find(animal => !unlockedSet.has(animal.id)) || null;
    }

    // Get progress percentage for next unlock
    getUnlockProgress(wpm, currentUnlocked) {
        const nextAnimal = this.getNextAnimalToUnlock(currentUnlocked);
        if (!nextAnimal) return 100; // All unlocked

        const currentAnimal = this.getAnimalForWPM(wpm);
        const range = nextAnimal.minWPM - currentAnimal.minWPM;
        const progress = wpm - currentAnimal.minWPM;

        return Math.min((progress / range) * 100, 100);
    }

    // Format animal card HTML
    formatAnimalCard(animal, isUnlocked) {
        const lockedClass = isUnlocked ? '' : 'locked';
        const lockIcon = isUnlocked ? '' : '<div class="lock-icon">🔒</div>';

        return `
            <div class="animal-card ${lockedClass}" data-animal-id="${animal.id}">
                ${lockIcon}
                <img src="${animal.image}" alt="${animal.name}" class="animal-image">
                <div class="animal-name">${animal.emoji} ${animal.name}</div>
                <div class="animal-requirement">
                    ${isUnlocked ?
                `<span class="unlocked-badge">✅ Unlocked</span>` :
                `${animal.minWPM} WPM to unlock`
            }
                </div>
                <div class="animal-description">${animal.description}</div>
            </div>
        `;
    }

    // Get animal for display based on current typing speed
    getCurrentAnimal(wpm) {
        return this.getAnimalForWPM(wpm);
    }

    // Get animal stats
    getAnimalStats(id) {
        const animal = this.getAnimalById(id);
        if (!animal) return null;

        return {
            id: animal.id,
            name: animal.name,
            emoji: animal.emoji,
            minWPM: animal.minWPM,
            maxWPM: animal.maxWPM,
            description: animal.description
        };
    }

    // Get total number of regular animals
    getTotalAnimals() {
        return this.animals.length;
    }

    // Get motivational message based on WPM
    getMotivationalMessage(wpm) {
        if (wpm < 10) return "Keep going! You're doing great! 🌟";
        if (wpm < 20) return "Nice progress! Keep practicing! 🎯";
        if (wpm < 30) return "You're getting faster! 🚀";
        if (wpm < 40) return "Excellent work! 💪";
        if (wpm < 50) return "Amazing speed! 🔥";
        if (wpm < 60) return "Incredible typing! ⚡";
        if (wpm < 70) return "Lightning fast! 💨";
        return "Champion typist! 🏆";
    }
}

// Export singleton instance
const animals = new AnimalsManager();
export default animals;
