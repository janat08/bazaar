Template.auctionItemBidList.events({
	'click .selectBid': function() {
		Meteor.call('selectBid', {bid: this._id, item: this.item});
	}
}); 
