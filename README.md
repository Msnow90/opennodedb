# About
OpenNodeDB is an open source database implementation made by me [(Matthew Snow)](http://www.matthewsnow.me). It's just a simple solution that uses an ORM approach to storing JSON data both in memory and in files (file system still in the works). Although the index system created doesn't use B or B+ trees, it uses a hash table for indexes (only for the id field), and each collection of record sets that the index points to has an incrementing id, we use a binary search method to quickly locate a record when searched by id.

# Description
This database implementation will be best used for small/medium sized intranets, or apps, where performance is a must. More to come as this project starts to take shape.

# How to Use
## From a terminal, inside main project
```
npm install opennodedb
```

## From inside a node.js project
```javascript
// create new database instance
var OpenNodeDB = require('opennodedb');
var db = new OpenNodeDB();


// create a model w/ validators, getters and setters
db.createModel('Users', 1, { name: String, password: String },
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
				return name + ' I got appended to the name haha!.'
			}
		}
	})



// inserting an object: db.insert(modelname, object)
db.insert('Users', { name: 'Apple Pear', password: 'doublefruit123'})
.then(user => {
	// here you can see that apple pear will be assigned the id of 0
	// each subsequent id will be incremented
})
.catch(err => {
	//....
})


// finding a user or users: db.read(modelname, queryParamsObj)
db.read('Users', { name: 'Apple Pear'})
.then(foundData => {
	// foundData will be an array with our results
	// if an id was searched, there will only be 1 result at foundData[0]
})

```

# Test Results
| Test Type      						   | Times         |
| ------------- 							 |:-------------:|
| Inserting 100,000 items      |  198.723 ms   |
| Reading by id (after 100000) |  0.075 ms     |
| Reading by name 		""			 |  3.9 ms    	 |


#Goals
1. Implement Getters functionality
2. Create a file persistence mechanism using child processes.
3. Creating multiple driver mechanisms (using a tcp socket) with auth.
4. Create update functionality
5. Create delete functionality