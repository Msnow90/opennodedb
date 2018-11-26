const fs = require('fs');

// import our utility functions
const _onInit = require('./utils/init');
const _createIndexes = require('./utils/create_indexes');

// crud ops
const _insert = require('./utils/crud/insert');
const _read = require('./utils/crud/read');
const _delete = require('./utils/crud/delete');
const _update = require('./utils/crud/update');

// association ops
const _createAssociation = require('./utils/associations/createAssociation');
const _addAssociation = require('./utils/associations/addAssociation');
const _findAssociated = require('./utils/associations/findAssociated');
const _removeAssociation = require('./utils/associations/removeAssociation');

// export main db here.
class Database {

	constructor() {
		this.idTable = {}; // will hold an object with a key for each modelName and a currentIndex value assigned to it
		this.indexes = {}; // contains all our data underneath the indexes
		this.models = {}; // holds model information and config
		this.relationsTables = {}; // will have keys based on model name, then a property for the associated model, and a property containing an adjacency list for (model 1) ids => (model 2) ids

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
		this.idTable[name] = 0;
		this.createIndexes(indexSize, name);

		// returns an object similar to a data model, this enables us to not have to specify the modelname when calling the methods attached
		return {
			insert: this.insert.bind(this, name),
			read: this.read.bind(this, name),
			delete: this.delete.bind(this, name),
			update: this.update.bind(this, name),
			createAssociation: this.createAssociation.bind(this, name),
			addAssociation: this.addAssociation.bind(this, name),
			removeAssociation: this.removeAssociation.bind(this, name),
			findAssociated: this.findAssociated.bind(this, name)
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


	// begin association functionality
	createAssociation(parentModel, childModel) {
		return _createAssociation(this, parentModel, childModel);
	}

	addAssociation(parentModel, parentId, childModel, childId) {
		return _addAssociation(this, parentModel, parentId, childModel, childId);
	}

	findAssociated(parentModel, parentId, childModel) {
		return _findAssociated(this, parentModel, parentId, childModel);
	}

	removeAssociation(parentModel, parentId, childModel, childId) {
		return _removeAssociation(this, parentModel, parentId, childModel, childId);
	}
}

module.exports = Database;