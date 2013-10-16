var app = require('../../../app'),
	request = require('supertest'),
	expect = require('expect.js'),
	userRoles = require('../../../client/app/scripts/routingConfig').userRoles,
	passportStub = require('passport-stub');
passportStub.install(app);

/*
	Testing notes- 
		app might throw 500's if useing passportStub.login(user); and it has no role
*/

// user account
var user1 = {
	'username':'userOne',
	'email':'jimmy@jimmy.com',
	'role': userRoles.user,
	'password':'123456789'
};

var user2 = {
	'username':'userTwo',
	'email':'jimmy@jimmy.com',
	'role': userRoles.user,
	'password':'123456789'
};

var userWrongPassword = {
	'username':'userOne',
	'role': userRoles.user,
	'email':'jimmy@jimmy.com',
	'password':'123456789666'
};

var userNoPassword = {
	'username':'newUser',
	'email':'jimmy@jimmy.com',
	'role': userRoles.user
};

var userNoName = {
	'role': userRoles.user,
	'email':'jimmy@jimmy.com',
	'password':'123456789'
};

var userNoEmail = {
	'username':'newUser',
	'role': userRoles.user,
	'password':'123456789'
};

var userBadEmail = {
	'username':'newUser',
	'role': userRoles.user,
	'email':'jimmyjimmy.com',
	'password':'123456789'
};

// admin account
var admin = {
	'username':'admin',
	'email':'admin@admin.com',
	'role': userRoles.admin,
	'id': '1',
	'password':'superpassword'
};

var userId1, userId2;

describe('User Test - ', function () {
	afterEach(function() {
		passportStub.logout(); // logout after each test
	});
	it('As a Logout user, on / - Return a 200', function(done) {
		request(app).get('/').expect(200, done);
	});
	it('As a Logout user, on /users - Return a 403', function(done) {
		request(app).get('/users').expect(403, done);
	});
	it('Register a new user1 - Return a 200', function(done) {
		request(app).post('/register').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId1 = result.body.id;
			console.log("userId1:",userId1);
			console.log("userId111:",result.body);
			done();
		});
	});
	it('Register a new user2 - Return a 200', function(done) {
		request(app).post('/register').send(user2).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId2 = result.body.id;
			done();
		});
	});
	it('Register a user with same username', function(done) {
		request(app).post('/register').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('UserAlreadyExists');
			done();
		});
	});
	it('Register a user with no password', function(done) {
		request(app).post('/register').send(userNoPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Password');
			done();
		});
	});
	it('Register a user with no username', function(done) {
		request(app).post('/register').send(userNoName).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Username');
			done();
		});
	});
	it('Register a user with no email', function(done) {
		request(app).post('/register').send(userNoEmail).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});
	it('Register a user with bad email', function(done) {
		request(app).post('/register').send(userBadEmail).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err[0]).to.be('Invalid Email');
			done();
		});
	});
	it('Login the account we just made', function(done) {
		request(app).post('/login').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			expect(result.body.username).to.be(user1.username);
			done();
		});
	});
	it('Login the account we just made with no password', function(done) {
		request(app).post('/login').send(userNoPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			done();
		});
	});
	it('Login the account we just made with bad password', function(done) {
		request(app).post('/login').send(userWrongPassword).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			expect(result.body.err).to.be('Incorrect Password');
			done();
		});
	});
	it('As a normal user, on /users - Return a 403', function(done) {
		passportStub.login(user1); // login as user
		request(app).get('/users').expect(403, done);
	});
	it('As a Admin user, on /users - Return a 200', function(done) {
		passportStub.login(admin); // login as admin
		request(app).get('/users').expect(200, done);
	});
	it('can we log out? - Return a 200', function(done) {
		request(app).get('/logout').expect(200, done);
	});
	it('Valid edit user - user1', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':'jimmy@john.com'};
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/editUser').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('invalid edit post not logged- post1', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':'jimmy@john.com'};
		request(app).post('/editUser').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(403);
			done();
		});
	});
	it('invalid edit post diffent user- post1', function(done) {
		var data = {'id':userId1,'password':'editeditedit','email':'jimmy@john.com'};
		user2.id = userId2;
		passportStub.login(user2); // login as user
		request(app).post('/editUser').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(false);
			done();
		});
	});
	it('delete the user we made with a user account- Return a 403', function(done) {
		var data = {'id':userId1};
		passportStub.login(user1); // login as user
		request(app).post('/deleteUser').send(data).expect(403, done);
	});
	it('delete the user1 we made - Return a 200', function(done) {
		var data = {'id':userId1};
		passportStub.login(admin); // login as admin
		request(app).post('/deleteUser').send(data).expect(200, done);
	});
	it('delete the user2 we made - Return a 200', function(done) {
		var data = {'id':userId2};
		passportStub.login(admin); // login as admin
		request(app).post('/deleteUser').send(data).expect(200, done);
	});
});