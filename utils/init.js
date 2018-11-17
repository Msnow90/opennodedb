const fs = require('fs');

module.exports = function (dbInstance) {

	var possibleConfigFile;

	try {
		possibleConfigFile = fs.readFileSync('./.dbconfig');
	}

	catch (err) {

		if (err) {

			// if file doesn't exist, create it, then load and assimilate
			if (err.errno == -4058) {
				var dbProps = { idTable: {}, indexes: {}, models: {}, adjancencyListsFilePaths: {} }

				fs.writeFileSync('./.dbconfig', JSON.stringify(dbProps));

				var configFile = fs.readFileSync('./.dbconfig');
				return dbAssimilate(JSON.parse(configFile.toString()), dbInstance);

			}
		}
	}

	return dbAssimilate(JSON.parse(possibleConfigFile.toString()), dbInstance);
}


function dbAssimilate(data, db) {
	db.indexes = assimilateIndexes(data);
	db.models = assimilateModels(data);
	db.adjancencyListsFilePaths = assimilateAdjancencyListsFilePaths(data);
}

function assimilateIndexes(data) {
	return data.indexes;
}

function assimilateModels(data) {
	return data.models;
}

function assimilateAdjancencyListsFilePaths(data) {
	return data.adjancencyListsFilePaths;
}
