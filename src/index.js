import Phaser from "phaser";

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [Preloader, Game],
    scale: {
        zoom: 2
    }
};

export default new Phaser.Game(config);
