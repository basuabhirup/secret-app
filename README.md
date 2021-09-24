# Secret App
### Live Site URL: [secrets-basuabhirup.herokuapp.com](secrets-basuabhirup.herokuapp.com/)
This project is a part of "The Complete 2021 Web Development Bootcamp" by The London App Brewery, instructed by Dr. Angela Yu and hosted on Udemy.

## Table of contents

  - [Objective of this Project](#objective-of-this-project)
  - [Steps I have followed](#steps-i-have-followed)
    - [Basic Server Setup](#basic-server-setup)
    - [Experiment with 6 different levels of security](#experiment-with-6-different-levels-of-security)
      - [Level 1 Security: Login with registered Username and Password](#level-1-security-login-with-registered-username-and-password)
      - [Level 2 Security: Database Encryption](#level-2-security-database-encryption)
      - [Level 3 Security: Hashing passwords with MD5](#level-3-security-hashing-passwords-with-md5)
      - [Level 4 Security: Salting and Hashing passwords with bcrypt](#level-4-security-salting-and-hashing-passwords-with-bcrypt)
      - [Level 5 Security: Add Cookies and Sessions using Passport.js](#level-5-security-add-cookies-and-sessions-using-passportjs)
      - [Level 6 Security: Implementing Third Party Sign-in using OAuth 2.0](#level-6-security-implementing-third-party-sign-in-using-oauth-20)
    - [Finishing Up the App](#finishing-up-the-app)


## Objective of this Project:
- To create an app where the registered users can share secrets anonymously.
- To restrict access to the secrets by all the non-registered users.
- To add authentication to the app so that individual users would sign up with a username and password.
- To enable users to log into the app using their username and password to access to the secrets.

## Steps I have followed:

### Basic Server Setup:
1. Initialized NPM inside the project directory using `npm init -y` command from the terminal.
2. Used `npm i express body-parser ejs mongoose dotenv` command to install these dependencies for our project.
3. Initialized the server with the following code inside the `app.js` file:
```javascript
// Require necessary NPM modules:
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

// Assign a port for localhost as well as final deployement:
const port = process.env.PORT || 3000;

// Initial setup for the server:
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


// Connect to a new MongoDB Database, using Mongoose ODM:

// Create a new collection inside the database to store data:



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



// Enable client to listen to the appropriate port:
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
```
<br />

4. Initialized a local git repository with `git init` command.
5. Created a `.gitignore` file to prevent all the unwanted files from being tracked:
```
node_modules/
npm-debug.log
.DS_Store
.env
```
<br />

6. Created a `.env` file to store all the encryption keys / database passwords as environment variables and made sure that the `.env` file is not being tracked by git:
```
DB_USER=my_user_name
DB_PASS=Abc123xyz789
```
<br />

7. Connected the server to a new database named `userDB` in MongoDB Atlas Cluster, using Mongoose ODM:
```javascript
// Connect to a new MongoDB Database, using Mongoose ODM:
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5s9h.mongodb.net/userDB`);
```
<br />

8. Created a new collection named `users` inside `userDB` to store the emails and passwords of all the users:
```javascript
// Create a new collection named 'users' to store the emails and passwords of the users:
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})
const User = new mongoose.model('User', userSchema);
```
<br />

### Experiment with 6 different levels of security:

### Level 1 Security: Login with registered Username and Password
* Handled the HTTP `POST` requests made on the `/register` route, so that it creates a new user document in the database to store their emails and passwords:
```javascript
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
```
<br />

* Handled the HTTP `POST` requests made on the `/login` route, so that the registered users can seamlessly login to the app with their credentials:
```javascript
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
```
<br />

### Level 2 Security: Database Encryption
* Installed the `mongoose-encryption` NPM module using `npm i mongoose-encryption` command and required the same inside our `app.js` file:
```javascript
const encrypt = require('mongoose-encryption');
```
<br />

* Created a long unguessable secret key as an environment variable inside the `.env` file and added an encryption package to our `userSchema` to keep the users' passwords encrypted:
```javascript
// Add the encryption package to our userSchema before creating the User model:
let secret = process.env.SECRET_STRING;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
```
<br />

* `mongoose-encryption` package is smart enough to decrypt the passwords from the database whenever POST requests are created on the `/login` route. Therefore, anyone having access to the server code in `app.js` file can get access to all the users' passwords.
<br />

### Level 3 Security: Hashing passwords with MD5
* Installed the `md5` module using `npm i md5` command and required the same in our `app.js` file:
```javascript
const md5 = require('md5');
```
<br />

* Modified the user object inside the handler function of the `POST` requests made on the `/register` route, so that instead of storing the users' passwords in our database, we use our Hash function MD5 to turn that into an irreversible hash.
```javascript
const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  })
```
<br />

* Modified the logic inside the handler function of the `POST` requests made on the `/login` route:
```javascript
if(user.password === md5(req.body.password)) {
  res.render('secrets');
}
```
<br />

### Level 4 Security: Salting and Hashing passwords with bcrypt
* Installed the `bcrypt` module using `npm i bcrypt` command and required the same in our `app.js` file:
```javascript
const bcrypt = require('bcrypt');
```
<br />

* Modified handler of `POST` requests made on the `/register` route, to turn the users' passwords into a complex hash using 10 rounds of salting:
```javascript
app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    const user = new User({
      email: req.body.username,
      password: hash
    })
    user.save(err => {
      if(err) {
        console.log(err);
      } else {
        res.render('secrets');
      }
    })
  })  
})
```
<br />

* Modified handler of `POST` requests made on the `/login` route:
```javascript
if(user) {
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if(result === true) {
      res.render('secrets');
    } else {
      res.send("Please check your password and try again...");
    }
  })
} else {
  res.send("Please check your username and try again...");
}
```
<br />

### Level 5 Security: Add Cookies and Sessions using Passport.js
* Installed the `passport`, `passport-local`, `passport-local-mongoose`and `express-session`  modules using ` npm i passport passport-local passport-local-mongoose express-session` command from terminal and required them inside our `app.js` file, maintaining order as following:
```javascript
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
```
<br />

* Created a `SECRET_KEY` as an environment variable inside the `.env` file, configured `session` below all the `app.use` commands and initialized `passport` right below this:
```javascript
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
```
<br />

* Added `passportLocalMongoose` plugin to the `userSchema` before creating the User model, so that it can salt and hash the users' passwords before saving them to the database:
```javascript
userSchema.plugin(passportLocalMongoose);
```
<br />

* Added `passport-local` configurations right below the User model:
```javascript
// Add passport-local Configuration:
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```
<br/>

* Handled the HTTP `POST` requests made on the `/register` route, using some methods from the `passport` and the `passportLocalMongoose` packages:
```javascript
app.post('/register', (req, res) => {
  User.register({username: req.body.username}, req.body.password, (err, user) => {
    if(err){
      res.send(`
        <h3 style="font-family:sans-serif; color:red;">${err.message}</h3>
        <button type="button" style="font-size:1rem; cursor:pointer;" onclick="window.location.href='/register'">Go back to Registration Page</buton>
        `);
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      })
    }
  })
})
```
<br />

* Handled the HTTP `POST` requests made on the `/login` route, using some methods from the `passport` and the `passportLocalMongoose` packages:
```javascript
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secrets',
  failureRedirect: '/login',
}));
```
<br />

* Handled the HTTP `GET` requests made on the `/secrets` route, so that only the logged in authenticated users can get access to the secrets:
```javascript
app.get('/secrets', (req, res) => {
  if(req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
})
```
<br />

* Handled the HTTP 'GET' requests made on the '/logout' route to deauthenticate the user and end the user session, using the `req.logout()` method from the `passport` module:
```javascript
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})
```
<br />

### Level 6 Security: Implementing Third Party Sign-in using OAuth 2.0
* Installed the `passport-google-oauth20` and `mongoose-findorcreate` modules using `npm i passport-google-oauth20 mongoose-findorcreate` command and required them inside our `app.js` file:
```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
```
<br />

* Created a new project in the [Google Developers Console](https://console.developers.google.com/), generated OAuth 2.0 client ID with source URI as `http://localhost:3000`, redirect URI as `http://localhost:3000/auth/google/secrets` and stored the credentials in our `.env` file as environment variables `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
* Added the `findOrCreate` function as a plugin to the `userSchema` before creating the User model:
```javascript
userSchema.plugin(findOrCreate);
```
<br />

