class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.isGameOver = false;
    this.JUMP_VELOCITY = -350;
    this.MOVE_SPEED = 200;
    this.OBSTACLE_SPEED = -300;
    this.MIN_SPAWN_TIME = 2000;
    this.MAX_SPAWN_TIME = 4000;
    this.OBSTACLE_TYPES = ['laptop-barrier', 'digital-stack', 'coffee-cups'];
    this.COIN_SPEED = -250;
    this.COIN_SPAWN_MIN = 1000;
    this.COIN_SPAWN_MAX = 3000;
    this.COIN_VALUE = 1;
    this.GROUND_Y = 550;
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

    // Create ground - position it at the center of the screen width
    const gameWidth = this.sys.game.config.width;
    const groundHeight = 15; // Very narrow path
    
    // Create ground with physics
    this.ground = this.add.rectangle(gameWidth / 2, 550, gameWidth, groundHeight, 0x1a237e);
    this.physics.add.existing(this.ground, true);

    // Create animations first
    this.createAnimations();

    // Initialize player sprite
    this.player = this.physics.add.sprite(100, 450, 'idle-0');
    
    // Set up sprite rendering
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.1);
    this.player.setAlpha(1);
    this.player.setPipeline('TextureTintPipeline');
    
    // Set up physics body for player
    const playerBodyWidth = this.player.width * 0.8;
    const playerBodyHeight = this.player.height * 0.9;
    this.player.body.setSize(playerBodyWidth, playerBodyHeight);
    this.player.body.setOffset(
      (this.player.width - playerBodyWidth) / 2,
      (this.player.height - playerBodyHeight) / 2
    );
    
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(600);

    // Create groups
    this.obstacles = this.physics.add.group();
    this.coins = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Add collisions
    this.physics.add.collider(this.player, this.ground, this.onGroundCollision, null, this);
    this.physics.add.collider(this.player, this.obstacles, this.onObstacleCollision, null, this);
    this.physics.add.collider(this.obstacles, this.ground);
    this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

    // Set up keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      font: '32px monospace',
      fill: '#ffffff'
    });

    // Start idle animation
    if (this.animsCreated) {
      this.player.play('idle');
    }

    // Start spawning obstacles and coins
    this.spawnObstacle();
    this.spawnCoin();
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

    // Clean up off-screen obstacles and coins
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle.x < -obstacle.width) {
        obstacle.destroy();
      }
    });

    this.coins.getChildren().forEach((coin) => {
      if (coin.x < -coin.width) {
        coin.destroy();
      }
    });
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
    
    // Stop physics and animations
    this.physics.pause();
    this.player.stop();
    
    // Stop all obstacles
    this.obstacles.getChildren().forEach(obstacle => {
      obstacle.setVelocityX(0);
    });
    
    // Stop all coins
    this.coins.getChildren().forEach(coin => {
      coin.setVelocityX(0);
      coin.stop();
    });
    
    // Flash screen red
    this.cameras.main.flash(500, 255, 0, 0);
    
    // Shake camera
    this.cameras.main.shake(250, 0.01);
    
    // Wait for effects to finish before transitioning
    this.time.delayedCall(750, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    // Create obstacle at the right edge of the screen, aligned with ground
    const obstacle = this.obstacles.create(800, this.GROUND_Y, 'obstacles-overtime-clock');
    
    // Set up obstacle properties with adjusted scale
    obstacle.setScale(0.06); // Decreased from 0.065 to 0.06
    obstacle.setVelocityX(this.OBSTACLE_SPEED);
    obstacle.setImmovable(true);
    obstacle.setGravityY(0); // Ensure it doesn't fall
    
    // Set origin to bottom center to align with ground
    obstacle.setOrigin(0.5, 1);
    
    // Set body size and offset for better collision
    const bodyWidth = obstacle.width * 0.4;  // Reduced from 0.6 to 0.4 for tighter collision
    const bodyHeight = obstacle.height * 0.5; // Reduced from 0.7 to 0.5 for tighter collision
    obstacle.body.setSize(bodyWidth, bodyHeight);
    obstacle.body.setOffset(
      (obstacle.width - bodyWidth) / 2,
      obstacle.height - bodyHeight - 5  // Added small offset from bottom to tighten collision
    );

    // Add to physics group and ensure it stays on ground
    this.physics.add.collider(obstacle, this.ground);
    obstacle.body.moves = true; // Enable physics movement
    obstacle.body.allowGravity = false; // Disable gravity
    obstacle.body.pushable = false; // Prevent being pushed by other objects

    // Schedule next spawn with increasing difficulty
    const progress = Math.min(this.score / 1000, 1);
    const minTime = this.MIN_SPAWN_TIME - (progress * 500);
    const maxTime = this.MAX_SPAWN_TIME - (progress * 1000);
    const nextSpawnTime = Phaser.Math.Between(minTime, maxTime);
    
    this.time.delayedCall(nextSpawnTime, () => this.spawnObstacle(), [], this);
  }

  onObstacleCollision(player, obstacle) {
    // Trigger game over
    this.gameOver();
  }

  spawnCoin() {
    if (this.isGameOver) return;

    // Create coin at random height between ground and max jump height
    const groundY = 550; // Ground position
    const minY = groundY - 150; // 150 pixels above ground
    const maxY = groundY - 80; // 80 pixels above ground
    const y = Phaser.Math.Between(minY, maxY);
    
    // Create coin sprite
    const coin = this.coins.create(800, y, 'coin-spin-0');
    
    // Set up coin properties with smaller scale
    coin.setScale(0.05); // Reduced from 0.08 to 0.05
    coin.setVelocityX(this.COIN_SPEED);
    coin.setBounce(0);
    coin.setGravityY(0);
    
    // Set up smaller physics body
    coin.body.setSize(24, 24); // Reduced from 32x32 to 24x24
    coin.body.setOffset(-6, -6); // Adjusted offset for smaller size
    
    // Play spinning animation
    coin.play('coin-spin');

    // Schedule next spawn
    const nextSpawnTime = Phaser.Math.Between(this.COIN_SPAWN_MIN, this.COIN_SPAWN_MAX);
    this.time.delayedCall(nextSpawnTime, () => this.spawnCoin(), [], this);
  }

  collectCoin(player, coin) {
    // Prevent collecting the same coin multiple times
    if (coin.collected) return;
    coin.collected = true;

    // Disable physics body immediately to prevent multiple collisions
    coin.body.enable = false;
    
    // Stop the spinning animation and play the faster collection animation
    coin.stop();
    coin.play('coin-collect').once('animationcomplete', () => {
      coin.destroy();
    });

    // Update score
    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);

    // Add faster visual feedback
    this.tweens.add({
      targets: this.scoreText,
      scale: 1.2,
      duration: 50, // Reduced from 100 to 50
      yoyo: true
    });

    // Add a quicker particle effect
    this.add.particles(coin.x, coin.y, 'coin-spin-0', {
      speed: 150, // Increased from 100 to 150
      scale: { start: 0.05, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 200, // Reduced from 300 to 200
      quantity: 5,
      emitting: false
    }).explode(5);
  }

  createAnimations() {
    try {
      // Create idle animation
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
      const landAnim = this.anims.create({
        key: 'land',
        frames: [
          { key: 'land-0' },
          { key: 'land-1' }
        ],
        frameRate: 15,
        repeat: 0
      });

      // Create coin spinning animation
      const coinSpinAnim = this.anims.create({
        key: 'coin-spin',
        frames: [
          { key: 'coin-spin-0' },
          { key: 'coin-spin-1' },
          { key: 'coin-spin-2' },
          { key: 'coin-spin-3' },
          { key: 'coin-spin-4' },
          { key: 'coin-spin-5' },
          { key: 'coin-spin-6' },
          { key: 'coin-spin-7' }
        ],
        frameRate: 10,
        repeat: -1
      });

      // Create coin collection animation
      const coinCollectAnim = this.anims.create({
        key: 'coin-collect',
        frames: [
          { key: 'coin-collect-0' },
          { key: 'coin-collect-1' },
          { key: 'coin-collect-2' },
          { key: 'coin-collect-3' },
          { key: 'coin-collect-4' },
          { key: 'coin-collect-5' }
        ],
        frameRate: 24,
        repeat: 0
      });

      if (!idleAnim || !runAnim || !jumpUpAnim || !jumpDownAnim || !landAnim || !coinSpinAnim || !coinCollectAnim) {
        throw new Error('Failed to create animations');
      }

      this.animsCreated = true;
    } catch (error) {
      console.error('Error creating animations:', error);
      this.animsCreated = false;
    }
  }
} 