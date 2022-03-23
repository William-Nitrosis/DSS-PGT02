const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
var captchaLib = require("nodejs-captcha");
var captchaValue = null;

//login handle
router.get('/login',(req,res)=>{
	var captcha = captchaLib();
	captchaValue = captcha.value
	
    res.render('login', {
		captchaSource: captcha.image
	});
})

//Register handle
router.get('/register',(req,res)=>{
	var captcha = captchaLib();
	captchaValue = captcha.value
	
    res.render('register', {
		captchaSource: captcha.image
	})
})

// login post handle
router.post('/login',(req,res,next)=>{
	const {captchaInput} = req.body;
	console.log('Captcha input ' + captchaInput + ' | Actual value :' + captchaValue);
	
	if (captchaInput == captchaValue) {
		passport.authenticate('local',{
			successRedirect : '/dashboard',
			failureRedirect: '/users/login',
			failureFlash : true
		})
		(req,res,next)
	} else {
		var errors = [];
		var captcha = captchaLib();
		captchaValue = captcha.value
		
		errors.push({msg : "Captcha incorrect, please try again."})
		
		res.render('login', {
			errors : errors,
			captchaSource: captcha.image
		})
		
	}
})

  //register post handle
  router.post('/register',(req,res)=>{
    const {name,email, password, password2, captchaInput} = req.body;
    let errors = [];
	
    console.log(' Name ' + name+ ' email :' + email+ ' pass:' + password);
	console.log('Captcha input ' + captchaInput + ' | Actual value :' + captchaValue);
	
    if(!name || !email || !password || !password2 || !captchaInput) {
        errors.push({msg : "Please fill in all fields"})
    }
    //check if match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
	
	// check captcha
	if (captchaInput != captchaValue) {
		errors.push({msg : "Captcha incorrect, please try again."})
	}
	
    if(errors.length > 0 ) {
		var captcha = captchaLib();
		captchaValue = captcha.value
		
		res.render('register', {
			errors : errors,
			name : name,
			email : email,
			password : password,
			password2 : password2,
			captchaSource: captcha.image
		})
     } else {
        //validation passed
       User.findOne({email : email}).exec((err,user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: 'email already registered'});
            res.render('register',{errors,name,email,password,password2})  
           } else {
            const newUser = new User({
                name : name,
                email : email,
                password : password
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
    })
//logout
router.get('/logout',(req,res)=>{
req.logout();
req.flash('success_msg','Now logged out');
res.redirect('/users/login'); 
})
module.exports  = router;