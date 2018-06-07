import mongoose from 'mongoose'
import config from '../config/database'
import express from 'express'
import User from "../models/user"
import Project from "../models/project"
import UserService from "../services/user-service"
import ProjectService from "../services/project-service"

const router = express.Router();

var userService = new UserService();
var projectService = new ProjectService();


router.post('/:userId', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let userId = req.params.userId;
		let long = req.body.long;
		let lat = req.body.lat;
		let title = req.body.title;
		let description = req.body.description;
		let tag = req.body.tag;
		let status = req.body.status;

		if (!userId) {
			res.json({success: false, msg: 'User Id is required.'});
		} else if (!long) {
			res.json({success: false, msg: 'long is required.'});
		} else if (!lat) {
			res.json({success: false, msg: 'lat is required.'});
		} else if (!title) {
			res.json({success: false, msg: 'title is required.'});
		} else if (!description) {
			res.json({success: false, msg: 'description is required.'});
		} else if (!tag) {
			res.json({success: false, msg: 'tag is required.'});
		} 

		if(!status) {
			status = "available";
		}
		else {

			tag = tag.split(',');	
			var proj = new Project({
				project: {
					user: userId,
					type: "Point",
					coordinates: [parseFloat(long),parseFloat(lat)],
					title : title,
					description : description,
					tag : tag,
					status : status
				},
			});

			projectService.asyncSaveProject(proj,function(err,proj){
				if (err) {
					console.log(err);
					return res.json({success: false, msg: 'Unable to save project.'});
				}
				res.json({success: true, msg: 'Project has been successfully saved.'});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});


router.put('/:projectId', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let projectId = req.params.projectId;
		let long = req.body.long;
		let lat = req.body.lat;
		let title = req.body.title;
		let description = req.body.description;
		let tag = req.body.tag;
		let status = req.body.status;

		if (!projectId) {
			res.json({success: false, msg: 'projectId is required.'});
		} else if (!long) {
			res.json({success: false, msg: 'long is required.'});
		} else if (!lat) {
			res.json({success: false, msg: 'lat is required.'});
		} else if (!title) {
			res.json({success: false, msg: 'title is required.'});
		} else if (!description) {
			res.json({success: false, msg: 'description is required.'});
		} else if (!tag) {
			res.json({success: false, msg: 'tag is required.'});
		} 
		else {
			tag = tag.split(',');	
			var proj = new Project({
				_id: projectId,
				project: {
					type: "Point",
					coordinates: [parseFloat(long),parseFloat(lat)],
					title : title,
					description : description,
					tag : tag,
					status : status
				},
			});

			projectService.asyncFindUpdateProjectById(proj,function(err,proj){
				if (err) {
					console.log(err);
					return res.json({success: false, msg: 'Unable to update project.'});
				}
				res.json({success: true, msg: 'Project has been successfully updated.'});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});


router.delete('/:projectId', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let projectId = req.params.projectId;

		if (!projectId) {
			res.json({success: false, msg: 'projectId is required.'});
		} else {

			projectService.asyncDeleteProjectById(projectId,function(err,proj){
				if (err) {
					return res.json({success: false, msg: 'Unable to delete project.'});
				}
				res.json({success: true, msg: 'Project has been successfully deleted.'});
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