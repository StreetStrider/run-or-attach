
require('console-ultimate/global').replace()

// eslint-disable-next-line id-length
process.env.RUN_OR_ATTACH_DEBUG = true


var attach = require('./src/run-or-attach')

attach('/tmp/sock', require.resolve('./test-worker'))
.then((flow) =>
{
	flow.request({ sqr: 2 })
	.then((r) =>
	{
		console.info('request:')
		console.dir(r)
	})
	.catch((error) =>
	{
		console.error('request error:', error)
	})

	flow({ inc: Math.random() })
	flow.recv = (data) =>
	{
		console.info('recv:')
		console.dir(data)

		if (data.realtime === 10)
		{
			console.info('done')
			process.exit()
		}
	}
}
, console.error)
