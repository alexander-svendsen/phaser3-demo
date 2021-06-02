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
    jumped = false;
    squashAnimationPlaying = false;

    constructor() {
        super('game');
    }


    preload () {
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    collectStar (player, star)
    {
        star.disableBody(true, true);

        this.score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0)
        {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

        }
    }

    hitBomb (player, bomb)
    {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        this.gameOver = true;
    }

    create () {
        this.cameras.main.setBackgroundColor('#1d212d')

        const map = this.make.tilemap({key: 'level'})
        const tileset = map.addTilesetImage('level', 'tiles')

        map.createLayer('Ground', tileset)
        const platformLayer = map.createLayer('Walls', tileset)

        platformLayer.setCollisionByProperty({collides: true})

        this.player = this.physics.add.sprite(50,255, 'player','idle1.png')
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



        this.player.anims.play('player-idle')

        /*
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });


        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);*/

    }

    update(){
        if(!this.cursors || !this.player){
            return;
        }

        const speed = 100

        if (this.cursors.left.isDown) {

            this.player.setVelocityX(-speed);
            this.player.scaleX = -1;
            this.player.body.offset.x = 16

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
            this.player.body.offset.x = 0

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
            this.player.setVelocityY(-200);
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


