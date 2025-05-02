const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [
        BootScene,
        MenuScene,
        GameScene,
        GameOverScene
    ],
    pixelArt: true, // Enable pixel art mode for crisp rendering
    backgroundColor: '#000000'
}; 