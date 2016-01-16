Template.userProfilePage.events({
	'click #saveKeys': function() {
		var key1 = new Array();
		var key2 = new Array();
		$('input[name="key1[]"]').each(function() {
			key1.push($(this).val());
		});
		$('input[name="key2[]"]').each(function() {
			key2.push($(this).val());
		});
		var keys = new Array();
		key1.forEach(function(item, i, arr) {
			var k1 = key1[i].trim();
			var k2 = key2[i].trim();
			if ((k1 != '') && (k2 != '')) {
				var k = {
					key1: k1,
					key2: k2
				};
				keys.push(k);
			}
		});
		Meteor.call('setApiKeys', keys, function (err) {
			if (err) {
				alert(err.message);
			} else {
				$('.newKey').each(function() {
					$(this).val('');
				});
			}
		});
	},
	'click .charInfo': function() {
		Meteor.call('fetchCharInfo', this.characterID);
		Router.go('charInfoPage', {id: this.characterID});
	},
	'click .sellChar': function() {
		if (!confirm('Are you sure?')) return;
		Meteor.call('fetchCharInfo', this.characterID);
		Router.go('auctionItemCreatePage', {id: this.characterID});
	}
}); 
