import mongoose from 'mongoose'
import express from 'express'
import User from "../models/user"
import UserLocation from "../models/user-location"
import to from "../util/to"


module.exports = class LocationService {

  constructor() {
  }

  async asyncFindLocationByUserId(userId,callback) {
    let err, loc;
    var query  = UserLocation.where({ "loc.user": userId });
    [err, loc] = await to(query.findOne());
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(loc);
    }  
  }

  async asyncFindUpdateLocationByUserId(userLoc,callback) {
    let err, loc;
    console.log("tst");
    console.log("user:"+userLoc.loc.user);
    var ObjectId = require('mongoose').Types.ObjectId; 
    [err, loc] = await to(UserLocation.findOneAndUpdate({ "loc.user": new ObjectId(userLoc.loc.user) }, { $set: userLoc }, { new: true }));
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(loc);
    }  
  }

  async asyncSaveLocation(userLocation,callback) {
    let err, savedUserLoc;
    [err, savedUserLoc] = await to(userLocation.save());
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(savedUserLoc);
    } 
  }

  async asyncFindAllLocation(callback){
    let err, locs;
    [err, locs] = await to(UserLocation.find());
    if(err) return new Error(err);

    if(callback !== undefined) {
      return callback(locs);
    }
  }

  async asyncDeleteLocationByUserId(userId,callback) {
   let err, deletedUserLoc;
   [err, deletedUserLoc] = await to(UserLocation.deleteMany({ "loc.user": userId }));
   if(err) return new Error(err);

   if(callback !== undefined) {
    return callback(deletedUserLoc);
  } 
}

 async asyncFindNearLocation(long,lat,maxDistance,userId,callback) {
    let err, locs;
    maxDistance = parseFloat(maxDistance) / 6371;
    var ObjectId = require('mongoose').Types.ObjectId; 
    [err, locs] = await to(UserLocation.aggregate(
      [
      { "$geoNear": {
              "near": [long,lat],
              "distanceField": "distance",
              "maxDistance": maxDistance,
              "query": {
                "loc.user": { "$ne": new ObjectId(userId) } 
              },
              "spherical": true
            },


          },
        { "$sort": { "distance": -1 } }
      ]

     ));
    console.log(err);
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(locs);
    }  
    return locs;
  }


}