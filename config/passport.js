// Load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// Load up the user model
var User = require('../app/models/user.js');

module.exports = function(passport) {
    // passport session setup
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    //

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    //
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true
    }, function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
            User.findOne({'username':username}, function(err, user) {
                if (err) 
                    return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken'));
                } else {
                    var newUser = User();

                    newUser.local.username = username;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err) {
                        if (err)  
                            throw err;

                        return done(null, newUser);
                    });
                    
                }
            });
        })
    }));
}
