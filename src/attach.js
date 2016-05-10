
var Socket  = require('net').Socket
var Flow = require('./flow/flow')
var socketUp = require('./util/socket-up')

module.exports = function attach (socket)
{
	return new Promise((rs, rj) =>
	{
		if (! (socket instanceof Socket))
		{
			var connect = require('net').connect

			socket = connect(socket, () =>
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
