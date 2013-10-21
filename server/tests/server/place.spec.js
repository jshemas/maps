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
	'description': 'a nice place',
	'category': 'testing',
	'lat': 56,
	'long': 65
};

// sample data

var sampleData1 = {
	'name': 'Cosi',
	'rateing': '6/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 39.959850,
	'long': -83.00716,
	'type': 'Museum'
};

var sampleData2 = {
	'name': 'Easton Town Center',
	'rateing': '8/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 40.0504,
	'long': -82.91541,
	'type': 'Mall'
};

var sampleData3 = {
	'name': 'Columbus Museum of Art',
	'rateing': '7/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 39.964343,
	'long': -82.987808,
	'type': 'Museum'
};

var sampleData4 = {
	'name': 'Hollywood Casino',
	'rateing': '7/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 39.948734,
	'long': -83.107165,
	'type': 'Gambeling'
};

var sampleData5 = {
	'name': 'Field of Corn',
	'rateing': '5/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 40.085049,
	'long': -83.123463,
	'type': 'Monument'
};

var sampleData6 = {
	'name': 'Columbus Zoo',
	'rateing': '8/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 40.156184,
	'long': -83.118338,
	'type': 'Zoo'
};

var sampleData7 = {
	'name': 'Franklin Park Conservitory',
	'rateing': '8/10',
	'description': 'test place test',
	'category': 'test place tes',
	'lat': 39.965992,
	'long': -82.953301,
	'type': 'Museum'
};

var sampleData8 = {
	'name': 'Alum Creek Lake',
	'rateing': '6/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 40.190699,
	'long': -82.971449,
	'type': 'Beach'
};

var sampleData9 = {
	'name': 'Mirror Lake',
	'rateing': '6/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 39.998044,
	'long': -83.014235,
	'type': 'Lake'
};

var sampleData10 = {
	'name': 'Wexner Center for the Arts',
	'rateing': '7/10',
	'description': 'test place test',
	'category': 'test place test',
	'lat': 40.000422,
	'long': -83.008893,
	'type': 'Museum'
};

// for finding stuff
var locData = {
	'maxDistance': 2.33,
	'lat': 39.959850,
	'long': -83.00716
}

var userId1, userId2, placeId;

var sampleData1Id, sampleData2Id, sampleData3Id, sampleData4Id, sampleData5Id, sampleData6Id, sampleData7Id, sampleData8Id, sampleData9Id, sampleData10Id;

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
		request(app).get('/getAllPlace').end( function(err, result) {
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
		var data = {'id':placeId,'name':'editName','lat':'22','long':'44', 'description':'testtest', 'category':'category'};
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

describe('Places Sample Test - ', function () {
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
	it('Make a new sample place - 1', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData1Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 2', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData2).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData2Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 3', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData3).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData3Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 4', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData4).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData4Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 5', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData5).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData5Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 6', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData6).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData6Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 7', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData7).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData7Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 8', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData8).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData8Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 9', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData9).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData9Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 10', function(done) {
		user1.id = userId1;
		passportStub.login(user1); // login as user
		request(app).post('/addPlace').send(sampleData10).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData10Id = result.body.res._id;
			done();
		});
	});
	it('Did we make all of the sample data?', function(done) {
		request(app).get('/getAllPlace').end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			//expect(result.body.res.length).to.be(10);
			done();
		});
	});
	it('Get some Locations', function(done) {
		request(app).get('/getPlaceByLocation').send(locData).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			//expect(result.body.res.length).to.be(6);
			done();
		});
	});
	it('Delete that sample place - 1', function(done) {
		var data = {'id':sampleData1Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 2', function(done) {
		var data = {'id':sampleData2Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 3', function(done) {
		var data = {'id':sampleData3Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 4', function(done) {
		var data = {'id':sampleData4Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 5', function(done) {
		var data = {'id':sampleData5Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 6', function(done) {
		var data = {'id':sampleData6Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 7', function(done) {
		var data = {'id':sampleData7Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 8', function(done) {
		var data = {'id':sampleData8Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 9', function(done) {
		var data = {'id':sampleData9Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('Delete that sample place - 10', function(done) {
		var data = {'id':sampleData10Id};
		passportStub.login(admin); // login as admin
		request(app).post('/deletePlace').send(data).expect(200, done);
	});
	it('delete the user1 we made - Return a 200', function(done) {
		var data = {'id':userId1};
		passportStub.login(admin); // login as admin
		request(app).post('/deleteUser').send(data).expect(200, done);
	});
});