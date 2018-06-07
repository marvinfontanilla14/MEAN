import mongoose from 'mongoose'
import passport from 'passport'
import config from '../config/database'
import express from 'express'
import jwt from 'jsonwebtoken'
import User from "../models/user"
import UserLocation from "../models/user-location"
import Project from "../models/project"
import Book from "../models/book"
import LocationService from "../services/location-service"
import ProjectService from "../services/project-service"

var locationService = new LocationService();
var projectService = new ProjectService();

require('../config/passport')(passport);
const router = express.Router();

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
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
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

router.post('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body);
    var newBook = new Book({
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher
    });

    newBook.save(function(err) {
      if (err) {
        return res.json({success: false,    msg: 'Save book failed.'});
      }
      res.json({success: true, msg: 'Successful created new book.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



//**User location **//
router.post('/user-location', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {

    //--Find user by jwt

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return next(new Error('Authentication error'));
      }
      User.findOne({
        username: decoded.username
      }, (err, user) => {
        if (err) {
          console.log('error');
          console.log(err);
          throw err;
        }
        if (!user) {
          return next(new Error('Authentication error'));
        }
        console.log('user id below');
        console.log(user._id);
                // res.json(user);

                let long = Number.parseFloat(req.body.long);
                let lat = Number.parseFloat(req.body.lat);

                //-- Save user location
                var userLocation = new UserLocation({ 
                 "loc": { 
                   "user": user._id,
                   "type": "Point",
                   "coordinates": [long, lat],
                    "socketId" :"nu"
                 },

               });

                userLocation.save(function (err,loc) {
                 console.log('pumasok'); 
                 console.log(err);
                 console.log(loc);
                  // if (err) return new Error(err);


                  UserLocation.find(function (err, locs) {
                    res.json(locs);
                  });
                  
                });
              });
    });



  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



router.get('/near-location', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.query);
    let long = parseFloat(req.query.long);
    let lat = parseFloat(req.query.lat);
    let maxDistance = parseFloat(req.query.maxDistance) / 6371;  

    UserLocation.aggregate(
      [
      { "$geoNear": {
        "near": [long,lat],
              // "near": { type: "Point", coordinates: [long,lat] },
              "distanceField": "distance",
              "maxDistance": maxDistance,
              "spherical": true
            }},
        { "$sort": { "distance": -1 } } // Sort nearest first
        ],
        function(err,docs) {
          console.log(err);
      // console.log(docs);
      res.json(docs);

       // These are not mongoose documents, but you can always cast them
     }
     );



  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.get('/test', passport.authenticate('jwt', { session: false}), function(req, res) {

  // locationService.asyncFindLocationByUserId("5b098339a617a02994f2e619",function(result){
  //   res.json(result);
  // });

// locationService.asyncFindNearLocation(120.5873108,15.2232775,2,"5af81f08f1c4b328d051d5df",function(result){
//   res.json(result);
// })


     var userLocation = new UserLocation({ 
         "_id": "5b098a456fca8934c083946f",
        "loc": {
            "coordinates": [
                120.5801282,
                15.2110799
            ],
            "user": "5b098339a617a02994f2e619",
            "type": "Point",
            "socketId": "testlangrrrrr"
        }

               });



locationService.asyncFindUpdateLocationByUserId(userLocation,function(result){
  res.json(result);
})

// locationService.asyncSaveLocation(userLocation,function(result){
//   res.json(result);
// });

  // locationService.asyncDeleteLocationByUserId("5b098339a617a02994f2e619",function(result){
  //   res.json(result);
  // });


});


router.get('/projecttest', passport.authenticate('jwt', { session: false}), function(req, res) {

// var addons = '6';
//  var project = new Project({ 
//         "project": {
//             "coordinates": [
//                 120.5801282,
//                 15.2110799
//             ],
//             "user": "5b098a456fca8934c083946f",
//             "type": "Point",
//             "title": "title"+addons,
//             "description": "description"+addons,
//             "tag": ["1tag"+addons,"2tag"+addons,"3tag"+addons],
//             "status" : "completed"
//         }

//                });


// projectService.asyncSaveProject(project,function(result){
//   res.json(result);
// });


// projectService.asyncFindProjectByUserId("5b098339a617a02994f2e619",function(result){
//   res.json(result);
// });


  // var project = new Project(
  //       {
  //       "project": {
  //           "coordinates": [
  //               120.5801282,
  //               15.2110799
  //           ],
  //           "tag": [
  //               "1tag2e1",
  //               "2tag2e1",
  //               "3tag2e1"
  //           ],
  //           "user": "5b098339a617a02994f2e619",
  //           "type": "Point",
  //           "title": "title2e1",
  //           "description": "description2e"
  //       },
  //       "_id": "5b0aae3c88e04f1970e6c0de"
  //   }

  // );

  // projectService.asyncFindUpdateProjectById(project,function(result){
  //     res.json(result);
  // });

  // projectService.asyncFindAllProject(function(result){
  //     res.json(result);
  // });


  // projectService.asyncDeleteProjectById("5b0aae3c88e04f1970e6c0de",function(result){
  //   res.json(result);
  // });

  projectService.asyncFindNearProject(120.5801282,15.2110799,2,"5b098339a617a02994f2e619",[],"completed",function(result){
  res.json(result);
})

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