const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const { authenticator } = require('otplib')
const QRCode = require('qrcode')
var captchaLib = require("nodejs-captcha");

var captcha = null;


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
	console.log('Captcha input ' + captchaInput + ' | Actual value :' + captcha.value);
	
	if (captchaInput == captcha.value) {
		passport.authenticate('local',{
			successRedirect : '/dashboard',
			failureRedirect: '/users/login',
			failureFlash : true
		})
		(req,res,next);
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
    const {name, email, password, password2, captchaInput} = req.body;
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
	if (!req.session.email) {
		return res.redirect('/')
	}

	const sessionEmail = req.session.email
	code = req.body.code
	
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
	
});





module.exports  = router;

function regenerateCaptcha() {
	captcha = captchaLib();
}
