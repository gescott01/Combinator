var Combinator = Combinator || {};
/*global Phaser*/
Combinator.BottomTrophy = function(game, x, y, key) {
    Phaser.Sprite.call(this, game, x, y, key);
	this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
   
};

Combinator.BottomTrophy.prototype = Object.create(Phaser.Sprite.prototype);
Combinator.BottomTrophy.prototype.constructor = Combinator.BottomTrophy;
