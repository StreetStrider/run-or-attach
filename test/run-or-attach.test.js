
var fs = require('fs-sync')
var expect = require('chai').expect

var sockpath = '/tmp/run-or-attach-test'
var workerpath = require.resolve('./worker.test')

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
		return attach(sockpath, workerpath)
		.then((flow) =>
		{
			expect(fs.exists(sockpath)).true

			return flow
		})
		.then(() =>
		{
			// re-attach
			return attach(sockpath, workerpath)
		})
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
		.then(() =>
		{
			// attach after stopped
			return attach(sockpath, workerpath)
		})
		.then((flow) =>
		{
			flow([ 'quit' ])

			return waitfor('quit', flow)
		})
	})

	it('works by realtime', () =>
	{
		return attach(sockpath, workerpath)
		.then((flow) =>
		{
			flow([ 'plus', 3, 7 ])
			return waitfor('plus-r', flow)
			.then(data =>
			{
				expect(data[0]).equal('plus-r')
				expect(data[1]).equal(10)

				return flow
			})
		})
		.then((flow) =>
		{
			flow([ 'sqr', 4 ])

			return waitfor('sqr-r', flow)
			.then(data =>
			{
				expect(data[0]).equal('sqr-r')
				expect(data[1]).equal(16)
			})
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
			if (data[0] === token)
			{
				rs(data)
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
