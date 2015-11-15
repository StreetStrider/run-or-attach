
var dump = JSON.stringify
var load = JSON.parse

var Next = require('../util/next-id')

module.exports = function Flow (socket, serverfn)
{
	var next = Next()

	function flow (data)
	{
		var msg = { data: data, id: next() }

		var str = dump(msg)

		socket.write(str)
	}

	flow.socket = socket

	flow.recv = serverfn

	socket.on('data', Handler(flow, serverfn))

	return flow
}

function Handler (flow, serverfn)
{
	if (serverfn)
	{
		var socket = flow.socket

		return function (str)
		{
			if (str === 'alive?\n')
			{
				socket.write('yup!\n')
			}
			else
			{
				flowRecv(flow, str)
			}
		}
	}
	else
	{
		return flowRecv.bind(null, flow)
	}
}

function flowRecv (flow, str)
{
	if (typeof flow.recv === 'function')
	{
		var msg = load(str)

		var data = msg.data

		var result = flow.recv(data)

		if (result)
		{
			resolve(result).then(flow)
		}
	}
}


var P = Promise.resolve

function resolve (value)
{
	return P(value).catch(function (error)
	{
		if (error instanceof Error)
		{
			return error
		}
		else
		{
			return new Error(error)
		}
	})
}
