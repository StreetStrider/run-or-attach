
var expect = require('chai').expect

var attach = require('../')

describe('run-or-attach', () =>
{
	it('exports correct function', () =>
	{
		expect(attach).a('function')

		var source = String(attach)

		expect(attach.length).equal(2)
		expect(source).contains('(sockpath')
		expect(source).contains('workerpath)')
	})

})
