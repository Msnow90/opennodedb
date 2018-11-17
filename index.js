const fs = require('fs');

// import our utility functions
const _onInit = require('./utils/init');
const _createIndexes = require('./utils/create_indexes');
const _insertToFile = require('./utils/insert_to_file');

// crud ops
const _insert = require('./utils/crud/insert');
const _read = require('./utils/crud/read');

// export main db here.
class Database {

	constructor() {
		this.idTable = {}; // will hold an object with a key to each modelName and a currentIndex value
		this.indexes = {};
		this.models = {};
		this.adjancencyListsFilePaths = {};
	
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
}

module.exports = Database;