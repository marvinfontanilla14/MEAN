import mongoose from 'mongoose'
import express from 'express'
import Service from "../models/service"
import to from "../util/to"


module.exports = class ServiceService {

  constructor() {
  }

  async asyncFindServiceByUserId(userId,callback) {
    let err, docs;
    var query  = Service.where({ "Service.user": userId });
    [err, docs] = await to(query.find());
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(docs);
    }  
  }

  async asyncFindUpdateServiceById(Service,callback) {
    let err, docs;
    var ObjectId = require('mongoose').Types.ObjectId; 
    [err, docs] = await to(Service.findOneAndUpdate({ "_id": new ObjectId(Service._id)}, { $set: Service }, { new: true }));
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(docs);
    }  
  }

  async asyncSaveService(Service,callback) {
    let err, docs;
    [err, docs] = await to(Service.save());
    console.log(err);
    console.log(docs);
    if(err) return new Error(err);
    if(callback !== undefined) {
      return callback(docs);
    } 
  }

  async asyncFindAllService(callback){
    let err, docs;
    [err, docs] = await to(Service.find());
    if(err) return new Error(err);

    if(callback !== undefined) {
      return callback(docs);
    }
  }

  async asyncDeleteServiceById(id,callback) {
   let err, docs;
   [err, docs] = await to(Service.deleteOne({ "_id": id }));
   if(err) return new Error(err);

   if(callback !== undefined) {
    return callback(docs);
  } 
}

async asyncFindNearService(long,lat,maxDistance,userId,tag,status,callback) {
  let err, docs;
  maxDistance = parseFloat(maxDistance) / 6371;
  let ObjectId = require('mongoose').Types.ObjectId; 
  let query = Service.where({"Service.user": { "$ne": new ObjectId(userId) }});
  if(tag.length > 0) {
    query = query.where({"Service.tag": { "$in": tag }});
  } if (status.length > 0) {
    query = query.where({"Service.status": { "$eq": status }});
  }
 

  [err, docs] = await to(Service.aggregate(
    [
    { "$geoNear": {
      "near": [long,lat],
      "distanceField": "distance",
      "maxDistance": maxDistance,
      "query" : query._conditions,
      "spherical": true
    },


  },
  { "$sort": { "distance": -1 } }
  ]

  ));
  console.log(err);
  console.log(docs);
  if(err) return new Error(err);
  if(callback !== undefined) {
    return callback(docs);
  }  
  return docs;
}


}