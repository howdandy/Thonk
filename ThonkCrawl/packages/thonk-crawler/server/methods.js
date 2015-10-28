if(Meteor.isServer) {
	Meteor.methods({
		/**
		 * the server-side "crawl" function, to be called client-side
		 * @param  {String} url   |the seed url to be crawled
		 * @param  {Array} terms  |the array of keywords to be matched
		 */
		"crawl" : function(url,terms) {
			console.log("initiated web crawl...");
			Crawler.crawl(url, terms);
		},
		/**
		 * TEMP FUNCTION - initiates the removal of all files
		 * originally saved by the crawler
		 */
		"removeFiles" : function() {
			Crawler.FilesCtrl.removeFiles();
		}
	});
}
