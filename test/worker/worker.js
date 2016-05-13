
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

			rs()
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
	})
})
