
var fs = require('fs-sync')
var expect = require('chai').expect

var sockpath = '/tmp/run-or-attach-test'

var attach = require('../')

describe('run-or-attach', () =>
{
	before(() =>
	{
		fs.remove(sockpath)
	})

	it('exports correct function', () =>
	{
		expect(attach).a('function')

		var source = String(attach)

		expect(attach.length).equal(2)
		expect(source).contains('(sockpath')
		expect(source).contains('workerpath)')
	})

	it('works', () =>
	{

		return attach(sockpath, require.resolve('./worker.test'))
		.then((flow) =>
		{
			flow([ 'quit' ])

			return waitfor('quit', flow)
		})
		.then(delay)
		.then(() =>
		{
			expect(fs.exists(sockpath)).false
		})
	})

	after(() =>
	{
		fs.remove(sockpath)
	})
})

function waitfor (token, flow)
{
	var prev_recv = flow.recv

	var r = new Promise(rs =>
	{
		flow.recv = (data) =>
		{
			if (data === token)
			{
				rs()
			}
		}
	})

	r = timeout(r)

	r.then(data =>
	{
		flow.recv = prev_recv

		return data
	})

	r.catch(error =>
	{
		flow.recv = prev_recv

		console.log(error)

		throw error
	})

	return r
}

function timeout (promise)
{
	return Promise.race(
	[
		promise,
		new Promise((rs, rj) => { setTimeout(() => rj(new Error('timeout')), 1.5 * 1000) })
	])
}

function delay ()
{
	return new Promise(rs => setTimeout(() => rs(), 0.25 * 1000))
}
