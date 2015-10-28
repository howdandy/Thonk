PageParser = class PageParser {
	constructor(page, parent) {
		this._page = page;
		this._parent = parent;
		this.validSources = [];
		this.matchThreshold = 1;
		this._parseStringCharLimit = 50000;
	}

	///////////////////////
	//GETTERS AND SETTER //
	///////////////////////

	get type() { return this.page.type;};
	get page() { return this._page;};

	/**
	 * checks if the found data (page meta data) is a match for the search criteria
	 * @param  {Object} context | the context the method was called in
	 * @param  {Object} data    | the page meta data
	 * @return {Boolean}        | Success of the operation
	 */
	checkForMatch(context, data) {
		var matchedKeywords = 0;
		var threshold = context.matchThreshold;
		var tempKeyWords = context.page.keyWords;
		var wordMatched = false;
		data['tags'].forEach(function(tag) {
			if(tempKeyWords.length == 0 || wordMatched >= threshold) {
				return;
			}

			/** iterate over each key word to test for a match */
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
		/** if the number of matched words is greater than or equal to 
		/*  the match threshold, than we add the item to the validSources Array
		 */
		if(matchedKeywords >= threshold) {
			context.validSources.push(data);
			console.log('page matched!');

			return true;
		}
			return false;
	}

	/**
	 * checks if the parser found valid link sources and saves them
	 * 
	 * @return {Boolean} the success of the operation
	 */
	saveValidSources() {
		context = this;
		var _this = this;		
		context._parent.DatabaseCtrl.find('pages');
		if(_this.validSources.length > 0) {
			_this.validSources.forEach(function(source) {
				context._parent.DatabaseCtrl.insert('pages', {source: source});
			});

			return true;
		} else {
			console.log('no valid Sources found');
			return false;
		}

	}

	/**
	 * polymorphic overload for parsing
	 */
	parse() {
		return parseUrl(this.page);
	}

	/**
	 * parse a specified URL
	 * @param  {String} url |the url to parse
	 */
	parseUrl(url) {
		var _this = this;
		var data = Scrape.url(url); 
		if(Match.test(data, undefined)) {
			return false;
		}

		/** check if request returned data */
		this.checkForMatch(_this,data);
		this.saveValidSources();

		return true;
	}

	/**
	 * produces an array of "chunks" of the string given
	 * the size of the chunks is determined by the "parseStringCharLimit" of the Parser
	 * 
	 * @param  {[type]} chunkSize [description]
	 * @return {[type]}           [description]
	 */
	chunkString(str, chunkSize) {
		var _this = this;
		var chunks = new Array();
		var numChunks = 1;
		if(str.length > _this._parseStringCharLimit) {
			numChunks = Math.ceil(str / _this._parseStringCharLimit);
		} 
			for (var i = 0; i < numChunks; i++) {
				var tempStr = str.substring(0, _this._parseStringCharLimit);
				str = str.substring(_this._parseStringCharLimit);

				chunks.push(tempStr);
			};

			chunks.push(str);

		return chunks;
	}

	/**
	 * extracts links from given page
	 * 
	 * @return {Array}      an array of Strings containg the links found
	 */
	farmLinks() {
		var _this = this;
		var content = _this.page.content;
		///////////////////////////////////////////////
		// THIS IS A LIMIT ON HOW MANY LINKS TO FARM //
		//    AND SHOULD BE REMOVED IN PRODUCTION    //
		///////////////////////////////////////////////
		var debug_limit = 5;
		var link_counter = 0;
		///////////////////////////////////////////////
		///////////////////////////////////////////////
		///////////////////////////////////////////////

		var pageChunks = _this.chunkString(content);
		var links = new Array();
		var cheerio = _this._parent._accessNPM('cheerio');
		/** iterate through the chunks and parse them */
		pageChunks.some(function(chunk) {
			/** load the specified html chunk */
			var $ = cheerio.load(chunk);

			/** search for any "a" tags in the loaded html
			/*  and extract the "href" (link) property from it
			*/
			var linkArr = $('a');

			if(!Match.test(linkArr, undefined)){
				/** linkInfo will be of type cheerio AttrObject */
				$(linkArr).each(function(indx, linkInfo) {
					var link;

					link = $(linkInfo).attr('href');

					/** check link validity */
					if(_this.checkLinkValidity(link)) {
						/** push the Array of links into the stack */
						if(!(link_counter >= debug_limit)) {
							links.push(link);
							link_counter++;
						}
					}
				});
			}
		}); 

		/** return all links found */
		return  links;
	}

	/**
	 * checks the various fail cases of the link
	 * 
	 * @return {Boolean} the result of the validity test
	 */
	checkLinkValidity(link) {
		var _this = this;
		/** check if link is defined */
		if(Match.test(link, undefined)) {
			return false;
		} 

		/** check if link is anchor placeholder */
		if(link.indexOf('#') == 0){
			return false;
		}

		/** check if link is relative */
		if(link.indexOf('/') == 0 ){
			return false;
		}

		/** check if link is the same as seed link */
		if((link == _this.page.url)){
			return false;
		}

		/** check for specific outlawed page types */
		if((link.indexOf('.xml') !== -1)){
			return false;
		}

		_this._parent.Links.some(function(src) {
			if(src == link) {
				return false;
			}
		});
		

		return true;
	}
};