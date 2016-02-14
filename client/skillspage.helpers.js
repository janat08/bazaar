
// Define Colors for various columns

Template.skillsPage.helpers({
	setColorValue: function(value) {
		if(value=="5"){
			return "level5Color";
		}else if(value=="4"){
			return "level4Color";
		}else if(value=="3"){
			return "level3Color";
		}else if(value=="2"){
			return "level2Color";
		}else if(value=="1"){
			return "level1Color";
		}else if(value=="0"){
			return "level0Color";
		}else{
			return "levelNoneColor";
		}
	}
});