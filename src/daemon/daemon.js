
var fork = require('child_process').fork

var daemon = module.exports = function (sockpath, workerpath)
{
	var opts =
	{
		// stdio: 'ignore',
		// stdio: [ 'ignore', process.stdout, process.stderr ],
		silent: ! process.env.RUN_OR_ATTACH_DEBUG,
		detached: true,
		env:
		{
			RUN_OR_ATTACH_WORKERPATH: workerpath,
			RUN_OR_ATTACH_SOCKPATH: sockpath,
			RUN_OR_ATTACH_DEBUG: process.env.RUN_OR_ATTACH_DEBUG
		}
	}

	var child = fork(require.resolve('./run-daemon.js'), opts)

	child.unref()

	child.on('message', function (data)
	{
		if (data === 'RUN_OR_ATTACH_READY')
		{
			child.emit('daemon-ready')
		}
	})

	return child
}

daemon.is = function ()
{
	return (
		(!! process.send)
		&&
		(!! process.env.RUN_OR_ATTACH_WORKERPATH)
		&&
		(!! process.env.RUN_OR_ATTACH_SOCKPATH)
	)
}
