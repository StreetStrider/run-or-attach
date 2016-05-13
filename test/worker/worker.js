
var expect = require('chai').expect
var spawn = require('child_process').spawn

var which = require('../../src/util/which')

var node = which(process.argv[0]) /* istanbul */
var opts =
{
	// stdio: 'ignore',
	// detached: true,
	env:
	{
	}
}

// eslint-disable-next-line no-underscore-dangle
var _test = {}

var Worker = require('../../worker')
var worker = module.exports = Worker()

worker.init = () =>
{
	process.title = 'test-run-or-attach'

	_test.init = true
}

/* cannot be tested */
/*worker.down = () =>
{
	_test.down = true
}*/

describe('worker', () =>
{
	it('have handlers', () =>
	{
		[
			'init',
			'conn',
			'dscn',
			'recv',
			'down'
		]
		.forEach(it => expect(worker[it]).a('function'))
	})

	it('connects and disconnects', () =>
	{
		return new Promise(rs =>
		{
			worker.conn = (flow) =>
			{
				expect(flow).an('function')

				// expect(flow.recv).a('function')
				expect(flow.request).a('function')
				expect(flow.socket).an('object')

				_test.conn = true
			}

			worker.dscn = () =>
			{
				_test.dscn = true
			}

			rs()
		})
		.then(() =>
		{
			/* global run */
			return run.then(() =>
			{
				return new Promise((rs, rj) =>
				{
					spawn(node, [ require.resolve('./caller.js') ], opts)
					.on('exit', rs)
					.on('error', rj)
				})
			})
		})
		.then(() =>
		{
			expect(_test.init).true
			// expect(_test.down).true /* cannot be tested */

			expect(_test.conn).true
			expect(_test.dscn).true
		})
	})

	it('sends and recieves', () =>
	{
		return new Promise(rs =>
		{
			_test.recv = []

			worker.recv = (data) =>
			{
				_test.recv.push(data)
			}

			return rs()
		})
		.then(() =>
		{
			return run
		})
		.then(() =>
		{
			return new Promise((rs, rj) =>
			{
				spawn(node, [ require.resolve('./caller.js') ], opts)
				.on('exit', rs)
				.on('error', rj)
			})
		})
		.then(() =>
		{
			expect(_test.recv).eql(
			[
				[ 'ok', 'data1' ],
				[ 'ok', 'data2' ],
				[ 'ok', 'data3' ]
			])
		})
		.then(() =>
		{
			_test.recv = []

			worker.conn = (flow) =>
			{
				flow([ 'turn', 'around' ])
			}

			worker.recv = (data) =>
			{
				_test.recv.push(data)
			}
		})
		.then(() =>
		{
			return new Promise((rs, rj) =>
			{
				spawn(node, [ require.resolve('./caller.js') ], opts)
				.on('exit', rs)
				.on('error', rj)
			})
		})
		.then(() =>
		{
			var turn = _test.recv.filter(item => item[0] === 'turn')[0]

			expect(turn[1]).equal('around_yes')
		})
	})
})
