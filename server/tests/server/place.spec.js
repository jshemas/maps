var app = require('../../../app'),
	request = require('supertest'),
	expect = require('expect.js'),
	passportStub = require('passport-stub');
passportStub.install(app);

// user account
var user1 = {
	'username':'userOne',
	'email':'jimmy@jimmy.com',
	'role': {
		bitMask: 2,
		title: 'user'
	},
	'password':'123456789'
};

var user2 = {
	'username':'userTwo',
	'email':'jimmy@jimmy.com',
	'role': {
		bitMask: 2,
		title: 'user'
	},
	'password':'123456789'
};

// admin account
var admin = {
	'username':'admin',
	'email':'admin@admin.com',
	'role': {
		bitMask: 4,
		title: 'admin'
	},
	'id': '1',
	'password':'superpassword'
};

// places data
var place = {
	'name': 'cosi',
	'lat': '56',
	'long': '65'
};

var userId1, userId2, placeId;

describe('Places Test - ', function () {
	afterEach(function() {
		passportStub.logout(); // logout after each test
	});
	it('Register a new user1 - Return a 200', function(done) {
		request(app).post('/register').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId1 = result.body.id;
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
	it('Make a new place', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(place).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			placeId = result.body.res._id;
			done();
		});
	});
	it('Find that new place', function(done) {
		request(app).get('/getPlace').end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			var bool = 0;
			for (var i = 0; i <= result.body.res.length-1; i++) {
				if (result.body.res[i]._id === placeId) {
					bool = 1;
				};
			};
			expect(bool).to.be(1);
			done();
		});
	});
	it('Edit that place', function(done) {
		var data = {'id':placeId,'name':'editName','lat':'22','long':'44'};
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/editPlace').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Delete that new place', function(done) {
		var data = {'id':placeId};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
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