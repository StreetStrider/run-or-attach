
var Worker = require('../../worker')

var delay = require('../_util').delay


var worker = module.exports = Worker()

worker.init = () =>
{
	process.title = 'test-run-or-attach'
}

worker.conn = (flow) =>
{
	var seq = [ 1, 2, 3, 4, 5 ]

	delay().then(loop)

	function loop ()
	{
		if (seq.length)
		{
			var head = seq[0]

			flow([ head ])

			seq = seq.slice(1)

			delay().then(loop)
		}
	}
}

worker.recv = (data) =>
{
	switch (data[0])
	{
	case 'quit':
		setTimeout(process.exit, 0)
		return [ 'quit' ]

	case 'plus':
		return [ 'plus-r', data[1] + data[2] ]

	case 'sqr':
		return new Promise(rs =>
		{
			setTimeout(() =>
			{
				rs([ 'sqr-r', data[1] * data[1] ])
			}
			, 100)
		})

	default:
		return Promise.reject(new Error)
	}
}
