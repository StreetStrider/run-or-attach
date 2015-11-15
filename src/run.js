
var daemon = require('./util/daemon')
var server = require('net').createServer
var rm = require('fs').unlinkSync

var Flow = require('./flow/flow')

module.exports = function (sockpath, fWorker)
{
	if (! daemon.is())
	{
		return
	}

	server()
	.listen(sockpath)
	.on('connection', function (socket)
	{
		socket.setEncoding('utf-8')

		var flow = Flow(socket, fWorker)
	})
	.on('listening', function (error)
	{
		if (error) return

		fWorker.init()

		// process.on('SIGINT', teardown)
		process.on('SIGINT', process.exit)
		process.on('exit', teardown)

		function teardown (args)
		{
			rm(sockpath)
			fWorker.down()
		}

		process.send('RUN_OR_ATTACH_READY')
	})
}
