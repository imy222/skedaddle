class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Load assets here
        // this.load.image('player', 'assets/player.png');
        // this.load.image('coin', 'assets/coin.png');
        // this.load.image('obstacle', 'assets/obstacle.png');
    }

    create() {
        // Once assets are loaded, start the menu scene
        this.scene.start('MenuScene');
    }
} 