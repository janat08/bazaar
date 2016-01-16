Meteor.publish('userData', function() {
	if (!this.userId) return null;
	return Meteor.users.find(this.userId, {fields: {
		apiKeys: 1,
		chars: 1
	}});
});

Meteor.publish('charsInfo', function(id) {
	if (!this.userId) return null;
	return CharsInfo.find({characterID: id});
});

Meteor.publish('allCharsInfo', function(id) {
	if (!this.userId) return null;
	return CharsInfo.find();
});

Meteor.publish('auctionItems', function() {
	if (!this.userId) return null;
	return AuctionItems.find();
});

Meteor.publish('auctionBids', function() {
	if (!this.userId) return null;
	return AuctionBids.find();
});