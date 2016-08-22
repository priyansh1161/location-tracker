var express = require('express');
var ctrlLocation = require('../controllers/location');
var ctrlReviews = require('../controllers/reviews.js');
var router = express.Router();

//location
router.get('/locations',ctrlLocation.getLocationByDistance);
router.post('/locations',ctrlLocation.locationCreate);
router.put('/locations/:locationId',ctrlLocation.locationUpdateOne);
router.get('/locations/:locationId',ctrlLocation.locationReadOne);
router.delete('/locations/:locationId',ctrlLocation.locationDeleteOne);

//reviews

router.get('/locations/:locationId/reviews/:reviewId',ctrlReviews.reviewsReadOne);
router.post('/locations/:locationId/reviews/',ctrlReviews.reviewsCreate);
router.put('/locations/:locationId/reviews/:reviewId',ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId',ctrlReviews.reviewsDeleteOne);

module.exports = router;