* Configured `passport-google-OAuth20` strategy:
```javascript
// Add passport-google-OAuth20 strategy configuration:
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets',

  },
  function(accessToken, refreshToken, profile, cb) {
    const id = profile.id;
    const userEmail = profile.emails[0].value;
    User.findOrCreate({ username: userEmail, googleId: id },
      (err, user) => {
      return cb(err, user);
    })
  }
))
```
<br />

* Added a `googleId` field to the `userSchema`:
```javascript
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String
})
```
<br />

* Created Google 'Sign Up' and 'Sign In' buttons to make `GET` requests on the `/auth/google` route:
* Handled `GET` requests made on the `/auth/google` route:
```javascript
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email'] }));
```
<br />

* Handled `GET` requests made on the authorized redirect route `/auth/google/secrets`:
```javascript
app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/secrets');
  });
```
<br />

* Modified passport-local configurations and updated the methods of serialize and deserialize users to make them compatible with all OAuth strategies:
```javascript
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
```
<br />

* Modified styles of the login button using [bootstrap-social](https://lipis.github.io/bootstrap-social/) stylesheets.
* Similary, created Facebook Sign-in authentication using `passport-facebook` module, with the help of its [official documentation page](https://www.passportjs.org/packages/passport-facebook/). Created a Test App in [Facebook Developers Console](https://developers.facebook.com) to test the authentication.
* Fixed the back button issue by adding the following code to the handler function of the `GET` requests made on the `/secrets` route:
```javascript
res.set('Cache-Control', 'no-store');
```
<br />

### Finishing Up the App:
* Created a new 'secrets' field inside our `userSchema` to store the secrets.
```javascript
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  secrets: [{secret: String}]
})
```
<br />

* Handled `GET` requests made on the `/submit` route:
```javascript
app.get('/submit', (req, res) => {
  res.set('Cache-Control', 'no-store');
  if(req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/login');
  }
})
```
<br />

* Handled `POST` requests made on the `/submit` route:
```javascript
app.post('/submit',(req, res) => {
  User.findOne({ _id: req.user._id}, (err, user) => {
    if(err) {
      console.log(err);
    } else {
      if(user) {
        user.secrets.push({secret: req.body.secret});
        user.save(() => {
          res.redirect('/secrets')
        });
      }
    }
  })
})
```
<br />

* Updated the template code inside `secrets.ejs` file:
```html
<% users.forEach(user => { %>
  <% user.secrets.forEach(secret => { %>
    <p class="secret-text"><%= secret.secret %></p>
  <% }) %>
<% }) %>
```
<br />

* Modified handler of `GET` requests made on the `/secrets` route:
```javascript
app.get('/secrets', (req, res) => {
  res.set('Cache-Control', 'no-store');
  if(req.isAuthenticated()) {
    User.find({'secret': {$ne: null}}, (err, users) => {
      if(err) {
        console.log(err);
      } else {
        if (users) {
          res.render('secrets', {users: users});
        }
      }
    })
  } else {
    res.redirect('/login');
  }
})
```
<br />

* Finally, created a `Procfile`, replaced all `localhost:3000` links with the live deployment URIs in both the server code as well as in Google and Facebook's Developers Console, and made all other necessary changes to prepare the codebase for deployment via Heroku server.
