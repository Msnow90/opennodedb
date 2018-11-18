module.exports = function (dbInstance, modelName, queryObj) {

	return new Promise((resolve, reject) => {
	var queryFields = Object.keys(queryObj);
	var data = dbInstance.indexes[modelName];
	var possibleIdField = queryFields.indexOf('id');

	if (possibleIdField != -1) {
		var indexStr = queryObj['id'].toString()[0];

		// *** Because our indexes increment and are in order, we can do a binary search to cut down time

		var dataEntries = data[indexStr];
		var middleIndex = Math.floor(dataEntries.length / 2);
		var firstIndex = 0;
		var lastIndex = dataEntries.length - 1;
		var lastMiddleIndex;

		while (dataEntries[middleIndex].id != queryObj.id) {

			if (lastMiddleIndex == middleIndex) return reject(`Failed to find the id: ${queryObj.id}`);
			lastMiddleIndex = middleIndex;

			if (dataEntries[middleIndex].id > queryObj.id) {
				lastIndex = middleIndex;
				middleIndex = Math.floor((firstIndex + lastIndex) / 2);
			}

			else if (dataEntries[middleIndex].id < queryObj.id) {
				firstIndex = middleIndex;
				middleIndex = Math.floor((firstIndex + lastIndex) / 2);
			}
		}

		return dataEntries.splice(middleIndex, 1);
	}


	// if an id field isn't provided, we need to search our objects in our 
	var deletionCount = 0;
	for (var index in data) {

		for (var i = 0; i < data[index]; ++i) {

			var willDelete = queryFields.forEach(field => {
				if (data[index][i][field] == queryObj[field]) return true;
			})
			.reduce((acc, curr) => {
				return acc && curr;
			}, true)

			// if the document matches all our query fields
			if (willDelete) {
				data[index].splice(i, 1);
				deletionCount++;
			}
		}
	}

	return resolve({msg: "Successfully deleted query params.", count: deletionCount});
	})
	
}