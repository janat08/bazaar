Template.charInfoPage.helpers({
	implantsList: function() {
		var list = new Array();
		for (var id in this.implants) {
			list.push(this.implants[id]);
		}
		return list;
	},
	skillPoints: function() {
		var total = 0;
		for (var id in this.skills) {
			total += parseInt(this.skills[id].skillpoints);
		}
		return total;
	},
	skillList: function() {
		var list = new Array();
		for (var id in this.skills) {
			list.push(this.skills[id]);
		}
		return list;
	}
});
