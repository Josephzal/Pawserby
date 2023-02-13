const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users')
const animalRoutes = require('./routes/animals');
const commentRoutes = require('./routes/comments');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/pawserby', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Set up cookies
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // set expire/max age to 7 days
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        mageAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

// Authentication via passport
app.use(passport.initialize());
app.use(passport.session());
// Tell passport to use local strategy and for the local strategy, use authentication method on user model
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/animals', animalRoutes);
app.use('/animals/:id/comments', commentRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// app.use((err, req, res, next) => {
//     const { statusCode = 500} = err;
//     if(!err.message) err.message = "Oh No! Something went wrong!" 
//     if(err){
//         req.flash('error', "Page Not Found");
//         return res.redirect(`/animals`);
//     };
//     res.status(statusCode).render('error', { err });

// });

app.listen(3000, () => {
    console.log('Serving on port 3000');
});

