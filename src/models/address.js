var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Address = new Schema({
  address: {
  		user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String },
        coordinates: []
    },
    completeAddress : {
    	type : String,
    	required : true
    },
    isPrimary: {
        type: Boolean,
        required: false
    }

});

Address.index({ "address": "2dsphere" });

module.exports = mongoose.model('Address', Address);