
var connect = require('net').connect

var Flow = require('./flow/flow')

module.exports = function (sockpath, callback)
{
	var socket = connect(sockpath, function ()
	{
		socket.setEncoding('utf-8')

		var flow = Flow(socket)

		return callback(null, flow)
	})

	socket.on('error', callback)
}
