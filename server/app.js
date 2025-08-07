
require('dotenv').config()
const express=require("express")
const cors=require('cors')
const ejs=require('ejs')
const dbCon=require('./app/config/dbCon')
const path=require('path')
const fs=require('fs')
const methodOverride = require('method-override');
const session = require('express-session');

dbCon()
const app=express()
app.use(cors())
// Fix CSP here
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'self' data: blob:;");
    next();
});

app.use(session({
  secret: 'myquizsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // use true if using HTTPS
}));


app.use(express.json())
app.use(express.urlencoded({extended:true}))
//method override
app.use(methodOverride('_method'));
// set ejs engine
app.set("view engine", "ejs")
app.set("views", "views")

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//routes front end 
//quiz routes
const quiz=require('./app/routes/userAnsRoutes')
app.use('/api',quiz)
//auth route
const userAuthRoues=require('./app/routes/userAuthRoutes')
app.use ('/api/user',userAuthRoues)
//admin route
const adminRoute = require('./app/routes/adminRoutes')
app.use( adminRoute)
const port=2001

app.listen(port,()=>{
    console.log("😊😀sever is running at port:",port)
})