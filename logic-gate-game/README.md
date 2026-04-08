# ⚡ Logic Gate Designer

An interactive puzzle game where you design logic circuits to solve truth table challenges. A Neal Fun-style browser game built with vanilla JavaScript.

## 🎮 How to Play

### Quick Start
1. **Click the tutorial** (❓ Help button) when you first load the game
2. **Place gates** by clicking gate types in the sidebar
3. **Connect gates** by clicking on the small ports (circles) on gates
4. **Match the truth table** shown in the "Target Pattern" section
5. **Advance levels** when your circuit works perfectly!

### Gate Types
- **AND**: Output 1 only when BOTH inputs are 1
- **OR**: Output 1 when AT LEAST ONE input is 1
- **NOT**: Output OPPOSITE of input (1 becomes 0, 0 becomes 1)
- **XOR**: Output 1 when inputs are DIFFERENT

### Truth Tables
Each level shows a truth table like:
```
0 0 → 0
0 1 → 1
1 0 → 1
1 1 → 0
```
This means: Input A=0, Input B=0 → Output should be 0, etc.

## 🎨 Features

- **Interactive Tutorial** - Complete guide for beginners
- **5 Progressive Levels** - From basic gates to complex circuits
- **Real-time Circuit Evaluation** - See if your design matches instantly
- **Drag-and-Drop Interface** - Intuitive gate placement and connections
- **Visual Feedback** - Glowing connections and hover effects
- **Hints System** - Get help when stuck
- **Neon Aesthetic** - Inspired by Neal Fun's visual style
- **No Dependencies** - Pure HTML/CSS/JavaScript

## 🚀 Getting Started

### Play Online (GitHub Pages)
1. Fork/clone this repo
2. Go to Settings → Pages → Select "main" branch
3. Your game will be live at `https://YOUR-USERNAME.github.io/logic-gate-game`

### Play Locally
1. Clone the repo: `git clone https://github.com/YOUR-USERNAME/logic-gate-game.git`
2. Double-click `index.html` to play in your browser
3. No server needed!

## 📁 Project Structure

```
logic-gate-game/
├── index.html      # Game structure & UI with tutorial modal
├── style.css       # Neon styling & animations
├── script.js       # Game logic & interactive tutorial
└── README.md       # This file
```

## 🎯 Level Guide

1. **AND Gate Basics** - Learn the fundamental AND operation
2. **OR Gate Basics** - Master the OR operation
3. **XOR Gate Basics** - Understand exclusive OR
4. **NOT Gate: Making NAND** - Combine gates for NAND logic
5. **Complex Logic** - Build XOR using multiple gates

## 🛠️ Customization

Edit `script.js` to add more levels:

```javascript
const LEVELS = [
    {
        name: 'Your Level Name',
        description: 'Your description',
        truth_table: [[0, 0, 0], [0, 1, 1], ...],
        hint: 'Your helpful hint here'
    },
    // Add more levels here
];
```

## 💡 Tips

- **Start simple** - Use basic gates before combining them
- **Think logically** - Map out the truth table on paper first
- **Use hints** - Click the 💡 Hint button if stuck
- **Clear and retry** - Use 🗑️ Clear Board to start over
- **Connect carefully** - Click ports to create/remove connections

## 🎉 Winning

When your circuit matches the truth table perfectly, you'll see "✓ Level Complete!" and can advance to the next challenge!

---

**Have fun building circuits!** 🔌✨

*Inspired by Neal Fun and classic logic puzzle games.*
        description: 'Your description',
        truth_table: [[0, 0, 0], [0, 1, 1], ...],
        gates_provided: []
    },
    // Add more levels here
];
```

## 🎯 Challenge Ideas

- Add a timer mode
- Create a "Minimal Gates" challenge
- Add more gate types (NAND, NOR)
- Implement level sharing via URL
- Add an undo/redo system

## 📄 License

MIT - Feel free to fork, modify, and share!

## 💡 Inspiration

Inspired by [Neal Fun](https://neal.fun) and the satisfying puzzle games like:
- Human Resource Machine
- TIS-100
- Zach-like

---

**Have fun building circuits!** 🔌✨
