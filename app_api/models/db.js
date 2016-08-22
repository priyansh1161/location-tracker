var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:27017/loc8er';

if(process.env.NODE_ENV=='production'){
    dbURI = 'mongodb://localhost:27017/loc8er';
    console.log('temp production placeholder');
}

mongoose.connect(dbURI);
mongoose.connection.on('connected' , function () {
   console.log('Connected to Db at',dbURI);
});
mongoose.connection.on('error',function (err) {
   console.log('Error in db ',err);
});
mongoose.connection.on('disconnected',function () {
    console.log('Disconnected from Db at',dbURI);
});


var shutdown = function(msg,cb){
    mongoose.connection.close(function () {
       console.log('Closing Db due to',msg);
        cb();
    });
};

// windows sucks so SIGUSR2 not working in win32
process.once('SIGUSR2',function () {
   shutdown('nodemon restart',function () {
      process.kill(process.pid,'SIGUSR2');
   });
});

process.on('SIGINT',function () {
    shutdown('App termination',function () {
        process.exit(0);
    })
});

process.on('SIGTERM',function () {
    shutdown('heroku restart',function () {
        process.exit(0);
    })
});

require('./locations');