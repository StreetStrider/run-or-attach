
var server = require('net').createServer
var rm = require('fs').unlinkSync

module.exports = function (sockpath)
{
	server()
	.listen(sockpath)
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
				// pass to next handler
			}
		})
	})

	process.on('exit', teardown)
	// process.on('SIGINT', teardown)
	process.on('SIGINT', process.exit)

	function teardown (args)
	{
		console.info('teardown')
		rm(sockpath)
	}
}
