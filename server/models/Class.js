var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

var ClassSchema = new Schema({
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    students: [{
        type: ObjectId,
        ref: "User"
    }]
});

module.exports = mongoose.model('Class', ClassSchema);