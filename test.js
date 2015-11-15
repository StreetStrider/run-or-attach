
require('console-ultimate/global').replace()
process.env.RUN_OR_ATTACH_DEBUG = true


var FWorker = require('./src/flow/worker')

var worker = FWorker()

worker.init = function ()
{
	console.info('init worker')
}

worker.conn = function ()
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

attach('/tmp/sock', worker, function (error, flow)
{
	if (error)
	{
		console.error(error)
	}
	else
	{
		flow({ x: Math.random() })
		flow.recv = function (data)
		{
			console.dir(data)

			process.exit(0)
		}
	}
})
