# About
OpenNodeDB is an open source caching server with an ORM type overlay querying mechanism (a variation of something like Redis with more of a database-like architecture) made by me [(Matthew Snow)](http://www.matthewsnow.me). It's just a simple solution that uses an ORM approach to storing JSON data both in memory and in files (file system still in the works). Although the index system created doesn't use B or B+ trees, it uses a hash table for indexes (only for the id field), and each collection of record sets that the index points to has an incrementing id, we use a binary search method to quickly locate a record when searched by id.

# Description
This is an open source memory caching server (will be when finished), that can be utilized to store and retrieve things in a database like format. 

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


// **** OR we can return a model interface so the model name doesn't need to be specified as an argument:

var User = db.createModel('Users'.....)

User.read({ id: 1234 })
User.insert({ name: 'Some name...', password: 'A password...' })


// *** Creating associations is also pretty simple

var Post = db.createModel('Posts', { title: String, genre: String})

dbInstance.createAssociation('Users', 'Posts');

// add an assocation .addAssocation(parentModel, parentId, childModel, childId);
dbInstance.addAssociation('Users', 78, 'Posts', 3);

// to query data that is associated with a model: dbInstance.findAssociated(ownerModel, ownerId, childModel)
dbInstance.findAssociated('Users', 24, 'Posts')
.then(results => ....);


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



// updating a user by id ---- db.update(modelname, queryObj, objDataToUpdate)
db.update('Users', {id: 1234}, {name: 'This is my new name!'})
.

```

# Test Results
| Test Type      						   | Times         |
| ------------- 							 |:-------------:|
| Inserting 100,000 items      |  198.723 ms   |
| Reading by id (after 100000) |  0.075 ms     |
| Reading by name 		""			 |  3.9 ms    	 |
| Updating by id							 |  0.758 ms		 |
| Update 99,999 items by name	 |  28.092 ms		 |
| Delete by id								 |  0.555 ms		 |
| Delete 99,998 items by name  |  37.156 ms    |
| Insert through User Model		 |  0.051 ms     |
| Create an association				 |  0.089 ms		 |
| Add an association entry		 |  0.105 ms     |
| Find One Associated Obj			 |  0.516 ms		 |
| Finding 11 associated objs	 |  0.076 ms		 |

* Need to figure out why finding 1 associated object is slower than finding 11.



# Goals
1. Implement Getters functionality
2. Create a file persistence mechanism using child processes.
3. Creating multiple driver mechanisms: TCP socket with auth, HTTP server w/ auth, in app option.
4. Cleanup CRUD operation login, make more readable and efficient in terms of decisions
5. Implement proper error handling and feedback

# Contributions
Any contributions are welcome, please open an issue and provide a PR if possible. I'm also open to discussing/collaborating.