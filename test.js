
require('console-ultimate/global').replace()

var attach = require('./src/run-or-attach')

attach('/tmp/sock', function (error, socket)
{
	console.info('test', error, !! socket)

	if (socket)
	{
		var next = require('./src/util/next-id')()

		socket.write(JSON.stringify({ x: Math.random(), id: next() }))
		socket.on('data', function (data)
		{
			console.log('recv')
			console.dir(data)
		})
	}
})
