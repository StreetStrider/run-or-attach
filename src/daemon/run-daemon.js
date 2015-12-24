
if (process.env.RUN_OR_ATTACH_DEBUG)
{
	require('console-ultimate/global').replace()
}


var daemon = require('./daemon')
var server = require('net').createServer
var rm = require('fs').unlinkSync

var Flow = require('../flow/flow')
var socketUp = require('../util/socket-up')


if (! daemon.is())
{
	console.error('must be started in daemon environment (workerpath and sockpath must be present)')
	process.exit(-1)
}


try
{
	var workerpath = process.env.RUN_OR_ATTACH_WORKERPATH
	var worker = require(workerpath)
}
catch (e)
{
	console.error('worker `%s` not found', workerpath)
	process.exit(-2)
}


var sockpath = process.env.RUN_OR_ATTACH_SOCKPATH


server()
.listen(sockpath)
.on('connection', function (socket)
{
	socket = socketUp(socket)

	var flow = Flow(socket, worker)
})
.on('listening', function (error)
{
	if (error) return

	worker.init()

	// process.on('SIGINT', teardown)
	process.on('SIGINT', process.exit)
	process.on('exit', teardown)

	function teardown (args)
	{
		rm(sockpath)
		worker.down()
	}

	//process.send('RUN_OR_ATTACH_READY')
})
