Run.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
	this.game; //	a reference to the currently running game
	this.add; //	used to add sprites, text, groups, etc
	this.camera; //	a reference to the game camera
	this.cache; //	the game cache
	this.input; //	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
	this.load; //	for preloading assets
	this.math; //	lots of useful common math operations
	this.sound; //	the sound manager - add a sound, play one, set-up markers, etc
	this.stage; //	the game stage
	this.time; //	the clock
	this.tweens; //  the tween manager
	this.state; //	the state manager
	this.world; //	the game world
	this.particles; //	the particle manager
	this.physics; //	the physics manager
	this.rnd; //	the repeatable random number generator
};

var points;
var bonus_points;
var total_bonus;
var bonus_item;
var timer;
var game_replaying = false;
var ball;
var balls;
var bonus_ball;
var ball_group;
var bonus_mode;
var counter;
var time_counter;
var flip;
var header;
var unlocked;
var time_counter;
var ball_display;
var score_display;

Run.Game.prototype = {


	init: function () {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.setBoundsToWorld();
		game.world.gravity = 800;

		game.stage.backgroundColor = '#ccff00';

		// world setting
		///game.world.setBounds(0, 0, 640, 1136);
		current_state = game.state.current;

	},

	create: function () {

		points = 0;
		balls = 2;
		unlocked = false;
		time_counter = 0;

		/* GAME BG ******************************************************/
		var background = this.game.add.sprite(0, 0, 'gamesprite', 'game_bg.png');

		var footer = game.add.graphics(0, 0);
		footer.beginFill(0x000000, 1);
		footer.drawRect(0, 0, 10, 60);
		footer.width = game.width
		footer.x = 0;
		footer.y = this.game.height - 60;

		/* HEADER ******************************************************/

		game_title = this.game.add.sprite(0, 0, 'gamesprite', 'title_bar.png');
		game_title.anchor.setTo(0.5, 1);
		game_title.x = game.world.centerX
		game_title.y = footer.top;

		/**************************************************************/

		displays = game.add.group();

		/// game time display
		score_display = game.add.text(0, 0, 'SCORE: ' + points, {
			/// styling
			font: "58px game_font",
			fill: "#ffffff",
			align: "left"
		});
		score_display.anchor.setTo(0, 1)
		score_display.x = 100
		score_display.y = 110


		ball_display = game.add.text(0, 0, 'BALLS: ' + balls.length, {
			/// styling
			font: "58px game_font",
			fill: "#ffffff",
			align: "right"
		});
		ball_display.anchor.setTo(1, 1)

		ball_display.x = game.width - 100
		ball_display.y = 110
			//ball_display.x = score_display.right + 60

		//displays.add(score_display)
		//displays.add(ball_display)

		displays.x = game.world.centerX - displays.width / 3
		displays.y = 76;

		var bonus_txt = game.add.text(0, 0, 'FREE YOUR PHONE +100 PTS!', {
			font: "38px game_font",
			fill: "#ffffff",
			align: "center"
		});
		bonus_txt.anchor.setTo(0.5)
		bonus_txt.x = game.world.centerX;
		bonus_txt.y = ball_display.bottom + 20

		/**************************************************************/
		// BLOCK GROUPS
		blocks = game.add.group(); /// regular point awarding blocks
		blocks_invis = game.add.group(); /// spacer blocks non alpha
		blocks_bumper = game.add.group(); /// non point blocks

		/**************************************************************/
		/// groups of blocks
		/**************************************************************/

		game_grid = game.add.group();

		phone_group = game.add.group();
		blue_block_group = game.add.group();
		pink_block_group = game.add.group();
		orange_block_group = game.add.group();
		pink_block_group = game.add.group();
		blocker = game.add.group();
		blocker_half_group = game.add.group();
		special_group = game.add.group();


		map = this.game.add.tilemap('level_1');
		map.addTilesetImage('tracfone_tiled_sprite', 'tilemap_sprite');

		orange_blks = map.createFromObjects('orange', 3, 'gamesprite', 'block_orange.png', true, false, orange_block_group);
		blue_blks = map.createFromObjects('blue', 1, 'gamesprite', 'block_blue.png', true, false, blue_block_group);
		pink_blks = map.createFromObjects('pink', 4, 'gamesprite', 'block_pink.png', true, false, pink_block_group);

		blocker_blks = map.createFromObjects('blocker', 6, 'gamesprite', 'block_white.png', true, false, blocker);
		blocker_half_blks = map.createFromObjects('blocker_half', 2, 'gamesprite', 'block_dual.png', true, false, blocker_half_group);

		special_blks = map.createFromObjects('special', 5, 'gamesprite', 'block_special.png', true, false, special_group);
		phone = map.createFromObjects('phone', 4, 'gamesprite', 'phone_sm.png', true, false, phone_group);

		phone_group.x = 2;
		phone_group.y = 14;

		game_grid.add(blue_block_group)
		game_grid.add(pink_block_group)
		game_grid.add(orange_block_group)
		game_grid.add(blocker)
		game_grid.add(blocker_half_group)
		game_grid.add(special_group)
		game_grid.add(phone_group)

		game_grid.x = game.world.centerX - game_grid.width / 2;
		game_grid.y = 180;

		grid_offset_x = game_grid.x;
		grid_offset_y = game_grid.y;


		/*******************************************************************/

		blue_block_emitter = game.add.emitter(0, 0, 20);
		blue_block_emitter.makeParticles('gamesprite', 'pixel_blue.png');
		blue_block_emitter.gravity = 300;
		blue_block_emitter.setYSpeed(-200, 20);

		pink_block_emitter = game.add.emitter(0, 0, 20);
		pink_block_emitter.makeParticles('gamesprite', 'pixel_pink.png');
		pink_block_emitter.gravity = 300;
		pink_block_emitter.setYSpeed(-200, 20);

		orange_block_emitter = game.add.emitter(0, 0, 20);
		orange_block_emitter.makeParticles('gamesprite', 'pixel_orange.png');
		orange_block_emitter.gravity = 300;
		orange_block_emitter.setYSpeed(-200, 20);

		white_block_emitter = game.add.emitter(0, 0, 20);
		white_block_emitter.makeParticles('gamesprite', 'pixel_white.png');
		white_block_emitter.gravity = 300;
		white_block_emitter.setYSpeed(-200, 20);

		special_block_emitter = game.add.emitter(0, 0, 20);
		special_block_emitter.makeParticles('gamesprite', 'pixel_special.png');
		special_block_emitter.gravity = 300;
		special_block_emitter.setYSpeed(-200, 20);


		/*******************************************************************/



		blue_block_group.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true

		}, this);

		pink_block_group.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true

		}, this);

		orange_block_group.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true
			item.body.bounce.setTo(3);

		}, this);

		phone_group.alpha = .6

		blocker.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true
			item.health = 6

		}, this);

		blocker_half_group.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true
			item.health = 2

		}, this);

		special_group.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true
				//item.health = 3

		}, this);

		phone_group.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.enableBody = true
			item.body.immovable = true

		}, this);

		/****************************************************************************************************/
		// PADDLE
		/////////////////////////////////////////////////////////////////
		paddle = game.add.sprite(0, 0, 'gamesprite', 'paddle.png');
		paddle.width = 120;
		paddle.x = game.world.centerX;
		paddle.y = 802;

		game.physics.arcade.enable(paddle);
		paddle.enableBody = true;
		paddle.body.immovable = true;
		paddle.inputEnabled = true;
		paddle.input.enableDrag(true);
		paddle.input.allowVerticalDrag = false;
		paddle.anchor.setTo(0.5, 0);
		paddle.body.collideWorldBounds = true;
		/****************************************************************************************************/

		balls = game.add.group();
		balls.createMultiple(3, 'gamesprite', 'ball.png');

		balls.forEach(function (item) {

			game.physics.arcade.enable(item);
			item.anchor.setTo(0.5, 0.5);
			item.body.maxVelocity.y = 1100; ///800
			item.body.maxVelocity.x = 700;
			//item.body.velocity.y = 600; /// from 100
			item.body.bounce.setTo(1);
			item.body.collideWorldBounds = true;

			item.kill();

		}, this)



		/****************************************************************************************************/

		bottom_hit = game.add.graphics(0, 0);
		bottom_hit.beginFill(0xffffff, 0);
		bottom_hit.drawRect(0, 0, 10, 60);
		bottom_hit.width = game.width
		bottom_hit.x = 0;
		bottom_hit.y = paddle.bottom;

		game.physics.arcade.enable(bottom_hit);
		bottom_hit.enableBody = true;
		bottom_hit.body.immovable = true;

		ball_display.setText('BALLS: ' + balls.length);

		release_ball();

		/// timer
		timer = this.game.time.create(false);
		timer.loop(1000, updateCounter, this);
		timer.start();

	},

	render: function () {

		//game.debug.body(paddle_body);
	},

	update: function () {

		//main_blocks
		//blocker
		//blocker_half
		//special

		/// block collisions
		paddle.y = 802;
		paddle.x = this.input.activePointer.x

		game.physics.arcade.collide(ball, paddle, bounce, null, this);
		game.physics.arcade.collide(ball, bottom_hit, kill_ball, null, this);

		game.physics.arcade.collide(ball, orange_block_group, orange_block_hit, null, this);
		game.physics.arcade.collide(ball, pink_block_group, pink_block_hit, null, this);
		game.physics.arcade.collide(ball, blue_block_group, blue_block_hit, null, this);

		game.physics.arcade.collide(ball, blocker, hit_blocker, null, this);
		game.physics.arcade.collide(ball, special_group, hit_special, null, this);
		game.physics.arcade.collide(ball, blocker_half_group, hit_blocker_half, null, this);
		game.physics.arcade.collide(ball, phone_group, phone_hit, null, this);

	},

	shutdown: function () {

		// last call before end menu
		if (!game_replaying) {

			mraid.trackEvent(mraid.getEvent('game_ended'));
		}
	},
};

