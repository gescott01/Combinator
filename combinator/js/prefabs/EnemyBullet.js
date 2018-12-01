var Combinator = Combinator || {};
/*global Phaser*/
Combinator.EnemyBullet = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.anchor.setTo(0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
};

Combinator.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
Combinator.EnemyBullet.prototype.constructor = Combinator.EnemyBullet;