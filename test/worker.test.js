
var Worker = require('../worker')

var worker = module.exports = Worker()

worker.init = function ()
{
	process.title = 'test-run-or-attach'
}

worker.recv = function (data)
{
	switch (data[0])
	{
	case 'quit':
		setTimeout(process.exit, 0)
		return 'quit'
		break
	}
}
