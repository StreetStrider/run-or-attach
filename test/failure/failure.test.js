
var fs = require('fs-sync')
var expect = require('chai').expect

var socket = require('net').createServer

var sockpath_refuse = '/tmp/run-or-attach-test-refuse'
var sockpath_dangle = '/tmp/run-or-attach-test-dangle'

var attach = require('../../')

describe('errors', () =>
{
	before(() =>
	{
		fs.write(sockpath_refuse)
		socket().listen(sockpath_dangle)
	})

	it('connect ECONNREFUSED', () =>
	{
		return attach(sockpath_refuse)
		.then(fail, error =>
		{
			expect(error).instanceof(Error)

			expect(error.code).equal('ECONNREFUSED')
			expect(error.errno).equal('ECONNREFUSED')
			expect(error.syscall).equal('connect')
			expect(error.address).equal(sockpath_refuse)
		})
	})

	it('timeout NOT_UP_DAEMON', function ()
	{
		this.timeout(3500)

		return attach(sockpath_dangle)
		.then(fail, error =>
		{
			expect(error).instanceof(Error)

			expect(error.message).equal('timeout NOT_UP_DAEMON')
			expect(error.address).equal(sockpath_dangle)
		})
	})

	after(() =>
	{
		fs.remove(sockpath_refuse)
		fs.remove(sockpath_dangle)
	})
})

function fail ()
{
	expect(false, 'to fail').true
}
