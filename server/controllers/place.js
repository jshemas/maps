'use strict';
var Place = require('../models/Place.js'),
	utils = require('../utils.js');

module.exports = {
	createPlace: function(req, res) {
		// need to update validion rules
		utils.validateCreatePlace(req.body.name, req.body.long, req.body.lat, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				// need to pass real user ID
				Place.addPlace(req.body.name, req.body.lat, req.body.long, '456', function(err, result) {
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

	editPlace: function(req, res) {
		// need to update validion rules
		utils.validateEditPlace(req.body.id, req.body.name, req.body.long, req.body.lat, function(err) {
			if(err.length >= 1){
				return res.send(200, {'success': false, 'err': err});
			} else {
				Place.editPlace(req.body.id, req.body.name, req.body.lat, req.body.long, req.user.id, function(err, result) {
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
	}
};