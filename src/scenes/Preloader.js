import Phaser from 'phaser'
import asset from '../assets/spreadsheet.png'
import pickup from '../assets/pickup.png'
import level from '../assets/level-01.json'
import textureCharacterPng from '../assets/character/texture.png'
import textureEnemyPng from '../assets/enemy/texture.png'
import textureCharacterJson from '../assets/character/texture.json'
import textureEnemyJson from '../assets/enemy/texture.json'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload(){
        this.load.image('tiles', asset)
        this.load.image('pickup', pickup)
        this.load.tilemapTiledJSON('level', level)
        this.load.atlas('player', textureCharacterPng, textureCharacterJson)
        this.load.atlas('enemy', textureEnemyPng, textureEnemyJson)
    }

    create() {
        this.scene.start('game')
    }
}