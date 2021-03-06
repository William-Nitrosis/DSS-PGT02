var chai = require('chai'); // http://chaijs.com/api/bdd/
var expect = chai.expect; // http://chaijs.com/guide/styles/#expect
var should = require('chai').should(); // http://chaijs.com/guide/styles/#should
var assert = chai.assert; // http://chaijs.com/guide/styles/#assert

var chaiHttp = require('chai-http');
chai.use(chaiHttp);

var bcrypt = require('bcrypt'); // BCrypt docs: https://github.com/ncb000gt/node.bcrypt.js

//var app = require('../app');
//var chaiAppServer = chai.request(app).keepOpen();


var mongoose = require('mongoose');
var User = require('../app/models/user'); 


var test1 = 1;
var control = control || {}; // 'control' data in an experiment

describe('Testing Hashing', function () {
    // before each test ("it")
    beforeEach(function () {
        //runs before each test in this block
        //create some mock data to use
        //control.salt = bcrypt.genSaltSync(10);
        control.salt = '$2b$10$nOUIs5kJ7naTuTFkBy1veu';
        control.mockUsersPassword = 's0/\/\P4$$w0rD'; //s0//P4$$w0rD
        control.mockUsersPasswordHashDbEntry = '$2a$10$2mk9J/g5P3XWsUe0T.b7MOF9a.3THsQb.NcgXKToo3UZLUQapn9jm';
        control.mockIncorrectPassword = 'giggles';
    });

    // after each test ("it")
    afterEach(function () {
        //runs after each test in this block
        //reset control
        control = {};
    });

    it("Testing Comparison Return True On Correct Password", function () {
        // Load hash from your password DB.
        var hashFromDb = control.mockUsersPasswordHashDbEntry;

        // test result from db before continuing... gotta make sure that data is right
        //expect(typeof(hashFromDb)).to.equal('string');
		expect(hashFromDb).to.be.a('string');
        expect(hashFromDb.length).to.equal(60);

        // use our mock user's password to check bcrypt compareSync is returning true on correct pwd
        var comparison = bcrypt.compareSync(control.mockUsersPassword, hashFromDb); // true
        expect(comparison).to.equal(true);
    });

    it("Testing Comparison Return False On Incorrect Password", function () {
        // Load hash from your password DB.
        var hashFromDb = control.mockUsersPasswordHashDbEntry;

        // test result from db before continuing... gotta make sure that data is right
        expect(typeof(hashFromDb)).to.equal('string');
        expect(hashFromDb.length).to.equal(60);

        // use our mock incorrect password to check bcrypt compareSync is returning false on incorrect pwd
        var comparison = bcrypt.compareSync(control.mockIncorrectPassword, hashFromDb); // true
        expect(comparison).to.equal(false);
    });

    it("Testing Hashing Normal Input", function () {
        // Hash normal input
        var input = '.{.cKa9v(AtZP0G%';
        var expectedhash = '$2b$10$nOUIs5kJ7naTuTFkBy1veu1JP7yJHB5Z4VyrX.GjRI9zhOfH8Det6';
        var hash = bcrypt.hashSync(input, control.salt);

        // test result before continuing... gotta make sure that data is right
        expect(typeof(hash)).to.equal('string');
        expect(hash.length).to.equal(60);

        // check bcrypt hashSync is creating valid hash
        var comparison = bcrypt.compareSync(input, hash); // true
        expect(comparison).to.equal(true);

        // check hashSync is creating same result as pregenerated hash with same salt
        expect(hash).to.equal(expectedhash);
    });

    it("Testing No Input", function () {
        // Hash no input
        var input = '';
        var expectedhash = '$2b$10$nOUIs5kJ7naTuTFkBy1veuCcQC2ooYOFB3/EpLDBRV/hBvXR0oKwK';
        var hash = bcrypt.hashSync(input, control.salt);

        // test result before continuing... gotta make sure that data is right
        expect(typeof(hash)).to.equal('string');
        expect(hash.length).to.equal(60);

        // check bcrypt hashSync is creating valid hash
        var comparison = bcrypt.compareSync(input, hash); // true
        expect(comparison).to.equal(true);

        // check hashSync is creating same result as pregenerated hash with same salt
        expect(hash).to.equal(expectedhash);
    });

    it("Testing 1 Character Input", function () {
        // Hash 1 char input
        var input = 'a';
        var expectedhash = '$2b$10$nOUIs5kJ7naTuTFkBy1veuHx/GtpiOBBrg5KQRagAiGIlK.yvZVt.';
        var hash = bcrypt.hashSync(input, control.salt);

        // test result before continuing... gotta make sure that data is right
        expect(typeof(hash)).to.equal('string');
        expect(hash.length).to.equal(60);

        // check bcrypt hashSync is creating valid hash
        var comparison = bcrypt.compareSync(input, hash); // true
        expect(comparison).to.equal(true);

        // check hashSync is creating same result as pregenerated hash with same salt
        expect(hash).to.equal(expectedhash);
    });

    it("Testing Max Password Length", function () {
        // Hash max length input
        var input = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        var expectedhash = '$2b$10$nOUIs5kJ7naTuTFkBy1veurCBpeo1/Db5nvoyty8xVnZDUhtyUSXW';
        var hash = bcrypt.hashSync(input, control.salt);

        // test result before continuing... gotta make sure that data is right
        expect(typeof(hash)).to.equal('string');
        expect(hash.length).to.equal(60);

        // check bcrypt hashSync is creating valid hash
        var comparison = bcrypt.compareSync(input, hash); // true
        expect(comparison).to.equal(true);

        // check hashSync is creating same result as pregenerated hash with same salt
        expect(hash).to.equal(expectedhash);
    });
});

