# Secret App
This project is a part of "The Complete 2021 Web Development Bootcamp" by The London App Brewery, instructed by Dr. Angela Yu and hosted on Udemy.

## Objective of this Project:
- To create an app where the registered users can share secrets anonymously.
- To restrict access to the secrets by all the non-registered users.
- To add authentication to the app so that individual users would sign up with a username and password.
- To enable users to log into the app using their username and password to access to the secrets.

## Steps I have followed
1. Created a dedicated directory for the project and initialised NPM inside that directory using `npm init -y` command from the terminal.
2. Used `npm i express body-parser ejs` command to install these dependencies for our project.
3. Initialized the server with the following code:
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

4. Initialized a local git repository with `git init` command.
5. Created a .gitignore file to prevent all the unwanted files from being tracked:
```
node_modules/
npm-debug.log
.DS_Store
.env
```

6. Changed the default branch to `main` using `git branch -M main` command and linked to this remote github repository using `git remote add origin` command.
