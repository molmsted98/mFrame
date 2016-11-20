/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
const multer = require('multer');
const upload = multer({
    dest: path.join(__dirname, 'public/uploads')
});

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({
    path: '.env.example'
});

/**
 * Controllers (route handlers).
 */
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const demoController = require('./controllers/demo');
const uploadController = require('./controllers/upload');
const apiController = require('./controllers/api');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('connected', () => {
    console.log('%s MongoDB connection established!', chalk.green('✓'));
});
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    if (req.path === '/api/upload' || req.path === '/upload' || req.path === '/' || req.path === '/getPosts/:userId') {
        next();
    } else {
        lusca.csrf()(req, res, next);
    }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(function(req, res, next) {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    }
    next();
});
app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: 31557600000
}));

/**
 * Primary app routes.
 */
app.get('/', homeController.getUsers);
app.post('/', homeController.getUsers);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);
app.get('/demo', demoController.index);
app.get('/upload', passportConfig.isAuthenticated, uploadController.index);
app.get('/userProfile/:userId', userController.getProfile);
app.get('/followUser/:userId', passportConfig.isAuthenticated, userController.followUser);
app.get('/unfollowUser/:userId', passportConfig.isAuthenticated, userController.unfollowUser);
app.get('/getFollowing', passportConfig.isAuthenticated, userController.getFollowing);
app.get('/gifTest', demoController.gifTest);
app.get('/moveTest', demoController.moveTest);
app.post('/upload', passportConfig.isAuthenticated, upload.single('myFile'), uploadController.postUpload);
app.put('/getPosts/:userId', passportConfig.isAuthenticated, userController.followUser);
app.get('/:userId/followers', userController.showFollowers);

/**
 * API routes.
 */
app.get('/api/users/:userId/posts', userController.getPosts);
app.get('/api/users/:userId/following', userController.getFollowing);
app.get('/api/users/:userId/followers', apiController.getFollowers);
app.post('/api/users/:userId/follow', passportConfig.isAuthenticated, userController.followUser);
app.post('/api/users/:userId/unfollow', passportConfig.isAuthenticated, userController.unfollowUser);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_location']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});
app.get('/auth/google', passport.authenticate('google', {
    scope: 'profile email'
}));
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
    console.log('%s Express server listening on port %d in %s mode.', chalk.green('✓'), app.get('port'), app.get('env'));
});

module.exports = app;
