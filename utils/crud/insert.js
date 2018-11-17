const _runVirtuals = require('../run_virtuals');

module.exports = function(dbInstance, modelName, dataObj) {

	return new Promise((resolve, reject) => {
		var model = dbInstance.models[modelName];
			
		// dbInstance will run all of our validators and setters before inserting
		for (var key in model.config) {	

			if (key == 'validators' || key == 'setters') {
				var virtuals = model.config[key];

				try {
					_runVirtuals(dataObj, key, virtuals);
				}
				catch(e) {
					reject(e);
				}

			}
		}
		// create new id and assign to memory
		const newId = dbInstance.idTable[modelName]; // save a copy of current index for models to this variable
		dbInstance.idTable[modelName]++; // increment index immediately to help prevent false atomic operations

		const indexStr = newId.toString()[0];
		dataObj.id = newId;

		dbInstance.indexes[modelName][indexStr].push(dataObj); // push data into an array inside our index under proper model name
		resolve(dataObj);

	})
}