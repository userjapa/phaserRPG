var player, cursor, txtScore, score, map, block, monster = [], tiles, life, health, music

var game = new Phaser.Game(
    '100%',
    '100%',
    Phaser.CANVAS,
    'Game Demo', {
        preload: preload,
        create: create,
        update: update
    }
)

function preload() {
    game.load.spritesheet('player', 'img/hero.png', 32, 48)
    game.load.spritesheet('monster0', 'img/monster.png', 50, 48)
    game.load.spritesheet('monster1', 'img/monster2.png', 48, 64)
    game.load.spritesheet('monster2', 'img/monster3.png', 32, 48)
    game.load.spritesheet('monster3', 'img/monster4.png', 80, 80)
    game.load.spritesheet('monster4', 'img/monster5.png', 96, 96)
    game.load.spritesheet('monster5', 'img/monster6.png', 32, 46)
    game.load.spritesheet('monster6', 'img/monster7.png', 32, 46)
    game.load.spritesheet('monster7', 'img/monster8.png', 32, 46)
    game.load.spritesheet('monster8', 'img/monster9.png', 32, 46)
    game.load.spritesheet('monster9', 'img/monster10.png', 32, 46)
    game.load.tilemap('background', 'img/map.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tiles', 'img/map.png')
    game.load.audio('music', 'music/music1.mp3')
    game.load.audio('ping', 'sound/ping.mp3')
}

function create() {
    game.stage.backgroundColor = '#787878'
    
    map = game.add.tilemap('background')
    map.addTilesetImage('map','tiles')
    
    map.setCollisionBetween(100, 600)
    
    var world = map.createLayer('map')
    world.resizeWorld()
    block = map.createLayer('block')
    block.scale.set(1)
    block.resizeWorld()
    
    player = game.add.sprite(30, 15, 'player')
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true
    player.body.bounce.setTo(0.4 + Math.random() * 0.75, 0.4 + Math.random() * 0.75)
    player.body.velocity.setTo(0 + Math.random() * 0.75, 0 + Math.random() * 0.75)
    player.animations.add('walkDown', [0, 1, 2, 3])
    player.animations.add('walkLeft', [4, 5, 6, 7])
    player.animations.add('walkRight', [8, 9, 10, 11])
    player.animations.add('walkUp', [12, 13, 14, 15])
    
    game.camera.follow(player)
    
    life = new HealthBar(game, {x: 1110, y: 25, animationDuration: 200})
    
    life.setFixedToCamera(true)
    
    addMonster()

    score = 0;
    var style = {
        font: '25px Arial',
        fill: '#bddb28'
    };
    txtScore = game.add.text(1000, 50, "Monsters Killed: "+score.toString(), style);
    txtScore.fixedToCamera = true
    
    health = 100

    cursors = game.input.keyboard.createCursorKeys();

    music = game.sound.play('music')
    music.volume = 1
    music.loopFull();

}

function update() {
    game.physics.arcade.collide(player, block)
    if (cursors.left.isDown) {
        player.animations.play('walkLeft')
        player.x -= 5;
    } else if (cursors.right.isDown) {
        player.animations.play('walkRight')
        player.x += 5;
    } else if (cursors.up.isDown) {
        player.animations.play('walkUp')
        player.y -= 5;
    } else if (cursors.down.isDown) {
        player.animations.play('walkDown')
        player.y += 5;
    } else {
        player.animations.stop();
    }

    game.physics.arcade.collide(player, monster, monsterHitHandler);

    if (score >= 10) {
        score = 0;
    }
    
    if (health <= 0) {
        music.stop()
        game.state.restart()    
    }
}

function addMonster() {
    for (var i = 0; i < 10; i++ ) {
        monster[i] = game.add.sprite(Math.random() * game.width, Math.random() * game.height, 'monster'+i);
        game.physics.enable(monster[i], Phaser.Physics.ARCADE)
        monster[i].body.collideWorldBounds = true
        monster[i].animations.add('walkDown', [0, 1, 2, 3])
        monster[i].animations.add('walkLeft', [4, 5, 6, 7])
        monster[i].animations.add('walkRight', [8, 9, 10, 11])
        monster[i].animations.add('walkUp', [12, 13, 14, 15]) 
    }
}

function monsterHitHandler(playerObject, monsterObject) {
    monsterObject.destroy()
    score++;
    health -= 10
    life.setPercent(health)
    txtScore.setText("Monsters Killed: "+score.toString());
    game.sound.play('ping')
}