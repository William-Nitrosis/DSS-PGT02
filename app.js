const express = require('express');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require("passport");
const path = require('path');

const app = express();
const connectDB = require('./app/database/connection');

//env config
dotenv.config({ path: 'config.env' })
const PORT = process.env.PORT || 8080

//passport config:
require('./app/config/passport')(passport);

//log requests
app.use(morgan('tiny'));

//mongoose database connection
connectDB();

//EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({ extended: true }));

//express session
app.use(session({
    secret: 'secret', // secret string used in the signing of the session ID that is stored in the cookie
    name: 'DSSid', // set a unique name to remove the default connect.sid
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
        secure: false, // only send cookie over https (cant set to on without certificate)
        sameSite: 'lax',
        maxAge: 60000*60*4 // set cookie expiry length in ms
    }
}));

app.disable('x-powered-by'); // hides what the app is powered by in the header

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.header('Access-Control-Allow-Origin', 'http://localhost:' + PORT);
    next();
});


//load assets
app.use('/CSS', express.static(path.resolve(__dirname, "assets/CSS")))
app.use('/img', express.static(path.resolve(__dirname, "assets/img")))
app.use('/js', express.static(path.resolve(__dirname, "assets/js")))

//Routes
app.use('/', require('./app/routes/index'));
app.use('/users', require('./app/routes/users'));
app.use('/posts', require('./app/routes/posts'));


app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });
