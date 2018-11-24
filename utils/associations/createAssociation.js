module.exports = function(dbInstance, parentModel, childModel) {

	if (!dbInstance.relationsTables[parentModel]) dbInstance.relationsTables[parentModel] = [];

	dbInstance.relationsTables[parentModel].push({ has: childModel, table: {} });
}