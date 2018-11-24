const _read = require('./read');

module.exports = function(dbInstance, modelName, listOfIds) {

	return new Promise((resolve, reject) => {
		var readPromises = [];

		// create all our read promises
		listOfIds.forEach(idToSearch => {
			readPromises.push(_read(dbInstance, modelName, {id: idToSearch}));
		})


		Promise.all(readPromises)
		.then(results => {
			var processedResults = results.map(result => result[0]); // because of how read works, need to send first index
			return resolve(processedResults);
		})
		.catch(reject);
	})
}