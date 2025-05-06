class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        console.log('BootScene: constructor');
    }

    init() {
        console.log('BootScene: init');
        // Store references to loading graphics
        this.loadingGraphics = {
            progressBar: null,
            progressBox: null,
            loadingText: null
        };
    }

    preload() {
        console.log('BootScene: preload started');
        // Create loading bar
        this.createLoadingBar();

        // Create particle texture
        const particleTexture = this.textures.createCanvas('particle', 8, 8);
        const particleContext = particleTexture.getContext();
        particleContext.fillStyle = '#ffffff';
        particleContext.beginPath();
        particleContext.arc(4, 4, 4, 0, Math.PI * 2);
        particleContext.fill();
        particleTexture.refresh();

        // Load background assets
        this.load.image('background-far', './assets/background/development/far/background_far.png');
        this.load.image('background-middle', './assets/background/development/middle/background_middle_2.png');
        this.load.image('background-front', './assets/background/development/front/background_front.png');

        // Load individual character frames with transparency
        console.log('Loading character idle frames...');
        this.load.image('idle-0', './assets/character/development/idle/frame-0.png');
        this.load.image('idle-1', './assets/character/development/idle/frame-1.png');
        this.load.image('idle-2', './assets/character/development/idle/frame-2.png');
        this.load.image('idle-3', './assets/character/development/idle/frame-3.png');

        // Running animation frames
        this.load.image('run-0', './assets/character/development/running/frame-0.png');
        this.load.image('run-1', './assets/character/development/running/frame-1.png');
        this.load.image('run-2', './assets/character/development/running/frame-2.png');
        this.load.image('run-3', './assets/character/development/running/frame-3.png');
        this.load.image('run-4', './assets/character/development/running/frame-4.png');
        this.load.image('run-5', './assets/character/development/running/frame-5.png');

        // Jumping animation frames with transparency
        console.log('Loading jumping frames...');
        this.load.image('jump-0', './assets/character/development/jumping/frame-0.png', { premultiplyAlpha: true });
        this.load.image('jump-1', './assets/character/development/jumping/frame-1.png', { premultiplyAlpha: true });
        this.load.image('jump-2', './assets/character/development/jumping/frame-2.png', { premultiplyAlpha: true });
        this.load.image('jump-3', './assets/character/development/jumping/frame-3.png', { premultiplyAlpha: true });

        // Landing animation frames with transparency
        console.log('Loading landing frames...');
        this.load.image('land-0', './assets/character/development/landing/frame-0.png', { premultiplyAlpha: true });
        this.load.image('land-1', './assets/character/development/landing/frame-1.png', { premultiplyAlpha: true });
        this.load.image('land-2', './assets/character/development/landing/frame-2.png', { premultiplyAlpha: true });

        // Load coin spinning frames
        console.log('Loading coin spinning frames...');
        this.load.image('coin-spin-0', './assets/coins/development/spinning/spinning-frame-0.png');
        this.load.image('coin-spin-1', './assets/coins/development/spinning/spinning-frame-1.png');
        this.load.image('coin-spin-2', './assets/coins/development/spinning/spinning-frame-2.png');
        this.load.image('coin-spin-3', './assets/coins/development/spinning/spinning-frame-3.png');
        this.load.image('coin-spin-4', './assets/coins/development/spinning/spinning-frame-4.png');
        this.load.image('coin-spin-5', './assets/coins/development/spinning/spinning-frame-5.png');
        this.load.image('coin-spin-6', './assets/coins/development/spinning/spinning-frame-6.png');
        this.load.image('coin-spin-7', './assets/coins/development/spinning/spinning-frame-7.png');

        // Load coin collection frames
        console.log('Loading coin collection frames...');
        this.load.image('coin-collect-0', './assets/coins/development/collection/collection-frame-0.png');
        this.load.image('coin-collect-1', './assets/coins/development/collection/collection-frame-1.png');
        this.load.image('coin-collect-2', './assets/coins/development/collection/collection-frame-2.png');
        this.load.image('coin-collect-3', './assets/coins/development/collection/collection-frame-3.png');
        this.load.image('coin-collect-4', './assets/coins/development/collection/collection-frame-4.png');
        this.load.image('coin-collect-5', './assets/coins/development/collection/collection-frame-5.png');

        // Load obstacle asset
        this.load.image('obstacles-overtime-clock', './assets/obstacles/development/obstacles-overtime-clock.png');

        console.log('BootScene: preload completed');
    }

    create() {
        // Clean up loading graphics
        this.cleanupLoadingGraphics();
        
        // Hide the HTML loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }

        // Clear any remaining graphics
        this.add.graphics().clear();
        
        // Start the menu scene
        this.scene.start('MenuScene');
    }

    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Create loading graphics
        this.loadingGraphics.progressBar = this.add.graphics();
        this.loadingGraphics.progressBox = this.add.graphics();
        this.loadingGraphics.progressBox.fillStyle(0x222222, 0.8);
        this.loadingGraphics.progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);
        
        this.loadingGraphics.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
            font: '20px monospace',
            fill: '#ffffff'
        });
        this.loadingGraphics.loadingText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', (value) => {
            this.loadingGraphics.progressBar.clear();
            this.loadingGraphics.progressBar.fillStyle(0x6542be, 1);
            this.loadingGraphics.progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);

            // Update the HTML loading bar as well
            const htmlProgress = document.getElementById('loading-progress');
            if (htmlProgress) {
                htmlProgress.style.width = `${value * 100}%`;
            }
        });
    }

    cleanupLoadingGraphics() {
        // Destroy all loading graphics
        if (this.loadingGraphics.progressBar) {
            this.loadingGraphics.progressBar.destroy();
        }
        if (this.loadingGraphics.progressBox) {
            this.loadingGraphics.progressBox.destroy();
        }
        if (this.loadingGraphics.loadingText) {
            this.loadingGraphics.loadingText.destroy();
        }

        // Remove all listeners
        this.load.off('progress');
        
        // Clear any remaining graphics
        this.add.graphics().clear();
    }
}

export { BootScene }; 