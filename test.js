
require('console-ultimate/global').replace()
process.env.RUN_OR_ATTACH_DEBUG = true

var attach = require('./src/run-or-attach')

attach('/tmp/sock', serverfn, function (error, flow)
{
	if (error)
	{
		console.error(error)
	}
	else
	{
		flow({ x: Math.random() })
		flow.recv = function (data)
		{
			console.dir(data)

			process.exit(0)
		}
	}
})

function serverfn (data)
{
	data.x += 1
	return data
}
