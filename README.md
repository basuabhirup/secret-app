# Secret App
This project is a part of "The Complete 2021 Web Development Bootcamp" by The London App Brewery, instructed by Dr. Angela Yu and hosted on Udemy.

## Objective of this Project:
- To create an app where the registered users can share secrets anonymously.
- To restrict access to the secrets by all the non-registered users.
- To add authentication to the app so that individual users would sign up with a username and password.
- To enable users to log into the app using their username and password to access to the secrets.

## Steps I have followed:
1. Created a dedicated directory for the project and initialised NPM inside that directory using `npm init -y` command from the terminal.
2. Used `npm i express body-parser ejs` command to install these dependencies for our project.
3. Initialized the server with the following code inside the `app.js` file:
```javascript
// Requiring necessary NPM modules:
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

// Assign a port for localhost as well as final deployement:
const port = process.env.PORT || 3000;

// Initial setup for the server:
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));



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
5. Created a .gitignore file to prevent all the unwanted files from being tracked:
```
node_modules/
npm-debug.log
.DS_Store
.env
```
<br />
6. Changed the default branch to `main` using `git branch -M main` command and linked to this remote github repository using `git remote add origin` command.
7. Installed `mongoose` and `dotenv` modules using `npm i mongoose dotenv` command.
8. Required these newly installed dependencies from the `app.js` file:
```javascript
// Requiring necessary NPM modules:
require('dotenv').config();
const mongoose = require('mongoose');
```
<br />
9. Created a `.env` file to store all the encryption keys / database passwords as environment variables and made sure that the `.env` file is not being tracked by git.:
```
DB_USER=my_user_name
DB_PASS=Abc123xyz789
```
<br />
10. Connected the server to a new database named `userDB` in MongoDB Atlas Cluster, using Mongoose ODM:
```javascript
// Connect to a new MongoDB Database, using Mongoose ODM:
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m5s9h.mongodb.net/userDB`);
```
<br />
11. Created a new collection named `users` inside `userDB` to store the emails and passwords of all the users:
```javascript
// Create a new collection named 'users' to store the emails and passwords of the users:
const userSchema = new mongoose.Schema({
  email: String,
  password: String
})
const User = new mongoose.model('User', userSchema);
```
<br />
