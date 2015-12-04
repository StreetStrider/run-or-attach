
require('console-ultimate/global').replace()
process.env.RUN_OR_ATTACH_DEBUG = true


var FWorker = require('./worker')

var worker = FWorker()

worker.init = function ()
{
	console.info('init worker')
	process.title = 'run-or-attach'
}

worker.conn = function (socket)
{
	console.info('conn to worker')
}

worker.down = function ()
{
	console.info('worker teardown')
}

worker.recv = function (data)
{
	data.x += 1;
	return new Promise((rs) => { setTimeout(() => rs(data), 100) })
}


var attach = require('./src/run-or-attach')

attach('/tmp/sock', worker)
.then(function (flow)
{
	flow({ x: Math.random() })
	flow.recv = function (data)
	{
		console.dir(data)

		process.exit(0)
	}
},
function (error)
{
	console.error(error)
})
