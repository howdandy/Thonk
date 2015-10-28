/**
 * Wrapper for the PageParser Objects local createPageParser function
 * 
 * @param  {Object} page |the page to be parsed
 * @return {PageParser}  |the newly created PageParser
 */
Crawler.prototype.createPageParser = function(page) {
	var _this = this;

	_this.PageParsers[page.url] = _this.ParserFactory.createPageParser(page);

	return _this.PageParsers[page.url];
};

/**
 * create a new page object
 * @param  {Object} page |the page properties
 * @return {Page}        |the newly created page
 */
Crawler.prototype.createPage = function(page) {
	return new Page(page);
};


/**
 * Adds passed links to the Links Array
 */
Crawler.prototype.addLinks = function(links) {
	var _this = this;
	if(links.length > 0) {
		console.log(links.length + " link(s) found.");
		links.forEach(function(link) {
			console.log("adding link: "+ link + "to 'Links' Array...");
			_this.Links.push(link);
		});
	}
};

/**
 * checks whether a passed url needs to have
 * "http://" appended, and appends it
 * 
 * @param  {String} url |the url to be checked
 * @return {String}     |the checked/fixed URL
 */
Crawler.prototype.fixUrl = function(url, root) {
	if(url.indexOf('/' == 0)) {

	}
	if(url.indexOf('http://') == -1 && url.indexOf('https://') == -1) {
		url = "http://" + url;
	}

	return url;
};

/**
 * parses the initial seed url
 * 
 * @param  {String} url |the seed url to be parsed
 */
Crawler.prototype.parseSeed = function(url) {
	/** need vars */
	var page,links,ret, parser, type, Future, fut;
	var _this = this;

	/** define needed Future module */
	Future = _this._accessNPM('future');
	
	fut = new Future();

	/** GET seed page */
	HTTP.call("GET", url, function(err, result) {
		var ret = result;
		if(err) {
			console.log('error:' + err);
			return;
		}  else {
			fut.return(result);
		}
	});

	/** receive future return */
	ret = fut.wait();
	/** create seed page */
	page = _this.createPage({url: url, content: ret.content, headers: ret.headers});
	/** create seed page parser */
	parser = _this.createPageParser(page);
	/** farm links from seed page */
	links = parser.farmLinks(page);
	console.log(links);
	/** check if we found any links */
	if(!Match.test(links, undefined)) {
		/** if we found links, then we add them to the Links Array */
		_this.addLinks(links);
	} else {
		console.log('no links found on seed page.');
	}
};

/**
 * crawls the web and saves pages that meet the search criteria
 * to the loca file system and database
 * 
 * @param  {String} _url   |the initial seed URL
 * @param  {Array} terms  |An array of keywords to be matched
 */
Crawler.prototype.crawl = function(_url, terms) {
	var top__this = this;
	var fileName = _url;
	var Future = top__this._accessNPM('future');
	var results = new Object();
	var linkKeys = Object.keys(top__this.Links);

		/** check and fix URL if needed */
		_url = top__this.fixUrl(_url, _url);
		/** parse initial seed page */
		top__this.parseSeed(_url);
		for(var i = 0; i < top__this.Links.length; i++) {
			if(top__this.crawlCounter < top__this.crawlLimit) {
			console.log('processing link:' + top__this.Links[i]);
				/** create a future object */
				var rssfut = new Future();
				var fut = new Future();

				var url = top__this.Links[i];

				/** check and fix URL if needed */
				url = top__this.fixUrl(url, _url);
				HTTP.call("GET", url, function(err, result) {
					var ret = result;
					if(err) {
						console.log('Request ' + err);
						return;
					}  else {
						fut.return(result);
					}
				});

				var ret = fut.wait();

				//create parser
				var page = top__this.createPage({url: url, content: ret.content, headers: ret.headers, keyWords:  terms});
				console.log('checking correctness...');
				var parser = top__this.createPageParser(page);
				var type = parser.type;
				/** check if page meets criteria */
				if(!parser.parse()) {
					console.log('page rejected... continuing');
					continue;
				}

				 if(type != 'rss') {
					results[url] = ret;					 	
				 } else {
				 	if(parser.validSources.length > 0) {

					 	parser.validSources.forEach(function(source) {
						 	console.log('making GET Call');

						 	HTTP.call("GET", source.link, function(err, result) {
						 		if(err) {
									console.log('error:' + err);
									return;
						 		} else {
							 		rssfut.return(result);
						 		}
						 	});

					 		results[source.link] = rssfut.wait();
					 	});
				 	}
				 }

				 for(key in results) {
				 	var result = results[key];
				 	var fileName = result.headers.server + '_' + fileName;
			 		console.log('saving file(s)...');
			 		top__this.__call('FilesCtrl', parser.type + 'SaveValidFile', 
			 			[key, {fileName: fileName + "_" + parser.type,
			 	 					   content: result.content,
			 	 					   mimeType: result.headers['content-type'].substring(0, result.headers['content-type'].indexOf(';'))}]);

			 		var links = parser.farmLinks();
			 		top__this.addLinks(links);
				 }
				console.log('increment crawl count...');
				top__this.crawlCounter++;
				console.log('new crawl count: ' + top__this.crawlCounter);
			} else {
				console.log('skipping link:' + top__this.Links[i]);
			}
		}
		console.log('Links list empty, crawl completed.');
};