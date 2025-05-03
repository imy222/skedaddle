class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Add title
    const title = this.add.text(width / 2, height / 3, 'SKEDADDLE', {
      font: '64px monospace',
      fill: '#ffffff',
      stroke: '#6542be', // MYOB Purple
      strokeThickness: 6
    });
    title.setOrigin(0.5);

    // Add subtitle
    const subtitle = this.add.text(width / 2, height / 2, 'The 404 Runner Game', {
      font: '32px monospace',
      fill: '#ffffff'
    });
    subtitle.setOrigin(0.5);

    // Add start button
    const startButton = this.add.text(width / 2, height * 2/3, 'Click to Start', {
      font: '24px monospace',
      fill: '#ffffff'
    });
    startButton.setOrigin(0.5);
    startButton.setInteractive();

    // Button hover effect
    startButton.on('pointerover', () => {
      startButton.setStyle({ fill: '#6542be' }); // MYOB Purple
    });
    startButton.on('pointerout', () => {
      startButton.setStyle({ fill: '#ffffff' });
    });

    // Start game on click
    startButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    // Add keyboard control
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
} 