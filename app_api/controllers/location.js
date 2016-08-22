var mongoose = require('mongoose');
var Location = mongoose.model('Location');
// var lctn = require('../models/locations');
var ctrl = {};
function jsonResponse(res,status,json){
    status = status || 200;

    res.status(status);
    res.json(json);
};
var getLocation = function (results) {
    var locations = [];
     results.forEach(function (doc) {
         locations.push({
             distance : doc.dis,
             name : doc.obj.name,
             address : doc.obj.address,
             coords : doc.obj.coords,
             rating: doc.obj.rating,
             facilities: doc.obj.facilities,
             _id : doc.obj._id
         });
     });
    return locations;
}
ctrl.locationCreate = function (req,res) {
    var data = req.body,closing=true;
    console.log(req.body);
    if(!Object.keys(data).length){
        jsonResponse(res,400,{status : 'no data'});
        return;
    }

    Location.create({
        name: data.name,
        address: data.address,
        rating: parseFloat(data.rating),
        coords:[ parseFloat(data.lng),parseFloat(data.lat)],
        facilities:data.facilities.split(','),
        openingTimes: [{
            days: data.days1,
            opening: data.opening1,
            closing: data.closing1,
            closed: data.closed1,
            },{
            days: data.days2,
            opening: data.opening2,
            closing: data.closing2,
            closed: data.closed2,
            }
        ]
    },function (err,data) {
        if(err)
            jsonResponse(res,400,err);
        else
            jsonResponse(res,200,data);
    });
};
ctrl.locationReadOne = function (req,res) {
    console.log('dd');
    if(req.params && req.params.locationId){
        Location
            .findById(req.params.locationId)
            .exec(function (err,location) {
                if(!location) {
                    jsonResponse(res,404,{status:'Not Found'});
                }
                else if(err)
                    jsonResponse(res,404,err);
                else
                    jsonResponse(res,200,location);
            });
    }
    else{
        jsonResponse(res,404,{status:'No parameter passed'});
    }
};
ctrl.getLocationByDistance = function (req,res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseFloat(req.query.maxDistance);
    if(!lng || !lat || !maxDistance){
        jsonResponse(res,404,{status:'Bad request'});
        return;
    }
    var point = {
        type : 'Point',
        coordinates: [lng,lat]
    };
    var geoOptions = {
        spherical : true,
        num : 10,
        maxDistance : maxDistance*1000
    };
    Location.geoNear(point,geoOptions,function (err,results,status) {
        var location;
        if(err){
            jsonResponse(res,500,err);
        }
        location = getLocation(results);
        jsonResponse(res,200,location);
    });
};
ctrl.locationUpdateOne = function(req,res) {
    console.log(req.body);
    if(req.params && req.params.locationId){
        Location
            .findById(req.params.locationId)
            .select('-reviews -rating')
            .exec(function (err,location) {
                if(!location) {
                    jsonResponse(res,404,{status:'Not Found'});
                }
                else if(err)
                    jsonResponse(res,404,err);
                else{
                    for(var key in req.body){
                       location[key] = req.body[key]
                    }
                    location.save(function(err,data){
                        if(err) {
                            console.log(err);
                            jsonResponse(res,500,err);
                        }
                        else {
                            console.log(data);
                            jsonResponse(res,201,data);
                        }
                    })
                }
            });
    }
    else{
        jsonResponse(res,404,{status:'No parameter passed'});
    }
};
ctrl.locationDeleteOne = function (req,res) {
    if (req.params && req.params.locationId) {
        Location
            .findByIdAndRemove(req.params.locationId)
            .exec(function (err, location) {
                console.log('Removed', location);
                if (err)
                    jsonResponse(res, 404, err);
                else
                    jsonResponse(res, 204, null);
            })
    } else
        jsonResponse(res, 404, {status: 'Invalid Params'});
}
module.exports = ctrl;
