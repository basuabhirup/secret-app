// Require necessary NPM modules:
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


// Assign a port for localhost as well as final deployement:
const port = process.env.PORT || 3000;


// Initial setup for the server:
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());



// Connect to a new MongoDB Database named 'userDB', using Mongoose ODM:
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5s9h.mongodb.net/userDB`);

// Create a new collection named 'users' to store the emails and passwords of the users:
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})

// Add 'passportLocalMongoose' plugin to the userSchema before creating the User model:
userSchema.plugin(passportLocalMongoose);

// Create User model based on userSchema:
const User = new mongoose.model('User', userSchema);

// Add passport-local Configuration:
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Handle HTTP requests:

// Handle 'GET' requests made on the '/' route:
app.get('/', (req, res) => {
  res.render('home');
})

// Handle 'GET' requests made on the '/register' route:
app.get('/register', (req, res) => {
  res.render('register');
})

// Handle 'GET' requests made on the '/login' route:
app.get('/login', (req, res) => {
  res.render('login');
})

// Handle 'GET' requests made on the '/secrets' route:
app.get('/secrets', (req, res) => {
  if(req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
})

// Handle 'GET' requests made on the '/logout' route:
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})


// Handle 'POST' requests made on the '/register' route:
app.post('/register', (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      })
    }
  })
})

// Handle 'POST' requests made on the '/login' route:
app.post('/login', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  })
  req.login(user, err => {
    if(err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      })
    }
  })
})

// Handle 'POST' requests made on the '/submit' route:




// Enable client to listen to the appropriate port:
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
