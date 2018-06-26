var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var HopitalSchema = mongoose.Schema({
	hopital_name: {
		type: String,
		index:true
	},
	blood_qty: {
		type: String
	},
	email: {
		type: String
	},
	address: {
		type: String
    },
    
    number : {
		type: String
	},

	position: {
		type: String
	},


});

var Hopital = module.exports = mongoose.model('Hopital', HopitalSchema);

module.exports.createHopital = function(newHopital, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newHopital.password, salt, function(err, hash) {
	        newHopital.password = hash;
	        newHopital.save(callback);
	    });
	});
}

module.exports.getHopitalByHopitalname = function(hopitalname, callback){
	var query = {hopitalname: hopitalname};
	Hopital.findOne(query, callback);
}

module.exports.getHopitalById = function(id, callback){
	Hopital.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}