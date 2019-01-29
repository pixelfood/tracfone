Run.EndMenu = function (game) {
	this.bg;
};

Run.EndMenu.prototype = {

	create: function () {


		game.stage.backgroundColor = '#ccff00';

		current_state = game.state.current;

		points_won = 0

		var footer = game.add.graphics(0, 0);
		footer.beginFill(0x000000, 1);
		footer.drawRect(0, 0, 10, 60);
		footer.width = game.width
		footer.x = 0;
		footer.y = this.game.height - 60;

		logo = this.game.add.sprite(0, 980, 'gamesprite', 'logo.png');
		logo.anchor.setTo(0.5, 0);
		logo.x = game.world.centerX;
		logo.y = 62;

		/**************************************************************/

		/// instructions menu modal
		start_menu_group = game.add.group();
		pts_awrded_group = game.add.group();
		/**************************************************************/

		game_title = game.add.sprite(0, 0, 'gamesprite', 'game_title.png');
		game_title.anchor.setTo(.5, 0);
		game_title.x = game.world.centerX
		game_title.y = logo.bottom + 76;

		game_title_blocks = game.add.sprite(0, 0, 'gamesprite', 'game_title_blocks.png');
		game_title_blocks.anchor.setTo(.5, 0);
		game_title_blocks.x = game.world.centerX - 2
		game_title_blocks.y = game_title.top

		var exclamation = game.add.text(0, 0, "GREAT JOB!", {
			/// styling
			font: "90px game_font",
			fill: "#000000",
			align: "center"
		});

		exclamation.lineSpacing = -10
		exclamation.anchor.setTo(0.5, 0);
		exclamation.x = game_title_blocks.x
		exclamation.y = game_title_blocks.bottom + 64


		var static_text = game.add.text(0, 0, "YOU EARNED     POINTS!", {
			/// styling
			font: "60px game_font",
			fill: "#000000",
			align: "center"
		});

		static_text.anchor.setTo(0.5, 0);
		static_text.x = game.world.centerX;
		static_text.y = exclamation.bottom;


		var pts_awrded = game.add.text(0, 0, points_won, {
			/// styling
			font: "60px game_font",
			fill: "#000000",
			align: "center"
		});

		pts_awrded.anchor.setTo(0.5, 0);
		pts_awrded.x = game.world.centerX + 50;
		pts_awrded.y = exclamation.bottom;



		function count_up() {


			if (points > 0) {

				points--;

				points_won++

				points_wait_timer = game.time.events.add(Phaser.Timer.SECOND * .025, update_points, this);

			} else {

				return;

			}

			function update_points() {

				console.log(points_won);

				pts_awrded.setText(points_won);

				count_up();

			}

		}

		var button_replay = game.add.sprite(0, 0, 'gamesprite', 'button_replay.png');
		button_replay.anchor.setTo(.5, 0);
		button_replay.x = game.world.centerX
		button_replay.y = pts_awrded.bottom + 30;
		button_replay.inputEnabled = true;
		button_replay.events.onInputDown.add(replay, this)

		/***************************************************************/

		var button_continue = game.add.sprite(0, 0, 'gamesprite', 'button_continue.png');
		button_continue.anchor.setTo(.5, 0);
		button_continue.x = game.world.centerX
		button_continue.y = button_replay.bottom + 20;
		button_continue.inputEnabled = true;
		button_continue.events.onInputDown.add(endframe, this)

		/**************************************************************/

		game.world.bringToTop(footer);
		count_up();
	},

	update: function () {

		//	Do some nice funky main menu effect here

		//console.log('End menu updating')

	},
};

function replay() {

	game.camera.fade(0xccff00, 400); /// green

	game.camera.onFadeComplete.add(change_state_replay, this);

	function change_state_replay() {

		game_replaying = true;
		this.game.state.start('Game');
		mraid.trackEvent(mraid.getEvent('game_replay'));

	}

}

function endframe() {
	game.camera.fade(0xccff00, 400); /// green

	game.time.events.add(Phaser.Timer.SECOND * .4, change_state_endframe, this);


	function change_state_endframe() {

		this.game.state.start('EndFrame');

	}
}