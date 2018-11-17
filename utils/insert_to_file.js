const fs = require('fs');

module.exports = function(dataObj, modelName) {

	return new Promise((resolve, reject) => {

		var fileStr = dataObj.id[0];

		fs.appendFile(`./data/${modelName}/${fileStr}`, JSON.stringify(dataObj) + ',\n', (err) => {
			if (err) return reject(err);

			resolve(dataObj);
		})
	})
}