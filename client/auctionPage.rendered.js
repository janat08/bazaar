Template.auctionPage.rendered = function() {
	Meteor.call('getSkillList', function(err, result) {
		if (err) {
			alert(err.message);
		} else {
			var skillList = result;
			$('.skillSelector').autocomplete({
				source: skillList
			});
		}
	});
}
