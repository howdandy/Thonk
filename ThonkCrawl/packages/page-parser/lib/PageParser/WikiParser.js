WikiParser = class WikiParser extends PageParser {
	contructor(page, _parent) {
		super(page, _parent);
	}

	/**
	 * polymorphic overload for parsing
	 */
	parse() {
		return this.parseArticle(this.page.url);
	}

	/**
	 * parse a specified wiki page
	 * @param  {String} url |the url to parse
	 */
	parseArticle(url) {
		var data = Scrape.url(url);
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