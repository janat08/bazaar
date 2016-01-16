Template.auctionItemPage.events({
	'click #makeBid': function() {
		var params = {
			auctionID: this._id,
			characterID: this.characterID,
			bid: $('input[name=myBid]').val()
		};
		Meteor.call('makeBid', params, function(err) {
			if (err) {
				alert(err.message);
			}
		});
	}
}); 
