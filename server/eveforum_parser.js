function processEveForumTopicRow($, row) {
	if ($(row).hasClass('sticky')) return null;
	var link = $(row).children('.topicMain').children('.maintopic-content').children('a');
	var title = link.text().trim();
	var url = 'https://forums.eveonline.com' + link.attr('href');
	var lastPosted = $(row).children('.topicLastPost').html().split('<br>')[0];
	lastPosted = Date.parse(lastPosted);
	AuctionItems.upsert({parsed: true, url: url}, {
		parsed: true,
		url: url,
		title: title,
		lastPosted: lastPosted
	});
	return lastPosted;
}

function processEveForumPageContents($) {
	var lastPosted = Date.parse('2000.01.01 00:01');
	$('.topicRow').each(function(index, value) {
		var last = processEveForumTopicRow($, value);
		if (last != null) {
			if (last > lastPosted) {
				lastPosted = last;
			}
		}
	});
	$('.topicRow_Alt').each(function(index, value) {
		var last = processEveForumTopicRow($, value);
		if (last != null) {
			if (last > lastPosted) {
				lastPosted = last;
			}
		}
	});
	console.log(lastPosted.toString());
	return lastPosted;
}

function parseEveForumPage(page) {
	var url = 'https://forums.eveonline.com/default.aspx?g=topics&f=277&p=' + page;
	var result = HTTP.call('GET', url);
	$ = cheerio.load(result.content);
	return processEveForumPageContents($);
}

function parseEveForum() {
	var page = 1;
	var endDate = new Date();
	endDate.setDate(endDate.getDate() - 2);
	while (parseEveForumPage(page) > endDate) {
		page = page + 1;
	}
	AuctionItems.remove({parsed: true, lastPosted: {$lt: endDate}});
}

parseEveForum();
