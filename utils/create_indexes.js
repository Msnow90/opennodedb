const fs = require('fs');

module.exports = function(indexSize, modelName) {

	var possibleCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
														's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

	// needs to initialize files and return an object with all indexes, main db func will assign it to the right key	
	if (indexSize != 1 && indexSize != 2) {
		throw new Error('Improper index size provided to createModel method.');
	}

	//*** waiting to implement fs ops until in memory is complete
	//fs.mkdirSync(`./data/${modelName}`);

	if (indexSize == 1) {
		var indexObj = {};

		for (var i = 0; i < possibleCharacters.length; ++i) {
			var initializedFileData = {}; // will make our file a json object (will be adjancency list as items are added)
			var currentInd = possibleCharacters[i];

			indexObj[currentInd] = []; // will store our array of database entries for the appropriate index

			// *** for now we will not implement file system operations until the in-memory is complete
			//fs.writeFileSync(`./data/${modelName}/${currentInd}`, JSON.stringify(initializedFileData));
		}

		return indexObj;
	}

	// indexSize must be 2
	else {

	}
}