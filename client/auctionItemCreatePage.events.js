Template.auctionItemCreatePage.events({
	'submit form': function(evt) {
		evt.preventDefault();
		var params = {
			characterID: this.id,
			title: $('input[name=title]').val(),
			initialPrice: $('input[name=initialPrice]').val(),
			minimalOverbidding: $('input[name=minimalOverbidding]').val()
		};
		Meteor.call('sellChar', params, function(err, result) {
			if (err) {
				alert(err.message);
			} else {
				Router.go('auctionItemPage', {id: result});
			}
		});
	}
}); 
