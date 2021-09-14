// Require necessary NPM modules:
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


// Assign a port for localhost as well as final deployement:
const port = process.env.PORT || 3000;


// Initial setup for the server:
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));



// Connect to a new MongoDB Database named 'userDB', using Mongoose ODM:
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5s9h.mongodb.net/userDB`);

// Create a new collection named 'users' to store the emails and passwords of the users:
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// Add the encryption package to our userSchema before creating the User model:
let secret = process.env.SECRET_STRING;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);



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

// Handle 'GET' requests made on the '/logout' route:
app.get('/logout', (req, res) => {
  res.redirect('/');
})


// Handle 'POST' requests made on the '/register' route:
app.post('/register', (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  })
  user.save(err => {
    if(err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  })
})

// Handle 'POST' requests made on the '/login' route:
app.post('/login', (req, res) => {
  User.findOne({email: req.body.username}, (err, user) => {
    if(err) {
      res.send(err);
    } else {
      if(user) {
        if(user.password === req.body.password) {
          res.render('secrets');
        } else {
          res.send("Please check your password and try again...");
        }
      } else {
        res.send("Please check your username and try again...");
      }
    }
  })
})

// Handle 'POST' requests made on the '/submit' route:




// Enable client to listen to the appropriate port:
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
