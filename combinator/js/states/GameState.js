var Combinator = Combinator || {};
/*global Phaser*/
Combinator.GameState = {
    
    init: function(currentLevel){
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.PLAYER_SPEED = 200;
        this.BULLET_SPEED = -200;
        
        this.MIN_Y = 20;
        this.MAX_Y = 40;
        this.MIN_X = -50;
        this.MAX_X = 50;
        
        this.dead = false;
        
        Combinator.WINNING_SCORE = 4;
        
        Combinator.trophyDogHead = false;
        Combinator.trophyDogTorso = false;
        Combinator.trophyDogLegs = false;
        Combinator.trophyGatorHead = false;
        Combinator.trophyGatorTorso = false;
        Combinator.trophyGatorLegs = false;
        Combinator.trophyAlienHead = false;
        Combinator.trophyAlienTorso = false;
        Combinator.trophyAlienLegs = false;
        
        Combinator.cleanUp = false;
        Combinator.score = 0;
        Combinator.winGame = false;
        
        //level data
        this.numLevels = 3;
        this.currentLevel = currentLevel ? currentLevel : 1;
       // console.log('current level: ' +  this.currentLevel);
    },
    
    
   
    
    create: function(){
        
        this.background = this.add.sprite(0, 0, 'bg');
        
        
        //player
        this.player = this.add.sprite(this.game.world.centerX, this.game.world.height - 65, 'player');
        this.player.anchor.setTo(0.5);
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;
        
        //bullets and shooting timer
        this.initBullets();
        this.shootingTimer = this.game.time.events.loop(Phaser.Timer.SECOND /1.4, this.createPlayerBullets, this);
        
        //create enemy
        this.initEnemies();
        
        //create bottom trophies
        this.initBottomTrophies();
        
        //load level
        this.loadLevel();
        
        
        
        
   
    },
    
    
    update: function(){
        
        this.game.physics.arcade.overlap(this.playerBullets, this.enemies, this.damageEnemy, null, this);
        
        this.game.physics.arcade.overlap(this.enemies, this.player, this.killPlayer, null, this);
        
        this.player.body.velocity.x = 0;
        
        //movement with keys        
        if(this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.PLAYER_SPEED;
        }
        else if(this.cursors.right.isDown) {
            this.player.body.velocity.x = this.PLAYER_SPEED;
        }  
        
        if (Combinator.winGame){
            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.endGame, this);
            Combinator.score = 0;
        }
    },
    
    initBullets: function(){
        this.playerBullets = this.add.group();
        this.playerBullets.enableBody = true;
    },
    
   
        
    createPlayerBullets: function (){
        if(this.dead == false){
            var bullet = this.playerBullets.getFirstExists(false);
            if(!bullet){
                bullet = new Combinator.PlayerBullet(this.game, this.player.x + 18, this.player.top);
                this.playerBullets.add(bullet);
            }else{
                bullet.reset(this.player.x +18, this.player.top);
            }
            bullet.body.velocity.y = this.BULLET_SPEED;
        }   
    },
    
    initEnemies: function(){
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;
        
    },
    
    initBottomTrophies: function(){
        this.bottomTrophies = this.add.group();
        this.bottomTrophies.enableBody = true;
    },
    
    
    damageEnemy: function(bullet, enemy){
        enemy.damage(1);
        bullet.kill();
    },
    
    killPlayer: function(){
        if(!Combinator.winGame){
            this.player.kill();
            this.dead = true;

            var emitter = this.game.add.emitter(this.player.x, this.player.y, 250);
            emitter.makeParticles('enemyParticle');
            emitter.minParticleSpeed.setTo(-200, -200);
            emitter.maxParticleSpeed.setTo(200, 200);
            emitter.gravity = 300;
            emitter.start(true, 500, 300, 500);
            
            var style = {font: '35px Arial', fill: '#fff'};
            this.game.add.text(100, this.game.world.centerY , 'DEFEAT!!!', style);

            this.game.time.events.add(Phaser.Timer.SECOND * 5, this.endGame, this);
        }       
    },

    endGame: function(){
        this.game.state.start('StartScreen');
    },
    
    createEnemy: function (x, y, health, key, scale, speedX, speedY){
        var enemy = this.enemies.getFirstExists(false);
        if(!enemy){
            enemy = new Combinator.Enemy(this.game, x, y, key, health, this.enemyBullets, this.bottomTrophies);
            this.enemies.add(enemy);
        }
        enemy.reset(x, y, health, key, scale, speedX, speedY);
        
    },
    
    
    loadLevel: function(){
       /* this.createEnemy(20, 8, 1, "dogHead", 1, 0,0);
        this.createEnemy(20, 24, 1, "gatorTorso", 1, 0,0);
        this.createEnemy(20, 40, 1, "alienLegs", 1, 0,0);*/
        this.currentEnemyIndex = 0;
        
        this.levelData = {

            "duration": 80,
            "enemies": 
            [
                {
                    "time": 1,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 2,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X0, this.MIN_X0), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 3,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 4,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 5,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 6,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 7,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 8,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 9,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 10,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 11,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 12,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 13,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 14,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 15,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 16,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 17,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 18,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 19,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 20,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 21,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 22,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 23,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 24,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 25,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 26,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 27,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 28,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 29,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 30,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 31,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 32,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 33,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 34,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 35,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 36,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 37,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 38,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 39,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 40,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 41,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 42,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 43,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 44,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 45,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 46,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 47,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 48,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 49,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 50,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 51,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 52,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 53,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 54,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 55,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 56,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 57,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 58,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 59,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
                {
                    "time": 60,
                    "x": this.pickEnemyPosition(),
                    "health": 1,
                    "speedX": this.rnd.integerInRange(-this.MIN_X, this.MIN_X), 
                    "speedY": this.rnd.integerInRange(this.MIN_Y,this.MAX_Y),
                    "key": this.pickEnemy(),
                    "scale": 2
                },
            ]
        }

    

        //end of level timer
        this.endOfLevelTimer = this.game.time.events.add(this.levelData.duration * 1000, function(){
          //  console.log('level ended');
            
            if(this.currentLevel < this.numLevels){
                this.currentLevel++;
            }else{
                this.currentLevel = 1;
            }
            
            this.game.state.start('GameState', true, false, this.currentLevel);
        }, this);
    
    this.scheduleNextEnemy();
    
  },
    
    scheduleNextEnemy: function() {
    var nextEnemy = this.levelData.enemies[this.currentEnemyIndex];
    
    if(nextEnemy){
             var nextTime = 1000 * ( nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemies[this.currentEnemyIndex - 1].time));

              this.nextEnemyTimer = this.game.time.events.add(nextTime, function(){
        
        
              
                  this.createEnemy(nextEnemy.x, 90, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.speedX, nextEnemy.speedY);

        
        
                this.currentEnemyIndex++;
                this.scheduleNextEnemy();
                }, this);
        }
    },
    
    pickEnemy: function(){
        var num = this.rnd.integerInRange(1, 9);
        if (num == 1){
            return "dogHead";
        }else if (num == 2){
            return "dogTorso"; 
        }else if (num ==3){
            return "dogLegs";
        }else if (num ==4){
            return "gatorHead";
        }else if (num ==5){
            return "gatorTorso";
        }else if (num == 6){
            return "gatorLegs";
        }else if (num ==7){
            return "alienHead";
        }else if (num ==8){
            return "alienTorso";
        }else{
            return "alienLegs";
        }
    },
    
    pickEnemyPosition: function(){
        var pos = this.rnd.integerInRange(50, this.game.world.width - 50);
        return pos;
    }
};