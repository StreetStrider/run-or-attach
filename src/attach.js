
var Socket  = require('net').Socket
var Flow = require('./flow/flow')

module.exports = function (socket)
{
	return new Promise(function (rs, rj)
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

		socket.once('error', rj)

		function ok (socket)
		{
			var flow = Flow(socket)

			return rs(flow)
		}
	})
}
