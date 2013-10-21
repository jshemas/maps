'use strict';
var Place = require('../models/Place.js'),
	utils = require('../utils.js');

module.exports = {
	createPlace: function(req, res) {
		utils.validateCreatePlace(req.body.name, req.body.long, req.body.lat, req.body.description, req.body.category, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				// need to pass real user ID
				Place.addPlace(req.body.name, req.body.lat, req.body.long, '456', req.body.description, req.body.category, function(err, result) {
					if(err) {
						return res.send(200, {'success': false, 'err': err});
					}
					res.json(200,{'success': true, 'res': result});
				});
			}
		});
	},

	getAllPlaces: function(req, res) {
		Place.findAllPlaces(function(err, result) {
			if(err) {
				return res.send(200, {'success': false, 'err': err});
			}
			res.json(200,{'success': true, 'res': result});
		});
	},

	getPlaceByLocation: function(req, res) {
		// need to vailded this
		Place.findPlaceByLocation(req.body.long, req.body.lat, req.body.maxDistance, function(err, result) {
			if(err) {
				return res.send(200, {'success': false, 'err': err});
			}
			res.json(200,{'success': true, 'res': result});
		});
	},

	getPlaceById: function(req, res) {
		utils.validateIDS(req.body.id, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				Place.findPlaceById(req.body.id, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	},

	editPlace: function(req, res) {
		utils.validateEditPlace(req.body.id, req.body.name, req.body.long, req.body.lat, req.body.description, req.body.category, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				Place.editPlace(req.body.id, req.body.name, req.body.lat, req.body.long, req.user.id, req.body.description, req.body.category, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result === true){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	},

	deletePlace: function(req, res) {
		utils.validateIDS(req.body.id, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				Place.deletePlace(req.body.id, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result === true){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	},

	addComment: function(req, res) {
		// need to vailded this
		Place.addComment(req.body.id, req.user.id, req.body.content, function(err, result) {
			if(err) {
				return res.send(200, {'success': false, 'err': err});
			}
			res.json(200,{'success': true, 'res': result});
		});
	},

	editComment: function(req, res) {
		// need to vailded this
		Place.editComment(req.user.id, req.body.content, req.body.commentId, req.body.placeId, function(err, result) {
			if(err){
				return res.send(200, {'success': false, 'err': err});
			}
			if(result === true){
				return res.send(200, {'success': true, 'res': result});
			} else {
				return res.send(200, {'success': false, 'err': 'none'});
			}
		});
	},

	deleteComment: function(req, res) {
		// need more vaild for placeId
		utils.validateIDS(req.body.commentId, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				Place.deleteComment(req.body.commentId, req.body.placeId, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result === true){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	},

	addRate: function(req, res) {
		// need to vailded this
		Place.addRate(req.body.id, req.user.id, req.body.content, function(err, result) {
			if(err) {
				return res.send(200, {'success': false, 'err': err});
			}
			res.json(200,{'success': true, 'res': result});
		});
	},

	editRate: function(req, res) {
		// need to vailded this
		Place.editRate(req.user.id, req.body.content, req.body.rateId, req.body.placeId, function(err, result) {
			if(err){
				return res.send(200, {'success': false, 'err': err});
			}
			if(result === true){
				return res.send(200, {'success': true, 'res': result});
			} else {
				return res.send(200, {'success': false, 'err': 'none'});
			}
		});
	},

	deleteRate: function(req, res) {
		// need to vailded placeId
		utils.validateIDS(req.body.rateId, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				Place.deleteRate(req.body.rateId, req.body.placeId, function(err, result) {
					if(err){
						return res.send(200, {'success': false, 'err': err});
					}
					if(result === true){
						return res.send(200, {'success': true, 'res': result});
					} else {
						return res.send(200, {'success': false, 'err': 'none'});
					}
				});
			}
		});
	}
};