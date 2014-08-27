var request = require('supertest'),
	app = require('../../app'),
	supertest = request(app),
	expect = require('expect.js'),
	jwt = require('jsonwebtoken'),
	secret = require('../../config/secret'),
	passportStub = require('passport-stub');
passportStub.install(app);

/*
	Testing notes- 
		app might throw 500's if useing passportStub.login(user); and it has no role
		we shouldn't being passing role into the app when reg'ing a new user
*/

var user1 = {
		'username':'userOne'+(new Date).getTime(),
		'email':'jimmy'+(new Date).getTime()+'@jimmy.com',
		'role': 'user',
		'password':'123456789'
	},
	user2 = {
		'username':'userTwo'+(new Date).getTime(),
		'email':'jimmy2'+(new Date).getTime()+'@jimmy.com',
		'role': 'user',
		'password':'123456789'
	},
	user3 = {
		'username':'userthree'+(new Date).getTime(),
		'email':'jimmy3'+(new Date).getTime()+'@jimmy.com',
		'role': 'user',
		'password':'123456789'
	},
	userWrongPassword = {
		'username':user1.username,
		'email':'jimmy@jimmy.com',
		'password':'123456789666'
	},
	userNoPassword = {
		'username':'newUser',
		'email':'jimmy@jimmy.com',
	},
	userEmptyPassword = {
		'username':user1.username,
		'email':'jimmy@jimmy.com',
		'password':''
	},
	userNoName = {
		'email':'jimmy@jimmy.com',
		'password':'123456789'
	},
	userEmptyName = {
		'username':'',
		'email':'jimmy@jimmy.com',
		'password':'123456789'
	},
	userWithUser1Email = {
		'username':'userOnetow'+(new Date).getTime(),
		'email':user1.email,
		'role': 'user',
		'password':'123456789'		
	}
	userNoEmail = {
		'username':'newUser',
		'password':'123456789'
	},
	userEmptyEmail = {
		'username':user1.username,
		'email':'',
		'password':'123456789'
	},
	userFakeAccount = {
		'username':'userOneOOnnee',
		'email':'jjimmy@jjimmy.com',
		'password':'123456782323'
	},
	userFakeAccount2 = {
		'email':'jjjimmy@jjimmy.com',
		'password':'123456782323'
	},
	userBadEmail = {
		'username':'newUser',
		'email':'jimmyjimmy.com',
		'password':'123456789'
	},
	userNumberName = {
		'username':'123123123',
		'email':'jimmy@jimmy.com',
		'password':'123456789'
	},
	admin = {
		'username':'admin',
		'email':'admin@admin.com',
		'role': 'admin',
		'id': '1',
		'password':'superpassword',
		'token':''
	};

// build admin token
var profile = {
		id: admin.id,
		username: admin.username,
		role: admin.role
	},
	token = jwt.sign(profile, secret.jwtSecret, { expiresInMinutes: 60 * 5 });
admin.token = token;

var userId1, userId2, userId3;

afterEach(function() {
	passportStub.logout(); // logout after each test
	setTimeout(function() {
		// delay for 500ms, too many open file/connections
	}, 500);
});

