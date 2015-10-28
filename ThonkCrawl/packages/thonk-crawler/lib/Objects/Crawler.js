Crawler = class Crawler {
	constructor() {
		this.__bootstrap();
		this.FilesCtrl = new FilesCtrl();
		this.DatabaseCtrl = new DatabaseCtrl();
		this.PageParsers = new Object();
		this.ParserFactory = new ParserFactory(this);
		this.crawlLimit = 5;
		this.Links = new Array();
		this.crawlCounter = 0;
	}

	/**
	 * bootstrap the Crawler
	 */
	__bootstrap() {
		this.defineValidation();
		if(Meteor.isServer) {
			this.defineServerSide();
		}
	};

	/**
	 * define any serverside dependencies
	 */
	defineServerSide() {
		var _this = this;
		if(Meteor.isServer) {
			Crawler.prototype.NPM = new Object();
			_this.NPM['cheerio'] = Npm.require('cheerio');
			_this.NPM['chalk'] = Npm.require('chalk');
			_this.NPM['future'] = Npm.require('fibers/future');
		}
	};

	/**
	 * used by child modules to safely call methods in sibling modules 
	 * 
	 * @param  {String} mod  |The name of the sibling module
	 * @param  {String} func |the name of the function to be called
	 * @param  {Object} args |arguments to be passed to the 
	 * @return {??}      	 |returns whatever the invoked method returns
	 */
	__call(mod, func, args) {
		var _this = this;
		if(_this.hasOwnProperty(mod)) {
			if(typeof _this[mod][func] === 'function') {
					var ret = _this[mod][func].apply(_this[mod], args);
					return ret;
			} else {
				console.log('Crawler Error: call to undefined sibling method - "' + func + '" of "' + mod + '"');
			}
		} else {
			console.log('Crawler Error: call trying to access undefined sibling Module - "' + mod + '"');
		}
	};

	/**
	 * used by child modules to safely access properties in sibling modules 
	 * 
	 * @param  {String} mod  |The name of the sibling module
	 * @param  {String} func |the name of the function to be called
	 * @return {??}      	 |returns whatever the invoked method returns
	 */
	__access(mod, prop) {
		var _this = this;
		if(_this.hasOwnProperty(mod)) {
			if(_this[mod].hasOwnProperty(prop)) {
					var prop = _this[mod][prop];
					return prop;
			} else {
				console.log('Crawler Error: trying to undefined sibling property - "' + prop + '" of "' + mod + '"');
			}
		} else {
			console.log('Crawler Error: trying to access undefined sibling Module - "' + mod + '"');
		}
	};

	/**
	 * returns the instantiated node_module specified
	 * 
	 * @param  {String} mod |the name of the node_module to return 
	 * @return {Object}     | the node module being returned
	 */
	_accessNPM(mod) {
		var _this = this;
		var ret = _this.NPM[mod];

		return ret;
	};

	/**
	 * defines the validation schema for URLs
	 */
	defineValidation() {
		var _this = this;

		_this.HTTPSchema = new SimpleSchema({
		  url: {
		    type: String,
		    label: "A URL",
		    regEx: /(^|\s)((http?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi,
		    max: 1000
		  }
		});
	};

	/**
	 * valides the entered URL
	 * 
	 * @param  {String} url |the url to be validated
	 * @return {Boolean}    |the success of the operation
	 */
	validateURL(url) {
		var _this = this;
		return Match.test({url: url}, _this.HTTPSchema);
	};
};