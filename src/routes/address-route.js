import mongoose from 'mongoose'
import config from '../config/database'
import express from 'express'
import User from "../models/user"
import Address from "../models/address"
import UserService from "../services/user-service"
import AddressService from "../services/address-service"

const router = express.Router();

var userService = new UserService();
var addressService = new AddressService();


router.post('/:userId', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let userId = req.params.userId;
		let long = req.body.long;
		let lat = req.body.lat;
		let completeAddress = req.body.completeAddress;
		let isPrimary = req.body.isPrimary;

		if (!userId) {
			res.json({success: false, msg: 'User Id is required.'});
		} else if (!long) {
			res.json({success: false, msg: 'long is required.'});
		} else if (!lat) {
			res.json({success: false, msg: 'lat is required.'});
		} else if (!completeAddress) {
			res.json({success: false, msg: 'completeAddress is required.'});
		} 

		if(!isPrimary) {
			isPrimary = false;
		}
		else {

			var saveAddress = new Address({
				address: {
					user: userId,
					"type": "Point",
					coordinates: [parseFloat(long),parseFloat(lat)]
				},
				completeAddress : completeAddress,
				isPrimary: isPrimary
			});

			addressService.asyncSaveAddress(saveAddress,function(err,address){
				if (err) {
					console.log(err);
					return res.json({success: false, msg: 'Unable to save address.'});
				}
				res.json({success: true, msg: 'Address has been successfully saved.'});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});

router.put('/:addressId', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let addressId = req.params.addressId;
		let long = req.body.long;
		let lat = req.body.lat;
		let completeAddress = req.body.completeAddress;
		let isPrimary = req.body.isPrimary;

		if (!addressId) {
			res.json({success: false, msg: 'addressId is required.'});
		}else if (!long) {
			res.json({success: false, msg: 'long is required.'});
		} else if (!lat) {
			res.json({success: false, msg: 'lat is required.'});
		} else if (!completeAddress) {
			res.json({success: false, msg: 'completeAddress is required.'});
		} 

		if(!isPrimary) {
			isPrimary = false;
		}
		else {

			var updateAddress = new Address({
				_id : addressId,
				address: {
					"type": "Point",
					coordinates: [parseFloat(long),parseFloat(lat)]
				},
				completeAddress : completeAddress,
				isPrimary: isPrimary
			});

			addressService.asyncFindUpdateAddressById(updateAddress,function(err,address){
				if (err) {
					return res.json({success: false, msg: 'Unable to update address.'});
				}
				res.json({success: true, msg: 'Address has been successfully updated.'});
			});
		}

	} else {
		return res.status(403).send({success: false, msg: 'Unauthorized.'});
	}

});


router.delete('/:addressId', function(req, res) {
	var token = getToken(req.headers);
	if (token) {
		let addressId = req.params.addressId;

		if (!addressId) {
			res.json({success: false, msg: 'addressId is required.'});
		} else {

			addressService.asyncDeleteAddressById(addressId,function(err,address){
				if (err) {
					return res.json({success: false, msg: 'Unable to delete address.'});
				}
				res.json({success: true, msg: 'Address has been successfully delete.'});
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