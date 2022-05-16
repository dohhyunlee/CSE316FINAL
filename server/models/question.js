var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionsSchema = new Schema(
    {
            type: {type: String},
            date: {type: String},
            answer: {type: String},
            user: {type: Schema.Types.ObjectId, ref: 'User'},
    }
);

module.exports = mongoose.model('Question', questionsSchema);