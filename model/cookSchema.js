/**
 * Created by raveekiat on 6/23/2016 AD.
 */
var mongoose = require('mongoose');

var Cook    = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
    // TOODO
    /*
     , rating: Number,
     deliveryMethod: TODO
     deliverables: [String]
     */
});

module.exports = mongoose.model('Cook', Cook);
