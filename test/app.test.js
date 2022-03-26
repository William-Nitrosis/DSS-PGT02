//var chai = require('chai');
const { assert } = require('chai');  // Using Assert style
//const { expect, use } = require('chai');  // Creates local variables `expect` and `use`; useful for plugin use
var test1 = 1;


describe('Testing testing', function() {
	it("Testing first test", function(){
		assert.equal(test1, 1);
	});
});