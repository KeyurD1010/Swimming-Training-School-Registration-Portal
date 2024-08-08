const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const bodyparser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const connectDB = require('./server/database/connectDB');

const app = express();

//passport controler
require('./server/controller/passport')(passport);


//dotenv config
dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 8080
 


app.use(express.json());
app.use(express.urlencoded({ extended : false }));


//log request
app.use(morgan(`tiny`));



//mongoDB connection
connectDB();


//parser request to body parser
app.use(bodyparser.urlencoded({extended:true}))

//express-session midaleware
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

//passport midleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());

//Global variable
app.use((req,res,next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

// app.use(expressLayout);
//set view engine
app.set("view engine","ejs")
// app.set("views",path.resolve(__dirname,'views/ejs'));



//load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")));
app.use('/img',express.static(path.resolve(__dirname,"assets/img")));
app.use('/js',express.static(path.resolve(__dirname,"assets/js")));


//load routes
app.use('/',require('./server/routes/router'));




const static_path=path.join(__dirname,"../assets");
app.use(express.static(static_path));



app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})