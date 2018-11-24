module.exports = function(dbInstance, parentModel, parentId, childModel, childId) {

	var allAssociations = dbInstance.relationsTables[parentModel];
	//var childIndex; // will point to the index with our child model

	for (var i = 0; i < allAssociations.length; ++i) {
		if (allAssociations[i].has == childModel) {
			if (!allAssociations[i].table[parentId]) allAssociations[i].table[parentId] = [];
			allAssociations[i].table[parentId].push(childId);
		}
	}


	/*

	post id
	user id

	dbInstance.relationsTable:

	Users: [
		{
			has: 'Posts',
			table: {
				123: [1]
			}
		},
		{
			....
		}
	]

	*/


}