describe('Add User Test - ', function () {
	it('Register a new user1 - Return a 200', function(done) {
		supertest.post('/api/user').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId1 = result.body.id;
			user1.token = result.body.token;
			done();
		});
	});
	it('Register a new user2 - Return a 200', function(done) {
		supertest.post('/api/user').send(user2).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId2 = result.body.id;
			user2.token = result.body.token;
			done();
		});
	});
	it('Register a new user3 - Return a 200', function(done) {
		supertest.post('/api/user').send(user3).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId3 = result.body.id;
			user3.token = result.body.token;
			done();
		});
	});
	it('Is the username taken? - Yes', function(done) {
		var data = {'username':user1.username}
		supertest.get('/api/isUsernameTaken').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			expect(result.body.err).to.be(undefined);
			done();
		});
	});
	it('Is the username taken? - No', function(done) {
		var data = {'username':'thisisausernamenottaken'}
		supertest.get('/api/isUsernameTaken').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be(undefined);
			done();
		});
	});
	it('Is the email taken? - Yes', function(done) {
		var data = {'email':user1.email}
		supertest.get('/api/isEmailTaken').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			expect(result.body.err).to.be(undefined);
			done();
		});
	});
	it('Is the email taken? - No', function(done) {
		var data = {'email':'thisisausernamenottaken@email.com'}
		supertest.get('/api/isEmailTaken').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be(undefined);
			done();
		});
	});
	it('Register a user with same username', function(done) {
		supertest.post('/api/user').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('UserAlreadyExists');
			done();
		});
	});
	it('Register a user with same email', function(done) {
		supertest.post('/api/user').send(userWithUser1Email).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('EmailTaken');
			done();
		});
	});
	it('Register a user with no password', function(done) {
		supertest.post('/api/user').send(userNoPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Password');
			done();
		});
	});
	it('Register a user with no username', function(done) {
		supertest.post('/api/user').send(userNoName).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Username');
			done();
		});
	});
	it('Register a user with no email', function(done) {
		supertest.post('/api/user').send(userNoEmail).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});
	it('Register a user with empty password', function(done) {
		supertest.post('/api/user').send(userEmptyPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Password');
			done();
		});
	});
	it('Register a user with empty username', function(done) {
		supertest.post('/api/user').send(userEmptyName).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Username');
			done();
		});
	});
	it('Register a user with number username', function(done) {
		supertest.post('/api/user').send(userNumberName).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Username');
			done();
		});
	});
	it('Register a user with empty email', function(done) {
		supertest.post('/api/user').send(userEmptyEmail).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});
	it('Register a user with bad email', function(done) {
		supertest.post('/api/user').send(userBadEmail).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});
});

describe('Login User Test - ', function () {
	it('Login the account we just made - with username', function(done) {
		var data = {'username':user1.username, 'password':user1.password};
		supertest.post('/api/login').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			expect(result.body.username).to.be(user1.username);
			done();
		});
	});
	it('Login the account we just made - with email', function(done) {
		var data = {'username':user1.email, 'password':user1.password};
		supertest.post('/api/login').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			expect(result.body.username).to.be(user1.username);
			done();
		});
	});
	it('Login the account we just made with no password', function(done) {
		supertest.post('/api/login').send(userNoPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Invalid Password');
			done();
		});
	});
	it('Login the account we just made with bad password', function(done) {
		supertest.post('/api/login').send(userWrongPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Incorrect Password');
			done();
		});
	});
	it('Login a fake account we just made', function(done) {
		supertest.post('/api/login').send(userFakeAccount).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Incorrect Username');
			done();
		});
	});
	it('Login a fake account2 we just made', function(done) {
		supertest.post('/api/login').send(userFakeAccount2).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Invalid Username');
			done();
		});
	});
});

