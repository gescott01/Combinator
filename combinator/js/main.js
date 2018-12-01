var Combinator = Combinator || {};
/*global Phaser*/
//initiate the Phaser framework
Combinator.game = new Phaser.Game(400, 600, Phaser.CANVAS);

Combinator.game.state.add('PreloadState', Combinator.PreloadState);
Combinator.game.state.add('StartScreen', Combinator.StartScreen);
Combinator.game.state.add('GameState', Combinator.GameState);
Combinator.game.state.add('GameOver', Combinator.GameOver);
Combinator.game.state.start('PreloadState');    