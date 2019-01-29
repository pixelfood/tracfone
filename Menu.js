Run.StartMenu = function (game) {

	//this.bg;

};


Run.StartMenu.prototype = {

	create: function () {

		game.stage.backgroundColor = '#ccff00';
		current_state = game.state.current;
		
		
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


		//RULES LOOP /**************************************************************/

		var rules_num = 0;
		var rules;

		var rules_array = ['MOVE THE PADDLE TO AIM\nAT THE BRICKS', 'HIT THE GREEN BLOCKS\nTO FREE YOUR PHONE!', "HIT YOUR PHONE TO FREE\nYOUR PHONES'S DATA PLAN"];

		function rules_loop() {

			if (rules_num > 2) {
				
				rules_num = 0;
				
				if (button_start.alpha == 0) {
					enable_start();
				}
			}

			rules = game.add.text(0, 0, rules_array[rules_num], {
				/// styling
				font: "60px game_font",
				fill: "#000000",
				align: "center"
			});

			rules.lineSpacing = -10
			rules.anchor.setTo(0.5, 0);
			rules.x = game_title_blocks.x
			rules.y = game_title_blocks.bottom + 62;

			var rules_tween = game.add.tween(rules).from({
				alpha: 0
			}, 400, Phaser.Easing.Linear.Out, true);

			rules_tween.onComplete.add(rule_trans);

			rules_num++;

			function rule_trans() {

				game.time.events.add(Phaser.Timer.SECOND * 1, loop_out, this);

			}

			function loop_out() {

				var rules_out_tween = game.add.tween(rules).to({
					alpha: 0
				}, 400, Phaser.Easing.Linear.Out, true);

				rules_out_tween.onComplete.add(rules_loop);

			}

		}

		rules_loop();

		/***************************************************************************/

		var pts_awrd_1 = game.add.text(0, 0, "EARN UP TO", {
			/// styling
			font: "100px game_font",
			fill: "#000000",
			align: "center"
		});

		pts_awrd_1.anchor.setTo(0.5, 0);
		pts_awrd_1.x = game.world.centerX;
		pts_awrd_1.y = game_title_blocks.bottom + 344;

		var pts_awrd_2 = game.add.text(0, 0, "100", {
			/// styling
			font: "100px game_font",
			fill: "#de0003",
			align: "left"
		});

		pts_awrd_2.x = 0;
		pts_awrd_2.y = pts_awrd_1.bottom - 20;

		var pts_awrd_3 = game.add.text(0, 0, "POINTS", {
			/// styling
			font: "100px game_font",
			fill: "#000000",
			align: "left"
		});

		pts_awrd_3.x = pts_awrd_2.right + 38;
		pts_awrd_3.y = pts_awrd_1.bottom - 20;

		pts_awrded_group.add(pts_awrd_2)
		pts_awrded_group.add(pts_awrd_3)

		pts_awrded_group.x = game.world.centerX - pts_awrded_group.width / 2

		var button_start = game.add.sprite(0, 0, 'gamesprite', 'button_play.png');
		button_start.anchor.setTo(.5, 0);
		button_start.x = game.world.centerX
		button_start.y = pts_awrd_3.bottom + 30;

		button_start.alpha = 0

		function enable_start() {

			var button_fade = game.add.tween(button_start).to({
				alpha: 1
			}, 600, Phaser.Easing.Linear.Out, true);

			var button_scale = game.add.tween(button_start.scale).from({
				x: .7,
				y: .7
			}, 300, Phaser.Easing.Bounce.Out, true, 100);

			button_start.inputEnabled = true;
			button_start.events.onInputDown.add(play_game, this)

		}

		/**************************************************************/

		var paddle_menu = game.add.sprite(0, 0, 'gamesprite', 'paddle.png');
		paddle_menu.anchor.setTo(0.5);
		paddle_menu.x = game.world.centerX;
		paddle_menu.y = 660;

		var ball_menu = game.add.sprite(0, 0, 'gamesprite', 'ball.png');
		ball_menu.anchor.setTo(0.5);
		ball_menu.x = game.world.centerX;
		ball_menu.y = 460;


		function menu_loop() {

			var ball_to_paddle_tween = game.add.tween(ball_menu).to({
				y: paddle_menu.y,
				x: paddle_menu.x
			}, 800, Phaser.Easing.Linear.Out, true);

			ball_to_paddle_tween.onComplete.add(bounceUp);


			function bounceUp() {

				var rnd_num = game.rnd.integerInRange(-100, 100)

				var paddle_to_title_tween = game.add.tween(ball_menu).to({
					y: game_title.bottom,
					x: game_title.x + rnd_num
				}, 800, Phaser.Easing.Linear.Out, true);

				paddle_to_title_tween.onComplete.add(blink_title);

				///////////////////////////////////////////////////////////

				var rnd_num = game.rnd.integerInRange(100, 540)

				var paddle_move = game.add.tween(paddle_menu).to({
					x: rnd_num
				}, 800, Phaser.Easing.Linear.Out, true);

				paddle_move.onComplete.add(menu_loop);

				function blink_title() {

					console.log('------------------------------- BLINK')

					game_title.alpha = .7;

					game.time.events.add(Phaser.Timer.SECOND * .05, blink_back, this);

					function blink_back() {

						game_title.alpha = 1;
					}
				}
			}
		}

		menu_loop();

		/**************************************************************/

		start_menu_group.add(logo);
		start_menu_group.add(game_title);
		start_menu_group.add(game_title_blocks);
		//start_menu_group.add(rules);
		start_menu_group.add(pts_awrd_1);
		start_menu_group.add(pts_awrded_group);
		start_menu_group.add(button_start);

		game.world.bringToTop(rules)
		game.world.bringToTop(footer)

		/**************************************************************/
		/// middle instructions

		mraid.trackEvent(mraid.getEvent('poster'));
	},

	update: function () {


	},

	resize: function (width, height) {

	}

};

function play_game() {


	game.camera.fade(0xccff00, 400); /// green

	//cam_fade_menu = this.game.camera.onFadeComplete.add(play_myGame, this);
	
	game.time.events.add(Phaser.Timer.SECOND * .4, change_state_game, this);


	function change_state_game() {
		
		/// game.state.start('Game', true, false, my_var); /// use this to send a var to the state

		mraid.trackEvent(mraid.getEvent('game_started'));
		this.game.state.start('Game');

	}


}