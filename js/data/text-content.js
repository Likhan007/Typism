// Text Content Library - Jungle-themed typing texts

const TEXTS = {
    easy: [
        "The frog jumps high",
        "Monkeys eat bananas",
        "Birds fly in the sky",
        "Tigers are very fast",
        "Elephants are big",
        "Snakes move slowly",
        "Parrots are colorful",
        "The jungle is green",
        "Lions roar loudly",
        "Bears climb trees"
    ],
    medium: [
        "Colorful parrots fly through the jungle canopy",
        "The monkey swings from tree to tree with ease",
        "Tigers prowl silently through the tall grass",
        "Elephants trumpet loudly by the river bank",
        "Butterflies dance around the blooming flowers",
        "Sloths move slowly through the forest branches",
        "Toucans perch on the highest jungle trees",
        "Jaguars hunt stealthily in the moonlight",
        "Frogs croak loudly near the jungle pond",
        "Chameleons change colors to hide from danger",
        "Deer run swiftly through the forest paths",
        "Snakes slither quietly across the jungle floor",
        "Gorillas beat their chests in the morning",
        "Pandas munch on bamboo all day long",
        "The jungle comes alive with animal sounds"
    ],
    hard: [
        "The magnificent jaguar prowls silently through the dense undergrowth looking for prey",
        "Colorful macaws squawk loudly as they soar above the lush green jungle canopy",
        "Playful monkeys swing gracefully from vine to vine while chattering to their friends",
        "The enormous elephant carefully makes its way to the crystal clear watering hole",
        "Tiny hummingbirds hover delicately near vibrant tropical flowers collecting sweet nectar",
        "Sleepy sloths hang upside down from sturdy branches munching on fresh green leaves",
        "Mysterious sounds echo through the misty jungle as twilight descends upon the forest",
        "Brightly colored poison dart frogs hop between moss-covered rocks near the rushing stream",
        "The wise old tortoise slowly ambles along the winding path through the ancient jungle",
        "Majestic birds of paradise display their stunning plumage during elaborate mating dances",
        "Skilled chameleons blend seamlessly with their surroundings using incredible camouflage abilities",
        "Powerful gorillas protect their family groups while foraging for fruits and vegetation",
        "Graceful deer leap effortlessly over fallen logs as they navigate the forest floor",
        "Industrious leafcutter ants march in long lines carrying pieces of leaves to their nest",
        "The tropical rainforest teems with countless species of fascinating and exotic creatures"
    ]
};

class TextContentManager {
    constructor() {
        this.texts = TEXTS;
        this.currentDifficulty = 'medium';
        this.usedTexts = new Set();
    }

    // Get random text based on difficulty
    getRandomText(difficulty = null) {
        const diff = difficulty || this.currentDifficulty;
        const textsForDifficulty = this.texts[diff];

        if (!textsForDifficulty || textsForDifficulty.length === 0) {
            return "The jungle is full of amazing animals!";
        }

        // Reset used texts if all have been used
        if (this.usedTexts.size >= textsForDifficulty.length) {
            this.usedTexts.clear();
        }

        // Get unused text
        let text;
        let attempts = 0;
        do {
            text = textsForDifficulty[Math.floor(Math.random() * textsForDifficulty.length)];
            attempts++;
        } while (this.usedTexts.has(text) && attempts < 10);

        this.usedTexts.add(text);
        return text;
    }

    // Get daily challenge text (same text for same day)
    getDailyChallengeText() {
        // Use date as seed for consistent daily text
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);

        // Combine all texts for daily challenge
        const allTexts = [...this.texts.medium, ...this.texts.hard];
        const index = dayOfYear % allTexts.length;

        return allTexts[index];
    }

    // Set difficulty
    setDifficulty(difficulty) {
        if (this.texts[difficulty]) {
            this.currentDifficulty = difficulty;
            this.usedTexts.clear();
        }
    }

    // Get current difficulty
    getDifficulty() {
        return this.currentDifficulty;
    }

    // Add custom text (for future expansion)
    addCustomText(text, difficulty = 'medium') {
        if (this.texts[difficulty]) {
            this.texts[difficulty].push(text);
        }
    }

    // Get text stats
    getTextStats(text) {
        return {
            length: text.length,
            words: text.split(' ').length,
            difficulty: this.estimateDifficulty(text)
        };
    }

    // Estimate difficulty of text
    estimateDifficulty(text) {
        const length = text.length;
        if (length < 30) return 'easy';
        if (length < 70) return 'medium';
        return 'hard';
    }
}

// Export singleton instance
const textContent = new TextContentManager();
export default textContent;
