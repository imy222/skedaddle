# Skedaddle

A runner game where you dodge obstacles and collect coins while racing against increasing difficulty.

## Game Features

### Core Mechanics
- Jump and move to avoid obstacles
- Collect coins to increase your score
- Powerups activate every 10 points
- Dynamic difficulty scaling

### Controls
- **Space/Up Arrow**: Jump
- **Left/Right Arrow**: Move horizontally
- **Mouse**: Click buttons for menu interactions

### Powerup System
- Triggers at every 10 points
- Lasts 10 seconds
- Increases character size by 1.5x
- Allows destroying obstacles during powerup state

### Difficulty Scaling
The game becomes progressively harder over time:

#### Time-based Progression
- Difficulty increases every 15 seconds
- Maximum of 5 difficulty increases (1m15s total scaling)
- Visual "Speed Up!" indicator when difficulty increases

#### Speed Scaling
Initial speeds:
- Obstacle Speed: -300
- Coin Speed: -250

Each difficulty increase:
- All speeds increase by 10%
- Spawn intervals decrease by 10%

Difficulty progression example:
```
Start:
- Obstacle Speed: -300
- Coin Speed: -250
- Spawn Time: 2000-4000ms

After 15s (1st increase):
- Obstacle Speed: -330
- Coin Speed: -275
- Spawn Time: 1800-3600ms

After 30s (2nd increase):
- Obstacle Speed: -363
- Coin Speed: -302.5
- Spawn Time: 1620-3240ms

Final Stage (after 1m15s):
- Obstacle Speed: -483
- Coin Speed: -402.5
- Spawn Time: 1180-2360ms
```

## Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Local development server (e.g., Live Server)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/skedaddle.git
```

2. Navigate to the project directory
```bash
cd skedaddle
```

3. Start a local server (using Live Server)
```bash
npx live-server --port=5500
```

## Development

### Asset Structure
```
assets/
  ├── background/     # Parallax backgrounds
  ├── character/      # Character animations
  ├── coins/         # Coin sprites and effects
  ├── obstacles/     # Game obstacles
  └── powerups/      # Powerup effects
```

### Key Files
- `index.html`: Main game file
- `js/scenes/`: Game scene files
  - `BootScene.js`: Asset loading
  - `MenuScene.js`: Main menu
  - `GameScene.js`: Core gameplay
  - `GameOverScene.js`: Game over screen

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 