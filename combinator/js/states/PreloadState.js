var Combinator = Combinator || {};

//load assets

Combinator.PreloadState = {
    
    preload: function(){
        this.load.image('bg', 'assets/images/bg.png');
        this.load.image('space', 'assets/images/space.png');
        this.load.image('player', 'assets/images/scientist1.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('enemyParticle', 'assets/images/enemyParticle.png');
        
        
        this.load.image('dogHead', 'assets/images/dog_head.png');
        this.load.image('dogTorso', 'assets/images/dog_torso.png');
        this.load.image('dogLegs', 'assets/images/dog_legs.png');
        
        this.load.image('gatorHead', 'assets/images/gator_head.png');
        this.load.image('gatorTorso', 'assets/images/gator_torso.png');
        this.load.image('gatorLegs', 'assets/images/gator_legs.png');
        
        this.load.image('alienHead', 'assets/images/alien_head.png');
        this.load.image('alienTorso', 'assets/images/alien_torso.png');
        this.load.image('alienLegs', 'assets/images/alien_legs.png');
        
    },
    
    create: function(){
        this.state.start('StartScreen');
    }
};