// Canvas dimensions
export const CANVAS = {
    WIDTH: 800,
    HEIGHT: 600,
    GROUND_Y: 550
};

// Physics constants
export const PHYSICS = {
    GRAVITY: 0.5,
    JUMP_FORCE: -12,
    JUMP_HOLD_FORCE: -5,     // Additional force when holding jump button
    MAX_JUMP_TIME: 300      // Max time in ms player can hold jump for extra height
};

// Player constants
export const PLAYER = {
    MOVE_SPEED: 5,
    STATES: {
        IDLE: 'idle',
        RUNNING: 'running',
        JUMPING: 'jumping',
        FALLING: 'falling',
        POWERED_UP: 'powered_up',
        LANDING: 'land'
    },
    SPRITE_CONFIG: {
        ANIMATION_SPEED: 100 // ms per frame
    }
};

// Enemy constants
export const ENEMY = {
    TYPES: {
        GROUND: {
            WIDTH: 40,
            HEIGHT: 40,
            SPEED: -4,
            POINTS: 100
        },
        FLYING: {
            WIDTH: 40,
            HEIGHT: 40,
            SPEED: -6,
            POINTS: 150,
            VERTICAL_AMPLITUDE: 50,
            OSCILLATION_SPEED: 0.05
        }
    },
    OBSTACLE_TYPES: ['overtime-clock'],
    MAX_ON_SCREEN: 5,
    SPAWN_RATE: 3000,  // Increased base time between spawns
    SPAWN_VARIANCE: 1000, // Moderate random variance
    MIN_DISTANCE: 350, // Minimum distance between obstacles
    CLOCK: {
        SCALE: 0.06
    }
};

// Coin constants
export const COIN = {
    BASE_SPEED: -250,
    SPAWN_RATE: {
        MIN: 1000,
        MAX: 3000
    },
    VALUE: 1,
    MAX_ON_SCREEN: 8,
    SCALE: 0.05,
    BODY: {
        WIDTH: 24,
        HEIGHT: 24,
        OFFSET_X: -6,
        OFFSET_Y: -6
    },
    ANIMATION: {
        KEYS: {
            SPIN: 'coin-spin',
            COLLECT: 'coin-collect'
        }
    }
};

// Power-up constants
export const POWERUP = {
    DURATION: 10000,  // 10 seconds
    THRESHOLD: 10,    // Coins needed for powerup
    EFFECTS: {
        SPEED_MULTIPLIER: 1.5,
        SCALE: 1.5
    }
};

// Game progression constants
export const PROGRESSION = {
    DIFFICULTY_INCREASE_INTERVAL: 30000,  // Increase difficulty every 30 seconds
    SPEED_INCREASE: 1.1,                  // 10% faster each level
    SPAWN_RATE_DECREASE: 0.9,             // 10% faster spawning each level
    MAX_DIFFICULTY_LEVEL: 5,
    SCORE_MULTIPLIER: {
        BASE: 1,
        POWERUP: 2,
        COMBO: 1.5
    }
};

// Visual effects constants
export const EFFECTS = {
    PARALLAX_LAYERS: [
        { speed: 0.2, image: 'bg-far' },
        { speed: 0.4, image: 'bg-mid' },
        { speed: 0.8, image: 'bg-front' }
    ],
    PARTICLES: {
        MAX_PARTICLES: 50,
        COIN_COLLECT: {
            COUNT: 5,
            SPEED: 2,
            LIFETIME: 500,
            COLORS: ['#FFD700', '#FFF68F', '#FFEC8B']
        },
        POWERUP: {
            COUNT: 20,
            SPEED: 3,
            LIFETIME: 1000,
            COLORS: ['#6542be', '#7e57c2', '#9575cd']
        }
    }
};

// Debug settings
export const DEBUG = {
    SHOW_HITBOXES: false,
    SHOW_FPS: false,
    SHOW_SPAWN_POINTS: false,
    INVINCIBLE: false
};

// Game specific constants
export const GAME = {
    SCALE: {
        PLAYER: 0.1
    }
}; 