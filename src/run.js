
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
	.on('connection', function (socket)
	{
		socket.setEncoding('utf-8')

		var flow = Flow(socket, fWorker)
	})
	.listen(sockpath)
	.on('listening', function (error)
	{
		if (error) return

		fWorker.init()

		// process.on('SIGINT', teardown)
		process.on('SIGINT', process.exit)
		process.on('exit', teardown)

		function teardown (args)
		{
			process.env.RUN_OR_ATTACH_DEBUG && console.info('teardown')
			rm(sockpath)
		}

		process.send('RUN_OR_ATTACH_READY')
	})
}
