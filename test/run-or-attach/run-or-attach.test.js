
var fs = require('fs-sync')
var expect = require('chai').expect

var sockpath = '/tmp/run-or-attach-test'
var workerpath = require.resolve('./worker')

var attach = require('../../')
var attach_dry = require('../../src/attach')

var util = require('../_util')
var waitfor = util.waitfor
var delay = util.delay

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
		.then(() =>
		{
			// dry re-attach
			return attach_dry(sockpath)
		})
		.then((flow) =>
		{
			flow([ 'quit' ])

			return waitfor('quit', flow)
		})
		.then(() =>
		{
			return delay(100)
		})
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
			.then(() =>
			{
				flow.socket.end()
			})
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

	it('works by requests', () =>
	{
		return attach(sockpath, workerpath)
		.then((flow) =>
		{
			return flow.request([ 'plus', 13, 17 ])
			.then(data =>
			{
				expect(data[0]).equal('plus-r')
				expect(data[1]).equal(30)

				return flow
			})
		})
		.then(flow =>
		{
			return flow.request([ 'sqr', 5 ])
			.then(data =>
			{
				expect(data[0]).equal('sqr-r')
				expect(data[1]).equal(25)

				return flow
			})
		})
	})

	it('works by pure realtime', () =>
	{
		return attach(sockpath, workerpath)
		.then((flow) =>
		{
			var seq = []

			flow.recv = (data) =>
			{
				seq.push(data[0])
			}

			return waitfor(5, flow)
			.then(data =>
			{
				seq.push(data[0])

				return seq
			})
		})
		.then(seq =>
		{
			expect(seq).deep.equal([ 1, 2, 3, 4, 5 ])
		})
	})

	after(() =>
	{
		fs.remove(sockpath)
	})
})
