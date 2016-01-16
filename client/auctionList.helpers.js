Template.auctionList.helpers({
	items: function() {
		var query = Session.get('auctionFilterQuery');
		if (query != undefined) {
			return AuctionItems.find(query);
		} else {
			return AuctionItems.find();
		}
	}
});