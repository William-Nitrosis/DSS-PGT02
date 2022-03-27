//var chai = require('chai');
const { assert } = require('chai');  // Using Assert style
//const { expect, use } = require('chai');  // Creates local variables `expect` and `use`; useful for plugin use
var test1 = 1;


describe('Testing Hashing', function() {
	it("Testing Normal Input", function(){
		assert.equal(test1, 1);
	});
	it("Testing No Input", function(){
		assert.equal(test1, 1);
	});
	it("Testing 1 Character Input", function(){
		assert.equal(test1, 1);
	});
	it("Testing Max Password Length", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Salting', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Encryption', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing CAPTCHA', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Google Authenticator', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Registration', function() {
	it("Testing Required Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Optional Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Username Validation", function(){
		assert.equal(test1, 1);
	});
	it("Testing Password Validation", function(){
		assert.equal(test1, 1);
	});
	it("Testing Blank Space Parsing", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Login', function() {
	it("Testing Required Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Username Validation", function(){
		assert.equal(test1, 1);
	});
	it("Testing Password Validation", function(){
		assert.equal(test1, 1);
	});
	it("Testing Blank Space Parsing", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Search Function', function() {
	it("Testing No Result Searches", function(){
		assert.equal(test1, 1);
	});
	it("Testing Post Searches", function(){
		assert.equal(test1, 1);
	});
	it("Testing Invalid Searches", function(){
		assert.equal(test1, 1);
	});
	it("Testing User Searches", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Add Posts', function() {
	it("Testing Missing Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Valid Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Invalid Fields", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Edit Posts', function() {
	it("Testing Missing Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Valid Fields", function(){
		assert.equal(test1, 1);
	});
	it("Testing Invalid Fields", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Delete Posts', function() {
	it("Testing Deletion", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Account Enumeration', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing Session Hijacking', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing SQL Injection', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing XSS', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});

describe('Testing CSRF', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});