describe('Auth User Test - ', function () {
	it('As a Logout user, on / - Return a 200', function(done) {
		supertest.get('/').expect(200, done);
	});
	it('As a normal user, on / - Return a 200', function(done) {
		//passportStub.login(user1); // login as user
		supertest.get('/').set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('As a Admin user, on / - Return a 200', function(done) {
		//passportStub.login(admin); // login as admin
		supertest.get('/').set('Authorization', 'Bearer ' + user1.token).expect(200, done);
	});
	it('As a Logout user, on /s/user - Return a 401', function(done) {
		supertest.get('/api/s/user').expect(401, done);
	});
	it('As a normal user, on /s/user - Return a 401', function(done) {
		//passportStub.login(user1); // login as user
		supertest.get('/api/s/user').set('Authorization', 'Bearer ' + user1.token).expect(401, done);
	});
	it('As a Admin user, on /s/user - Return a 200', function(done) {
		// passportStub.login(admin); // login as admin
		supertest.get('/api/s/user').set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('As a normal user, on /users - Return a 200', function(done) {
		//passportStub.login(user1); // login as user
		supertest.get('/api/user').set('Authorization', 'Bearer ' + user1.token).expect(200, done);
	});
	it('can we log out? - Return a 200', function(done) {
		supertest.post('/api/logout').expect(200, done);
	});
});

describe('Edit User Test - ', function () {
	it('invalid edit user - taken email - user1', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':user2.email};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('EmailTaken');
			done();
		});
	});
	it('Valid edit user - user1', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':user1.email};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Valid edit user - user2 - new email', function(done) {
		var data = {'id':userId2,'password':'editeditedit','email':'jimmy'+(new Date).getTime()+'@jimmy.com'};
		user2.id = userId2;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user2.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Invalid edit user - user1 - need to wait', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':user1.email};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Need To Wait');
			done();
		});
	});
	it('invalid edit user - not logged - user1', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':'jimmy@john.com'};
		supertest.put('/api/s/user').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(401);
			done();
		});
	});
	it('Valid edit user - no password', function(done) {
		var data = {'id':userId1,'email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').set('Authorization', 'Bearer ' + user1.token).send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Password');
			done();
		});
	});
	it('Valid edit user - empty password', function(done) {
		var data = {'id':userId1,'password':'','email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Password');
			done();
		});
	});
	it('Valid edit user - no email', function(done) {
		var data = {'id':userId1,'password':'editeditedit'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});
	it('Valid edit user - empty email', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':''};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});

	it('Invalid edit user - bad ID1', function(done) {
		var data = {'id':231232,'password':'editeditedit','email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid edit user - bad ID2', function(done) {
		var data = {'id':'12323','password':'editeditedit','email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid edit user - bad ID3', function(done) {
		var data = {'id':'','password':'editeditedit','email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid edit user - bad ID4', function(done) {
		var data = {'id':'dasds','password':'editeditedit','email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid edit user - bad ID5', function(done) {
		var data = {'password':'editeditedit','email':'jimmy@john.com'};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid edit user - bad ID6', function(done) {
		var data = {'id':'52963cb2e13badae18000008','password':'editeditedit','email':'jimmy'+(new Date).getTime()+'@jimmy.com'};
		user3.id = userId3;
		// passportStub.login(user2); // login as user
		supertest.put('/api/s/user').send(data).set('Authorization', 'Bearer ' + user3.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Unauthorized Or User Not Found');
			done();
		});
	});
});

describe('Delete User Test - ', function () {
	it('delete the user we made with a user account- Return a 401', function(done) {
		var data = {'id':userId1};
		user1.id = userId1;
		// passportStub.login(user1); // login as user
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + user1.token).expect(401, done);
	});
	it('delete the user we made with a logged out- Return a 401', function(done) {
		var data = {'id':userId1};
		supertest.delete('/api/s/user').send(data).expect(401, done);
	});
	it('delete the user1 we made - Return a 200', function(done) {
		var data = {'id':userId1};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('delete the user2 we made - Return a 200', function(done) {
		var data = {'id':userId2};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('delete the user3 we made - Return a 200', function(done) {
		var data = {'id':userId3};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Invalid delete user - same id', function(done) {
		var data = {'id':userId2};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Invalid delete user - bad1', function(done) {
		var data = {'id':'topicId'};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid delete user - bad2', function(done) {
		var data = {'id':''};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid delete user - bad3', function(done) {
		var data = {'id':7892739287};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid delete user - bad4', function(done) {
		var data = {'id':'783474874'};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid delete user - bad5', function(done) {
		var data = { };
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Id');
			done();
		});
	});
	it('Invalid delete user - bad6', function(done) {
		var data = {'id':'52963cb2e13badae18000008'};
		// passportStub.login(admin); // login as admin
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Unauthorized Or User Not Found');
			done();
		});
	});
});