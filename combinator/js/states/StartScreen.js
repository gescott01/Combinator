var Combinator = Combinator || {};


Combinator.StartScreen = {
    
    init: function(message){
        this.message = message;
    },
    
    create: function(){
        var background = this.game.add.sprite(0, 0, 'bg');
        background.inputEnabled = true;
        
        background.events.onInputDown.add(function(){
            this.state.start('GameState');
        }, this);
        
        var style1 = {font: '13px Arial', fill: '#fff'};
        var style2 = {font: '25px Arial', fill: '#fff'};
        
        this.game.add.text(30, 60 , 'Your lab has blown up and body parts are flying everywhere!', style1);
        this.game.add.text(30, 90 , 'Make 4 hybrid abominations by letting a head, torso and legs', style1);
        this.game.add.text(30, 120 , 'fall in your combinator pit, which will make a monster!', style1);
        this.game.add.text(30, 150 , 'If you let the same part of 2 different species fall in the pit', style1);
        this.game.add.text(30, 180 , 'your pit will explode, taking you with it.', style1);
        this.game.add.text(30, 240 , 'Once you make a monster, it crawls out, letting you', style1);
        this.game.add.text(30, 270 , 'create a new one from scratch.', style1);
        this.game.add.text(30, 300 , "Shoot down the pieces you don't want with your gun.", style1);
        this.game.add.text(30, 330 , 'You only have 80 seconds before your lab explodes.', style1);
        this.game.add.text(30, 360 , 'The left and right arrow keys move you on your hoverboard', style1);
        this.game.add.text(30, 390 , 'above your combinator pit.', style1);
        
        this.game.add.text(30, 440 , 'CLICK SCREEN TO START', style2);
        this.game.add.text(90, 480 , 'GOOD LUCK!!', style2);
        
        if(this.message){
            this.game.add.text(60,this.game.world.centerY - 200, this.message, style1);
        }
    }
};