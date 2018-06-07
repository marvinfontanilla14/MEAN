var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
  project: {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        type: { type: String },
        coordinates: [],
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        tag : [String],
        status : {type: String}
    },
});

Project.index({ "project": "2dsphere" });

module.exports = mongoose.model('Project', Project);