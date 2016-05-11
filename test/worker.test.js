
var Worker = require('../worker')

var worker = module.exports = Worker()

worker.init = () =>
{
	process.title = 'test-run-or-attach'
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
	}
}
