
var daemon = require('./util/daemon')
var server = require('net').createServer
var rm = require('fs').unlinkSync

module.exports = function (sockpath)
{
	if (! daemon.is())
	{
		return
	}

	server()
	.on('connection', function (socket)
	{
		socket.setEncoding('utf-8')

		socket.on('data', function (data)
		{
			if (data === 'alive?\n')
			{
				socket.write('yup!\n')
			}
			else
			{
				data = JSON.parse(data)

				data.x += 1

				socket.write(JSON.stringify(data))
				// pass to next handler
			}
		})
	})
	.listen(sockpath)
	.on('listening', function (error)
	{
		if (error) return

		// process.on('SIGINT', teardown)
		process.on('SIGINT', process.exit)
		process.on('exit', teardown)

		function teardown (args)
		{
			console.info('teardown')
			rm(sockpath)
		}

		process.send('RUN_OR_ATTACH_READY')
	})
}
