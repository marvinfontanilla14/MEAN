import mongoose from 'mongoose'
import passport from 'passport'
import config from '../config/database'
import express from 'express'
import jwt from 'jsonwebtoken'
import User from "../models/user"
import UserService from "../services/user-service"

require('../config/passport')(passport);
const router = express.Router();

var userService = new UserService();

router.post('/signup', function(req, res) {
	if (!req.body.username || !req.body.password) {
		res.json({success: false, msg: 'Please pass username and password.'});
	} else {
		var newUser = new User({
			_id: new mongoose.Types.ObjectId(),
			username: req.body.username,
			password: req.body.password
		});
    // save the user
    userService.asyncSaveUser(newUser,function(err,user){
    	if (err) {
    		return res.json({success: false, msg: 'Username already exists.'});
    	}
    	res.json({success: true, msg: 'Successful created new user.'});
    });
}
});

router.post('/signin', function(req, res) {

	userService.asyncFindUserByUsername(req.body.username,function(err,user){
		if (err) throw err;

		if (!user) {
			res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
		} else {	
			console.log(user);
		      // check if password matches
		      userService.comparePassword(req.body.password,user.password, function (err, isMatch) {
		      	if (isMatch && !err) {
		          // if user is found and password is right create a token
		          var token = jwt.sign(user.toJSON(), config.secret);
		          // return the information including token as JSON
		          res.json({success: true, token: 'JWT ' + token});
		      } else {
		      	res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
		      }
		  });
		  }
		});

});


router.put('/:userId/service-status', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let userId = req.params.userId;
		let isService = req.body.isService;
		if (!userId) {
			res.json({success: false, msg: 'User Id is required.'});
		} else if (!isService) {
			res.json({success: false, msg: 'isService is required.'});
		} else {
			var updateUser = new User({
				_id: req.params.userId,
				isService: isService
			});

			userService.asyncFindUpdateUserById(updateUser,function(err,user){
				if (err) {
					return res.json({success: false, msg: 'Unable to update user.'});
				}
				res.json({success: true, msg: 'isService has been set to '+user.isService});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});


router.put('/:userId/project-status', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let userId = req.params.userId;
		let isProject = req.body.isProject;
		if (!userId) {
			res.json({success: false, msg: 'User Id is required.'});
		} else if (!isProject) {
			res.json({success: false, msg: 'isProject is required.'});
		} else {
			var updateUser = new User({
				_id: req.params.userId,
				isProject: isProject
			});

			userService.asyncFindUpdateUserById(updateUser,function(err,user){
				if (err) {
					return res.json({success: false, msg: 'Unable to update user.'});
				}
				res.json({success: true, msg: 'isProject has been set to '+user.isProject});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});

router.put('/:userId/online-status', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let userId = req.params.userId;
		let isOnline = req.body.isOnline;
		if (!userId) {
			res.json({success: false, msg: 'User Id is required.'});
		} else if (!isOnline) {
			res.json({success: false, msg: 'isOnline is required.'});
		} else {
			var updateUser = new User({
				_id: req.params.userId,
				isOnline: isOnline
			});

			userService.asyncFindUpdateUserById(updateUser,function(err,user){
				if (err) {
					return res.json({success: false, msg: 'Unable to update user.'});
				}
				res.json({success: true, msg: 'isOnline has been set to '+user.isOnline});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});

var getToken = (headers) => {
	if (headers && headers.authorization) {
		var parted = headers.authorization.split(' ');
		if (parted.length === 2) {
			return parted[1];
		} else {
			return null;
		}
	} else {
		return null;
	}
};

module.exports = router;