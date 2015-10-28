/**
 * client-side function to initiate crawl
 * @param  {String} url   |the url to be crawled
 * @param  {Array} terms  |the key words to be matched
 * @return {Boolean}      |the success of the operation
 */
Crawler.prototype.search = function(url,terms) {
	var _this = this;
	var valid = _this.validateURL(url);
	if(valid) {
		Meteor.call("crawl", url, terms, function(error) {
			if(error) {
				return new Meteor.Error(500, "Error: 500, Validation Error", "Invalid URL sent.");
			}
		});
	} else {
		return new Meteor.Error(500, "Error: 500, Validation Error", "Invalid URL sent.");
	}

	return true;
};
