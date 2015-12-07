
var Socket  = require('net').Socket
var Flow = require('./flow/flow')
var socketUp = require('./util/socket-up')

module.exports = function (socket)
{
	return new Promise(function (rs, rj)
	{
		if (! (socket instanceof Socket))
		{
			var connect = require('net').connect

			socket = connect(socket, function ()
			{
				socket = socketUp(socket)
				ok(socket)
			})
		}
		else
		{
			ok(socket)
		}

		socket.once('error', rj)

		function ok (socket)
		{
			var flow = Flow(socket)

			return rs(flow)
		}
	})
}
