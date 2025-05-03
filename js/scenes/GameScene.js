class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.isGameOver = false;
    this.JUMP_VELOCITY = -400;
    this.MOVE_SPEED = 200;
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

    // Create ground - position it at the center of the screen width
    const gameWidth = this.sys.game.config.width;
    const groundHeight = 15; // Very narrow path
    
    // Create ground with physics
    this.ground = this.add.rectangle(gameWidth / 2, 550, gameWidth, groundHeight, 0x1a237e);
    this.physics.add.existing(this.ground, true);

    // Create animations first
    this.createAnimations();

    // Initialize player sprite with transparency settings
    console.log('Creating player sprite');
    this.player = this.physics.add.sprite(400, 450, 'idle-0');
    
    // Set up sprite rendering with transparency
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.1);  // Much smaller scale for 1024x1024 frames
    this.player.setAlpha(1);
    this.player.setPipeline('TextureTintPipeline'); // Enable tinting for transparency
    
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

    // Handle movement
    const touchingGround = this.player.body.touching.down;
    
    if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.MOVE_SPEED);
      this.player.flipX = false;
      if (touchingGround && this.animsCreated) {
        this.player.play('run', true);
      }
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.MOVE_SPEED);
      this.player.flipX = true;
      if (touchingGround && this.animsCreated) {
        this.player.play('run', true);
      }
    } else {
      this.player.setVelocityX(0);
      if (touchingGround && this.animsCreated) {
        this.player.play('idle', true);
      }
    }

    // Handle jumping
    if ((Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space)) 
        && touchingGround) {
      this.jump();
    }

    // Update animations based on vertical movement
    if (!touchingGround && this.animsCreated) {
      if (this.player.body.velocity.y < 0) {
        // Rising
        this.player.play('jump-up', true);
      } else {
        // Falling
        this.player.play('jump-down', true);
      }
    }

    // Update score
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
  }

  jump() {
    this.player.setVelocityY(this.JUMP_VELOCITY);
    this.player.play('jump-up', true);
  }

  onGroundCollision() {
    // Play landing animation when touching ground
    if (this.player.body.velocity.y > 200) { // Only play landing for significant falls
      this.player.play('land', true).once('animationcomplete', () => {
        // After landing animation completes, transition to idle or run
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
          this.player.play('run', true);
        } else {
          this.player.play('idle', true);
        }
      });
    } else {
      // For small drops or regular movement, transition directly
      if (this.cursors.left.isDown || this.cursors.right.isDown) {
        this.player.play('run', true);
      } else {
        this.player.play('idle', true);
      }
    }
  }

  gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.physics.pause();
    
    this.cameras.main.flash(500, 255, 0, 0);
    
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  createAnimations() {
    try {
      // Create idle animation
      console.log('Creating idle animation');
      const idleAnim = this.anims.create({
        key: 'idle',
        frames: [
          { key: 'idle-0' },
          { key: 'idle-1' }
        ],
        frameRate: 2,
        repeat: -1,
        yoyo: true,
        duration: 1000
      });

      // Create running animation
      console.log('Creating running animation');
      const runAnim = this.anims.create({
        key: 'run',
        frames: [
          { key: 'run-0' },
          { key: 'run-1' },
          { key: 'run-2' },
          { key: 'run-3' },
          { key: 'run-4' },
          { key: 'run-5' }
        ],
        frameRate: 12,
        repeat: -1,
        duration: 500
      });

      // Create jumping animations
      console.log('Creating jumping animations');
      const jumpUpAnim = this.anims.create({
        key: 'jump-up',
        frames: [
          { key: 'jump-0' },
          { key: 'jump-1' }
        ],
        frameRate: 10,
        repeat: 0
      });

      const jumpDownAnim = this.anims.create({
        key: 'jump-down',
        frames: [
          { key: 'jump-2' },
          { key: 'jump-3' }
        ],
        frameRate: 10,
        repeat: 0
      });

      // Create landing animation
      console.log('Creating landing animation');
      const landAnim = this.anims.create({
        key: 'land',
        frames: [
          { key: 'land-0' },
          { key: 'land-1' }
        ],
        frameRate: 15,
        repeat: 0
      });

      if (!idleAnim || !runAnim || !jumpUpAnim || !jumpDownAnim || !landAnim) {
        throw new Error('Failed to create animations');
      }

      console.log('All animations created successfully');
      this.animsCreated = true;
    } catch (error) {
      console.error('Error creating animations:', error);
      this.animsCreated = false;
    }
  }
} 