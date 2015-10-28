Page = class Page {
	constructor(params) {
		this._url = params.url;
		this._content = params.content;
		this._headers = params.headers;
		
		/** keywords special case */
		if(Match.test(params.keyWords, undefined)) {
			this._keyWords = [];
		} else {
			this._keyWords = params.keyWords;
		}

		this._consumed = false;
		this._searched = true;
		this._type = this.findType(params.url); 
	}

	///////////////////////
	//GETTERS AND SETTER //
	///////////////////////
	get content() { return this._content;};
	get headers() { return this._headers;};
	get keyWords() { 
		return this._keyWords;
	};
	get consumed() { return this._consumed;};
	get searched() { return this._searched;};
	get url() { return this._url;};
	get type() { return this._type;};

	set content(val) { return this._content = val;};
	set headers(val) { return this._headers= val;};
	set keyWords(val) { return this._keyWords= val;};
	set consumed(val) { return this._consumed= val;};
	set searched(val) { return this._searched= val;};
	set url(val) { return this._url = val;};



	/**
	 * finds the page type of the passed URL
	 * @param  {String} url |the url to be typed
	 * @return {String}     |the page type of the URL
	 */
	findType(url) {
		var type;
			//find the correct type
		if(url.indexOf('/rss') > 1) {
			type = 'rss';
		} else if(url.indexOf('/wiki') > 1){
			type = 'wiki';
		} else {
			type = 'website';
		}

		return type;
	}
};