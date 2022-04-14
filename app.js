const express = require('express');
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv');

const passport = require("passport");
const app = express();
const connectDB = require('./app/database/connection');

//env config
dotenv.config( { path :'config.env'} )
const PORT = process.env.PORT || 8080

//passport config:
require('./app/config/passport')(passport);

//mongoose database connection
connectDB();

//EJS
app.set('view engine','ejs');
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({extended : false}));

//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })
    
//Routes
app.use('/',require('./app/routes/index'));
app.use('/users',require('./app/routes/users'));

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
