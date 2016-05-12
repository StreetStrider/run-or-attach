
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
	// eslint-disable-next-line max-len
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
	console.error(e)
	process.exit(-2)
}


var sockpath = process.env.RUN_OR_ATTACH_SOCKPATH


/* this promise is for testing */
/*
   in actual scenario this file is called by node in spawn,
   so no return value captured
*/
module.exports = new Promise((rs, rj) =>
{
	server()
	.listen(sockpath)
	.on('connection', (socket) =>
	{
		socket = socketUp(socket)

		Flow(socket, worker)
	})
	.on('listening', (error) =>
	{
		if (error) return

		worker.init()

		// process.on('SIGINT', teardown)
		process.on('SIGINT', process.exit)
		process.on('exit', teardown)

		function teardown ()
		{
			rm(sockpath)
			worker.down()
		}

		rs()
	})
	.on('error', rj)
})
