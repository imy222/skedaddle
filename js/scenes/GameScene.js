class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.isGameOver = false;
  }

  create() {
    console.log('GameScene: create started');
    
    // Add backgrounds for parallax
    this.backgroundFar = this.add.tileSprite(0, 0, 800, 600, 'background-far');
    this.backgroundMiddle = this.add.tileSprite(0, 0, 800, 600, 'background-middle');
    this.backgroundFront = this.add.tileSprite(0, 0, 800, 600, 'background-front');

    // Set origins to top-left
    this.backgroundFar.setOrigin(0, 0);
    this.backgroundMiddle.setOrigin(0, 0);
    this.backgroundFront.setOrigin(0, 0);

    // Create ground
    this.ground = this.add.rectangle(0, 550, 800, 50, 0x1a237e);
    this.physics.add.existing(this.ground, true);

    // Create animations first
    this.createAnimations();

    // Initialize player sprite
    console.log('Creating player sprite');
    this.player = this.physics.add.sprite(400, 450, 'idle-0');
    
    // Set up sprite rendering
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.1);  // Much smaller scale for 1024x1024 frames
    this.player.setAlpha(1);
    
    // Debug info
    console.log('Player sprite details:', {
      texture: this.player.texture.key,
      frame: this.player.frame.name,
      width: this.player.width,
      height: this.player.height,
      visible: this.player.visible,
      alpha: this.player.alpha,
      scale: this.player.scale
    });
    
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(800);

    // Add collision between player and ground
    this.physics.add.collider(this.player, this.ground, this.onGroundCollision, null, this);

    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      font: '32px monospace',
      fill: '#ffffff'
    });

    // Start idle animation immediately if animations are created
    if (this.animsCreated) {
      console.log('Starting idle animation');
      this.player.play('idle');
      
      // Debug animation info
      const anim = this.anims.get('idle');
      console.log('Animation details:', {
        key: anim.key,
        frameRate: anim.frameRate,
        frames: anim.frames.length,
        repeat: anim.repeat,
        yoyo: anim.yoyo
      });
    } else {
      console.warn('Animations not created, character will be static');
    }
    
    console.log('GameScene: create completed');
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

  createAnimations() {
    try {
      // Create idle animation from individual frames
      console.log('Creating idle animation');
      
      const idleAnim = this.anims.create({
        key: 'idle',
        frames: [
          { key: 'idle-0' },
          { key: 'idle-1' }
        ],
        frameRate: 2,  // Slower for more natural idle
        repeat: -1,
        yoyo: true,    // Back and forth for smooth idle
        duration: 1000 // 1 second per cycle
      });

      if (!idleAnim) {
        throw new Error('Failed to create idle animation');
      }

      console.log('Idle animation created with frames: idle-0, idle-1');

      this.animsCreated = true;
      console.log('All animations created successfully');
    } catch (error) {
      console.error('Error creating animations:', error);
      this.animsCreated = false;
    }
  }
} 