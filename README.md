# Secret App
This project is a part of "The Complete 2021 Web Development Bootcamp" by The London App Brewery, instructed by Dr. Angela Yu and hosted on Udemy.

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

### 2. Experiment with 6 different levels of security:

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
* Insalled the `md5` module using `npm i md5` command and required the same in our `app.js` file:
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
* Insalled the `bcrypt` module using `npm i bcrypt` command and required the same in our `app.js` file:
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




<!-- 10. Handled the HTTP 'GET' requests made on the '/logout' route, so that the logged in users can log out:
```javascript
app.get('/logout', (req, res) => {
  res.redirect('/')
})
```
<br /> -->
