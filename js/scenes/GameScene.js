class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  init() {
    this.score = 0;
    this.isGameOver = false;
    this.JUMP_VELOCITY = -350;
    this.MOVE_SPEED = 200;
    
    // Base speeds and intervals
    this.BASE_OBSTACLE_SPEED = -300;
    this.BASE_COIN_SPEED = -250;
    this.BASE_MIN_SPAWN_TIME = 2000;
    this.BASE_MAX_SPAWN_TIME = 4000;
    
    // Current speeds (will be modified by difficulty scaling)
    this.OBSTACLE_SPEED = this.BASE_OBSTACLE_SPEED;
    this.COIN_SPEED = this.BASE_COIN_SPEED;
    this.MIN_SPAWN_TIME = this.BASE_MIN_SPAWN_TIME;
    this.MAX_SPAWN_TIME = this.BASE_MAX_SPAWN_TIME;
    
    // Difficulty scaling settings
    this.DIFFICULTY_INTERVAL = 15000; // Increase difficulty every 15 seconds
    this.SPEED_INCREASE_FACTOR = 1.1; // 10% faster each time
    this.SPAWN_DECREASE_FACTOR = 0.9; // 10% shorter intervals each time
    this.MAX_DIFFICULTY_INCREASES = 5; // Cap difficulty increases at 5 times
    this.difficultyIncreases = 0;
    
    this.OBSTACLE_TYPES = ['laptop-barrier', 'digital-stack', 'coffee-cups'];
    this.COIN_SPAWN_MIN = 1000;
    this.COIN_SPAWN_MAX = 3000;
    this.COIN_VALUE = 1;
    this.GROUND_Y = 550;
    
    // Powerup properties
    this.isPoweredUp = false;
    this.powerupDuration = 10000;
    this.powerupScoreThreshold = 10;
    this.powerupScale = 1.5;
    this.originalScale = 0.1;
    this.powerupTimer = null;
    this.powerupProgressBar = null;
    this.powerupEmitter = null;
    this.powerupGlow = null;
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

    // Add restart button in top-right corner
    const restartBg = this.add.rectangle(gameWidth - 100, 32, 140, 40, 0x6542be);
    restartBg.setAlpha(0.8);
    restartBg.setInteractive();
    
    const restartText = this.add.text(gameWidth - 100, 32, 'RESTART', {
      font: 'bold 20px monospace',
      fill: '#ffffff'
    });
    restartText.setOrigin(0.5);

    // Button hover effects
    restartBg.on('pointerover', () => {
      restartBg.setFillStyle(0x7e57c2); // Lighter purple
      this.tweens.add({
        targets: [restartBg, restartText],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 100
      });
    });

    restartBg.on('pointerout', () => {
      restartBg.setFillStyle(0x6542be); // MYOB Purple
      this.tweens.add({
        targets: [restartBg, restartText],
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });

    // Restart game on click
    restartBg.on('pointerdown', () => {
      this.tweens.add({
        targets: [restartBg, restartText],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.scene.restart();
        }
      });
    });

    // Start idle animation
    if (this.animsCreated) {
      this.player.play('idle');
    }

    // Add difficulty scaling timer
    this.time.addEvent({
      delay: this.DIFFICULTY_INTERVAL,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });

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
    } else {
      this.player.setVelocityX(0);
      if (touchingGround && this.animsCreated) {
        this.player.play('idle', true);
      }
    }

    // Handle jumping
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && touchingGround) {
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

    // Update glow position
    if (this.powerupGlow && this.isPoweredUp) {
      this.powerupGlow.x = this.player.x;
      this.powerupGlow.y = this.player.y;
    }
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
    
    // Deactivate powerup if active
    if (this.isPoweredUp) {
      this.deactivatePowerup();
    }

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

  increaseDifficulty() {
    if (this.isGameOver || this.difficultyIncreases >= this.MAX_DIFFICULTY_INCREASES) return;

    this.difficultyIncreases++;

    // Increase speeds
    this.OBSTACLE_SPEED *= this.SPEED_INCREASE_FACTOR;
    this.COIN_SPEED *= this.SPEED_INCREASE_FACTOR;

    // Decrease spawn intervals
    this.MIN_SPAWN_TIME *= this.SPAWN_DECREASE_FACTOR;
    this.MAX_SPAWN_TIME *= this.SPAWN_DECREASE_FACTOR;

    // Update existing obstacles and coins with new speed
    this.obstacles.getChildren().forEach(obstacle => {
      obstacle.setVelocityX(this.OBSTACLE_SPEED);
    });

    this.coins.getChildren().forEach(coin => {
      coin.setVelocityX(this.COIN_SPEED);
    });

    // Visual feedback for difficulty increase
    const difficultyText = this.add.text(400, 300, 'Speed Up!', {
      font: 'bold 32px monospace',
      fill: '#ff0000'
    });
    difficultyText.setOrigin(0.5);
    difficultyText.setAlpha(0.8);

    this.tweens.add({
      targets: difficultyText,
      y: difficultyText.y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => difficultyText.destroy()
    });
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    // Create obstacle at the right edge of the screen
    const obstacle = this.obstacles.create(800, this.GROUND_Y, 'obstacles-overtime-clock');
    
    obstacle.setScale(0.06);
    obstacle.setVelocityX(this.OBSTACLE_SPEED); // Use current speed
    obstacle.setImmovable(true);
    obstacle.setGravityY(0);
    
    obstacle.setOrigin(0.5, 1);
    
    const bodyWidth = obstacle.width * 0.3;
    const bodyHeight = obstacle.height * 0.4;
    obstacle.body.setSize(bodyWidth, bodyHeight);
    obstacle.body.setOffset(
      (obstacle.width - bodyWidth) / 2,
      obstacle.height - bodyHeight - 8
    );

    this.physics.add.collider(obstacle, this.ground);
    obstacle.body.moves = true;
    obstacle.body.allowGravity = false;
    obstacle.body.pushable = false;

    // Schedule next spawn using current spawn times
    const nextSpawnTime = Phaser.Math.Between(this.MIN_SPAWN_TIME, this.MAX_SPAWN_TIME);
    this.time.delayedCall(nextSpawnTime, () => this.spawnObstacle(), [], this);
  }

  onObstacleCollision(player, obstacle) {
    if (this.isPoweredUp) {
      // Destroy obstacle and create explosion effect
      const explosion = this.add.particles(obstacle.x, obstacle.y, 'particle', {
        speed: { min: 100, max: 200 },
        scale: { start: 0.2, end: 0 },
        alpha: { start: 1, end: 0 },
        tint: [0x6542be, 0x00a9e0, 0x62b5e5],
        lifespan: 500,
        quantity: 20,
        emitting: false
      });
      explosion.explode(20);
      obstacle.destroy();

      // Add screen shake
      this.cameras.main.shake(200, 0.003);
    } else {
      if (!this.isGameOver) {
        this.gameOver();
      }
    }
  }

  spawnCoin() {
    if (this.isGameOver) return;

    const groundY = 550;
    const minY = groundY - 150;
    const maxY = groundY - 80;
    const y = Phaser.Math.Between(minY, maxY);
    
    const coin = this.coins.create(800, y, 'coin-spin-0');
    
    coin.setScale(0.05);
    coin.setVelocityX(this.COIN_SPEED); // Use current speed
    coin.setBounce(0);
    coin.setGravityY(0);
    
    coin.body.setSize(24, 24);
    coin.body.setOffset(-6, -6);
    
    coin.play('coin-spin');

    const nextSpawnTime = Phaser.Math.Between(this.COIN_SPAWN_MIN, this.COIN_SPAWN_MAX);
    this.time.delayedCall(nextSpawnTime, () => this.spawnCoin(), [], this);
  }

  collectCoin(player, coin) {
    // Prevent multiple collisions with the same coin
    if (coin.collected) return;
    coin.collected = true;

    // Update score first
    this.score += this.COIN_VALUE;
    this.scoreText.setText('Score: ' + this.score);

    // Play coin collection animation and destroy after
    coin.play('coin-collect').once('animationcomplete', () => {
      coin.destroy();
    });

    // Check for powerup trigger after a short delay
    if (this.score % this.powerupScoreThreshold === 0) {
      // Delay powerup activation slightly to avoid frame drops
      this.time.delayedCall(100, () => {
        this.activatePowerup();
      });
    }
  }

  activatePowerup() {
    if (this.isPoweredUp) {
      // Reset timer if already powered up
      if (this.powerupTimer) {
        this.powerupTimer.reset();
      }
      return;
    }

    this.isPoweredUp = true;

    // Scale up player with simpler animation
    this.player.setScale(this.powerupScale * this.originalScale);

    // Simple powerup text that fades out
    const powerupText = this.add.text(this.player.x, this.player.y - 50, 'POWERUP!', {
      font: 'bold 32px monospace',
      fill: '#ffffff'
    });
    powerupText.setOrigin(0.5);
    powerupText.setDepth(100);

    // Simple fade out
    this.tweens.add({
      targets: powerupText,
      alpha: 0,
      y: powerupText.y - 30,
      duration: 500,
      onComplete: () => powerupText.destroy()
    });

    // Create minimal progress bar
    this.createPowerupProgressBar();

    // Start powerup timer
    this.powerupTimer = this.time.delayedCall(this.powerupDuration, () => {
      this.deactivatePowerup();
    }, [], this);

    // Add simple glow effect
    const glow = this.add.sprite(this.player.x, this.player.y, 'particle');
    glow.setScale(4);
    glow.setAlpha(0.15);
    glow.setTint(0x6542be);
    glow.setBlendMode('ADD');
    glow.setDepth(this.player.depth - 1);
    this.powerupGlow = glow;

    // Update glow position in update method
    this.events.on('update', () => {
      if (this.powerupGlow && this.isPoweredUp) {
        this.powerupGlow.x = this.player.x;
        this.powerupGlow.y = this.player.y;
      }
    }, this);
  }

  deactivatePowerup() {
    if (!this.isPoweredUp) return;

    this.isPoweredUp = false;

    // Simple scale down
    this.player.setScale(this.originalScale);

    // Clean up effects
    if (this.powerupGlow) {
      this.powerupGlow.destroy();
      this.powerupGlow = null;
    }

    if (this.powerupProgressBar) {
      if (this.powerupProgressBar.background) {
        this.powerupProgressBar.background.destroy();
      }
      this.powerupProgressBar.destroy();
      this.powerupProgressBar = null;
    }

    // Clean up any remaining tweens
    this.tweens.killTweensOf(this.player);
    this.tweens.killTweensOf(this.powerupGlow);
  }

  createPowerupProgressBar() {
    const barWidth = 200;
    const barHeight = 10; // Reduced height
    const x = this.sys.game.config.width / 2 - barWidth / 2;
    const y = 20; // Moved higher up

    // Background bar
    const background = this.add.rectangle(x, y, barWidth, barHeight, 0x000000);
    background.setOrigin(0, 0);
    background.setAlpha(0.5); // Reduced alpha
    background.setDepth(100);

    // Progress bar
    this.powerupProgressBar = this.add.rectangle(x, y, barWidth, barHeight, 0x6542be);
    this.powerupProgressBar.setOrigin(0, 0);
    this.powerupProgressBar.setDepth(100);
    this.powerupProgressBar.background = background;

    // Update progress bar less frequently
    this.powerupProgressTimer = this.time.addEvent({
      delay: 500, // Update every 500ms
      repeat: this.powerupDuration / 500 - 1,
      callback: () => {
        if (this.powerupProgressBar && !this.isGameOver) {
          const progress = 1 - (this.powerupTimer.getProgress() || 0);
          this.powerupProgressBar.width = barWidth * progress;
        }
      }
    });
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