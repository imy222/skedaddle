class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Add background
    const bg = this.add.rectangle(0, 0, width, height, 0x1a237e);
    bg.setOrigin(0);
    bg.setAlpha(1);

    // Add title
    const title = this.add.text(width / 2, height * 0.2, 'SKEDADDLE', {
      font: 'bold 72px monospace',
      fill: '#ffffff',
      stroke: '#6542be',
      strokeThickness: 12,
      shadow: { color: '#000000', fill: true, offsetX: 2, offsetY: 2, blur: 8 }
    });
    title.setOrigin(0.5);

    // Create info container
    const infoContainer = this.add.container(width / 2, height * 0.5);
    
    const infoBg = this.add.rectangle(0, 0, 500, 260, 0x000000, 0.3);
    
    // Add objective text
    const objectiveText = this.add.text(0, -90, 'OBJECTIVE:', {
      font: 'bold 20px monospace',
      fill: '#ffffff',
      padding: { x: 16, y: 12 }
    });
    objectiveText.setOrigin(0.5);

    const objectiveDesc = this.add.text(0, -45, 'Collect coins and dodge obstacles\nEvery 10 coins grants a power-up!', {
      font: '18px monospace',
      fill: '#ffffff',
      padding: { x: 16, y: 12 },
      align: 'center'
    });
    objectiveDesc.setOrigin(0.5);

    // Add controls text
    const controlsText = this.add.text(0, 20, 'CONTROLS:', {
      font: 'bold 20px monospace',
      fill: '#ffffff',
      padding: { x: 16, y: 12 }
    });
    controlsText.setOrigin(0.5);

    const controlsDesc = this.add.text(0, 65, '↑ or SPACE to Jump\n→ to Move', {
      font: '18px monospace',
      fill: '#ffffff',
      padding: { x: 16, y: 16 },
      align: 'center'
    });
    controlsDesc.setOrigin(0.5);

    infoContainer.add([infoBg, objectiveText, objectiveDesc, controlsText, controlsDesc]);

    // Create button
    const buttonBg = this.add.rectangle(width / 2, height * 0.8, 240, 70, 0x6542be);
    buttonBg.setInteractive();
    
    const startButton = this.add.text(width / 2, height * 0.8, 'START GAME', {
      font: 'bold 28px monospace',
      fill: '#ffffff',
      padding: { x: 8, y: 4 },
      stroke: '#000000',
      strokeThickness: 2
    });
    startButton.setOrigin(0.5);

    // Button hover effects
    buttonBg.on('pointerover', () => {
      buttonBg.setFillStyle(0x7e57c2);
    });

    buttonBg.on('pointerout', () => {
      buttonBg.setFillStyle(0x6542be);
    });

    // Start game on click
    buttonBg.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}

export { MenuScene };