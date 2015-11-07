
require('console-ultimate/global').replace()

var attach = require('./src/run-or-attach')

attach('/tmp/sock', function (error, socket)
{
	console.info('test', error, !! socket)

	if (socket)
	{
		socket.write(JSON.stringify({ x: 1 }))
		socket.on('data', function (data)
		{
			console.log('recv')
			console.dir(data)
		})
	}
})
