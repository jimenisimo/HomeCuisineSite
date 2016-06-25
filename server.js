var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var moment = require('moment');
var crypto = require('crypto');


var tokenSecret = 'secrethomecuisine';

/*****Dish*****/

var DishSchema   = new mongoose.Schema({
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
    photo: String,                                // List of URL strings
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

/*****User*****/
var UserSchema = new mongoose.Schema({
    name: { type: String, trim: true, required: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    facebook: {
        id: String,
        email: String
    },
    google: {
        id: String,
        email: String
    }
});

/*const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Consumer', 'Cook', 'Admin'],
        default: 'Consumer'
    },
    facebook: {
        id: String,
        email: String
    },
    google: {
        id: String,
        email: String
    },
    birthday: {
        type: String,
        lowercase: true,
        required: false
    },
    address: {
        type: String,
        lowercase: true,
        required: false
    },
    phone: {
        type: String,
        lowercase: true,
        required: false
    },
    preferred_language: {
        type: String,
        enum: ['English', 'German'],
        default: 'English'
    }

});
 */

UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);
var Dish = mongoose.model('Dish', DishSchema);

mongoose.connect('mongodb://localhost/homecuisinedbtest2');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


function createJwtToken(user) {
    var payload = {
        user: user,
        iat: new Date().getTime(),
        exp: moment().add(7, 'days').valueOf()
    };
    return jwt.encode(payload, tokenSecret);
}


app.post('/auth/signup', function(req, res, next) {
    //TODO add that user to the type he/she select
    //TODO update that user with the ID of the type he/she select
 /*   if(!req.body.email){
        res.status(400).send('email required');
        return;
    }
    if(!req.body.name){
        res.status(400).send('name required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }
    if(!req.body.birthday){
        res.status(400).send('birthday required');
        return;
    }
    if(!req.body.address){
        res.status(400).send('address required');
        return;
    }
    if(!req.body.phone){
        res.status(400).send('Phone required');
        return;
    }
*/
    var user = new User();

    user.email = req.body.email;
    user.name = req.body.name;
    user.password = req.body.password;
  /*  user.birthday = req.body.birthday;
    user.address = req.body.address;
    //user.cook = req.body.cook;
    user.phone = req.body.phone;

    if(req.body.preferred_language)
        user.preferred_language = req.body.preferred_language;
   */
    // TODO create consumer or cook profile
    /*
     if(req.body.cook == true)
     //create a new cook profile and link it to user
     else // create a new consumer profile and link it to user
     */


    user.save(function(err) {
        if (err) {
            if (err.code == 11000) {
                return res.send(409, { message: user.name + ' already exists.' });
            }else{
                res.status(500).send({error: err});
            }

            return next(err);
          }

        res.status(201).json({token: createJwtToken(user)});
    });
}
);


app.post('/auth/login', function(req, res, next) {
    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) return res.send(401, 'User does not exist');
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (!isMatch) return res.send(401, 'Invalid email and/or password');
            var token = createJwtToken(user);
            res.send({ token: token });
        });
    });
});

app.post('/auth/facebook', function(req, res, next) {
    var profile = req.body.profile;
    var signedRequest = req.body.signedRequest;
    var encodedSignature = signedRequest.split('.')[0];
    var payload = signedRequest.split('.')[1];

    var appSecret = '298fb6c080fda239b809ae418bf49700';

    var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
    expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (encodedSignature !== expectedSignature) {
        return res.send(400, 'Invalid Request Signature');
    }

    User.findOne({ facebook: profile.id }, function(err, existingUser) {
        if (existingUser) {
            var token = createJwtToken(existingUser);
            return res.send(token);
        }
        var user = new User({
            name: profile.name,
            facebook: {
                id: profile.id,
                email: profile.email
            }
        });
        user.save(function(err) {
            if (err) return next(err);
            var token = createJwtToken(user);
            res.send(token);
        });
    });
});

app.post('/auth/google', function(req, res, next) {
    var profile = req.body.profile;
    User.findOne({ google: profile.id }, function(err, existingUser) {
        if (existingUser) {
            var token = createJwtToken(existingUser);
            return res.send(token);
        }
        var user = new User({
            name: profile.displayName,
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        user.save(function(err) {
            if (err) return next(err);
            var token = createJwtToken(user);
            res.send(token);
        });
    });
});


app.get('/api/shows', function(req, res, next) {
    var query = Dish.find();
    if (req.query.type) {
        query.where({ type: req.query.type });
    } else if (req.query.alphabet) {
        query.where({ title: new RegExp('^' + '[' + req.query.alphabet + ']', 'i') });
    } else {
        query.limit(12);
    }
    query.exec(function(err, dishes) {
        if (err) return next(err);
        res.send(dishes);
    });
});

app.get('/api/shows/:id', function(req, res, next) {
    Dish.findById(req.params.id, function(err, dish) {
        if (err) return next(err);
        res.send(dish);
    });
});


app.post('/api/shows', function (req, res, next) {
    var dishType = req.body.type;
    var dishTitle = req.body.title;
    var dishDescription = req.body.description;
    var dishPhoto = req.body.photo;


                    var dish = new Dish({
                        title: dishTitle,
                        type: dishType,
                        description: dishDescription,
                        photo: dishPhoto
                    });
         /*           _.each(episodes, function (episode) {
                        show.episodes.push({
                            season: episode.seasonnumber,
                            episodeNumber: episode.episodenumber,
                            episodeName: episode.episodename,
                            firstAired: episode.firstaired,
                            overview: episode.overview
                        });
                    });*/
        dish.save(function (err) {
            if (err) {
                if (err.code == 11000) {
                    return res.send(409, { message: dish.name + ' already exists.' });
                }
                return next(err);
            }
            /*var alertDate = Date.create('Next ' + show.airsDayOfWeek + ' at ' + show.airsTime).rewind({ hour: 2});
            agenda.schedule(alertDate, 'send email alert', show.name).repeatEvery('1 week');*/
            res.send(200);
        });
});




app.get('*', function(req, res) {
    res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, { message: err.message });
});


app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});