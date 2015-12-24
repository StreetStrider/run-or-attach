
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

	0 && child.on('message', function (data)
	{
		if (data === 'RUN_OR_ATTACH_READY')
		{
			child.emit('daemon-ready')
		}
	})

	0 && setTimeout(function ()
	{
		child.emit('daemon-ready')
	}, 2000)

	return loop()

	function loop ()
	{
		console.info('loop')
		return check(sockpath)
		.catch(function (error)
		{
			console.warn(error)
			if (error.code === 'ENOENT')
			{
				return delay(100, loop)
			}
		})
	}

	function delay (timeout, fn)
	{
		return new Promise((rs) => setTimeout(rs, timeout)).then(fn)
	}

	return new Promise(function (rs, rj)
	{
		console.dir(child)

		child.stdout.on('data', function (data)
		{
			console.log('*'); console.dir(data)

			if (data === 'RUN_OR_ATTACH_READY')
			{
				rs(sockpath)
			}
		})
	})
}

daemon.is = function ()
{
	return (
		(!! process.env.RUN_OR_ATTACH_WORKERPATH)
		&&
		(!! process.env.RUN_OR_ATTACH_SOCKPATH)
	)
}
