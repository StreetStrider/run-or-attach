
var expect = require('chai').expect

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

		worker.conn = (flow) =>
		{
			expect(flow).an('object')

			expect(flow.recv).a('function')
			expect(flow.request).a('function')
			expect(flow.socket).an('object')
		}

		return global.run
	})
})
