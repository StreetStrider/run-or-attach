
var server = require('net').createServer

module.exports = function (sockpath)
{
	server()
	.listen(sockpath)
	.on('connection', function (socket)
	{
		socket.setEncoding('utf-8')

		socket.on('data', function ()
		{
			console.log(arguments)
		})
	})
}