function phone_hit() {

	if (unlocked) {

		game.camera.shake(0.02, 500);

		ball.destroy();
		paddle.destroy();
		phone_group.destroy();

		green_flash = game.add.sprite(0, 0, 'gamesprite', 'green_flash.png');
		green_flash.anchor.setTo(0.5)
		green_flash.x = game.world.centerX
		green_flash.y = game.world.centerY
		green_flash.alpha = 0;

		large_phone = game.add.sprite(0, 0, 'gamesprite', 'phone_lrg.png');
		large_phone.anchor.setTo(0.5);
		large_phone.scale.x = .2;
		large_phone.scale.y = .2;

		large_phone.x = game.world.centerX
		large_phone.y = 346

		/// animate mask and bring phone to top
		var green_flash_tween_scale = game.add.tween(green_flash.scale).from({
			y: .1,
			x: .1

		}, 400, Phaser.Easing.Linear.Out, true, 400);

		var green_flash_tween_alpha = game.add.tween(green_flash).to({
			alpha: 1

		}, 300, Phaser.Easing.Linear.Out, true, 400);

		green_flash_tween_scale.onComplete.add(spin_green);

		var large_phone_tween_scale = game.add.tween(large_phone.scale).to({
			y: .4,
			x: .4
		}, 600, Phaser.Easing.Linear.Out, true, 600);

		var large_phone_tween_position = game.add.tween(large_phone).to({
			y: game.world.centerY,
			x: game.world.centerX
		}, 600, Phaser.Easing.Quintic.In, true, 600);

		large_phone_tween_position.onComplete.add(bounce_phone);

		function bounce_phone() {

			var large_phone_tween_scale_2 = game.add.tween(large_phone.scale).to({
				y: .8,
				x: .8
			}, 600, Phaser.Easing.Bounce.Out, true, 100);

		}



		function spin_green() {

			green_flash_2 = game.add.sprite(0, 0, 'gamesprite', 'green_flash.png');
			green_flash_2.anchor.setTo(0.5)
			green_flash_2.scale.setTo(1.5)
			green_flash_2.alpha = .7
			green_flash_2.x = game.world.centerX
			green_flash_2.y = game.world.centerY

			var green_flash_tween_scale = game.add.tween(green_flash.scale).to({
				y: 2,
				x: 2
			}, 3300, Phaser.Easing.Quadratic.Out, true);

			var green_flash_tween_rotate = game.add.tween(green_flash_2).to({
				angle: -15
			}, 2000, Phaser.Easing.Cubic.Out, true);

			var green_flash_tween_rotate = game.add.tween(green_flash).to({
				angle: 15
			}, 2000, Phaser.Easing.Cubic.Out, true);

			green_flash_tween_rotate.onComplete.add(go_to_endMenu);

			game.world.bringToTop(large_phone);

			function go_to_endMenu() {

				game.camera.fade(0xccff00, 400); /// green

				game.camera.onFadeComplete.add(change_state, this);

				function change_state() {

					points = 100;

					game.state.start('EndMenu');

				}

			}

		}

	} else {

		return;
	}
}

