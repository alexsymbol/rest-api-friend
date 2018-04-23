const express = require('express');
const router = express.Router();
const Friend = require('../models/friend');

// get a list of friends from the db
router.get('/friends', function(req, res, next) {
	Friend.aggregate().near({
		near: {
		 'type': 'Point',
		 'coordinates': [parseFloat(req.query.lng), parseFloat(req.query.lat)]
		},
		maxDistance: 1000000,
		spherical: true,
		distanceField: "dis"
	 }).then(function(friends){
		res.send(friends);
	});
});

// add a new friend to the db
router.post('/friends', function(req, res, next) {
	Friend.create(req.body).then(function(friend){
		res.send(friend);
	}).catch(next);
});

// update a friend in the db
router.put('/friends/:id', function(req, res, next) {
	Friend.findByIdAndUpdate({_id:req.params.id}, req.body).then(function(){
		Friend.findOne({_id:req.params.id}).then(function(friend){
			res.send(friend);
		});
	});
});

// delete a friends from the db
router.delete('/friends/:id', function(req, res, next) {
	Friend.findByIdAndRemove({_id:req.params.id}).then(function(friend){
		res.send(friend);
	});
});

module.exports = router;