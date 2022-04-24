const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const { authenticator } = require('otplib')
const QRCode = require('qrcode')
var captchaLib = require("nodejs-captcha");
var captchaValue = null;
var validator = require('validator');

// Login handle
router.get('/login',(req,res)=>{
	var captcha = captchaLib();
	captchaValue = captcha.value
	
    res.render('login', {
		captchaSource: captcha.image
	});
})

// Register handle
router.get('/register',(req,res)=>{
	var captcha = captchaLib();
	captchaValue = captcha.value
	
    res.render('register', {
		captchaSource: captcha.image
	})
})

// Register 2FA handle
router.get('/sign-up-2fa', (req, res) => {
  if (!req.session.qr) {
    return res.redirect('/')
  }

  return res.render('signup-2fa.ejs', { qr: req.session.qr })
})

// Register 2FA post handle
router.post('/sign-up-2fa', (req, res) => {
	req.session.email = validator.normalizeEmail(req.session.email); // cleans and validates email from session
	if (!req.session.email) {
		return res.redirect('/')
	}

	const sessionEmail = req.session.email
	code = validator.escape(req.body.code);
	
	console.log(code)
	console.log(sessionEmail)
	
	async function findSecret(){
		const userquery = await User.findOne({ 'email': sessionEmail }, 'secret').exec();
		var qrSecret = userquery.secret;
		console.log('%s', qrSecret);
		
		if (authenticator.check(code, qrSecret)) {
		passport.authenticate('local',{
			successRedirect : '/dashboard',
			failureRedirect: '/users/login',
			failureFlash : true
		})
		(req,res)
		}		
	}

	findSecret();
	
})



// Login post handle
router.post('/login',(req,res,next)=>{
	var {captchaInput} = req.body;
	captchaInput = validator.escape(captchaInput);
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

// Register post handle
router.post('/register',(req,res)=>{
    var {name, email, password, password2, captchaInput} = req.body;
	name = validator.escape(name);
	email = validator.escape(email);
	password = validator.escape(password);
	password2 = validator.escape(password2);
	captchaInput = validator.escape(captchaInput);
	
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
	
	// check if there were any errors
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
        // validation passed
		User.findOne({email : email}).exec((err,user)=>{
			console.log(user);
			if(user) {
				errors.push({msg: 'email already registered'});
				res.render('register',{errors,name,email,password,password2})  
			} else {
				secret = authenticator.generateSecret()
				const newUser = new User({
					name : name,
					email : email,
					password : password,
					secret : secret
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
							
							//generate qr and put it in session
							QRCode.toDataURL(authenticator.keyuri(email, '2FA Node App', secret), (err, url) => {
								if (err) {
									throw err
								}
								
								req.session.qr = url
								req.session.email = email
								res.redirect('/users/sign-up-2fa')
							})
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