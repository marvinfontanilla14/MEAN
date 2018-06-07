import mongoose from 'mongoose'
import express from 'express'
import Address from "../models/address"
import to from "../util/to"


module.exports = class AddressService {

  constructor() {
  }

  async asyncFindAddressByUserId(_id,callback) {
    let err, docs;
    var query  = Address.where({ "_id": _id });
    [err, docs] = await to(query.find());
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(docs);
    }  
  }

  async asyncFindUpdateAddressById(address,callback) {
    let err, docs;
    var ObjectId = require('mongoose').Types.ObjectId; 
    [err, docs] = await to(Address.findOneAndUpdate({ "_id": new ObjectId(address._id)}, { $set: address }, { new: true }));
    if(err) return callback(err);
    return callback(null,docs);  
  }

  async asyncSaveAddress(address,callback) {
    let err, docs;
    [err, docs] = await to(address.save());
    if(err) return callback(err);
    return callback(null,docs);  
  }

  async asyncFindAllAddress(callback){
    let err, docs;
    [err, docs] = await to(Address.find());
    if(err) return new Error(err);

    if(callback !== undefined) {
      return callback(docs);
    }
  }

  async asyncDeleteAddressById(id,callback) {
   let err, docs;
   [err, docs] = await to(Address.deleteOne({ "_id": id }));
   if(err) return callback(err);
   return callback(null,docs); 
 }

// async asyncFindNearAddress(long,lat,maxDistance,userId,tag,status,callback) {
//   let err, docs;
//   maxDistance = parseFloat(maxDistance) / 6371;
//   let ObjectId = require('mongoose').Types.ObjectId; 
//   let query = Address.where({"Address.user": { "$ne": new ObjectId(userId) }});
//   if(tag.length > 0) {
//     query = query.where({"Address.tag": { "$in": tag }});
//   } if (status.length > 0) {
//     query = query.where({"Address.status": { "$eq": status }});
//   }


//   [err, docs] = await to(Address.aggregate(
//     [
//     { "$geoNear": {
//       "near": [long,lat],
//       "distanceField": "distance",
//       "maxDistance": maxDistance,
//       "query" : query._conditions,
//       "spherical": true
//     },


//   },
//   { "$sort": { "distance": -1 } }
//   ]

//   ));
//   console.log(err);
//   console.log(docs);
//   if(err) return new Error(err);
//   if(callback !== undefined) {
//     return callback(docs);
//   }  
//   return docs;
// }


}