const _readAll = require('../crud/readAll');

module.exports = function(dbInstance, parentModel, ownerId, childModel) {

	var childIds = dbInstance.relationsTables[parentModel].filter(associationObj => {
		if (associationObj.has == childModel) return true;
		return false;
	})[0].table[ownerId];


	return _readAll(dbInstance, childModel, childIds);
}