Run.EndFrame = function (game) {

	this.bg;

};


Run.EndFrame.prototype = {

	create: function () {

		mraid.awardPoints(points);
		mraid.trackEvent({
			event: 'game_completed',
			award: 'game_completed',
			points: points
		});
		
		var endframe = this.add.sprite(0, 0, 'gamesprite', 'endframe_por.png');

		var bottom_bar = game.add.graphics(0, 0);
		bottom_bar.beginFill(0x000000, 1);
		bottom_bar.drawRect(0, 0, 640, 60);
		bottom_bar.x = 0;
		bottom_bar.y = this.game.height - bottom_bar.height;

		var main_hit = game.add.graphics(70, 890);
		main_hit.beginFill(0x666666, 0);
		main_hit.drawRect(0, 0, 400, 88);
		main_hit.inputEnabled = true;
		main_hit.events.onInputDown.add(goto_mainlink, this);


		var secondary_hit = game.add.graphics(94, 1020);
		secondary_hit.beginFill(0x666666, 0);
		secondary_hit.drawRect(0, 0, 460, 40);
		secondary_hit.inputEnabled = true;
		secondary_hit.events.onInputDown.add(goto_secondlink, this);

	},

	update: function () {

		// eventually add animation here

	},

	resize: function (width, height) {

		// on resize window

	}
};


function goto_mainlink() {
	mraid.trackEvent(mraid.getEvent({
		link_type: 'site'
	}));
	mraid.open(mraid.getEvent({
		link_type: 'site'
	}).url);
	//////////////////////////////////////////////////////

};

function goto_secondlink() {
	//mraid.trackEvent(mraid.getEvent({ link_type: 'store-locator'});
	//mraid.open(mraid.getEvent({ link_type: 'store-locator'}).url);
	//mraid.getEvent({link_type: 'store-locator'});
	mraid.trackEvent(mraid.getEvent({
		link_type: 'click'
	}))
	mraid.open(mraid.getEvent({
		link_type: 'click'
	}).url);
	///////////////////////////////////


};