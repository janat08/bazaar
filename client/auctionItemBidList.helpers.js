Template.auctionItemBidList.helpers({
	moreThanZeroBids: function() {
		return AuctionBids.find({item: this._id}).count() > 0;
	},
	bids: function() {
		return AuctionBids.find({item: this._id}, {sort: {value: -1}});
	}
}); 
