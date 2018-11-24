const _readAll = require('../crud/readAll');

module.exports = function(dbInstance, parentModel, parentId, childModel) {

	var childIds = dbInstance.relationsTables[parentModel].filter(associationObj => {
		if (associationObj.has == childModel) return true;
		return false;
	})[0].table[parentId];


	return _readAll(dbInstance, childModel, childIds);
}