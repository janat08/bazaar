Template.auctionItemPage.helpers({
	ownAuction: function() {
		return this.userID == Meteor.userId();
	},
	charInfo: function() {
		var info = CharsInfo.findOne({characterID: this.characterID});
		return info;
	},
	bidCount: function() {
		return AuctionBids.find({item: this._id}).count();
	},
	lastBid: function() {
		var lastBid = AuctionBids.findOne({item: this._id}, {sort: {value: -1}});
		if (lastBid != undefined) {
			return lastBid.value;
		} else {
			return this.initialPrice;
		}
	},
	recommendedBid: function() {
		var lastBid = AuctionBids.findOne({item: this._id}, {sort: {value: -1}});
		if (lastBid != undefined) {
			return parseInt(lastBid.value) + parseInt(this.minimalOverbidding) + 1;
		} else {
			return parseInt(this.initialPrice) + parseInt(this.minimalOverbidding) + 1;
		}
	}
}); 
