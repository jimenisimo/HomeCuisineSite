/**
 * Created by raveekiat on 6/4/2016 AD.
 */
var mongoose = require('mongoose');

var Review   = new  mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HomeCuisine'
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer'
    },
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cook'
    },
    rating: Number,                                 // TODO decide
    review_text: String,
    photo: [String]                                 // List of URL strings
});

module.exports = mongoose.model('Review', Review);