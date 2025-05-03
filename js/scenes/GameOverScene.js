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

    // Add semi-transparent dark overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000);
    overlay.setOrigin(0);
    overlay.setAlpha(0);
    
    // Create panel background
    const panel = this.add.rectangle(width / 2, height / 2, 400, 400, 0x1a237e);
    panel.setAlpha(0);
    
    // Add decorative border
    const border = this.add.rectangle(width / 2, height / 2, 410, 410, 0x6542be);
    border.setAlpha(0);

    // Game Over text with retro style
    const gameOver = this.add.text(width / 2, height / 3, 'GAME OVER', {
      font: '64px monospace',
      fill: '#ffffff',
      stroke: '#6542be',
      strokeThickness: 8,
      shadow: { color: '#000000', fill: true, blur: 15, offsetY: 5 }
    });
    gameOver.setOrigin(0.5);
    gameOver.setAlpha(0);

    // Score display with coin icon
    const scoreContainer = this.add.container(width / 2, height / 2 - 20);
    
    const scoreBg = this.add.rectangle(0, 0, 250, 60, 0x000000, 0.5);
    const scoreText = this.add.text(0, 0, `${this.score}`, {
      font: 'bold 48px monospace',
      fill: '#ffffff',
      stroke: '#00a9e0',
      strokeThickness: 4
    });
    scoreText.setOrigin(0.5);
    
    const scoreLabel = this.add.text(0, -40, 'FINAL SCORE', {
      font: '24px monospace',
      fill: '#ffffff'
    });
    scoreLabel.setOrigin(0.5);
    
    scoreContainer.add([scoreBg, scoreText, scoreLabel]);
    scoreContainer.setAlpha(0);

    // Create button background with gradient
    const buttonBg = this.add.rectangle(width / 2, height * 2/3, 200, 50, 0x6542be);
    buttonBg.setInteractive();
    buttonBg.setAlpha(0);
    
    // Restart button text
    const restartButton = this.add.text(width / 2, height * 2/3, 'PLAY AGAIN', {
      font: 'bold 24px monospace',
      fill: '#ffffff'
    });
    restartButton.setOrigin(0.5);
    restartButton.setAlpha(0);

    // Space bar instruction text
    const spaceText = this.add.text(width / 2, height * 2/3 + 60, 'or press SPACE', {
      font: '18px monospace',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    spaceText.setOrigin(0.5);
    spaceText.setAlpha(0);

    // Button hover effects with sound
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

    // Restart game on click with transition
    buttonBg.on('pointerdown', () => {
      this.restartGame();
    });

    // Add keyboard control
    this.input.keyboard.on('keydown-SPACE', () => {
      this.restartGame();
    });

    // Remove the separate space prompt and update the animation sequence
    this.tweens.add({
      targets: overlay,
      alpha: 0.7,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        // Fade in panel and border
        this.tweens.add({
          targets: [panel, border],
          alpha: 0.9,
          duration: 500,
          ease: 'Power2'
        });

        // Bounce in game over text
        this.tweens.add({
          targets: gameOver,
          alpha: 1,
          y: height / 3,
          duration: 800,
          ease: 'Bounce.easeOut'
        });

        // Fade in score with delay
        this.tweens.add({
          targets: scoreContainer,
          alpha: 1,
          duration: 500,
          delay: 400,
          ease: 'Power2'
        });

        // Fade in button and text
        this.tweens.add({
          targets: [buttonBg, restartButton, spaceText],
          alpha: 1,
          duration: 500,
          delay: 800,
          ease: 'Power2'
        });
      }
    });

    // Add pulsing effect to play again button
    this.tweens.add({
      targets: buttonBg,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  restartGame() {
    // Fade out everything
    this.tweens.add({
      targets: this.children.list,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        this.scene.start('GameScene');
      }
    });
  }
} 