module.exports = function (dataObj, key, virtuals) {

	switch (key) {
		case 'validators':
			runAllValidators(virtuals, dataObj);
			break;

		case 'getters':
			runAllGetters(virtuals, dataObj);
			break;

		case 'setters':
			runAllSetters(virtuals, dataObj);
			break;
	}

	return dataObj;
}


function runAllValidators(virtuals, dataObj) {

	for (var field in virtuals) {
		if(dataObj[field]) {

			try {
				virtuals[field](dataObj[field]); // call each validator
			}
			catch(e) {
				throw e;
			}
		}
	}
}


function runAllSetters(virtuals, dataObj) {

	for (var field in virtuals) {

		if (dataObj[field]) {
			dataObj[field] = virtuals[field](dataObj[field]); // calls the setter for the proper field
		}
	}
}