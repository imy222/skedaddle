import { POWERUP, PROGRESSION } from '../config/gameConstants.js';

export class GameState {
    constructor() {
        // Game status
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        
        // Score and progression
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.difficultyLevel = 0;
        this.lastDifficultyIncrease = 0;
        this.scoreMultiplier = PROGRESSION.SCORE_MULTIPLIER.BASE;
        
        // Power-up state
        this.powerupActive = false;
        this.powerupTimer = 0;
        this.coinsForNextPowerup = POWERUP.THRESHOLD;
        
        // Collection tracking
        this.totalCoinsCollected = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;
        
        // Entity tracking
        this.activeEnemies = [];
        this.activeCoins = [];
        this.particles = [];
        
        // Game speed
        this.gameSpeed = 1;
        this.targetGameSpeed = 1;
    }

    update(deltaTime) {
        if (!this.isPlaying || this.isPaused) return;

        // Update power-up timer
        if (this.powerupActive) {
            this.powerupTimer -= deltaTime;
            if (this.powerupTimer <= 0) {
                this.deactivatePowerup();
            }
        }

        // Update difficulty progression
        this.lastDifficultyIncrease += deltaTime;
        if (this.lastDifficultyIncrease >= PROGRESSION.DIFFICULTY_INCREASE_INTERVAL &&
            this.difficultyLevel < PROGRESSION.MAX_DIFFICULTY_LEVEL) {
            this.increaseDifficulty();
        }

        // Smooth game speed transition
        if (this.gameSpeed !== this.targetGameSpeed) {
            const speedDiff = this.targetGameSpeed - this.gameSpeed;
            this.gameSpeed += speedDiff * 0.1;
        }
    }

    addScore(points) {
        const basePoints = points * this.scoreMultiplier;
        let finalPoints = basePoints;

        // Apply power-up multiplier
        if (this.powerupActive) {
            finalPoints *= PROGRESSION.SCORE_MULTIPLIER.POWERUP;
        }

        // Apply combo multiplier
        if (this.currentCombo > 1) {
            finalPoints *= PROGRESSION.SCORE_MULTIPLIER.COMBO;
        }

        this.score += Math.round(finalPoints);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
    }

    collectCoin() {
        this.totalCoinsCollected++;
        this.currentCombo++;
        this.maxCombo = Math.max(this.maxCombo, this.currentCombo);

        // Check for power-up activation
        if (this.totalCoinsCollected >= this.coinsForNextPowerup) {
            this.activatePowerup();
        }
    }

    activatePowerup() {
        this.powerupActive = true;
        this.powerupTimer = POWERUP.DURATION;
        this.coinsForNextPowerup += POWERUP.THRESHOLD;
        this.scoreMultiplier *= POWERUP.EFFECTS.SPEED_MULTIPLIER;
    }

    deactivatePowerup() {
        this.powerupActive = false;
        this.powerupTimer = 0;
        this.scoreMultiplier = PROGRESSION.SCORE_MULTIPLIER.BASE;
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        this.lastDifficultyIncrease = 0;
        this.targetGameSpeed *= PROGRESSION.SPEED_INCREASE;
    }

    resetCombo() {
        this.currentCombo = 0;
    }

    startGame() {
        this.isPlaying = true;
        this.gameOver = false;
        this.score = 0;
        this.difficultyLevel = 0;
        this.gameSpeed = 1;
        this.targetGameSpeed = 1;
        this.lastDifficultyIncrease = 0;
        this.powerupActive = false;
        this.powerupTimer = 0;
        this.coinsForNextPowerup = POWERUP.THRESHOLD;
        this.totalCoinsCollected = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.activeEnemies = [];
        this.activeCoins = [];
        this.particles = [];
    }

    pauseGame() {
        this.isPaused = true;
    }

    resumeGame() {
        this.isPaused = false;
    }

    endGame() {
        this.isPlaying = false;
        this.gameOver = true;
        this.saveHighScore();
    }

    loadHighScore() {
        const saved = localStorage.getItem('highScore');
        return saved ? parseInt(saved) : 0;
    }

    saveHighScore() {
        localStorage.setItem('highScore', this.highScore.toString());
    }

    getGameStats() {
        return {
            score: this.score,
            highScore: this.highScore,
            coinsCollected: this.totalCoinsCollected,
            maxCombo: this.maxCombo,
            difficultyLevel: this.difficultyLevel,
            gameSpeed: this.gameSpeed,
            powerupActive: this.powerupActive,
            powerupTimeLeft: this.powerupTimer,
            coinsUntilPowerup: this.coinsForNextPowerup - this.totalCoinsCollected
        };
    }
} 