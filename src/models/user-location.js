var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserLocation = new Schema({
  loc: {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String },
        coordinates: [],
        isVisible : {
            type : Boolean,
            required : false
        },
        socketId : {
            type : String,
            required : false
        }
    },
    

});

UserLocation.index({ "loc": "2dsphere" });

module.exports = mongoose.model('UserLocation', UserLocation);