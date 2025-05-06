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

    // Add semi-transparent dark overlay with fade in
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000);
    overlay.setOrigin(0);
    overlay.setAlpha(0);
    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 500,
      ease: 'Power2'
    });
    
    // Create panel background
    const panel = this.add.rectangle(width / 2, height / 2, 400, 400, 0x1a237e);
    panel.setAlpha(0.9);
    
    // Add decorative border
    const border = this.add.rectangle(width / 2, height / 2, 410, 410, 0x6542be);
    border.setAlpha(0.9);

    // Game Over text with drop in effect
    const gameOver = this.add.text(width / 2, -50, 'GAME OVER', {
      font: '64px monospace',
      fill: '#ffffff',
      stroke: '#6542be',
      strokeThickness: 8,
      padding: { x: 16, y: 8 },
      shadow: { color: '#000000', fill: true, blur: 15, offsetY: 5 }
    });
    gameOver.setOrigin(0.5);
    
    // Drop in animation for game over text
    this.tweens.add({
      targets: gameOver,
      y: height / 3,
      duration: 1000,
      ease: 'Bounce.easeOut'
    });

    // Score display with counter effect
    const scoreContainer = this.add.container(width / 2, height / 2);
    
    const scoreBg = this.add.rectangle(0, 0, 250, 60, 0x000000, 0.5);
    
    const scoreText = this.add.text(0, 0, '0', {
      font: 'bold 48px monospace',
      fill: '#ffffff',
      stroke: '#00a9e0',
      strokeThickness: 4,
      padding: { x: 16, y: 8 }
    });
    scoreText.setOrigin(0.5);
    
    const scoreLabel = this.add.text(0, -50, 'COINS COLLECTED', {
      font: '24px monospace',
      fill: '#ffffff',
      padding: { x: 8, y: 4 },
      stroke: '#000000',
      strokeThickness: 1
    });
    scoreLabel.setOrigin(0.5);
    
    scoreContainer.add([scoreBg, scoreText, scoreLabel]);

    // Animate score counting up
    let currentScore = 0;
    const scoreInterval = setInterval(() => {
      currentScore = Math.min(currentScore + 1, this.score);
      scoreText.setText(currentScore.toString());
      if (currentScore >= this.score) {
        clearInterval(scoreInterval);
      }
    }, 50);

    // Create restart button - moved up slightly
    const buttonBg = this.add.rectangle(width / 2, height / 2 + 100, 260, 80, 0x6542be);
    buttonBg.setInteractive();
    
    const restartButton = this.add.text(width / 2, height / 2 + 100, 'PLAY AGAIN', {
      font: 'bold 28px monospace',
      fill: '#ffffff',
      padding: { x: 20, y: 10 },
      stroke: '#000000',
      strokeThickness: 2
    });
    restartButton.setOrigin(0.5);

    const spaceText = this.add.text(width / 2, height / 2 + 170, 'or press SPACE', {
      font: '20px monospace',
      fill: '#ffffff',
      padding: { x: 20, y: 16 },
      stroke: '#000000',
      strokeThickness: 1,
      alpha: 0.8
    });
    spaceText.setOrigin(0.5);

    // Button hover effects
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x7e57c2);
      this.tweens.add({
        targets: [buttonBg, restartButton],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100
      });
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x6542be);
      this.tweens.add({
        targets: [buttonBg, restartButton],
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    // Restart game function
    const restartGame = () => {
      // Clear any running intervals
      clearInterval(scoreInterval);
      
      // Fade out effect
      this.tweens.add({
        targets: [overlay, panel, border, gameOver, scoreContainer, buttonBg, restartButton, spaceText],
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () => {
          // Stop this scene first
          this.scene.stop();
          // Start a fresh GameScene
          this.scene.start('GameScene', { reset: true });
        }
      });
    };

    // Add restart triggers
    buttonBg.on('pointerdown', () => {
      this.tweens.add({
        targets: [buttonBg, restartButton],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: restartGame
      });
    });
    
    this.input.keyboard.on('keydown-SPACE', restartGame);

    // Add pulsing effect to space text
    this.tweens.add({
      targets: spaceText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}

export { GameOverScene }; 