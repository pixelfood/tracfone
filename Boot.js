var Run = {}; // is game container

Run.Boot = function (game) {

	game_replaying = false;
	first_run_endframe = true;
	var game_orientation;

	first_run = true;
	first_game_run = true;
	game_started = false;

	game_playing_sent = false;
	game_ended_sent = false;
	game_completed_sent = false;

	var current_state;

};


Run.Boot.prototype = {

	init: function () {

		this.game.stage.backgroundColor = '#ffffff';
		this.input.maxPointers = 3;
		this.stage.disableVisibilityChange = true;
		//////////////////////////////////////////////////////////////
		var mraid_size_height_Position = mraid.getCurrentPosition().height;
		var mraid_size_height = mraid.getCurrentPosition().height;

		var ratio = mraid_size_height / 1136;

		this.scale.maxWidth = 640 * ratio;
		this.scale.maxHeight = 1136 * ratio;

		///////////////////////////////////////////////////////////////
		this.scale.pageAlignVertically = false;
		this.scale.pageAlignHorizontally = true;
		///////////////////////////////////////////////////////////////
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //instead of SHOW_ALL 
		this.scale.refresh();
		///////////////////////////////////////////////////////////////


	},

	preload: function () {

		this.load.image('logo', 'images/bonus_logo.png');
		this.load.image('preloaderBar', 'images/preloaderBar.png');
	},

	create: function () {

		
		mraid.addEventListener('windowResize', orientation_handler);
		//this.state.start('Preloader');
		orientation_handler();
	},

};

function orientation_handler() {

	console.log('-------------------------------------------------------- HANDLER')
	
	current_state = 'Boot';

	var mraid_size_width = window.innerWidth;
	var mraid_size_height = window.innerHeight;
	
	console.log('-------------------------------------------------------- DOCUMENT SIZE: ' + mraid_size_height)

	
	if (mraid_size_width > mraid_size_height) { /// landscape

		game_orientation = 'landscape';
		new_height = 640;
		new_width = 1136;
		ratio = mraid_size_width / new_width;
		game.scale.maxWidth = new_width * ratio;
		game.scale.maxHeight = new_height * ratio;
		////////////////////////////////

	} else { // if (mraid_pos_width < mraid_pos_height);

		game_orientation = 'portrait';
		new_height = 1136;
		new_width = 640;
		ratio = mraid_size_height / new_height;
		game.scale.maxWidth = new_width * ratio;
		game.scale.maxHeight = new_height * ratio;

	}

	game.scale.setGameSize(new_width, new_height);
	game.world.setBounds(0,0,new_width,new_height);   


	if (game_orientation == 'landscape') {

		game.state.start('Turn');


	} else {

		game.state.start('Preloader');
	}

	setTimeout(function () {
		document.getElementsByTagName('html')[0].style.marginTop = '0px';
		document.getElementsByTagName('html')[0].style.marginTop = ((document.height - parseInt(window.getComputedStyle(document.getElementsByTagName('html')[0])['height'].replace('px', ''))) / 2) + 'px';
	}, 100);

}