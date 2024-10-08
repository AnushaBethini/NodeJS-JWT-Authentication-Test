const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const { expressjwt: expressJwt } = require('express-jwt');

const port = 3000;
const secretkey = 'My super secret key';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type, Authorization');
    next();
});

const jwtMW = expressJwt({
    secret: secretkey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'Anusha',
        password: '123'
    },
    {
        id: 2,
        username: 'Bethini',
        password: '456'
    }
];

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    for (let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({ id: user.id, username: user.username }, secretkey, { expiresIn: '3m' });
            res.json({
                success: true,
                err: null,
                token: token
            });
            return;
        }
    }

    res.status(401).json({
        success: false,
        token: null,
        err: 'Username or password is incorrect!!!'
    });
});

// Protected routes
app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that  logged-in people can only see.'
    });
});

app.get('/api/prices', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'This is the price $4.99'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'This is the settings page'
    });
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler for unauthorized errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
    } else {
        next(err);
    }
});

// Start the server
app.listen(port, () => {
   
   
    console.log(`Serving on port ${port}`);
});
