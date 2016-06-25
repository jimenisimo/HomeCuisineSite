/**
 * Created by raveekiat on 6/4/2016 AD.
 */
var mongoose = require('mongoose');

var Dish   = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cook'
    },
    title: String,
    description: String,
    photo: [String],                                // List of URL strings
    price: Number,
    type: String,
    ingredients: [String],
    tags: [String],
    rating: Number,
    featured: {
        type: Boolean,
        default: false
    },
    top: {
        type: Boolean,
        default: false
    },
    hidden: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Dish', Dish);