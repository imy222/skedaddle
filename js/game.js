// Initialize the Phaser game with our configuration
const game = new Phaser.Game(config);

// Global game settings
window.GAME_SETTINGS = {
    SCROLL_SPEED: 300,
    JUMP_VELOCITY: -400,
    SPAWN_RATE: 2000,
    INITIAL_SCORE: 0
}; 