
var connect = require('net').connect

module.exports = function (sockpath, callback)
{
	var socket = connect(sockpath, function ()
	{
		socket.setEncoding('utf-8')

		// socket.on('data', {})

		return callback(null, socket)
	})

	socket.on('error', callback)
}
