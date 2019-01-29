Run.Bonus = function (game) {

	//	this.bg;

};

Run.Bonus.prototype = {

	create: function () {

		game.stage.backgroundColor = '#ffffff';

		this.logo = this.add.sprite(0, 0, 'logo');
		this.logo.anchor.setTo(0.5);
		this.logo.x = game.world.centerX
		this.logo.y = game.world.centerY - 30

		///////////////////////////////////////////////////////////////////////////////////
		/// game overlay
		var dot = game.add.text(20, 20, '.', {
			/// styling
			font: "2px game_font",
			fill: "#ccff00",
			align: "center"
		});

		// timout
		game.time.events.add(Phaser.Timer.SECOND * 2, load_game, this);

	}

};

function load_game() {

	//game.state.start('EndMenu');
	game.state.start('StartMenu');
	//game.state.start('EndFrame');

};