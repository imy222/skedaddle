class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.isGameOver = false;
  }

  create() {
    // Add backgrounds for parallax
    this.backgroundFar = this.add.tileSprite(0, 0, 800, 600, 'background-far');
    this.backgroundMiddle = this.add.tileSprite(0, 0, 800, 600, 'background-middle');
    this.backgroundFront = this.add.tileSprite(0, 0, 800, 600, 'background-front');

    // Set origins to top-left
    this.backgroundFar.setOrigin(0, 0);
    this.backgroundMiddle.setOrigin(0, 0);
    this.backgroundFront.setOrigin(0, 0);

    // Add score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      font: '32px monospace',
      fill: '#ffffff'
    });

    // Initialize player (commented out until we have assets)
    /*
    this.player = this.physics.add.sprite(100, 450, 'character');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    */

    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add click/touch handler for testing
    this.input.on('pointerdown', () => {
      this.gameOver();
    });

    // Add space key handler for testing
    this.input.keyboard.on('keydown-SPACE', () => {
      this.gameOver();
    });
  }

  update() {
    if (this.isGameOver) return;

    // Update parallax backgrounds
    this.backgroundFar.tilePositionX += 0.2;
    this.backgroundMiddle.tilePositionX += 0.5;
    this.backgroundFront.tilePositionX += 1;

    // Update player movement (commented out until we have assets)
    /*
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    */

    // Update score
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
  }

  gameOver() {
    if (this.isGameOver) return; // Prevent multiple game over calls

    this.isGameOver = true;
    this.physics.pause();
    
    // Optional: Add a quick flash effect
    this.cameras.main.flash(500, 255, 0, 0);
    
    // Wait for flash to complete before changing scene
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
} 