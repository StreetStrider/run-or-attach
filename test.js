
require('console-ultimate/global').replace()

var attach = require('./src/run-or-attach')

var daemon = require('./src/util/daemon')

process.env.RUN_OR_ATTACH_DEBUG = true

attach('/tmp/sock', function (error, socket)
{
	if (error)
	{
		console.error(error)
	}
	else
	{
		var next = require('./src/util/next-id')()

		socket.write(JSON.stringify({ x: Math.random(), id: next() }))
		socket.on('data', function (data)
		{
			console.dir(data)
		})
	}
})
