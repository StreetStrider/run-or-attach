
var expect = require('chai').expect

var Worker = require('../../worker')
var worker = module.exports = Worker()

describe('worker', () =>
{
	it('handlers', () =>
	{
		[
			'init',
			'conn',
			'dscn',
			'recv',
			'down'
		]
		.forEach(it => expect(worker[it]).a('function'))

		worker.init = () =>
		{
			process.title = 'test-run-or-attach'
		}
	})
})
