import mongoose from 'mongoose'
import express from 'express'
import User from "../models/user"
import to from "../util/to"
import bcrypt from 'bcrypt-nodejs'


module.exports = class UserService {

  constructor() {
  }

  async asyncFindUserByUserId(userId,callback) {
    let err, docs;
    var query  = User.where({ "_id": new ObjectId(userId)});
    [err, docs] = await to(query.find());
    if(err) return callback(err);
    return callback(null,docs);  
  }

  async asyncFindUserByUsername(username,callback) {
    let err, docs;
    var result = new Object();
    var query  = User.where({ "username": username});
    [err, docs] = await to(query.findOne());
    if(err) return callback(err);
    return callback(null,docs);
  }


  comparePassword (inputpass,userpass, cb) {
    bcrypt.compare(inputpass, userpass, function (err, isMatch) {
      console.log('input: '+inputpass);
      console.log('userpass: '+userpass);
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  }

  async asyncFindUpdateUserById(updateUser,callback) {
    let err, docs;
    var ObjectId = require('mongoose').Types.ObjectId; 
    [err, docs] = await to(User.findOneAndUpdate({ "_id": new ObjectId(updateUser._id)}, { $set: updateUser }, { new: true }));
    if(err) return callback(err);
    return callback(null,docs);
  }

  async asyncSaveUser(User,callback) {
    let err, docs;
    let result = new Object();
    [err, docs] = await to(User.save());
    if(err) return callback(err);
    return callback(null,docs);
  }

  async asyncFindAllUser(callback){
    let err, docs;
    [err, docs] = await to(User.find());
    if(err) return callback(err);
    return callback(null,docs);
  }

  async asyncDeleteUserById(id,callback) {
   let err, docs;
   [err, docs] = await to(User.deleteOne({ "_id": id }));
   if(err) return callback(err);
   return callback(null,docs);
 }

}