function hit_special(ball, special_block) {

	special_block_emitter.x = special_block.x + special_block.width / 2 + grid_offset_x;
	special_block_emitter.y = special_block.y + special_block.height / 2 + grid_offset_y;
	special_block_emitter.start(true, 600, null, 800);

	special_block.destroy();

	points += 4
	update_points();

	var free_phone = special_group.countLiving()

	if (free_phone === 0) {

		phone_group.alpha = 1;

		unlocked = true;
	}
}

function hit_blocker(ball, blocker) {

	blocker.damage(1);

	if (blocker.health == 0) {

		white_block_emitter.x = blocker.x + blocker.width / 2 + grid_offset_x;
		white_block_emitter.y = blocker.y + blocker.height / 2 + grid_offset_y;
		white_block_emitter.start(true, 600, null, 800);

	}

}

function hit_blocker_half(ball, blocker_half) {

	// if hit from the top destroy
	//blocker_half.health -= 1;

	blocker_half.damage(1)

	if (blocker_half.health == 0) {

		white_block_emitter.x = blocker_half.x + blocker_half.width / 2 + grid_offset_x;
		white_block_emitter.y = blocker_half.y + blocker_half.height / 2 + grid_offset_y;
		white_block_emitter.start(true, 600, null, 800);

	}

}

