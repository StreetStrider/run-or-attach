
var spawn = require('child_process').spawn

var daemon = module.exports = function (sockpath, workerpath)
{
	var opts =
	{
		//stdio: !! process.env.RUN_OR_ATTACH_DEBUG ? 'inherit' : 'ignore',
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

	setTimeout(function ()
	{
		child.emit('daemon-ready')
	}, 2000)

	return child
}

daemon.is = function ()
{
	return (
		(!! process.env.RUN_OR_ATTACH_WORKERPATH)
		&&
		(!! process.env.RUN_OR_ATTACH_SOCKPATH)
	)
}
