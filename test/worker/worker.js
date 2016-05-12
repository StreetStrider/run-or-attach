
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

var Worker = require('../../worker')
var worker = module.exports = Worker()

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

	it('conn() provides Flow interface', () =>
	{
		worker.init = () =>
		{
			process.title = 'test-run-or-attach'
		}

		return new Promise(rs =>
		{
			worker.conn = (flow) =>
			{
				expect(flow).an('function')

				// expect(flow.recv).a('function')
				expect(flow.request).a('function')
				expect(flow.socket).an('object')
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
	})

	it('dscn()', () =>
	{

	})
})
