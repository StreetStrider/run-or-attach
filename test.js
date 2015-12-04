
require('console-ultimate/global').replace()
process.env.RUN_OR_ATTACH_DEBUG = true


var attach = require('./src/run-or-attach')

attach('/tmp/sock', require.resolve('./test-worker'))
.then(function (flow)
{
	flow({ x: Math.random() })
	flow.recv = function (data)
	{
		console.dir(data)

		process.exit(0)
	}
},
function (error)
{
	console.error(error)
})