describe('Testing Salting', function () {
    // before each test ("it")
    beforeEach(function () {
        //runs before each test in this block
        //create some mock data to use
        control.salt = bcrypt.genSaltSync(10);
        control.mockUsersPassword = 's0/\/\P4$$w0rD'; //s0//P4$$w0rD
        control.mockIncorrectPassword = 'giggles';
    });

    // after each test ("it")
    afterEach(function () {
        //runs after each test in this block
        //reset control
        control = {};
    });

    it("Testing Salt Generation Gives Valid Hash", function () {
        // hash password using the bcrypt genSaltSync
        var hash = bcrypt.hashSync(control.mockUsersPassword, control.salt);

        // test result from db before continuing... gotta make sure that data is right
        expect(typeof(hash)).to.equal('string');
        expect(hash.length).to.equal(60);

        // use our mock user's password to check bcrypt compareSync is returning true on correct pwd
        var comparison = bcrypt.compareSync(control.mockUsersPassword, hash); // true
        expect(comparison).to.equal(true);
    });
});

describe.skip('Testing Encryption', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing CAPTCHA', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Google Authenticator', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Registration', function () {
 	// before each test ("it")
    beforeEach(function () {
        //runs before each test in this block
        
    });

    // after each test ("it")
    afterEach(function () {
        //runs after each test in this block

    });
	
    it("Testing Required Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Optional Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Username Validation", function () {
        assert.equal(test1, 0);
    });
    it("Testing Password Validation", function () {
        assert.equal(test1, 0);
    });
    it("Testing Blank Space Parsing", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Login', function () {
    it("Testing Required Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Username Validation", function () {
        assert.equal(test1, 0);
    });
    it("Testing Password Validation", function () {
        assert.equal(test1, 0);
    });
    it("Testing Blank Space Parsing", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Search Function', function () {
    it("Testing No Result Searches", function () {
        assert.equal(test1, 0);
    });
    it("Testing Post Searches", function () {
        assert.equal(test1, 0);
    });
    it("Testing Invalid Searches", function () {
        assert.equal(test1, 0);
    });
    it("Testing User Searches", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Add Posts', function () {
    it("Testing Missing Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Valid Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Invalid Fields", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Edit Posts', function () {
    it("Testing Missing Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Valid Fields", function () {
        assert.equal(test1, 0);
    });
    it("Testing Invalid Fields", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Delete Posts', function () {
    it("Testing Deletion", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Account Enumeration', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing Session Hijacking', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing SQL Injection', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing XSS', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    });
});

describe.skip('Testing CSRF', function () {
    it("Testing first test", function () {
        assert.equal(test1, 0);
    }) ;
});

describe.skip('Testing Webpage Interaction', function() {
	describe('/ with localhost url', function() {
		it('responds with status 200', function(done) {
			chai.request('http://localhost:3000')
			.get('/')
			.end(function(err, res) {
				expect(res).to.have.status(200);
				done();                               
			});
		});
	});
 	describe('/ with app module', function() {
		// beforeEach(function(){
			// app = require('../app')
		// });
		
		// afterEach(function(done){
			// //app.close();
			// delete require.cache[require.resolve( '../app' )];
			// done();
		// });
		
		after(function() {
			chaiAppServer.close();
		});
		
		it('responds with status 200', function(done) {
			chaiAppServer
			.get('/')
			.end(function(err, res) {
				expect(res).to.have.status(200);
				done();                               
			});
		});
	});
	
});

describe('Testing Database Interaction', function() {
	
	before(function() {
        mongoose.connect('mongodb://localhost/testsheet');
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
          console.log('We are connected to test database!');
        });
    });
	
	beforeEach(function(done) {
		mongoose.connection.collections.users.drop(function(){
			done();	
		});
	});
	
	after(function (done){
        mongoose.connection.db.dropDatabase(function(){
			mongoose.connection.close(done);
        });
    });
	
	it('allows creation of user', function(done) {
		const newUser = new User({
                name : 'test',
                email : 'test@test.com',
                password : 'password123',
                secret : 'secrettest'
        });
		newUser.save().then(function(){
			//if the newUser is saved in db and it is not new
            assert(!newUser.isNew);
            done();
		});
	});
});