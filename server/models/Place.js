'use strict';
var winston = require('winston'),
	mongoose = require('mongoose');

var Comment = new mongoose.Schema({
	author: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	editDate: { type: Date },
	content: { type: String, required: true }
});

var Rate = new mongoose.Schema({
	author: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	editDate: { type: Date },
	content: { type: Number, required: true }
});

// Place Schema
var PlaceSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	location: {
		type: { type: String, required: true },
		coordinates: { type: [Number], index: '2dsphere', required: true }
	},
	totalOverAllRating: { type: Number },
	rate: [Rate],
	category:  { type: String, required: true },
	author: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	editDate: { type: Date },
	comment: [Comment],
	pictures: { type: [String] },
	tags: { type: [String] },
	cost: { type: String },
	website: { type: String },
	address: {
		displayName: { type: String },
		roadNumber: { type: String },
		road: { type: String },
		city: { type: String },
		county: { type: String },
		state: { type: String },
		postcode: { type: String },
		country: { type: String },
		countryCode: { type: String }
	},
	hours: {
		sunday: { type: String },
		monday: { type: String },
		tuesday: { type: String },
		wednesday: { type: String },
		thursday: { type: String },
		friday: { type: String },
		saturday: { type: String },
	}
});

var Place = mongoose.model('Place', PlaceSchema);

module.exports = {
	addPlace: function (name, long, lat, author, description, category, callback) {
		var place = new Place({
			name: name,
			category: category,
			description: description,
			location: {
				coordinates: [long, lat]
			},
			author: author
		});
		place.location.type = 'Point';
		place.save( function (err, result) {
			if (err) {
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

	editPlace: function(placeId, name, long, lat, editBy, description, category, callback) {
		var placeUpdate = { $set: {
			name: name,
			category: category,
			description: description,
			editDate: new Date().toISOString(),
			location: {
				type: 'Point',
				coordinates: [ long, lat ]
			}
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

	addComment: function(placeId, addBy, content, callback) {
		this.findPlaceById(placeId, function(err, place) {
			var comment = {
				author: addBy,
				content: content
			};
			if(place._id){
				place.comment.push(comment);
				place.save( function(err, result){
					if(err){
						winston.info('Error in addComment:'+err);
						callback(err, null);
					} else {
						if(result._id) {
							callback(null, result);
						} else {
							callback(null, null);
						}
					}
				});
			} else {
				callback(null, null);
			}
		});
	},

	editComment: function(author, content, commentId, placeId, callback){
		// only author + admin can edit
		var commentUpdate = { $set: {
			'comment.$.content': content,
			'comment.$.author': author,
			'comment.$.editDate': new Date().toISOString()
		}};
		Place.update({_id:placeId, 'comment._id':commentId},commentUpdate,{upsert: true}, function(err, result){
			if(err){
				winston.info('Error in editComment:'+err);
				callback(err, null);
			} else {
				if(result === 1){
					callback(null, true);
				} else {
					callback(null, null);
				}
			}
		});
	},

	deleteComment: function(commentId, placeId, callback){
		var commentUpdate = { $pull: {
			comment:{_id:commentId}
		}};
		Place.update({_id:placeId},commentUpdate, function(err, result){
			if(err){
				winston.info('Error in deleteComment:'+err);
				callback(err, null);
			} else {
				if(result === 1){
					callback(null, true);
				} else {
					callback(null, null);
				}
			}
		});
	},

	addRate: function(placeId, addBy, rateContent, callback) {
		this.findPlaceById(placeId, function(err, place) {
			var rate = {
				author: addBy,
				content: rateContent
			};
			if(place._id){
				place.rate.push(rate);
				var totalOverAllRating = 0;
				for (var i = 0; i < place.rate.length; i++) {
					totalOverAllRating = totalOverAllRating + place.rate[i].content;
				}
				totalOverAllRating = (totalOverAllRating / place.rate.length);
				place.totalOverAllRating = totalOverAllRating;
				place.save( function(err, result){
					if(err){
						winston.info('Error in addRate:'+err);
						callback(err, null);
					} else {
						if(result._id) {
							callback(null, result);
						} else {
							callback(null, null);
						}
					}
				});
			} else {
				callback(null, null);
			}
		});
	},

	editRate: function(author, rateContent, rateId, placeId, callback){
		// only user who made this should edit it
		var rateUpdate = { $set: {
			'rate.$.rate': rateContent,
			'rate.$.author': author,
			'rate.$.editDate': new Date().toISOString()
		}};
		var that = this;
		Place.update({_id:placeId, 'rate._id':rateId},rateUpdate,{upsert: true}, function(err, result){
			if(err){
				winston.info('Error in editRate:'+err);
				callback(err, null);
			} else {
				if(result === 1){
					that.updateTotalOverAllRating(placeId, function(err, updateResult) {
						if(err){
							winston.info('Error in editRate2:'+err);
							callback(err, null);
						} else {
							if(updateResult === true){
								callback(null, true);
							} else {
								callback(null, null);
							}
						}
					});
				} else {
					callback(null, null);
				}
			}
		});
	},

	deleteRate: function(rateId, placeId, callback){
		var rateUpdate = { $pull: {
			rate:{_id:rateId}
		}};
		var that = this;
		Place.update({_id:placeId},rateUpdate, function(err, result){
			if(err){
				winston.info('Error in deleteRate:'+err);
				callback(err, null);
			} else {
				if(result === 1){
					that.updateTotalOverAllRating(placeId, function(err, result) {
						if(err){
							winston.info('Error in deleteRate2:'+err);
							callback(err, null);
						} else {
							if(result === true) {
								callback(null, true);
							} else {
								callback(null, null);
							}
						}
					});
				} else {
					callback(null, null);
				}
			}
		});
	},

	updateTotalOverAllRating: function(placeId, callback) {
		this.findPlaceById(placeId, function(err, place) {
			if(place._id){
				var totalOverAllRating = 0;
				for (var i = 0; i < place.rate.length; i++) {
					totalOverAllRating = totalOverAllRating + place.rate[i].content;
				}
				if(totalOverAllRating > 0) {
					totalOverAllRating = (totalOverAllRating / place.rate.length);
				}
				place.totalOverAllRating = totalOverAllRating;
				place.save( function(err, result){
					if(err){
						winston.info('Error in updateTotalOverAllRating:'+err);
						callback(err, null);
					} else {
						if(result._id) {
							callback(null, true);
						} else {
							callback(null, null);
						}
					}
				});
			} else {
				callback(null, null);
			}
		});
	}
};
