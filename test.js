
require('console-ultimate/global').replace()
process.env.RUN_OR_ATTACH_DEBUG = true


var attach = require('./src/run-or-attach')

attach('/tmp/sock', require.resolve('./test-worker'))
.then(function (flow)
{
	flow.request({ sqr: 2 })
	.then(function (r)
	{
		console.info('request:')
		console.dir(r)
	})
	.catch(function (error)
	{
		console.error('request error:', error)
	})

	0 && flow({ inc: Math.random() })
	flow.recv = function (data)
	{
		console.info('recv:')
		console.dir(data)
	}

	setTimeout(process.exit, 10 * 1000)
},
function (error)
{
	console.error(error)
})
