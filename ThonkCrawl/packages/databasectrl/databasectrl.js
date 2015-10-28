DatabaseCtrl = class DatabaseCtrl {
	constructor(collections) {
		this.collections = {};
		if(typeof collections != 'undefined') {
			collections.forEach(function(key, value) {
				this.collections[key] = value;
			});
		}
		this.CreateBaseCollections();
		return this;
	}

	
	insert(key, insertStatment) {
		var collection = this._getCollection(key);
		collection.insert(insertStatment);
	}

	find(key, args) {
		var collection = this._getCollection(key);
		if(typeof args == 'undefined') {
			return collection.find();
		} else {
			return collection.find(args);
		}
	}

	findAndFetch(key, args) {
		var collection = this._getCollection(key);
		if(typeof args == 'undefined') {
			return collection.find().fetch();
		} else {
			return collection.find(args).fetch();
		}
	}

	remove(key, id) {
		var collection = this._getCollection(key);
		collection.remove(id);
	}

	update(key, id, data) {
		var collection = this._getCollection(key);
		collection.update(id, data);
	}

	_getCollection(key) {
		return this.collections[key];
	}

	createCollection(key) {
		var _this = this;
		if(typeof key == 'string') {
			_this.collections[key] = new Mongo.Collection(key);
		} else if(typeof key == 'object'){
			key.forEach(function(k){
				_this.collections[k] = new Mongo.Collection(k);
			});
		}
	}

	CreateBaseCollections() {
		var cols = new Array();
		var _this = this;
		for(var key in _this.collections) {
			cols.push(key);
		}

		cols.push('pages');
		cols.push('savedOptions');
		this.createCollection(cols);
	}

	PublishUniversalCollections() {
		if(Meteor.isServer) {
			Meteor.publish("savedOptions", function() {
			var options = this._getCollection('options');
				return options.find({}).fetch();
			});

			Meteor.publish("pages", function() {
			var pages = this._getCollection('pages');
				return pages.find({}).fetch();
			});
		}

		if(Meteor.isClient) {
			Meteor.subscribe("savedOptions", function() {
			var options = this._getCollection('options');
				return options.find({}).fetch();
			});
		}

		if(Meteor.isClient) {
			Meteor.subscribe("savedOptions");			
		}
	}
}

