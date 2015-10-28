WebsiteParser = class WebsiteParser extends PageParser {
	contructor(page, _parent) {
		super(page, _parent);
	}

	/**
	 * polymorphic overload for parsing
	 */
	parse() {
		return this.parseWebsite(this.page.url);
	}

	/**
	 * parse a specified Website URL
	 * @param  {String} url |the url to parse
	 */
	parseWebsite(url) {
		var data = Scrape.website(url);
		var _this = this;

		/** check if request returned data */
		if(Match.test(data, undefined)) {
			return false;
		}
		this.checkForMatch(_this,data);
		this.saveValidSources(_this);

		return true;
	}

};