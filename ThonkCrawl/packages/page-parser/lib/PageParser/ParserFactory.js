ParserFactory = class ParserFactory {
	constructor(_parent) {
		this._parent = _parent;
	}

	/**
	 * create the correct parser type, using the 
	 * page-type
	 * 
	 * @param  {Page} page 	 |the page to be parsed
	 * @return {PageParser}  |the newly created PageParser
	 */
	createPageParser(page) {
		var parser;
		var _this = this;

		/** find the correct page type
		 *  and created the needed parser
		 */
		switch(page.type) {
			case 'rss':
				parser = new RSSParser(page, _this._parent);
			break;
			case 'wiki':
				parser = new WikiParser(page, _this._parent);
			break;
			default:
			/** if the page is not a wiki or an rss feed
			 *  it must be a normal website
			 */
				parser = new WebsiteParser(page, _this._parent);
		}

		return parser;
	}
};