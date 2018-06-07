import mongoose from 'mongoose'
import express from 'express'
import Project from "../models/project"
import to from "../util/to"


module.exports = class ProjectService {

  constructor() {
  }

  async asyncFindProjectByUserId(userId,callback) {
    let err, docs;
    var query  = Project.where({ "project.user": userId });
    [err, docs] = await to(query.find());
    if(err) return callback(err);
    return callback(null,docs); 
  }

  async asyncFindUpdateProjectById(project,callback) {
    let err, docs;
    var ObjectId = require('mongoose').Types.ObjectId; 
    [err, docs] = await to(Project.findOneAndUpdate({ "_id": new ObjectId(project._id)}, { $set: project }, { new: true }));
    if(err) return callback(err);
    return callback(null,docs); 
  }

  async asyncSaveProject(project,callback) {
    let err, docs;
    [err, docs] = await to(project.save());
    if(err) return callback(err);
    return callback(null,docs); 
  }

  async asyncFindAllProject(callback){
    let err, docs;
    [err, docs] = await to(Project.find());
    if(err) return new Error(err);

    if(callback !== undefined) {
      return callback(docs);
    }
  }

  async asyncDeleteProjectById(id,callback) {
   let err, docs;
   [err, docs] = await to(Project.deleteOne({ "_id": id }));
   if(err) return callback(err);
   return callback(null,docs); 
 }

 async asyncFindNearProject(long,lat,maxDistance,userId,tag,status,callback) {
  let err, docs;
  maxDistance = parseFloat(maxDistance) / 6371;
  let ObjectId = require('mongoose').Types.ObjectId; 
  let query = Project.where({"project.user": { "$ne": new ObjectId(userId) }});
  if(tag.length > 0) {
    query = query.where({"project.tag": { "$in": tag }});
  } if (status.length > 0) {
    query = query.where({"project.status": { "$eq": status }});
  }
  

  [err, docs] = await to(Project.aggregate(
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