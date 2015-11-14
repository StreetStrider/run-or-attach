
require('console-ultimate/global').replace()
process.env.RUN_OR_ATTACH_DEBUG = true

var attach = require('./src/run-or-attach')

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

			process.exit(0)
		})
	}
})
