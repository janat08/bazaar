function makeSkillFilters(filters) {
	var conds = [];
	for (var i in filters) {
		var filter = filters[i];
		var levels = [];
		if (filter.level1) levels.push('1');
		if (filter.level2) levels.push('2');
		if (filter.level3) levels.push('3');
		if (filter.level4) levels.push('4');
		if (filter.level5) levels.push('5');
		if (levels.length > 0) {
			var skillQuery = {
				typeName: filter.name,
				level: {
					$in: levels
				}
			};
			conds.push({
				"charInfo.skillList": {
					$elemMatch: skillQuery
				}
			});
		}
	}
	if (conds.length > 0) {
		var query = {
			$and: conds
		};
		return query;
	} else {
		return undefined;
	}
}

function applySkillFilters() {
	var filters = AuctionSkillFilters.find().fetch();
	var query = makeSkillFilters(filters);
	if (query != undefined) {
		Session.set('auctionFilterQuery', query);
		Session.set('auctionSkillFilters', filters);
	} else {
		Session.set('auctionFilterQuery', undefined);
		Session.set('auctionSkillFilters', undefined);
	}
}

Template.auctionPage.events({
	'click .addSkillFilter': function() {
		var skillName = $('input[name=skillFilter]').val().trim();
		if (skillName == '') {
			alert('You must select skill for filter');
			return;
		}
		AuctionSkillFilters.upsert({name: skillName}, {name: skillName, level1: true, level2: true, level3: true, level4: true, level5: true});
		$('input[name=skillFilter]').val('');
		applySkillFilters();
	},
	'click .removeSkillFilter': function() {
		AuctionSkillFilters.remove(this._id);
		applySkillFilters();
	},
	'click .skillLevelSelector': function(evt) {
		var elem = $(evt.target);
		var elemName = elem.attr('name');
		var elemVal = elem.prop('checked');
		var updateQuery = {$set: {}};
		updateQuery['$set'][elemName] = elemVal;
		AuctionSkillFilters.update(this._id, updateQuery);
		applySkillFilters();
	}
}); 

Deps.autorun(function() {
	var skillFilters = Session.get('auctionSkillFilters');
	var query = makeSkillFilters(skillFilters);
	var oldQuery = Session.get('auctionFilterQuery');
	if (query != oldQuery) {
		applySkillFilters();
	}
});
