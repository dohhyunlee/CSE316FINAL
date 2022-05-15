var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var notesSchema = new Schema(
    {
        text: {type: String},
        lastUpdatedDate: {type: String},
        dateText:{type: String},
        tags: {type: Array},
        sim: {type: Number},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
    }
);

module.exports = mongoose.model('Note', notesSchema);