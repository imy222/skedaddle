import { CANVAS, PHYSICS, PLAYER, POWERUP, PROGRESSION, GAME, COIN, ENEMY, EFFECTS, DEBUG } from '../config/gameConstants.js';

/**
 * Main gameplay scene that handles the endless runner mechanics.
 * Uses constants from gameConstants.js for consistent gameplay parameters.
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    // Initialize groups as null
    this.obstacles = null;
    this.coins = null;
  }

  init(data) {
    // Reset base properties
    this.score = 0;
    this.isGameOver = false;
    this.difficultyIncreases = 0;
    
    // Jump properties
    this.isJumping = false;
    this.jumpHoldTime = 0;
    this.maxJumpHoldTime = PHYSICS.MAX_JUMP_TIME;
    this.jumpHoldForce = PHYSICS.JUMP_HOLD_FORCE;
    
    // Base speeds and intervals from global constants
    this.BASE_OBSTACLE_SPEED = ENEMY.TYPES.GROUND.SPEED * 75; // Scale speed for game pace
    this.BASE_COIN_SPEED = COIN.BASE_SPEED;
    this.BASE_MIN_SPAWN_TIME = ENEMY.SPAWN_RATE - ENEMY.SPAWN_VARIANCE;
    this.BASE_MAX_SPAWN_TIME = ENEMY.SPAWN_RATE + ENEMY.SPAWN_VARIANCE;
    
    // Current speeds (will be modified by difficulty scaling)
    this.OBSTACLE_SPEED = this.BASE_OBSTACLE_SPEED;
    this.COIN_SPEED = this.BASE_COIN_SPEED;
    this.MIN_SPAWN_TIME = this.BASE_MIN_SPAWN_TIME;
    this.MAX_SPAWN_TIME = this.BASE_MAX_SPAWN_TIME;
    
    // Difficulty scaling settings from progression constants
    this.DIFFICULTY_INTERVAL = PROGRESSION.DIFFICULTY_INCREASE_INTERVAL / 2; // Use half the default interval
    this.SPEED_INCREASE_FACTOR = PROGRESSION.SPEED_INCREASE;
    this.SPAWN_DECREASE_FACTOR = PROGRESSION.SPAWN_RATE_DECREASE;
    this.MAX_DIFFICULTY_INCREASES = PROGRESSION.MAX_DIFFICULTY_LEVEL;
    
    // Game constants from global configuration
    this.JUMP_VELOCITY = PHYSICS.JUMP_FORCE * 30; // Scale the jump force (conversion from physics system)
    this.MOVE_SPEED = PLAYER.MOVE_SPEED * 40; // Scale the move speed (conversion from physics system)
    this.OBSTACLE_TYPES = ENEMY.OBSTACLE_TYPES;
    this.COIN_SPAWN_MIN = COIN.SPAWN_RATE.MIN;
    this.COIN_SPAWN_MAX = COIN.SPAWN_RATE.MAX;
    this.COIN_VALUE = COIN.VALUE;
    this.GROUND_Y = CANVAS.GROUND_Y;
    
    // Powerup properties from powerup constants
    this.isPoweredUp = false;
    this.powerupDuration = POWERUP.DURATION;
    this.powerupScoreThreshold = POWERUP.THRESHOLD;
    this.powerupScale = POWERUP.EFFECTS.SCALE;
    this.originalScale = GAME.SCALE.PLAYER;
    this.powerupTimer = null;
    this.powerupProgressBar = null;
    this.powerupEmitter = null;
    this.powerupGlow = null;

    // Flag to indicate if this is a restart
    this.isRestart = data && data.reset === true;
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

    // Create ground
    const gameWidth = this.sys.game.config.width;
    const groundHeight = 15;
    this.ground = this.add.rectangle(gameWidth / 2, 550, gameWidth, groundHeight, 0x1a237e);
    this.physics.add.existing(this.ground, true);

    // Create animations
    this.createAnimations();

    // Initialize player sprite
    this.player = this.physics.add.sprite(100, 450, 'idle-0');
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(GAME.SCALE.PLAYER);
    this.player.setAlpha(1);
    this.player.setPipeline('TextureTintPipeline');
    
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

    // Create fresh groups
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
      this.player.play(PLAYER.STATES.IDLE);
    }

    // Start spawning obstacles and coins
    this.spawnObstacle();
    this.spawnCoin();

    // Add difficulty scaling timer
    this.time.addEvent({
      delay: this.DIFFICULTY_INTERVAL,
      callback: this.increaseDifficulty,
      callbackScope: this,
      loop: true
    });

    // If this is a restart, resume physics
    if (this.isRestart) {
      this.physics.resume();
    }
    
    // Debug settings
    if (DEBUG.SHOW_HITBOXES) {
      this.physics.world.createDebugGraphic();
    }
    
    // Display FPS counter if enabled
    if (DEBUG.SHOW_FPS) {
      this.fpsText = this.add.text(this.cameras.main.width - 100, 10, 'FPS: 0', {
        font: '16px Arial',
        fill: '#ffffff'
      });
      this.time.addEvent({
        delay: 1000,
        callback: this.updateFPS,
        callbackScope: this,
        loop: true
      });
    }
    
    // Add restart button in the top right corner
    this.restartButton = this.add.text(this.cameras.main.width - 70, 16, 'RESET', {
      font: '18px monospace',
      fill: '#ffffff',
      backgroundColor: '#6542be',
      padding: { x: 8, y: 4 }
    });
    this.restartButton.setInteractive({ useHandCursor: true });
    this.restartButton.on('pointerdown', () => {
      this.resetGameState();
    });
    
    // Add restart key
    this.restartKey = this.input.keyboard.addKey('R');
    this.restartKey.on('down', () => {
      this.resetGameState();
    });
    
    // Player invincibility for debugging
    if (DEBUG.INVINCIBLE) {
      this.isPoweredUp = true;
    }
  }

  update() {
    if (this.isGameOver) return;

    // Disable restart key during game over state
    if (this.restartKey) {
      this.restartKey.enabled = !this.isGameOver;
    }
    if (this.restartButton) {
      this.restartButton.setVisible(!this.isGameOver);
    }

    // Handle movement
    const touchingGround = this.player.body.touching.down;
    let scrollMultiplier = 1; // Base scroll speed multiplier
    
    if (this.cursors.right.isDown) {
      // When moving right, increase scroll speed
      scrollMultiplier = 2.5;
      this.player.setVelocityX(this.MOVE_SPEED);
      this.player.flipX = false;
      if (touchingGround && this.animsCreated) {
        this.player.play(PLAYER.STATES.RUNNING, true);
      }
      // Keep player position fixed at 1/4 of screen width
      this.player.x = Math.min(this.player.x, this.cameras.main.width * 0.25);
    } else {
      scrollMultiplier = 1;
      this.player.setVelocityX(0);
      // Let player move back if they're ahead of the target position
      if (this.player.x > this.cameras.main.width * 0.25) {
        this.player.setVelocityX(-this.MOVE_SPEED * 0.5);
      }
      if (touchingGround && this.animsCreated) {
        this.player.play(PLAYER.STATES.IDLE, true);
      }
    }

    // Update parallax backgrounds with dynamic speed
    this.backgroundFar.tilePositionX += EFFECTS.PARALLAX_LAYERS[0].speed * scrollMultiplier;
    this.backgroundMiddle.tilePositionX += EFFECTS.PARALLAX_LAYERS[1].speed * scrollMultiplier;
    this.backgroundFront.tilePositionX += EFFECTS.PARALLAX_LAYERS[2].speed * scrollMultiplier;

    // Update obstacle and coin speeds based on movement
    const currentObstacleSpeed = this.OBSTACLE_SPEED * scrollMultiplier;
    const currentCoinSpeed = this.COIN_SPEED * scrollMultiplier;

    this.obstacles.getChildren().forEach(obstacle => {
      // Ensure obstacles stay on the ground and keep moving at the right speed
      obstacle.setVelocityX(currentObstacleSpeed);
      obstacle.y = this.GROUND_Y; // Ensure it stays exactly on the ground
    });

    this.coins.getChildren().forEach(coin => {
      coin.setVelocityX(currentCoinSpeed);
      
      // Check for coin collection during powerup state
      if (this.isPoweredUp && !coin.collected) {
        const bounds = this.player.getBounds();
        const coinBounds = coin.getBounds();
        if (Phaser.Geom.Rectangle.Overlaps(bounds, coinBounds)) {
          this.collectCoin(this.player, coin);
        }
      }
    });

    // Handle jumping
    const jumpButtonPressed = this.cursors.up.isDown || this.cursors.space.isDown;
    
    if (jumpButtonPressed && touchingGround && !this.isJumping) {
      this.jump();
      this.isJumping = true;
      this.jumpHoldTime = 0;
    }
    
    // Variable jump height when holding the jump button
    if (this.isJumping && jumpButtonPressed) {
      this.jumpHoldTime += this.sys.game.loop.delta;
      if (this.jumpHoldTime < this.maxJumpHoldTime) {
        this.player.setVelocityY(this.player.body.velocity.y + this.jumpHoldForce);
      }
    }
    
    // Reset jump state when button is released or max hold time reached
    if (this.isJumping && (!jumpButtonPressed || this.jumpHoldTime >= this.maxJumpHoldTime)) {
      this.isJumping = false;
    }
    
    // Reset jump state when touching ground
    if (touchingGround) {
      this.isJumping = false;
    }

    // Update animations based on vertical movement
    if (!touchingGround && this.animsCreated) {
      if (this.player.body.velocity.y < 0) {
        // Rising
        this.player.play(PLAYER.STATES.JUMPING, true);
      } else {
        // Falling
        this.player.play(PLAYER.STATES.FALLING, true);
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
    this.player.play(PLAYER.STATES.JUMPING, true);
  }

  onGroundCollision() {
    // Play landing animation when touching ground
    if (this.player.body.velocity.y > 200) { // Only play landing for significant falls
      this.player.play(PLAYER.STATES.LANDING, true).once('animationcomplete', () => {
        // After landing animation completes, transition to idle or run
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
          this.player.play(PLAYER.STATES.RUNNING, true);
        } else {
          this.player.play(PLAYER.STATES.IDLE, true);
        }
      });
    } else {
      // For small drops or regular movement, transition directly
      if (this.cursors.left.isDown || this.cursors.right.isDown) {
        this.player.play(PLAYER.STATES.RUNNING, true);
      } else {
        this.player.play(PLAYER.STATES.IDLE, true);
      }
    }
  }

  gameOver() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    
    // Stop physics and animations
    this.physics.pause();
    
    // Stop player animations
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
    
    // Hide the restart button
    if (this.restartButton) {
      this.restartButton.setVisible(false);
    }
    
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
      fontFamily: 'Roboto Mono',
      fontSize: '32px',
      fontWeight: 'bold',
      fill: '#ff0000',
      padding: { x: 16, y: 8 }
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

    // Check if there are any obstacles too close to the right edge
    const existingObstacles = this.obstacles.getChildren();
    const rightmostX = existingObstacles.reduce((max, obs) => Math.max(max, obs.x), 0);
    
    // If the rightmost obstacle is too close to spawn point, delay the spawn
    if (rightmostX > 800 - ENEMY.MIN_DISTANCE) {
      // Schedule a check after a short delay
      this.time.delayedCall(500, () => this.spawnObstacle(), [], this);
      return;
    }

    // Create obstacle at the right edge of the screen with small x variance
    const xVariance = Phaser.Math.Between(0, 50); // Only positive variance to prevent overlapping
    const obstacle = this.obstacles.create(800 + xVariance, this.GROUND_Y, 'obstacles-overtime-clock');
    
    // Set fixed properties
    obstacle.setScale(ENEMY.CLOCK.SCALE);
    obstacle.setOrigin(0.5, 0.95); // Adjust origin to make it sit right on the path
    obstacle.setImmovable(true);
    obstacle.body.allowGravity = false;
    
    // Set body size proportional to ENEMY dimensions
    const bodyWidth = obstacle.width * 0.25;
    const bodyHeight = obstacle.height * 0.4;
    obstacle.body.setSize(bodyWidth, bodyHeight);
    obstacle.body.setOffset(
      (obstacle.width - bodyWidth) / 2,
      obstacle.height - bodyHeight - 2 // Reduce the bottom offset to position it closer to the path
    );

    // Use consistent speed
    obstacle.setVelocityX(this.OBSTACLE_SPEED);
    
    // Schedule next spawn using current spawn times with moderate randomness
    const baseSpawnTime = Phaser.Math.Between(this.MIN_SPAWN_TIME, this.MAX_SPAWN_TIME);
    const nextSpawnTime = baseSpawnTime;
    
    // Check if we've reached the max obstacles
    if (this.obstacles.getChildren().length <= ENEMY.MAX_ON_SCREEN) {
      this.time.delayedCall(nextSpawnTime, () => this.spawnObstacle(), [], this);
    }
  }

  onObstacleCollision(player, obstacle) {
    if (this.isPoweredUp || DEBUG.INVINCIBLE) {
      // Add a spinning effect before destroying the obstacle
      this.tweens.add({
        targets: obstacle,
        angle: obstacle.angle + 360, // One full spin instead of two
        scale: obstacle.scale * 0.5, // Shrink while spinning
        alpha: 0, // Fade out
        duration: 300, // Reduced duration
        ease: 'Power2',
        onComplete: () => {
          // Simplified explosion effect
          const explosion = this.add.particles(obstacle.x, obstacle.y, 'particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.2, end: 0 },
            alpha: { start: 1, end: 0 },
            tint: EFFECTS.PARTICLES.POWERUP.COLORS,
            lifespan: EFFECTS.PARTICLES.POWERUP.LIFETIME / 2, // Reduced lifetime
            quantity: EFFECTS.PARTICLES.POWERUP.COUNT / 2, // Reduced particle count
            emitting: false
          });
          explosion.explode(EFFECTS.PARTICLES.POWERUP.COUNT / 2);
          obstacle.destroy();
        }
      });

      // Add reduced screen shake
      this.cameras.main.shake(100, 0.002);
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
    
    coin.setScale(COIN.SCALE);
    coin.setVelocityX(this.COIN_SPEED); // Use current speed
    coin.setBounce(0);
    coin.setGravityY(0);
    
    coin.body.setSize(COIN.BODY.WIDTH, COIN.BODY.HEIGHT);
    coin.body.setOffset(COIN.BODY.OFFSET_X, COIN.BODY.OFFSET_Y);
    
    coin.play(COIN.ANIMATION.KEYS.SPIN);

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

    // Create particle effect for coin collection
    const particles = this.add.particles(coin.x, coin.y, 'particle', {
      speed: { min: 50, max: EFFECTS.PARTICLES.COIN_COLLECT.SPEED * 100 },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: EFFECTS.PARTICLES.COIN_COLLECT.COLORS,
      lifespan: EFFECTS.PARTICLES.COIN_COLLECT.LIFETIME,
      quantity: EFFECTS.PARTICLES.COIN_COLLECT.COUNT,
      emitting: false
    });
    particles.explode(EFFECTS.PARTICLES.COIN_COLLECT.COUNT);

    // Play coin collection animation and destroy after
    coin.play(COIN.ANIMATION.KEYS.COLLECT).once('animationcomplete', () => {
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
      fontFamily: 'monospace',
      fontSize: '32px',
      fontWeight: 'bold',
      fill: '#ffffff',
      padding: { x: 16, y: 8 }
    });
    powerupText.setOrigin(0.5);
    powerupText.setDepth(100);

    // Simple fade out
    this.tweens.add({
      targets: powerupText,
      alpha: 0,
      y: powerupText.y - 30,
      duration: 600,
      onComplete: () => powerupText.destroy()
    });

    // Create minimal progress bar
    this.createPowerupProgressBar();

    // Start powerup timer
    this.powerupTimer = this.time.delayedCall(this.powerupDuration, () => {
      this.deactivatePowerup();
    }, [], this);

    // Add simple glow effect - optimized for better browser performance
    const glow = this.add.sprite(this.player.x, this.player.y, 'particle');
    glow.setScale(4);
    glow.setAlpha(0.12);
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

  /**
   * Creates a progress bar to visualize the remaining powerup duration
   * The bar depletes as the powerup timer counts down
   */
  createPowerupProgressBar() {
    // UI constants
    const PROGRESS_BAR = {
      WIDTH: 150,
      HEIGHT: 8,
      Y_POSITION: 16,
      UPDATE_FREQUENCY: 500, // ms
      BACKGROUND_OPACITY: 0.4,
      COLOR: 0x6542be
    };
    
    const x = this.sys.game.config.width / 2 - PROGRESS_BAR.WIDTH / 2;
    const y = PROGRESS_BAR.Y_POSITION;

    // Background bar
    const background = this.add.rectangle(x, y, PROGRESS_BAR.WIDTH, PROGRESS_BAR.HEIGHT, 0x000000);
    background.setOrigin(0, 0);
    background.setAlpha(PROGRESS_BAR.BACKGROUND_OPACITY);
    background.setDepth(100);

    // Progress bar
    this.powerupProgressBar = this.add.rectangle(x, y, PROGRESS_BAR.WIDTH, PROGRESS_BAR.HEIGHT, PROGRESS_BAR.COLOR);
    this.powerupProgressBar.setOrigin(0, 0);
    this.powerupProgressBar.setDepth(100);
    this.powerupProgressBar.background = background;

    // Update progress bar less frequently
    this.powerupProgressTimer = this.time.addEvent({
      delay: PROGRESS_BAR.UPDATE_FREQUENCY,
      repeat: this.powerupDuration / PROGRESS_BAR.UPDATE_FREQUENCY - 1,
      callback: () => {
        if (this.powerupProgressBar && !this.isGameOver) {
          const progress = 1 - (this.powerupTimer.getProgress() || 0);
          this.powerupProgressBar.width = PROGRESS_BAR.WIDTH * progress;
        }
      }
    });
  }

  createAnimations() {
    try {
      // Create idle animation
      const idleAnim = this.anims.create({
        key: PLAYER.STATES.IDLE,
        frames: [
          { key: 'idle-0' },
          { key: 'idle-1' }
        ],
        frameRate: 1000 / PLAYER.SPRITE_CONFIG.ANIMATION_SPEED, // Convert ms to frameRate
        repeat: -1,
        yoyo: true,
        duration: 1000
      });

      // Create running animation
      const runAnim = this.anims.create({
        key: PLAYER.STATES.RUNNING,
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
        key: PLAYER.STATES.JUMPING,
        frames: [
          { key: 'jump-0' },
          { key: 'jump-1' }
        ],
        frameRate: 10,
        repeat: 0
      });

      const jumpDownAnim = this.anims.create({
        key: PLAYER.STATES.FALLING,
        frames: [
          { key: 'jump-2' },
          { key: 'jump-3' }
        ],
        frameRate: 10,
        repeat: 0
      });

      // Create landing animation
      const landAnim = this.anims.create({
        key: PLAYER.STATES.LANDING,
        frames: [
          { key: 'land-0' },
          { key: 'land-1' }
        ],
        frameRate: 15,
        repeat: 0
      });

      // Create coin spinning animation
      const coinSpinAnim = this.anims.create({
        key: COIN.ANIMATION.KEYS.SPIN,
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
        key: COIN.ANIMATION.KEYS.COLLECT,
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

  resetGameState() {
    // This method is now only called from create() or after all game objects are initialized
    if (!this.scene.isActive()) return;

    // Reset score and flags
    this.score = 0;
    this.isGameOver = false;
    this.difficultyIncreases = 0;
    
    // Reset speeds to base values
    this.OBSTACLE_SPEED = this.BASE_OBSTACLE_SPEED;
    this.COIN_SPEED = this.BASE_COIN_SPEED;
    this.MIN_SPAWN_TIME = this.BASE_MIN_SPAWN_TIME;
    this.MAX_SPAWN_TIME = this.BASE_MAX_SPAWN_TIME;
    
    // Make restart button visible again
    if (this.restartButton) {
      this.restartButton.setVisible(true);
    }
    
    // Reset player position and state if it exists
    if (this.player && this.player.body) {
      this.player.setPosition(100, 450);
      this.player.setVelocity(0, 0);
      if (this.animsCreated) {
        this.player.play(PLAYER.STATES.IDLE);
      }
    }
    
    // Clear existing groups
    if (this.obstacles) {
      this.obstacles.clear(true, true);
    }
    if (this.coins) {
      this.coins.clear(true, true);
    }
    
    // Reset powerup state
    this.isPoweredUp = false;
    if (this.powerupTimer) {
      this.powerupTimer.remove();
      this.powerupTimer = null;
    }
    if (this.powerupProgressBar) {
      if (this.powerupProgressBar.background) {
        this.powerupProgressBar.background.destroy();
      }
      this.powerupProgressBar.destroy();
      this.powerupProgressBar = null;
    }
    if (this.powerupEmitter) {
      this.powerupEmitter.stop();
      this.powerupEmitter = null;
    }
    if (this.powerupGlow) {
      this.powerupGlow.destroy();
      this.powerupGlow = null;
    }
    
    // Update score display if it exists
    if (this.scoreText) {
      this.scoreText.setText('Score: 0');
    }

    // Resume physics if it was paused
    if (this.physics && this.physics.resume) {
      this.physics.resume();
    }

    // Restart spawning
    this.spawnObstacle();
    this.spawnCoin();
  }

  // Add FPS counter update method
  updateFPS() {
    if (this.fpsText) {
      this.fpsText.setText('FPS: ' + Math.round(this.game.loop.actualFps));
    }
  }
}

export { GameScene }; 