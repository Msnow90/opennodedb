const fs = require('fs');

// import our utility functions
const _onInit = require('./utils/init');
const _createIndexes = require('./utils/create_indexes');

// crud ops
const _insert = require('./utils/crud/insert');
const _read = require('./utils/crud/read');
const _delete = require('./utils/crud/delete');
const _update = require('./utils/crud/update');

// export main db here.
class Database {

	constructor() {
		this.idTable = {}; // will hold an object with a key for each modelName and a currentIndex value assigned to it
		this.indexes = {}; // contains all our data underneath the indexes
		this.models = {}; // holds model information and config
		this.adjancencyListsFilePaths = {}; // not using currently
	
		// load config on inits
		_onInit(this)
	}

	/*

	index size comes as either 1 or 2 or the amount of characters to index on uuid

	1 means just the first character (36 combos, 36 file sectors)
	2 is 36*36 indexes and file sectors

	config contains props: validators, setters, getters - these run from basic crud methods

	*/
	createModel(name, indexSize, modelObj, config) {
		this.models[name] = {model: modelObj, config};
		this.createIndexes(indexSize, name);
		this.idTable[name] = 0;

		return {
			insert: this.insert.bind(this, name),
			read: this.read.bind(this, name),
			delete: this.delete.bind(this, name),
			update: this.update.bind(this, name)
		}
	}


	createIndexes(indexSize, modelName) {
		this.indexes[modelName] = _createIndexes(indexSize, modelName);
	}

	// returns a promise
	insert(modelName, dataObj) {
		return _insert(this, modelName, dataObj);
	}

	read(modelName, queryObj) {
		return _read(this, modelName, queryObj);
	}

	delete(modelName, queryObj) {
		return _delete(this, modelName, queryObj);
	}

	update(modelName, queryObj, updatedObj) {
		return _update(this, modelName, queryObj, updatedObj);
	}
}

module.exports = Database;