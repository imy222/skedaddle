class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Add semi-transparent background panel
    const panel = this.add.rectangle(width / 2, height / 2, 400, 300, 0x1a237e);
    panel.setAlpha(0.3);

    // Add title
    const title = this.add.text(width / 2, height / 3, 'SKEDADDLE', {
      font: 'bold 64px monospace',
      fill: '#ffffff',
      stroke: '#6542be', // MYOB Purple
      strokeThickness: 8,
      shadow: { color: '#000000', fill: true, offsetX: 2, offsetY: 2, blur: 8 }
    });
    title.setOrigin(0.5);

    // Add subtitle
    const subtitle = this.add.text(width / 2, height / 2, 'The 404 Runner Game', {
      font: '32px monospace',
      fill: '#ffffff',
      stroke: '#1a237e', // MYOB Navy
      strokeThickness: 2
    });
    subtitle.setOrigin(0.5);

    // Create button background
    const buttonBg = this.add.rectangle(width / 2, height * 2/3, 200, 50, 0x6542be);
    buttonBg.setInteractive();
    
    // Add start button text
    const startButton = this.add.text(width / 2, height * 2/3, 'START GAME', {
      font: 'bold 24px monospace',
      fill: '#ffffff'
    });
    startButton.setOrigin(0.5);

    // Button hover effects
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x7e57c2); // Lighter purple
      this.tweens.add({
        targets: [buttonBg, startButton],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100
      });
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x6542be); // MYOB Purple
      this.tweens.add({
        targets: [buttonBg, startButton],
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    // Start game on click
    buttonBg.on('pointerdown', () => {
      this.tweens.add({
        targets: [buttonBg, startButton],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });

    // Add keyboard control
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    // Fade in animation
    this.tweens.add({
      targets: [panel, title, subtitle, buttonBg, startButton],
      alpha: { from: 0, to: 1 },
      duration: 1000,
      ease: 'Power2'
    });
  }
} 