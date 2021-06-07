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
            gravity: { y: 600 },
            debug: false
        }
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    scene: [Preloader, Game],
    scale: {
        zoom: 2
    }
};

export default new Phaser.Game(config);
