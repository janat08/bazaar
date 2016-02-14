Router.configure({
	layoutTemplate: 'mainLayout',
	subscriptions: function() {
		return Meteor.subscribe('userData');
	}
});

Router.route('homePage', {
	path: '/'
});

Router.route('userProfilePage', {
	path: '/profile',
	data: function() {
		return Meteor.users.findOne(Meteor.userId());
	}
});

Router.route('charInfoPage', {
	path: '/charInfo/:id',
	data: function() {
		return CharsInfo.findOne({characterID: this.params.id});
	},
	subscriptions: function() {
		return Meteor.subscribe('charsInfo', this.params.id);
	}
});

// Redirect to skills page which shows skills for a selected character. id has to be given

Router.route('skillsPage', {
	path: '/skill/:id',
	data: function() {
		return CharsInfo.findOne({characterID: this.params.id});
		
	},
	subscriptions: function() {
		// add subscribe for skills here
	}
});

Router.route('auctionPage', {
	path: '/auction',
	subscriptions: function() {
		return Meteor.subscribe('auctionBids') && Meteor.subscribe('auctionItems') && Meteor.subscribe('allCharsInfo');
	}
});

Router.route('auctionItemCreatePage', {
	path: '/auction/create/:id',
	data: function() {
		return {id: this.params.id};
	},
	subscriptions: function() {
		return Meteor.subscribe('auctionBids') && Meteor.subscribe('auctionItems');
	},

});

Router.route('auctionItemPage', {
	path: '/auction/item/:id',
	data: function() {
		return AuctionItems.findOne(this.params.id);
	},
	subscriptions: function() {
		return Meteor.subscribe('auctionBids') && Meteor.subscribe('auctionItems') && Meteor.subscribe('allCharsInfo');
	}
});
