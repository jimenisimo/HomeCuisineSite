/**
 * Created by raveekiat on 6/4/2016 AD.
 */
var mongoose = require('mongoose');

var Order   = new  mongoose.Schema({
    cook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cook'
    },
    consumer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer'
    },
    dish:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    },
    total: Number,
    order_date: Date,
    delivery: String,                               // TODO decide
    payment: String                                 // TODO decide
});
module.exports = mongoose.model('Order', Order);