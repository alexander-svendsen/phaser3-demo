import Phaser from 'phaser';

var
stars,
score = 0,
scoreText,
bombs,
gameOver = false;

export default class Game extends Phaser.Scene {

    cursors;
    player;
    pickups;
    jumped = false;
    squashAnimationPlaying = false;
    scoreText;
    enemies;
    score = 0
    gameOver = false

    constructor() {
        super('game');
    }

    preload () {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    collectPickup (player, pickup)
    {
        pickup.disableBody(true, true);

        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.pickups.countActive(true) === 0)
        {
            this.pickups.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            const x = (this.player.x < 200) ? Phaser.Math.Between(200, 400) : Phaser.Math.Between(0, 200);
            this.spawnEnemy(x)

        }
    }

    hitByEnemy (player, enemy) {
        this.physics.pause();
        this.anims.pauseAll();
        player.setTint(0xff0000);
        this.gameOver = true;
    }

    spawnEnemy(x){
        const enemy = this.enemies.create(x, 16, 'enemy');
        enemy.body.setSize(9,9)
        enemy.anims.play('enemy-anim', true)
        enemy.setBounce(1);
        enemy.body.setAllowGravity(false)
        enemy.setCollideWorldBounds(true);
        enemy.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100,100));
    }

    create () {
        this.cameras.main.setBackgroundColor('#1d212d')

        const map = this.make.tilemap({key: 'level'})
        const tileset = map.addTilesetImage('level', 'tiles')

        map.createLayer('Ground', tileset)
        const platformLayer = map.createLayer('Walls', tileset)

        platformLayer.setCollisionByProperty({collides: true})

        this.player = this.physics.add.sprite(50,255, 'player','idle1.png')
        this.player.body.setSize(10, 16)
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platformLayer);


        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNames('player', {start: 1, end: 3, prefix: 'idle', suffix: '.png'}),
            repeat: -1,
            frameRate: 3
        })

        this.anims.create({
            key: 'player-run',
            frames: this.anims.generateFrameNames('player', {start: 1, end: 3, prefix: 'run', suffix: '.png'}),
            repeat: -1,
            frameRate: 6
        })

        this.anims.create({
            key: 'player-squash',
            frames: this.anims.generateFrameNames('player', {start: 1, end: 3, prefix: 'squash', suffix: '.png'}),
            repeat: 0,
            frameRate: 18
        })

        this.anims.create({
            key: 'player-jump',
            frames: this.anims.generateFrameNames('player', {start: 1, end: 5, prefix: 'jump', suffix: '.png'}),
            repeat: -1,
            frameRate: 4
        })

        this.anims.create({
            key: 'enemy-anim',
            frames: this.anims.generateFrameNames('enemy', {start: 1, end: 12, prefix: '', suffix: '.png'}),
            repeat: -1,
            frameRate: 4
        })

        this.player.anims.play('player-idle')

        this.pickups = this.physics.add.group({
            key: 'pickup',
            repeat: 11,
            setXY: { x: 6, y: 0, stepX: 35 }
        });

        this.pickups.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
        });

        this.physics.add.collider(this.pickups, platformLayer);
        this.physics.add.overlap(this.player, this.pickups, this.collectPickup, null, this);


        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontFamily:'ps2p', fontSize: '8px', fill: '#fff' });
        this.add.text(240, 310, 'Hit space to restart', { fontFamily:'ps2p', fontSize: '8px', fill: '#fff' });

        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, platformLayer);
        this.physics.add.collider(this.player, this.enemies, this.hitByEnemy, null, this);

        this.spawnEnemy(350)
    }

    update(){

        if(!this.cursors || !this.player){
            return;
        }

        if(this.cursors.space.isDown){
            this.score = 0;
            this.gameOver = false;
            this.anims.resumeAll();
            this.scene.restart();
        }

        if(this.gameOver){
            return
        }


        const speed = 100

        if (this.cursors.left.isDown) {

            this.player.setVelocityX(-speed);
            this.player.scaleX = -1;
            this.player.body.offset.x = 13

            if(!this.squashAnimationPlaying) {
                if (!this.player.body.onFloor()) {
                    this.player.anims.play('player-jump', true);
                } else {
                    this.player.anims.play('player-run', true);
                }
            }
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);

            this.player.scaleX = 1;
            this.player.body.offset.x = 3

            if(!this.squashAnimationPlaying) {

                if (!this.player.body.onFloor()) {
                    this.player.anims.play('player-jump', true);
                } else {
                    this.player.anims.play('player-run', true);
                }
            }
        }
        else if (!this.player.body.onFloor()) {
            this.player.setVelocityX(0);
            this.player.anims.play('player-jump', true);
        }
        else {
            this.player.setVelocityX(0);

            if(!this.squashAnimationPlaying){
                this.player.anims.play('player-idle', true);
            }
        }

        if (this.cursors.up.isDown && this.player.body.onFloor()) {
            this.player.setVelocityY(-285);
        }

        if(!this.player.body.onFloor()){
            this.jumped = true;
        }

        if(this.player.body.onFloor() && this.jumped && this.player.body.velocity.y === 0){
            this.player.anims.play('player-squash', true);
            this.jumped = false;
            this.squashAnimationPlaying = true

            this.player.once('animationcomplete', () => {
                this.squashAnimationPlaying = false
            });
        }
    }

}


