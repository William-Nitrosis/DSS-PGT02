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
	regenerateCaptcha();

    res.render('login', {
		captchaSource: captcha.image
	});
});

// Login post handle
router.post('/login',(req,res,next)=>{
	const {captchaInput} = req.body;
	captchaInput = validator.escape(captchaInput);
	req.body.email = validator.escape(req.body.email);
	req.body.password = validator.escape(req.body.password);
	console.log('Captcha input ' + captchaInput + ' | Actual value :' + captcha.value);
	
	if (captchaInput == captcha.value) {
		//waitRandTimeFromToMS(50, 500);
		var from = 50;
		var to = 500;
		const randTimeMS = Math.floor(Math.random() * (to - from) + from);
		console.log("...waiting a random time between " + from + " and " + to + "..." + randTimeMS);
		setTimeout(function(){
			console.log('after');
			passport.authenticate('local',{
			successRedirect : '/dashboard',
			failureRedirect: '/users/login',
			failureFlash : true
		})
		(req,res,next);
		},randTimeMS);
	} else {
		var errors = [];
		
		errors.push({msg : "Captcha incorrect, please try again."});
		
		res.render('login', {
			errors : errors,
			captchaSource: captcha.image
		});
	};
	
});



// Logout
router.get('/logout',(req,res)=>{
	req.logout();
	req.flash('success_msg','Now logged out');
	res.redirect('/users/login'); 
});



// Register handle
router.get('/register',(req,res)=>{
	regenerateCaptcha();
	
    res.render('register', {
		captchaSource: captcha.image
	})
});

// Register post handle
router.post('/register',(req,res)=>{
    var {name, email, password, password2, captchaInput} = req.body;
	name = validator.escape(name);
	email = validator.escape(email);
	password = validator.escape(password);
	password2 = validator.escape(password2);
	captchaInput = validator.escape(captchaInput);
	
    let errors = [];
	
    console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
	console.log('Captcha input ' + captchaInput + ' | Actual value :' + captcha.value);
	
	// require fields are filled
    if(!name || !email || !password || !password2 || !captchaInput) {
        errors.push({msg : "Please fill in all fields"})
    }

    // error if passwords dont match
    if(password !== password2) {
        errors.push({msg : "passwords dont match"});
    }
    
    // error if password is less than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'password atleast 6 characters'})
    }
	
	// error if captcha is incorrect
	if (captchaInput != captcha.value) {
		errors.push({msg : "Captcha incorrect, please try again."})
	}
	
	// error if user aready exists
	// if no errors save to user to database
	trySaveUsertoDB(email, errors, name, password, req, res, password2);
});



// Register 2FA handle
router.get('/sign-up-2fa', (req, res)=>{
	if (!req.session.qr) {
		return res.redirect('/')
	}

	return res.render('signup-2fa', { qr: req.session.qr })
});

// Register 2FA post handle
router.post('/sign-up-2fa', (req, res)=>{
    req.session.email = validator.normalizeEmail(req.session.email);
	if (!req.session.email) {
		return res.redirect('/')
	}

	const sessionEmail = req.session.email
	code = validator.escape(req.body.code)
	
	console.log(code)
	console.log(sessionEmail)
	
	async function authenticateQRSecret(){
		const userquery = await User.findOne({ 'email': sessionEmail }, 'secret').exec();
		var qrSecret = userquery.secret;
		console.log('%s', qrSecret);
		
		if (authenticator.check(code, qrSecret)) {
			res.redirect('/users/login');
		} else {
			res.redirect('/users/sign-up-2fa');
		}
	}

	authenticateQRSecret();
	
});





module.exports  = router;

async function trySaveUsertoDB(email, errors, name, password, req, res, password2) {
	await doesUserExistWithEmail(email).then((value) => {
		console.log(value);
		if (value === true) { errors.push({ msg: 'Email already registered' }); };
	});

	// check if no errors
	if (errors.length === 0) {
		// validation passed
		console.log("Validation Passed");
		var secret = authenticator.generateSecret();
		const newUser = new User({
			name: name,
			email: email,
			password: password,
			secret: secret
		});

		// hash password
		bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt,
			(err, hash) => {
				if (err)
					throw err;

				// save password as hash
				newUser.password = hash;

				// save user to db
				newUser.save()
					.then((value) => {
						console.log("Saved to db: " + value);
						req.flash('success_msg', 'You have now registered!');

						//generate qr and put it in session
						generateQRandRedirect2FASignup(email, secret, req, res);
					})
					.catch(value => console.log(value));
			}));
	} else {
		// errors occurred
		regenerateCaptcha();
		// clear error messages and push generic error msg for account enumeration protection
		console.log(errors);
		errors = [];
		errors.push({
			msg: 'An error occurred with your registration.\n\
			The cause of the error can be:\n\
			The username is invalid or is already taken. Select Another username.\n\
			The password is of an invalid length. Use a longer password.\n\
			Passwords do not match. Retype your passwords to ensure you entered them correctly.\n\
			The email address you entered is already registered or is invalid. Use another email address.\n\
			The captcha is invalid. Write the response for the captcha correctly.\n\
			You have not agreed to the terms of service. Make sure you agree to the terms of service and check the applicable checkbox below.\n\
			Correct any errors in registration and try again.\n\
			We do not disclose the reason why the registration failed for security reasons.'
		});

		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			password: password,
			password2: password2,
			captchaSource: captcha.image
		});
	}
}

function generateQRandRedirect2FASignup(email, secret, req, res) {
	QRCode.toDataURL(authenticator.keyuri(email, '2FA Node App', secret), (err, url) => {
		if (err)
			throw err;

		req.session.qr = url;
		req.session.email = email;
		res.redirect('/users/sign-up-2fa');
	});
}

function regenerateCaptcha() {
	captcha = captchaLib();
}

function waitRandTimeFromToMS(from, to) {
	const randTimeMS = Math.floor(Math.random() * (to - from) + from);
	console.log("...waiting a random time between " + from + " and " + to + "..."+randTimeMS);
	setTimeout(function(){
		console.log('after');
	},randTimeMS);
}

async function doesUserExistWithEmail(email){
	const user = await User.findOne({ 'email': email }).exec();
	if (user) {
		console.log('Email already registered: ' + user);
		return true;
	} else {
		return false;
	}
}
