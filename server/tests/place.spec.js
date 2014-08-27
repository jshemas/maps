var request = require('supertest'),
	app = require('../../app'),
	supertest = request(app),
	expect = require('expect.js'),
	jwt = require('jsonwebtoken'),
	secret = require('../../config/secret');

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
	admin = {
		'username':'admin',
		'email':'admin@admin.com',
		'role': 'admin',
		'id': '1',
		'password':'superpassword',
		'token':''
	};

// places data
var place = {
	'name': 'cosi',
	'description': 'a nice place',
	'category': 'testing',
	'lat': 56,
	'long': 65
};

var comment = {
	'content': 'this is a comment'
};

var rate = {
	'content': 5
}

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

// build admin token
var profile = {
		id: admin.id,
		username: admin.username,
		role: admin.role
	},
	token = jwt.sign(profile, secret.jwtSecret, { expiresInMinutes: 60 * 5 });
admin.token = token;

var userId1, userId2, placeId;

var sampleData1Id, sampleData2Id, sampleData3Id, sampleData4Id, sampleData5Id, sampleData6Id, sampleData7Id, sampleData8Id, sampleData9Id, sampleData10Id;

afterEach(function() {
	setTimeout(function() {
		// delay for 500ms, too many open file/connections
	}, 500);
});

describe('Places Test - ', function () {
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
	it('Make a new place', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(place).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			placeId = result.body.res._id;
			done();
		});
	});
	it('Find that new place', function(done) {
		supertest.get('/api/getAllPlace').end( function(err, result) {
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
		supertest.put('/api/s/editPlace').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Make a new Comment', function(done) {
		user1.id = userId1;
		comment.id = placeId;
		supertest.post('/api/s/addComment').send(comment).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			commentId = result.body.res.comment[0]._id;
			done();
		});
	});
	it('Find that new comment', function(done) {
		var data = {'id':placeId};
		supertest.get('/api/getPlaceById').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			var bool = 0;
			for (var i = 0; i <= result.body.res.comment.length-1; i++) {
				if (result.body.res.comment[i]._id === commentId) {
					bool = 1;
				};
			};
			expect(bool).to.be(1);
			done();
		});
	});
	it('Edit that comment', function(done) {
		var data = {'placeId':placeId,'commentId':commentId,'content':'edit that comment'};
		user1.id = userId1;
		supertest.put('/api/s/editComment').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Delete that new Comment', function(done) {
		var data = {'placeId':placeId,'commentId':commentId};
		supertest.delete('/api/s/deleteComment').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Make a new Rate', function(done) {
		user1.id = userId1;
		rate.id = placeId;
		supertest.post('/api/s/addRate').send(rate).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			rateId = result.body.res.rate[0]._id;
			done();
		});
	});
	it('Find that new rate', function(done) {
		var data = {'id':placeId};
		supertest.get('/api/getPlaceById').send(data).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			var bool = 0;
			for (var i = 0; i <= result.body.res.rate.length-1; i++) {
				if (result.body.res.rate[i]._id === rateId) {
					bool = 1;
				};
			};
			expect(bool).to.be(1);
			done();
		});
	});
	it('Edit that rate', function(done) {
		var data = {'placeId':placeId,'rateId':rateId,'content':2};
		user1.id = userId1;
		supertest.put('/api/s/editRate').send(data).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			done();
		});
	});
	it('Delete that new Rate', function(done) {
		var data = {'placeId':placeId,'rateId':rateId};
		supertest.delete('/api/s/deleteRate').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that new place', function(done) {
		var data = {'id':placeId};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('delete the user1 we made - Return a 200', function(done) {
		var data = {'id':userId1};
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('delete the user2 we made - Return a 200', function(done) {
		var data = {'id':userId2};
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
});

describe('Places Sample Test - ', function () {
	it('Register a new user1 - Return a 200', function(done) {
		user1.username = 'userTwo'+(new Date).getTime();
		user1.email = 'jimmy2'+(new Date).getTime()+'@jimmy.com';
		supertest.post('/api/user').send(user1).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			userId1 = result.body.id;
			user1.token = result.body.token;
			done();
		});
	});
	it('Make a new sample place - 1', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData1).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData1Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 2', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData2).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData2Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 3', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData3).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData3Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 4', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData4).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData4Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 5', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData5).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData5Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 6', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData6).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData6Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 7', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData7).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData7Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 8', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData8).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData8Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 9', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData9).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData9Id = result.body.res._id;
			done();
		});
	});
	it('Make a new sample place - 10', function(done) {
		user1.id = userId1;
		supertest.post('/api/s/addPlace').send(sampleData10).set('Authorization', 'Bearer ' + user1.token).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			sampleData10Id = result.body.res._id;
			done();
		});
	});
	it('Did we make all of the sample data?', function(done) {
		supertest.get('/api/getAllPlace').end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			//expect(result.body.res.length).to.be(10);
			done();
		});
	});
	it('Get some Locations', function(done) {
		supertest.get('/api/getPlaceByLocation').send(locData).end( function(err, result) {
			expect(result.res.statusCode).to.be(200);
			expect(result.body.success).to.be(true);
			//expect(result.body.res.length).to.be(6);
			done();
		});
	});
	it('Delete that sample place - 1', function(done) {
		var data = {'id':sampleData1Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 2', function(done) {
		var data = {'id':sampleData2Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 3', function(done) {
		var data = {'id':sampleData3Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 4', function(done) {
		var data = {'id':sampleData4Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 5', function(done) {
		var data = {'id':sampleData5Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 6', function(done) {
		var data = {'id':sampleData6Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 7', function(done) {
		var data = {'id':sampleData7Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 8', function(done) {
		var data = {'id':sampleData8Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 9', function(done) {
		var data = {'id':sampleData9Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('Delete that sample place - 10', function(done) {
		var data = {'id':sampleData10Id};
		supertest.delete('/api/s/deletePlace').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
	it('delete the user1 we made - Return a 200', function(done) {
		var data = {'id':userId1};
		supertest.delete('/api/s/user').send(data).set('Authorization', 'Bearer ' + admin.token).expect(200, done);
	});
});