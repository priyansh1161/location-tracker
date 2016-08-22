var mongoose = require('mongoose');
var Location = mongoose.model('Location');

var ctrl = {};

function jsonResponse(res,status,json){
    status = status || 200;
    res.status(status);
    res.json(json);
};

function updateAvrageRating(loc,cb) {
    var newRating,sum=0;
    for(var i=0;i<loc.reviews.length;i++)
        sum+=loc.reviews[i].rating;
    newRating = parseInt(sum/loc.reviews.length,10);
    console.log(sum,newRating);
    loc.rating = newRating;
    loc.save(function(err,data){
        if(err)
            console.log(err);
        else {
            console.log(data);
            if(cb){
                cb();
            }
        }
    })
}
function addReview(req,res,loc) {
    console.log(req.body.rating,parseFloat(req.body.rating));
    loc.reviews.push({
        author:req.body.author,
        rating:parseFloat(req.body.rating),
        reviewText:req.body.reviewText
    });
    loc.save(function (err,location) {
        if(err){
            jsonResponse(res,500,err);
        }
        setTimeout(updateAvrageRating(location),0);
        var thisRating = location.reviews[location.reviews.length-1];
        jsonResponse(res,201,thisRating);
    })
}
ctrl.reviewsReadOne = function (req,res) {
    if(req.params && req.params.locationId && req.params.reviewId){
        Location
            .findById(req.params.locationId)
            .select('name reviews')
            .exec(function (err,location) {
                if(err || !location)
                    jsonResponse(res,404,{status:'not found'});
                else{
                    var review , response;
                    review = location.reviews.id(req.params.reviewId);
                    if(!review)
                        jsonResponse(res,404,{status:'bad reqId'});
                    else{
                        response = {
                            name : location.name,
                            review : review
                        };

                        jsonResponse(res,200,response);
                    }
                }

            })
    }
    else{
        jsonResponse(res,400,{status:'bad request'});
    }
};
ctrl.reviewsCreate = function (req,res) {
    Location
        .findById(req.params.locationId)
        .select('reviews')
        .exec(function (err,loc) {
            if(err)
                jsonResponse(res,400,err);
            else{
                addReview(req,res,loc);
            }
        })
};
ctrl.reviewsUpdateOne = function (req,res) {
    if(req.params && req.params.locationId && req.params.reviewId){
        Location
            .findById(req.params.locationId)
            .select('name reviews')
            .exec(function (err,location) {
                if(err || !location)
                    jsonResponse(res,404,{status:'not found'});
                else{
                    var review ;
                    review = location.reviews.id(req.params.reviewId);
                    if(!review)
                        jsonResponse(res,404,{status:'bad reqId'});
                    else{
                        review.rating = req.body.rating;
                        review.reviewText = req.body.reviewText;
                        location.save(function (err,data) {
                            if(err){
                                jsonResponse(res,500,err);
                            }
                            else{
                                updateAvrageRating(data,function () {
                                    jsonResponse(res,200,data);
                                });

                            }

                        });

                    }
                }

            })
    }
    else{
        jsonResponse(res,400,{status:'bad request'});
    }
};
ctrl.reviewsDeleteOne = function (req,res) {
    if(req.params && req.params.locationId && req.params.reviewId){
        Location
            .findById(req.params.locationId)
            .select('name reviews')
            .exec(function (err,location) {
                if(err || !location)
                    jsonResponse(res,404,{status:'not found'});
                else{
                    location.reviews.id(req.params.reviewId).remove();
                   location.save(function(err,loc){
                     if(err)
                         jsonResponse(res,500,err);
                     else {
                        setTimeout(updateAvrageRating(loc),0);
                         jsonResponse(res,204,null);
                     }
                   });
                }
            });
    }
    else{
        jsonResponse(res,400,{status:'bad request'});
    }
}
module.exports = ctrl;