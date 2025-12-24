# 🐾 Jungle Typing Adventure

A kid-friendly browser-based typing game where players improve typing speed and accuracy while unlocking adorable jungle animals!

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🎮 Features

- **Fun Typing Gameplay**: Type jungle-themed texts and watch your progress!
- **8 Unlockable Animals**: From 🐌 Snail to 🐎 Horse, unlock animals as your WPM improves
- **Ghost Typing Rival**: Race against your previous best performance
- **Live Stats**: Real-time WPM, accuracy, and streak tracking
- **Beautiful Jungle Theme**: Vibrant colors, smooth animations, and kid-friendly design
- **Sound Effects & Music**: Ambient jungle sounds and feedback (toggleable)
- **Progress Rewards**: Earn bananas, grow your typing tree, and unlock mystery eggs
- **Daily Challenge**: New typing text every day for bonus rewards
- **Night Mode**: Switch to a peaceful nighttime jungle with fireflies
- **Fully Offline**: No internet required after initial load

## 🚀 Quick Start

### Option 1: Direct Open
1. Simply open `index.html` in any modern browser (Chrome, Edge, Firefox)
2. Start typing!

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000 in your browser
```

## 🎯 How to Play

1. **Start Adventure**: Click "Start Adventure" on the home screen
2. **Type the Text**: Type the jungle-themed sentence that appears
3. **Watch Your Progress**: See your WPM and accuracy update in real-time
4. **Unlock Animals**: Reach higher WPM thresholds to unlock faster animals
5. **Beat Your Ghost**: Try to type faster than your previous best run!

### WPM Tiers

| WPM Range | Animal | Emoji |
|-----------|--------|-------|
| 0-10 | Snail | 🐌 |
| 10-20 | Sloth | 🦥 |
| 20-30 | Turtle | 🐢 |
| 30-40 | Rabbit | 🐰 |
| 40-50 | Dog | 🐕 |
| 50-60 | Deer | 🦌 |
| 60-70 | Cheetah | 🐆 |
| 70+ | Horse | 🐎 |

## 📁 Project Structure

```
jungle-typing-adventure/
├── index.html              # Main HTML file
├── css/
│   ├── main.css           # Core styles
│   ├── jungle-theme.css   # Jungle visuals
│   └── animations.css     # Keyframe animations
├── js/
│   ├── app.js             # Main app controller
│   ├── modules/
│   │   ├── storage.js     # localStorage wrapper
│   │   ├── typing-engine.js # Core typing logic
│   │   ├── stats.js       # WPM/accuracy calculations
│   │   ├── ghost.js       # Ghost replay system
│   │   ├── animals.js     # Animal data & unlock logic
│   │   ├── sound.js       # Web Audio API sounds
│   │   └── ui.js          # DOM manipulation
│   └── data/
│       └── text-content.js # Typing text library
└── assets/
    └── animals/           # Animated animal sprites
        ├── snail.png
        ├── sloth.png
        └── ... (8 total)
```

## 🎨 Customization

### Adding Custom Texts
Edit `js/data/text-content.js` and add your texts to the appropriate difficulty array:

```javascript
easy: [
    "Your easy text here"
],
medium: [
    "Your medium text here"
],
hard: [
    "Your longer and harder text here"
]
```

### Changing Animals
1. Replace images in `assets/animals/` (keep the same filename)
2. Update animal data in `js/modules/animals.js` if needed

### Customizing Theme
Edit CSS variables in `css/main.css`:

```css
:root {
    --jungle-green: #1a5f3a;
    --banana-yellow: #ffd93d;
    /* ... more colors */
}
```

## 🔧 Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Animations
- **Vanilla JavaScript**: ES6+ modules
- **Web Audio API**: Sound effects
- **localStorage API**: Data persistence

**No frameworks required!** Pure web technologies for maximum performance and compatibility.

## 📊 Browser Support

- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## 🎓 Educational Benefits

Perfect for kids aged 6-14 to:
- Improve typing speed
- Increase accuracy
- Learn proper finger placement
- Build confidence through gamification
- Develop consistent practice habits

## 🐛 Troubleshooting

**Sounds not playing?**
- Click anywhere on the page first (browser autoplay policy)
- Check that sound/music toggles are enabled in settings

**Progress not saving?**
- Ensure localStorage is enabled in your browser
- Don't use private/incognito mode

**Animals not animating?**
- Make sure all image files are in `assets/animals/`
- Check browser console for any errors

## 📝 License

MIT License - feel free to use for personal or educational purposes!

## 🙏 Credits

Created with ❤️ for young typists everywhere!

Special thanks to all the jungle animals who volunteered to be in this game! 🦥🐆🐎

## 🎉 Future Enhancements

- Multiplayer race mode
- Custom word lists
- Achievement badges
- Leaderboard (optional online feature)
- More animal tiers
- Boss battles

---

**Happy Typing!** 🌿⌨️🐾
