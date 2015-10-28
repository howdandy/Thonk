RSSParser = class RSSParser extends PageParser {
	contructor(page, _parent) {
		console.log(_parent);
		super(page,_parent);
	}

	/**
	 * overload function of parent checkMatch, customized
	 * for RSS feeds
	 * 	
	 * @param  {Object} context |the context the method was called from
	 * @param  {Object} data    |the page meta data
	 * @return {Boolean}        |the success of the operation
	 */
	checkForMatch(context, data) {
		var matchedKeywords;
		var threshold = context.matchThreshold;
		var tempKeyWords = context.page.keyWords;
		var wordMatched = false;

		data.items.forEach(function(item){
			console.log('checking item: '+ item.title);
			matchedKeywords = 0;
			item['tags'].forEach(function(tag) {
				if(tempKeyWords.length == 0 || wordMatched >= threshold) {
					return;
				}
				tempKeyWords.forEach(function(keyword) {
					if(tag.toLowerCase() == String(keyword).toLowerCase()) {
						console.log('matched tag: ' + tag + ' to keyword: ' + keyword);
						wordMatched = true;
						matchedKeywords++;
					}
				});

				if(wordMatched) {
					var idx = tempKeyWords.indexOf(tag);
					tempKeyWords.splice(idx, 1);
					wordMatched = false;
				}
			});
			if(!(matchedKeywords >= threshold)) {
				return false;
			}

			context.validSources.push(item);
			console.log('page matched!');

			return true;
		});
	}

	/**
	 * polymorphic overload for parsing
	 */
	parse() {
		return this.parseRSS(this.page.url);
	}

	/**
	 * parse a specified RSS feed
	 * @param  {String} url |the url to parse
	 */
	parseRSS(url) {
		var _this = this;
		var data = Scrape.feed(url);

		/** check if request returned data */
		if(Match.test(data, undefined)) {
			return false;
		}

		this.checkForMatch(_this,data);
		this.saveValidSources(_this);

		return true;
	}


};