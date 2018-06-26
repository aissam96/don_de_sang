var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Hopital = require('../models/hopital');


// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

// Register User
router.post('/register', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var fName = req.body.firstName;
	var lName = req.body.lastName;
	var email = req.body.email;
	var num = req.body.number;
	var city = req.body.city;

	// Validation
	req.checkBody('email', 'entrez votre Email').notEmpty();
	req.checkBody('email', 'Email invalide').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'vérifier la confirmation').equals(req.body.password);
	req.checkBody('password', 'mot de passe manquant is required').notEmpty();
	req.checkBody('firstName', 'entrez votre prenom').notEmpty();
	req.checkBody('lastName', 'entrez votre nom ').notEmpty();
	req.checkBody('number', 'entrez votre numero de tel ').notEmpty();
	

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {

					var newUser = new User({
						username: username,
						password: password,
						email: email,
						firstName : fName,
						lastName : lName,
						number : num ,
						sang : "",
						city : "",
						donate: "false",
						hospital: ""

				

					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'Vous êtes inscrit avec succés ! ');
					res.redirect('/users/login');
				}
			});
		});
	}
});

//passport sett


passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Utilisateur Inconnu' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Mot de passe invalide' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

//login

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
		
	});

//don
router.post('/don',function(req,res){
	res.render("don")
});

router.post('/modifier',function(req,res){
	res.render("modifier")
});

//Donate
router.post('/donate',function (req, res) {

	
	var usname = req.user.username
	var ddblood = req.body.dblood
	var ddcity = req.body.dcity
	var ddhospital = req.body.dhospital
	var  query= {username : usname }
	var update = {
		donate : "true" , sang : ddblood , city : ddcity , hospital : ddhospital
		   }
		   User.findOneAndUpdate(query,update,function(error,result){
			if(error){
			  // handle error
			}else{
			  res.render("index")
			}
		  });
	});

//Donate
router.post('/supprimer',function (req, res) {

	
	var usname = req.user.username
	var  query= {username : usname }
	var update = {
		donate : "false"  
		   }
		   User.findOneAndUpdate(query,update,function(error,result){
			if(error){
			  // handle error
			}else{
			  res.render("index")
			}
		  });
	});

		
	//logout

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'Vous êtes déconnecté');

	res.redirect('/users/login');
});






//hopital
router.post('/hopital',function (req, res) {

	res.render("hopital")
	Hopital.find({hopitalname : ""},function(err, hcontent){
		res.render("hopital",{ title: '', hcontents: hcontent })
		console.log(hcontent)
	})
});


  /* GET home page. */
router.post('/search', function(req, res, next) {
var typo = req.body.typ ;
var villa = req.body.villa ;
console.log(villa + typo)
if (typo == null || villa== null){
	if (typo == null && villa != null){
	User.find({donate : "true",city : villa},function(err, content) {		
		res.render('Search', { title: '', contents: content });
		console.log(content)
	 }) 
}else if (typo != null && villa== null){
	User.find({donate : "true" , sang : typo },function(err, content) {		
		res.render('Search', { title: '', contents: content });
		console.log(content)
	 }) 
	
 }
else{
	User.find({donate : "true" },function(err, content) {		
		res.render('Search', { title: '', contents: content });
		console.log(content)
	 })
}
}else{
	
	User.find({donate : "true",city : villa , sang : typo },function(err, content) {		
		res.render('Search', { title: '', contents: content });
		console.log(content)
	 }) 
 }
});


router.get('/search', function (req, res) {
	res.render('Search');
});

function test() {
console.log('rrr')
}


module.exports = router;