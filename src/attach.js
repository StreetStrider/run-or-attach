
var Socket  = require('net').Socket
var Flow = require('./flow/flow')

module.exports = function (socket, callback)
{
	if (! (socket instanceof Socket))
	{
		var connect = require('net').connect

		socket = connect(socket, function ()
		{
			socket.setEncoding('utf-8')

			ok(socket)
		})
	}
	else
	{
		ok(socket)
	}

	socket.once('error', callback)

	function ok (socket)
	{
		var flow = Flow(socket)

		return callback(null, flow)
	}
}
