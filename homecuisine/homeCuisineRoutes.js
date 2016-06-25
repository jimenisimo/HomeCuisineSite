/**
 * Created by raveekiat on 6/4/2016 AD.
 */
module.exports = homeCuisineRoutes;


function homeCuisineRoutes(passport) {

    var homeCuisineController = require('../homecuisine/homeCuisineController');
    var router = require('express').Router();
    var unless = require('express-unless');

    var mw = passport.authenticate('jwt', {session: false});
    mw.unless = unless;

    //middleware
    router.use(mw.unless({method: ['GET', 'OPTIONS']}));

    // TODO update this list according to the controller file
    // Dish
    router.route('/dishes/:dish_id')
        .get(homeCuisineController.getDish)
        .put(homeCuisineController.putDish)
        .delete(homeCuisineController.deleteDish);

    router.route('/dishes/').post(homeCuisineController.postDish);

    // Review
    router.route('/review/:review_id')
        .get(homeCuisineController.getReview)
        .delete(homeCuisineController.deleteReview);

    router.route('/review/').post(homeCuisineController.postReview);

    // // TopChefs
    // router.route('/topchefs/').get(homeCuisineController.getTopChef);

    // Featured Dish
    router.route('/featuredDishes/').get(homeCuisineController.getFeatured);

    // Top Dish
    router.route('/topDishes/').get(homeCuisineController.getTop);
    
    // // Banner
    // router.route('/banner/').get(homeCuisineController.getBanner);
    
    // Search
    router.route('/search/:title/:type').get(homeCuisineController.getSearch);
    
    // MyDish
    router.route('/mydish/:cook_id').get(homeCuisineController.mydish);


    // Order
    router.route('/order/').post(homeCuisineController.postOrder);
    router.route('/order/:user_id')
        .get(homeCuisineController.getOrder);


    return router;
}