function kill_ball() {

	ball.destroy();

	ball_display.setText('BALLS: ' + balls.length);


	if (balls.length > 0) {

		release_ball();

	} else {

		game.state.start('EndMenu');

	}

}

function release_ball() {

	//console.log('--------------- REALEASE BALL ----------------');

	function ball_drop() {

		ball = balls.getFirstDead();
		ball.reset(game.world.centerX, 640);

		var ball_scale = game.add.tween(ball.scale).from({
			x: 6.6,
			y: 6.6
		}, 600, Phaser.Easing.Bounce.Out, true);


		game.time.events.add(Phaser.Timer.SECOND * .6, drop, this);

		function drop() {

			ball.body.velocity.y = 700; /// from 100
		}

	}

	game.time.events.add(Phaser.Timer.SECOND * .4, ball_drop, this);

}

function bumper_hit() {

	//console.log('Bumper HIT');

}

function blue_block_hit(ball, block) {

	blue_block_emitter.x = block.x + block.width / 2 + grid_offset_x;
	blue_block_emitter.y = block.y + block.height / 2 + grid_offset_y;
	blue_block_emitter.start(true, 600, null, 800);

	block.destroy()

	points += 2
	update_points();


}

function pink_block_hit(ball, block) {

	pink_block_emitter.x = block.x + block.width / 2 + grid_offset_x;
	pink_block_emitter.y = block.y + block.height / 2 + grid_offset_y;
	pink_block_emitter.start(true, 600, null, 800);

	block.destroy()
	points += 2
	update_points();

}


function orange_block_hit(ball, block) {

	orange_block_emitter.x = block.x + block.width / 2 + grid_offset_x;
	orange_block_emitter.y = block.y + block.height / 2 + grid_offset_y;
	orange_block_emitter.start(true, 600, null, 800);

	block.destroy()
	points += 2
	update_points();

}



function bounce(ball, paddle_body) {


	var diff = 0;

	if (ball.x < paddle_body.x) {

		diff = paddle_body.x - ball.x;
		ball.body.velocity.x = (-10 * diff);


	} else if (ball.x > paddle_body.x) {

		diff = ball.x - paddle_body.x;
		ball.body.velocity.x = (10 * diff);

	} else {

		ball.body.velocity.x = Math.floor(Math.random() * 8);
		ball.body.velocity.y = 1050;

	}
}

function update_points() {

	score_display.setText('SCORE: ' + points);
}


function updateCounter() {

	time_counter++

	game_time = (30 - time_counter);

	//time_display.setText(':' + game_time);
	//console.log('TIMER: ' + time_counter)

	if (time_counter === 15 && game_replaying === false) {

		mraid.trackEvent(mraid.getEvent('game_playing'));
		mraid.trackEvent(mraid.getEvent('billable_action'));


	}

	if (time_counter === 16) {

		timer.stop();
	}

};