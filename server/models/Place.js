'use strict';
var winston = require('winston'),
	mongoose = require('mongoose');

var Comment = new mongoose.Schema({
	author: { type: String, required: true },
	body: { type: String, required: true }
});

// Place Schema
var PlaceSchema = new mongoose.Schema({
	name: { type: String, required: true },
	location: {
		type: { type: String },
		coordinates: { type: [Number], index: '2dsphere' }
	},
	author: { type: String, required: false },
	createdDate: { type: Date, default: Date.now },
	comment: [Comment]
});

var Place = mongoose.model('Place', PlaceSchema);

module.exports = {
	addPlace: function(name, long, lat, author, callback) {
		var place = new Place({
			name: name,
			author: author
		});
		place.location.type = 'Point';
		place.location.coordinates.push(long);
		place.location.coordinates.push(lat);
		place.save( function(err, result){
			if(err){
				winston.info('Error in addPlace:'+err);
				callback('DB-err-addPlace',null);
			} else {
				callback(null, result);
			}
		});
	},

	/* http://emptysqua.re/blog/paging-geo-mongodb/ */
	findPlaceByLocation: function(long, lat, maxDistance, callback) {
		var point = { type: "Point", coordinates: [long,lat] };
		Place.geoNear(point, { maxDistance: maxDistance, spherical: true }, function(err, result) {
			if(err){
				winston.info('Error in findPlaceByLocation:'+err);
				callback('DB-err-findPlaceByLocation',null);
			} else {
				if(result) {
					callback(null, result);
				} else {
					callback(null, null);
				}
			}
		});
	},

	findAllPlaces: function(callback) {
		var query = Place.find().sort('-createddate');
		query.select('name lat long author _id');
		query.exec(function (err, result) {
			if(err){
				winston.info('Error in findAllPlaces:'+err);
				callback('DB-err-findAllPlaces',null);
			} else {
				callback(null, result);
			}
		});
	},

	findPlaceById: function(id, callback) {
		Place.findOne({_id:id}, function(err,result) {
			if(err){
				winston.info('Error in findPlaceById:'+err);
				callback('DB-err-findPlaceById',null);
			} else {
				if(result) {
					callback(null, result);
				} else {
					callback(null, null);
				}
			}
		});
	},

	findPlaceByName: function(name, callback) {
		Place.findOne({name:name}, function(err,result) {
			if(err){
				winston.info('Error in findPlaceByName:'+err);
				callback('DB-err-findPlaceByName',null);
			} else {
				if(result) {
					callback(null, result);
				} else {
					callback(null, null);
				}
			}
		});
	},

	editPlace: function(placeId, name, long, lat, editBy, callback) {
		// need to update long and lat
		var placeUpdate = { $set: {
			name: name,
		}};
		Place.update({_id:placeId},placeUpdate,{upsert: true}, function(err, result){
			if(err){
				winston.info('Error in editPlace:'+err);
				callback('DB-err-editPlace',null);
			} else {
				if(result === 1){
					callback(null, true);
				} else {
					callback(null, null);
				}
			}
		});
	},

	deletePlace: function(placeId, callback) {
		Place.find({_id:placeId}).remove(function(err, result){
			if(err){
				winston.info('Error in deletePlace:'+err);
				callback('DB-err-deletePlace',null);
			} else {
				if(result === 1){
					callback(null, true);
				} else {
					callback(null, null);
				}
			}
		});
	},
};
