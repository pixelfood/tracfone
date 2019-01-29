Run.Turn = function (game) {

	this.bg;

};

//var char_toPlay;
//var char;



Run.Turn.prototype = {

	create: function () {

		game.stage.backgroundColor = '#ccff00';
		
		var footer = game.add.graphics(0, 0);
		footer.beginFill(0x000000, 1);
		footer.drawRect(0, 0, 10, 60);
		footer.width = game.width
		footer.x = 0;
		footer.y = this.game.height - 60;

		if (game_orientation == 'landscape') {
			// world setting
			game.world.setBounds(0, 0, 1136, 640);

			//endofworld = 11360;

		} else { /// PORTRAIT
			// world setting
			game.world.setBounds(0, 0, 640, 1136);
		}

		/* GAME BG ******************************************************/

		console.log('--------------------- TURN MENU - GAME ORIENTATION:  ' + game_orientation);

		if (game_orientation == 'landscape') {

			/// instructions menu modal
			turn_menu_group = game.add.group();

			/*************************************** MENU **********************************/

			var game_instructs = this.game.add.text(0, 0, "Please rotate your phone", {
				/// styling
				font: "48px helvetica",
				fill: '#000000',
				align: "center"
			});

			game_instructs.lineSpacing = -2;
			game_instructs.anchor.setTo(.5, 0);
			game_instructs.x = game.world.centerX;
			game_instructs.y = game.world.centerY - 60;

			/*********************************************************************************/
			turn_menu_group.add(game_instructs);
		
		} else if (game_orientation == 'portrait') {

			game.time.events.add(Phaser.Timer.SECOND * .5, reload_game, this);

		}


		/***************************** MENU CHARACTERS ***********************************/


	}
};


function reload_game() {
	//var current_state = game.state.current;

	console.log('restart state: ' + current_state)
		////////////////////////////////////////////////
	game.state.start(current_state);

}