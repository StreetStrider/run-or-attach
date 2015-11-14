
var dump = JSON.stringify
var load = JSON.parse

var Next = require('../util/next-id')

module.exports = function Flow (socket)
{
	var next = Next()

	function flow (data)
	{
		var msg = { data: data, id: next() }

		var str = dump(msg)

		socket.write(str)
	}

	flow.recv = null

	socket.on('data', function (str)
	{
		if (typeof flow.recv === 'function')
		{
			var msg = load(str)

			var data = msg.data

			flow.recv(data)
		}
	})

	flow.socket = socket

	return flow
}
