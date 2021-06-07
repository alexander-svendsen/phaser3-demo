import Phaser from 'phaser'
import asset from '../assets/spreadsheet.png'
import pickup from '../assets/pickup.png'
import level from '../assets/level-01.json'
import textureCharacterPng from '../assets/character/characterTexture.png'
import textureEnemyPng from '../assets/enemy/enemyTexture.png'
import textureCharacterJson from '../assets/character/characterTexture.json'
import textureEnemyJson from '../assets/enemy/enemyTexture.json'
import WebFontFile from "../utils/WebFontFile";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload(){
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 100, height / 2, 200, 28);
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 15,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 15,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', function (value) {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.fillRect(width / 2 - 96, height / 2 + 4, 192 * value, 20);
        });

        this.load.once('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        this.load.image('tiles', asset)
        this.load.image('pickup', pickup)
        this.load.tilemapTiledJSON('level', level)
        this.load.atlas('player', textureCharacterPng, textureCharacterJson)
        this.load.atlas('enemy', textureEnemyPng, textureEnemyJson)

        this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    }

    create() {
        this.scene.start('game')
    }
}