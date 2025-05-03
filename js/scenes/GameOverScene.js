class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.score = data.score;
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Game Over text
    const gameOver = this.add.text(width / 2, height / 3, 'Game Over', {
      font: '64px monospace',
      fill: '#ffffff',
      stroke: '#6542be', // MYOB Purple
      strokeThickness: 6
    });
    gameOver.setOrigin(0.5);

    // Score display
    const scoreText = this.add.text(width / 2, height / 2, `Score: ${this.score}`, {
      font: '32px monospace',
      fill: '#ffffff'
    });
    scoreText.setOrigin(0.5);

    // Restart button
    const restartButton = this.add.text(width / 2, height * 2/3, 'Click to Restart', {
      font: '24px monospace',
      fill: '#ffffff'
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();

    // Button hover effect
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ fill: '#6542be' }); // MYOB Purple
    });
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ fill: '#ffffff' });
    });

    // Restart game on click
    restartButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Add keyboard control
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
} 