const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser =require("body-parser");
const path = require('path');


const app = express();

dotenv.config( { path :'config.env'} )
const PORT = process.env.PORT || 8080

const connectDB = require('./server/database/connection');

//log requests
app.use(morgan('tiny'));

//db connection calling

connectDB();

//pasrse request to body parser
app.use(bodyparser.urlencoded({extended:true}))

//set view engine
app.set("view engine", "ejs")

//load assets
app.use('/CSS',express.static(path.resolve(__dirname,"assets/CSS")))
app.use('/img',express.static(path.resolve(__dirname,"assets/img")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))

app.get('/',(req,res)=>{
  res.render('index.ejs');
})

//load routers

app.use('/',require('./server/routes/router'))

app.listen(PORT, ()=> { console.log(`Server is running on http://localhost:${PORT}`)});
