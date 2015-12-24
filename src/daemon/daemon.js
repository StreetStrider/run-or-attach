
var spawn = require('child_process').spawn

var stream = require('stream')

var check = require('../check')


var daemon = module.exports = function (sockpath, workerpath)
{
	var capture = new stream.Transform;
	capture._transform = function (data, encoding, callback)
	{
		console.dir(data.toString())
		callback(null, data)
	}

	var opts =
	{
		// stdio: !! process.env.RUN_OR_ATTACH_DEBUG ? 'inherit' : 'ignore',
		stdio: 'ignore',
		detached: true,
		env:
		{
			RUN_OR_ATTACH_WORKERPATH: workerpath,
			RUN_OR_ATTACH_SOCKPATH: sockpath,
			RUN_OR_ATTACH_DEBUG: process.env.RUN_OR_ATTACH_DEBUG
		}
	}

	var child = spawn(process.argv[0], [ require.resolve('./run-daemon.js') ], opts)

	child.unref()

	return loop()

	function loop (n)
	{
		n || (n = 0)
		if (n == 10)
		{
			return Promise.reject('timeout NOT_UP_DAEMON')
		}

		return check(sockpath)
		.catch(function (error)
		{
			if (error.code === 'ENOENT')
			{
				return delay(100, loop.bind(null, n + 1))
			}
		})
	}

	function delay (timeout, fn)
	{
		return new Promise((rs) => setTimeout(rs, timeout)).then(fn)
	}
}

daemon.is = function ()
{
	return (
		(!! process.env.RUN_OR_ATTACH_WORKERPATH)
		&&
		(!! process.env.RUN_OR_ATTACH_SOCKPATH)
	)
}
