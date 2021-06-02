import Phaser from 'phaser'
import asset from '../assets/spreadsheet.png'
import level from '../assets/level-01.json'
import texturePng from '../assets/character/texture.png'
import textureJson from '../assets/character/texture.json'

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('preloader');
    }

    preload(){
        this.load.image('tiles', asset)
        this.load.tilemapTiledJSON('level', level)
        this.load.atlas('player', texturePng, textureJson)
    }

    create() {
        this.scene.start('game')
    }
}