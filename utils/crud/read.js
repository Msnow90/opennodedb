module.exports = function(dbInstance, modelName, queryObj) {

	return new Promise((resolve, reject) => {

		
		var queryFields = Object.keys(queryObj);
		var data = dbInstance.indexes[modelName];
		var possibleIdField = queryFields.indexOf('id');

		// meaning we can search the proper index instead of parsing everything
		if (possibleIdField != -1) {
			var indexStr = queryObj['id'].toString()[0];

			// *** Because our indexes increment and are in order, we can do a binary search to cut down time

			var dataEntries = data[indexStr];
			var middleIndex = Math.floor(dataEntries.length / 2);
			var firstIndex = 0;
			var lastIndex = dataEntries.length - 1;
			var data = [];
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

			data[0] = dataEntries[middleIndex];
			return resolve(data);


			// var matchedData = data[indexStr].filter(entry => {

			// 	for (var i = 0; i < queryFields.length; ++i) {
			// 		if (queryObj[queryFields[i]] != entry[queryFields[i]]) return false;
			// 		else return true;
			// 	}
			// })



			// return resolve(matchedData);
		}
		
		var matchedDataAcc = []; // will accumulate all of our queries from below
		// if an id isn't provided...
		for (var index in data) {
			// stores results that pass
			var matchedDataSet = data[index].filter(entry => {

				for (var i = 0; i < queryFields.length; ++i) {				
					if (queryObj[queryFields[i]] != entry[queryFields[i]]) return false;
					else return true;
				}
			})

			matchedDataAcc = matchedDataAcc.concat(matchedDataSet);
		}

		return resolve(matchedDataAcc);
	})
}