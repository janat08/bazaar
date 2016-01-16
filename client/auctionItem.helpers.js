Template.auctionItem.helpers({
	bidCount: function() {
		if (this.parsed) {
			return 'N/A';
		} else {
			return AuctionBids.find({item: this._id}).count();
		}
	},
	lastBid: function() {
		if (this.parsed) {
			return 'N/A';
		} else {
			var lastBid = AuctionBids.findOne({item: this._id}, {sort: {value: -1}});
			if (lastBid != undefined) {
				return lastBid.value;
			} else {
				return this.initialPrice;
			}
		}
	},
	spPerIsk: function() {
		if (this.parsed) {
			return 'N/A';
		} else {
			var lastBid = AuctionBids.findOne({item: this._id}, {sort: {value: -1}});
			if (lastBid != undefined) {
				return this.sp / lastBid.value;
			} else {
				if (this.initialPrice > 0) {
					return this.sp / this.initialPrice;
				} else {
					return 'N/A';
				}
			}
		}
	},
	expireDate: function() {
		return this.expire;
	},
	link: function() {
		if (this.parsed) {
			return this.url;
		} else {
			return Router.routes['auctionItemPage'].path({id: this._id});
		}
	}
}); 
