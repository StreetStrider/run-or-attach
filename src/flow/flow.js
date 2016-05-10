
var json = require('../util/json')
var dump = json.dump
var load = json.load

var Next = require('../util/next-id')

module.exports = function Flow (socket, worker)
{
	function flow (data)
	{
		var packet = { data: data }

		setTimeout(() => send(packet), 0)
	}

	function send (packet)
	{
		if (! finalized)
		{
			socket.write(dump(packet))
		}
	}

	var finalized = false

	flow.socket = socket
	var next = Next()
	var takebacks = {}

	flow.request = function request (data)
	{
		var id = next()
		var packet = { id: id, data: data }

		send(packet)

		return new Promise(rs =>
		{
			takebacks[id] = rs
		})
	}

	socket.on('data', Handler(flow, send, takebacks, !! worker))
	socket.on('end', function ()
	{
		finalized = true

		if (worker)
		{
			worker.dscn(flow)
		}
	})

	if (worker)
	{
		worker.conn(flow)
		flow.recv = worker.recv.bind(worker)
	}

	return flow
}

function Handler (flow, send, takebacks, isServer)
{
	if (isServer)
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
				flowRecv(flow, send, takebacks, str)
			}
		}
	}
	else
	{
		return function (str)
		{
			flowRecv(flow, send, takebacks, str)
		}
	}
}

function flowRecv (flow, send, takebacks, str)
{
	if (! str)
	{
		return
	}

	var packet = load(str)

	if (packet instanceof Error)
	{
		return
	}

	if ('rid' in packet)
	{
		var rid = packet.rid

		if (rid in takebacks)
		{
			takebacks[rid](packet.data)
		}
	}
	else if (typeof flow.recv === 'function')
	{
		var result = flow.recv(packet.data)

		if (result)
		{
			resolve(result).then(function (result)
			{
				var result__packet = { data: result }
				if ('id' in packet)
				{
					result__packet.rid = packet.id
				}
				send(result__packet)
			})
		}
	}
}


function resolve (value)
{
	return Promise.resolve(value).catch(function (error)
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
