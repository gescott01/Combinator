var Combinator = Combinator || {};
/*global Phaser*/

Combinator.Enemy = function(game, x, y, key, health, enemyBullets, bottomTrophies) {
    Phaser.Sprite.call(this, game, x, y, key);

    this.game = game;
    
    this.style = {font: '35px Arial', fill: '#fff'};

    //enable physics
    //this.game.physics.arcade.enable(this);

    this.animations.add('getHit', [0, 1, 2, 1, 0], 25, false);
    this.anchor.setTo(0.5);
    this.health = health;

    this.enemyBullets = enemyBullets;
    this.bottomTrophies = bottomTrophies;

    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
    
    //this.scheduleShooting();
};

Combinator.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Combinator.Enemy.prototype.constructor = Combinator.Enemy;

Combinator.Enemy.prototype.update = function() {
  
    //bounce on the borders
    if(this.position.x < 0.05 * this.game.world.width) {
        this.position.x = 0.05 * this.game.world.width + 2;
        this.body.velocity.x *= -1;
    }
    else if(this.position.x > 0.95 * this.game.world.width) {
        this.position.x = 0.95 * this.game.world.width - 2;
        this.body.velocity.x *= -1;
    }



    //kill if off world in the bottom
    if(this.position.y > this.game.world.height) {

        this.makeBottomTrophy();
        this.kill();
        
    }
        this.checkForBadCombination();
        this.checkForGoodCombination();
};

Combinator.Enemy.prototype.damage = function(amount){
    Phaser.Sprite.prototype.damage.call(this, amount);
    this.play('getHit');
    
    //explosion on death
    if(this.health <= 0){
        var emitter = this.game.add.emitter(this.x, this.y, 10);
        emitter.makeParticles('enemyParticle');
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 300;
        emitter.start(true, 250, 150, 50);
        
        //timer to stop shoot after dead
        this.enemyTimer.pause();
    }
};

Combinator.Enemy.prototype.scheduleShooting = function(){
    this.shoot();
    this.enemyTimer.add(Phaser.Timer.SECOND * 2, this.scheduleShooting, this);
    
};

Combinator.Enemy.prototype.reset = function(x, y, health, key, scale, speedX, speedY){
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.body.velocity.x = speedX;
    this.body.velocity.y = speedY;
    
    //resumes shooting on respawn
    this.enemyTimer.resume();
    
};

Combinator.Enemy.prototype.makeBottomTrophy = function(){
    var x,y;
    var bottomTrophy = this.bottomTrophies.getFirstExists(false);
    if (this.key == 'dogHead'){
        x = 20 + Combinator.score * 20;
        y = 20;
        Combinator.trophyDogHead = true;
    }else if (this.key == 'dogTorso'){
        x = 20 + Combinator.score * 20;
        y = 36;
        Combinator.trophyDogTorso = true;
    }else if (this.key == 'dogLegs'){
        x = 20 + Combinator.score * 20;
        y = 52
        Combinator.trophyDogLegs = true;
    }else if (this.key == 'gatorHead'){
       x = 20 + Combinator.score * 20;
        y=20;
        Combinator.trophyGatorHead = true;
    }else if (this.key == 'gatorTorso'){
        x = 20 + Combinator.score * 20;
        y=36;
        Combinator.trophyGatorTorso = true;
    }else if (this.key == 'gatorLegs'){
        x = 20 + Combinator.score * 20;
        y = 52
        Combinator.trophyGatorLegs = true;
    }else if (this.key == 'alienHead'){
        x = 20 + Combinator.score * 20;
        y=20;
        Combinator.trophyAlienHead = true;
    }else if (this.key == 'alienTorso'){
        x = 20 + Combinator.score * 20;
        y = 36;
        Combinator.trophyAlienTorso = true;
    }else if (this.key == 'alienLegs'){
       x = 20 + Combinator.score * 20;
        y=52;
        Combinator.trophyAlienLegs = true;
    }
            
    if(!bottomTrophy){
        bottomTrophy = new Combinator.BottomTrophy(this.game, x, y, this.key);
        this.bottomTrophies.add(bottomTrophy,this);
    }else{
       bottomTrophy.reset(x, y, this);
   }
    
};

Combinator.Enemy.prototype.checkForBadCombination = function(){
    
    if((Combinator.trophyGatorHead && Combinator.trophyAlienHead) || (Combinator.trophyGatorHead && Combinator.trophyDogHead) || (Combinator.trophyAlienHead && Combinator.trophyDogHead)){
        
        this.game.add.text(100, this.game.world.centerY , 'DEFEAT!!!', this.style);
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.loseGame, this);
        
    }
    if((Combinator.trophyGatorTorso && Combinator.trophyAlienTorso) || (Combinator.trophyGatorTorso && Combinator.trophyDogTorso) || (Combinator.trophyAlienTorso && Combinator.trophyDogTorso)){
        
        this.game.add.text(100, this.game.world.centerY , 'DEFEAT!!!', this.style);
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.loseGame, this);
        
    }
    if((Combinator.trophyGatorLegs && Combinator.trophyAlienLegs) || (Combinator.trophyGatorLegs && Combinator.trophyDogLegs) || (Combinator.trophyAlienLegs && Combinator.trophyDogLegs)){
        
        this.game.add.text(100, this.game.world.centerY , 'DEFEAT!!!', this.style);
        this.game.time.events.add(Phaser.Timer.SECOND * 5, this.loseGame, this);
        
    }
};

Combinator.Enemy.prototype.checkForGoodCombination = function(){
    if((Combinator.trophyDogHead || Combinator.trophyGatorHead ||Combinator.trophyAlienHead) && 
       (Combinator.trophyDogTorso || Combinator.trophyGatorTorso || Combinator.trophyAlienTorso) && 
       (Combinator.trophyDogLegs || Combinator.trophyGatorLegs || Combinator.trophyAlienLegs))
       {
            console.log('COMBO');
            Combinator.trophyDogHead = false;
            Combinator.trophyDogTorso = false;
            Combinator.trophyDogLegs = false;
            Combinator.trophyGatorHead = false;
            Combinator.trophyGatorTorso = false;
            Combinator.trophyGatorLegs = false;
            Combinator.trophyAlienHead = false;
            Combinator.trophyAlienTorso = false;
            Combinator.trophyAlienLegs = false;
           
           Combinator.score++;
           console.log(Combinator.score);
           if(Combinator.score == Combinator.WINNING_SCORE){
                
                var style = {font: '16px Arial', fill: '#fff'};
                this.game.add.text(30, this.game.world.centerY , 'YOU SAVED YOUR LAB', style);
                this.game.add.text(30, this.game.world.centerY+50 , 'AND MADE 4 ABOMINATIONS', style);
               Combinator.winGame = true;
            }
           
           
       }
};


Combinator.Enemy.prototype.shoot = function (){
    var bullet = this.enemyBullets.getFirstExists(false);
    if(!bullet){
        bullet = new Combinator.EnemyBullet(this.game, this.x, this.bottom);
        this.enemyBullets.add(bullet);
    }else{
        bullet.reset(this.x, this.y);
    }
    
    bullet.body.velocity.y = 300;
    
};

Combinator.Enemy.prototype.loseGame = function (){
    this.game.state.start('StartScreen');
};