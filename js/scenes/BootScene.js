class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        // Create loading bar
        this.createLoadingBar();

        // Load background assets
        this.load.image('background-far', 'assets/background/development/far/background_far.png');
        this.load.image('background-middle', 'assets/background/development/middle/background-middle.png');
        this.load.image('background-front', 'assets/background/development/front/background_front.png');

        // Character assets will be loaded later
        // this.load.spritesheet('character', 'assets/character/final/character.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        // Create animations once we have character assets
        // this.createAnimations();

        // Start the menu scene
        this.scene.start('MenuScene');
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
        
        const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        loadingText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x6542be, 1); // MYOB Purple
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }
} 