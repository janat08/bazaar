Meteor.methods({
	setApiKeys: function(keys) {
		if (!Meteor.user()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		var _keys = new Array();
		keys.forEach(function (key, index, array) {
			_keys.push(_.pick(key, 'key1', 'key2'));
		});
		Meteor.users.update({_id: Meteor.user()._id}, {
			$set: {
				apiKeys: _keys,
				chars: []
			}
		});
		if (this.isSimulation) return;
		var charsInfo = new Array();
		_keys.forEach(function (key, index, array) {
			EveOnline.fetch('account:Characters', { keyID: key.key1, vCode: key.key2 }, Meteor.bindEnvironment(function(err, result) {
				if (err) {
					throw err;
				}
				var chars = result.characters;
				for (var id in chars) {
					if (!chars.hasOwnProperty(id)) continue;
					var charInfo = chars[id];
					charInfo.apiKeyIndex = index;
					charsInfo.push(charInfo);
				}
				if (index == (_keys.length - 1)) {
					Meteor.users.update({_id: Meteor.user()._id}, {
						$set: {
							chars: charsInfo
						}
					});
				}
			}));
		});
	},
	fetchCharInfo: function(charId) {
		if (!Meteor.user()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		var user = Meteor.users.findOne({
			chars: {
				$elemMatch: {
					characterID: charId
				}
			}
		});
		if (user == undefined) {
			throw new Meteor.Error(404, 'Not Found');
		}
		if (this.isSimulation) return;
		for (var i in user.chars) {
			if (user.chars[i].characterID == charId) {
				var key = user.apiKeys[user.chars[i].apiKeyIndex];
				EveOnline.fetch('char:CharacterSheet', { keyID: key.key1, vCode: key.key2, characterID: charId },
					Meteor.bindEnvironment(function(err, result) {
						if (err) {
							throw err;
						}
						var skillList = [];
						for (var id in result.skills) {
							var getSync = Async.wrap(EveDatabase, 'get');
							var row = getSync("SELECT typeName FROM invTypes WHERE typeID = '" + id + "';");
							result.skills[id].typeName = (row != undefined) ? row.typeName : 'Unknown';
							skillList.push(result.skills[id]);
						}
						result.skillList = skillList;
						CharsInfo.upsert({characterID: charId}, result);
						AuctionItems.update({characterID: charId}, {$set: {charInfo: result}});
					}));
				break; 
			}
		}
	},
	sellChar: function(params) {
		if (!Meteor.user()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		if (params.title.trim().length == 0) {
			throw new Meteor.Error(400, 'You must specify auction item title');
		}
		var user = Meteor.users.findOne({
			chars: {
				$elemMatch: {
					characterID: params.characterID
				}
			}
		});
		if ((user == undefined) || (user._id != Meteor.userId())) {
			throw new Meteor.Error(403, 'Access denied');
		}
		var charInfo = CharsInfo.findOne({characterID: params.characterID});
		if (charInfo == undefined) {
			throw new Meteor.Error(404, 'Not found');
		}
		var totalSP = 0;
		for (var id in charInfo.skills) {
			totalSP += parseInt(charInfo.skills[id].skillpoints);
		}
		AuctionItems.upsert({characterID: params.characterID}, {
			userID: Meteor.userId(),
			characterID: params.characterID,
			initialPrice: params.initialPrice,
			minimalOverbidding: params.minimalOverbidding,
			title: params.title,
			sp: totalSP,
			charInfo: charInfo
		});
		return AuctionItems.findOne({characterID: params.characterID})._id;
	},
	makeBid: function(params) {
		if (!Meteor.user()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		var item = AuctionItems.findOne(params.auctionID);
		if (item == undefined) {
			throw new Meteor.Error(404, 'Auction not found');
		}
		var lastBid = AuctionBids.findOne({item: item._id}, {sort: {value: -1}});
		var minNextBid = 0;
		if (lastBid == undefined) {
			minNextBid = parseInt(item.minimalOverbidding) + parseInt(item.initialPrice);
		} else {
			minNextBid = parseInt(lastBid.value) + parseInt(item.minimalOverbidding);
		}
		if (params.bid < minNextBid) {
			throw new Meteor.Error(400, 'Your bid must be greater or equal ' + minNextBid + ' ISK');
		}
		AuctionBids.upsert({user: Meteor.userId(), item: params.auctionID}, {
			user: Meteor.userId(),
			item: params.auctionID,
			value: parseInt(params.bid)
		});
	},
	selectBid: function(params) {
		if (!Meteor.user()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		var item = AuctionItems.findOne(params.item);
		if (item == undefined) {
			throw new Meteor.Error(404, 'Auction not found');
		}
		if (item.userID != Meteor.userId()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		AuctionBids.update({
				item: item._id,
				selected: true
			}, {
			$set: {
				selected: false
			}
		});
		AuctionBids.update({_id: params.bid}, {
			$set: {
				selected: true
			}
		});
		var expireDate = new Date();
		expireDate.setDate(expireDate.getDate() + 1);
		AuctionItems.update({_id: params.item}, {
			$set: {
				expire: expireDate
			}
		});
	},
	getSkillList: function(params) {
		if (!Meteor.user()) {
			throw new Meteor.Error(403, 'Access denied');
		}
		var item = CharsInfo.findOne();
		if (item == undefined) {
			return [];
		} else {
			var skillList = [];
			for (var id in item.skills) {
				skillList.push(item.skills[id].typeName);
			}
			return skillList;
		}
	}
});
