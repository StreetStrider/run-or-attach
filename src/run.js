
var server = require('net').createServer
var rm = require('fs').unlinkSync

module.exports = function (sockpath, callback)
{
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
		if (error) return callback(error)

		// process.on('SIGINT', teardown)
		process.on('SIGINT', process.exit)
		process.on('exit', teardown)

		function teardown (args)
		{
			console.info('teardown')
			rm(sockpath)
		}

		return callback()
	})
}
