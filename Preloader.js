Run.Preloader = function (game) {

	this.preloadBar = null;
	this.ready = false;

};

Run.Preloader.prototype = {

	init: function () {

		game.stage.backgroundColor = '#ccff00';

	},

	preload: function () {
		
		this.logo = this.add.sprite(0, 0, 'logo');
		this.logo.anchor.setTo(0.5);
		this.logo.x = game.world.centerX
		this.logo.y = game.world.centerY - 30
		
		this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5)
		this.preloadBar.x = game.world.centerX
		this.preloadBar.y = this.logo.bottom + 50;
		this.load.setPreloadSprite(this.preloadBar)
		
		/***************************************************************************/

		this.game.load.image('tilemap_sprite', 'tilemaps/tracfone_tiled_sprite.png');
		
		this.game.load.tilemap('level_1', 'tilemaps/tracfone_tiled_sprite.json', null, Phaser.Tilemap.TILED_JSON); /***************************************************************************/
		// game sprite sheet
		this.game.load.atlasJSONHash('gamesprite', 'images/tracfone_breakout_game_sprite.png', 'images/tracfone_breakout_game_sprite.json');
		/***************************************************************************/

		/// endframe
		//this.load.image('endframe', 'images/big_image.png');
	},

	create: function () {

		this.state.start('Bonus');

		//this.state.start('StartMenu');
		//this.state.start('EndMenu');
		//this.state.start('EndFrame');

		//this.state.start('Game');

	}

};