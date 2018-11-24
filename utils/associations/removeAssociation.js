// removes a child id specified from relations tables

module.exports = function(dbInstance, parentModel, parentId, childModel, childId) {

	var relationsObj = dbInstance.relationsTables[parentModel].filter(associations => {
		if (associations.has == childModel) return true;
	})[0];

	var table = relationsObj.table[parentId];
	var indexToRemove = table.indexOf(childId);
	table.splice(indexToRemove, 1);
}