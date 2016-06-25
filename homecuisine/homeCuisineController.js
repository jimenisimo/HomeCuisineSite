/**
 * Created by raveekiat on 6/4/2016 AD.
 */
var Dish = require('../model/dishSchema');
var Review = require('../model/reviewSchema');
var Order = require('../model/orderSchema');


// TODO 	banner	X
// TODO SEARCH (dish,delivery, location, type of food)"

// TODO DELETE	basket	userID, dishID
// TODO GET	basket	userID
// TODO POST	basket	userID,[dishID,quantity]
// TODO PUT	basket	userID,[dishID,quantity]

//GET	dish	DishID
// Create endpoint /api/dish/:dish_id for GET
exports.getDish = function(req, res) {
    Dish.findById(req.params.dish_id, function(err, dish) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(dish);
    });
};

//POST	dish	dishID, changes
exports.postDish = function(req, res) {
    // Use the Beer model to find a specific beer
    var dish = new Dish(req.body);

    dish.save(function (err, m) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.status(201).json(m);
        });

};


//PUT	dish	dishID, changes
//TODO Revise the authentication mechanism (later)
exports.putDish = function(req, res) {

    Dish.findByIdAndUpdate(
        req.params.dish_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, dish) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            if (dish.cook && req.user._id.equals(dish.cook)) {
                res.json(dish);
            } else {
                res.sendStatus(401);
            }
        });

};

//DELETE	dish	dishID
//TODO Revise the authentication mechanism (later)
exports.deleteDish = function(req, res) {
    Dish.findById(req.params.dish_id, function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //authorize
        if (m.cook && req.user._id.equals(m.cook)) {
            m.remove();
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }

    });
};


// GET	review	userID
exports.getReview = function(req, res) {
    Review.findById(req.params.review_id, function(err, review) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(review);
    });
};

// POST	review	review string, userID, dishID, photo(link)
exports.postReview = function(req, res) {

    var review = new Review(req.body);

    review.save(function (err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).json(m);
    });

};

// DELETE	review	reviewID
//TODO Revise the authentication mechanism (later)
exports.deleteReview = function(req, res) {
    // Use the Beer model to find a specific beer and remove it
    Review.findById(req.params.review_id, function(err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //authorize
        if (m.consumer && req.user._id.equals(m.consumer)) {
            m.remove();
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });
};

//POST	order	userID, [list of dish, qantity, price], delivery method, payment method
exports.postOrder = function(req, res) {

    var order = new Order(req.body);

    order.save(function (err, m) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).json(m);
    });
};

//GET order cook_id (chef)
exports.getOrder = function(req, res) {
    Order.find({ "cook": req.params.user_id }, function(err, review) {
        if (err) {
            res.status(500).send(err)
            return;
        };
        res.json(review);
    });
};

// getFeatured NONE Dishes
exports.getFeatured = function(req, res) {
    Dish.find({ "featured": true }, function(err, dish) {
        if (err) {
            res.status(500).send(err)
            return;
        };
        res.json(dish);
    });
};

// getTop NONE Dishes
exports.getTop = function(req, res) {
    Dish.find({ "top": true }, function(err, dish) {
        if (err) {
            res.status(500).send(err)
            return;
        };
        res.json(dish);
    });
};

// TODO: GET	search	"type, search string: implement search algorithms
exports.getSearch = function(req, res) {
    Dish.find({"title" : req.params.title, "type": req.params.type}, function(err, dish) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(dish);
    });
};

//GET	myDishes	CookID
exports.mydish = function(req, res) {
    Dish.find({ "cook" : req.params.cook_id}, function(err, dish) {
        if (err) {
            res.status(500).send(err)
            return;
        };
        res.json(dish);
    });
};