const chalk = require('chalk');

// require and initialize database
const ordb = require('./index');
var dbInstance = new ordb();

var testIndex = 1;

var User = dbInstance.createModel('Users', 1, { name: String, password: String },
	{
		validators: {
			name: function (name) {
				if (name.length < 5) throw new Error('Name of length needs to be at least 5 characters!')
			}
		},

		getters: {
			name: function (name) {
				return name + 'dbcombine!'
			}
		},
		setters: {
			name: function (name) {
				return name + ' is secure.'
			}
		}
	});


console.time('1st test')	
dbInstance.insert('Users', { name: 'Matta', password: 'password123' })
	.then(user => {
		console.timeEnd('1st test')
		logTest('Ensuring insert runs validator', user.name, 'Matta is secure.');

		console.time('2nd test')
		dbInstance.read('Users', { id: user.id })
			.then(foundData => {
				console.timeEnd('2nd test')
				logTest('Should have found user when searching by id', foundData[0].name, 'Matta is secure.')
			})
	})

	.then(() => {
		console.time('3rd test')
		dbInstance.read('Users', { name: 'Matta is secure.'})
		.then(foundUser => {
			console.timeEnd('3rd test')
			logTest('Should have found user when searching by a field other than id', foundUser[0].name, 'Matta is secure.')
		})
	})

	.then(() => {
		console.log(chalk.bgBlue('Begin insertion speed test for 100,000 items'))
		console.log(chalk.bgYellow(`Current memory usage is: ${process.memoryUsage().heapUsed / 1000000} MB`))
		var insertions = [];

		console.time('insertion speed test');

		for (var i = 0; i < 100000; ++i) {
			insertions.push(dbInstance.insert('Users', { name: 'Willy', password: 'goldeneggs'}));
		}

		Promise.all(insertions)
		.then(results => {
			console.timeEnd('insertion speed test');
			logTest('Insertion test of 100,000 items', results.length, 100000);
			console.log(chalk.bgYellow(`Current memory usage is: ${process.memoryUsage().heapUsed / 1000000} MB`))
		})

		.then(() => {
			console.time('read 100,000 items test')
			dbInstance.read('Users', {name: 'Willy is secure.'})
			.then(results => {
				console.timeEnd('read 100,000 items test');
				logTest('reading 100,000 users', results.length, 100000);
			})
		})

		.then(() => {
			console.time('read for id after items')

			dbInstance.read('Users', {id: 35874})
			.then(result => {
				console.timeEnd('read for id after items')
			})
		})

		.then(() => {
			console.time('read for name after items')

			dbInstance.read('Users', { name: 'Matta is secure.'})
			.then((result) => {
				console.timeEnd('read for name after items')
				logTest('Reading for name after items', result.length, 1);
			})
		})


		.then(() => {
			console.time('update by id')

			dbInstance.update('Users', {id: 7456}, {name: 'updated this name!!!'})
			.then(result => {
				console.timeEnd('update by id')
				logTest('Updating by id', result.user.name, "updated this name!!!");
			})
		})



		.then(() => {
			console.time('update by name, 99,999 items')

			dbInstance.update('Users', {name: 'Willy is secure.'}, {name: 'updated this name!!!'})
			.then(result => {
				console.timeEnd('update by name, 99,999 items')
				logTest('Updating by name, 99,999 items', result.count, 99999);
			})
		})


		
		.then(() => {
			console.time('delete by id')
	
			dbInstance.delete('Users', {id: 253})
			.then(result => {
				console.timeEnd('delete by id')
				logTest('Deleting by id', result.count, 1);
			})
		})

				
		.then(() => {
			console.time('delete by name, 100,000 users')
	
			dbInstance.delete('Users', {name: 'updated this name!!!'})
			.then(result => {
				console.timeEnd('delete by name, 100,000 users')
				logTest('Deleting by name, 100,000 users', result.count, 99999);
				logDatabaseSize(dbInstance);
			})
		})


		.then(() => {
			console.time('insert through User model obj')

			User.insert({name: 'Testing', password: 'A secret@8y2h2u'})
			.then(user => {
				console.timeEnd('insert through User model obj');
				logTest('inserting through User model', user.name, 'Testing is secure.')
			})
		})





		.catch(err => console.log('Error:', err))
	})
	.catch(err => console.log(chalk.red('Error is:', err)))










	function logTest(name, output, expectedOutput) {
		var didPass = output == expectedOutput;

		if (didPass) {
			console.log(`${chalk.blue(`Test ${testIndex}`)} ${chalk.yellow(`for: "${name}"`)} ${chalk.magenta(`====>`)} ${chalk.green('Pass')}`);
			console.log(chalk.cyan('==================================================='))
		}

		else {
			console.log(`Test ${testIndex} for: "${name}" ===> ${chalk.red('Fail')}`)
			console.log(`${chalk.green(`Expected output is: ${expectedOutput}`)}`)
			console.log(`${chalk.red(`Actual output is: ${output}`)}`)
		}

		testIndex++;
	}


	function logDatabaseSize(dbInstance) {
		var size = 0;
		for (var model in dbInstance.indexes) {
			for (var index in dbInstance.indexes[model]) {
				size += dbInstance.indexes[model][index].length;
			}
		}

		console.log('Size of database is: ' + size + ' items.');
	}