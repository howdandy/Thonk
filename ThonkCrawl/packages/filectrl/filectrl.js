FilesCtrl = class FilesCtrl {
	constructor() {
		this.__bootstrap();

		return this;
	}

	/**
	 * bootstrap the FileCtrl
	 * 
	 */
	__bootstrap() {
		this.FileStores = new Object();
		this.createPageStores();
	}

	/**
	 * OVERLOAD - save valid website files 
     *
	 * @param  {String} url     |the url of the page to be saved
	 * @param  {Object} options |the file options
	 */
	websiteSaveValidFile(url, options) {
		var _this = this;
		_this.saveValidFile(url, options, 'website');
	}

	/**
	 * OVERLOAD - save valid Rss files 
	 *
	 * @param  {String} url     |the url of the page to be saved
	 * @param  {Object} options |the file options
	 */
	rssSaveValidFile(url, options) {
		var _this = this;
		_this.saveValidFile(url, options, 'rss');
	}

	/**
	 * OVERLOAD - save valid Wiki files 
	 *
	 * @param  {String} url     |the url of the page to be saved
	 * @param  {Object} options |the file options
	 */
	wikiSaveValidFile(url, options) {
		var _this = this;
		_this.saveValidFile(url, options, 'wiki');
	}

	/**
	 * OVERLOAD - save valid file
	 * 
	 * @param  {String} url     |the url of the file to be saved
	 * @param  {Object} options  |the file options
	 * @param  {String} type    |the page-type of the file being saved
	 */
	saveValidFile(url, options, type) {
		var _this = this;
		_this.saveFile(url, options, type, 'ValidPages');
	}

	/**
	 * OVERLOAD - save failed website files 
	 *
	 * @param  {String} url     |the url of the page to be saved
	 * @param  {Object} options |the file options
	 */
	websiteSaveFailedFile(url, options) {
		var _this = this;
		_this.saveFailedFile(url, options, 'website');
	}

	/**
	 * OVERLOAD - save failed Rss files 
	 *
	 * @param  {String} url     |the url of the page to be saved
	 * @param  {Object} options |the file options
	 */
	rssSaveFailedFile(url, options) {
		var _this = this;
		_this.saveFailedFile(url, options, 'rss');
	}

	/**
	 * OVERLOAD - save failed Wiki files 
	 *
	 * @param  {String} url     |the url of the page to be saved
	 * @param  {Object} options |the file options
	 */
	wikiSaveFailedFile(url, options) {
		var _this = this;
		_this.saveFailedFile(url, options, 'wiki');
	}

	/**
	 * OVERLOAD - save failed file
	 * 
	 * @param  {String} url     |the url of the file to be saved
	 * @param  {Object} options  |the file options
	 * @param  {String} type    |the page-type of the file being saved
	 */
	saveFailedFile(url, options, type) {
		var _this = this;
		_this.saveFile(url, options, type, 'FailedPages');
	}

	/**
	 * saves a specified page-type to a file in the file system
	 * @param  {String} url           |the url of the file to be saved
	 * @param  {Object} options       |the file options
	 * @param  {String} type          |the page-type of the file being saved
	 * @param  {String} storeModifier |whether the page passed or failed
	 * @return {Boolean}              |the success of the function
	 */
	saveFile(url, options, type, storeModifier) {
		if(Meteor.isServer) {
			var _this = this;
			options.fileName = (typeof options.fileName == 'undefined') ? "" : options.fileName;
			var file = new FS.File();
			var file_name = _this.cleanFileName(options.fileName + Random.id(8));
			var extension;
			var retData ={};
			file.name(file_name);
			file.attachData(url);

			file.extension('html');
			extension = file.extension();
			
			console.log('attempting to save file...');
			/** detect type and insert the file */
			file_info = _this.FileStores[type + storeModifier].insert(file, function(err, result) {
				if(err) {
					console.log(err.reason);
				} else {
					console.log('file successfully saved.');
				}
			});
			return true;
		}
	}

	/**
	 * removes "." from the filename
	 * and replaces them with "_"
	 * 
	 * @param  {String} fileName |the filename to be cleaned
	 * @return {String}          |the cleaned filenam
	 */
	cleanFileName(fileName) {
		var _this = this;
		return fileName.replace(/\./g, "_");
	}

	/**
	 * TEMP FUNCTION - removes all files saved by the crawler to the file system
	 */
	removeFiles(){
		if(Meteor.isServer) {
			var _this = this;
			for(key in _this.FileStores) {
				var files = _this.FileStores[key].find().fetch();
				
				if(files.length < 1) {
					console.log('no files found in ' + key);
				} else {

					files.forEach(function(file) {
						_this.FileStores[key].remove(file._id);
						console.log('removed file record ' + file._id + '.');
					});
				}
			}

		}
	}

	/**
	 * TEMP FUNCTION - removes a specified file saved by the crawler to the file system
	 */
	removeFile(store, id) {
		if(Meteor.isServer) {
			var _this = this;

			var files = _this.FileStores[store].find().fetch();

			_this.FileStores[store].remove(id);
			console.log('removed file record ' + id + '.');
		}
	}

	/**
	 * initializes the needed filestores (where the files will be saved)
	 */
	createPageStores() {
		var _this = this;
		/** create file stores */
		_this.FileStores['rssValidPages'] = new FS.Collection("rss_valid_files", {
			stores: [new FS.Store.FileSystem("rss_valid_files", {
					path: "../../../../../../crawled_data/rss/passed",
					maxSize: 536870912,
					filter: {
						allow: {
							contentTypes: ['text/html'],
							extensions: ['js', 'html']
						}
					}
				})],
		});

		_this.FileStores['rssFailedPages'] = new FS.Collection("rss_failed_files", {
			stores: [new FS.Store.FileSystem("rss_failed_files", {
					path: "../../../../../../crawled_data/rss/failed",
					maxSize: 536870912,
					filter: {
						allow: {
							contentTypes: ['text/html'],
							extensions: ['js', 'html']
						}
					}
				})],
		});

		_this.FileStores['wikiValidPages'] = new FS.Collection("wiki_valid_files", {
			stores: [new FS.Store.FileSystem("wiki_valid_files", {
					path: "../../../../../../crawled_data/wiki/passed",
					maxSize: 536870912,
					filter: {
						allow: {
							contentTypes: ['text/html'],
							extensions: ['js', 'html']
						}
					}
				})],
		});

		_this.FileStores['wikiFailedPages'] = new FS.Collection("wiki_failed_files", {
			stores: [new FS.Store.FileSystem("wiki_failed_files", {
					path: "../../../../../../crawled_data/wiki/failed",
					maxSize: 536870912,
					filter: {
						allow: {
							contentTypes: ['text/html'],
							extensions: ['js', 'html']
						}
					}
				})],
		});

		_this.FileStores['websiteValidPages'] = new FS.Collection("website_valid_files", {
			stores: [new FS.Store.FileSystem("website_valid_files", {
					path: "../../../../../../crawled_data/website/passed",
					maxSize: 536870912,
					filter: {
						allow: {
							contentTypes: ['text/html'],
							extensions: ['js', 'html']
						}
					}
				})],
		});

		_this.FileStores['websiteFailedPages'] = new FS.Collection("website_failed_files", {
			stores: [new FS.Store.FileSystem("website_failed_files", {
					path: "../../../../../../crawled_data/website/failed",
					maxSize: 536870912,
					filter: {
						allow: {
							contentTypes: ['text/html'],
							extensions: ['js', 'html']
						}
					}
				})],
		});


		/** create file store permissions */
		_this.FileStores['rssValidPages'].allow({
			'insert' : function() {
				return true;
			}
		});

		_this.FileStores['rssFailedPages'].allow({
			'insert' : function() {
				return true;
			}
		});

		_this.FileStores['wikiValidPages'].allow({
			'insert' : function() {
				return true;
			}
		});

		_this.FileStores['wikiFailedPages'].allow({
			'insert' : function() {
				return true;
			}
		});

		_this.FileStores['websiteValidPages'].allow({
			'insert' : function() {
				return true;
			}
		});

		_this.FileStores['websiteFailedPages'].allow({
			'insert' : function() {
				return true;
			}
		});

	}
};
