
var daemon = module.exports = function ()
{
	var fork = require('child_process').fork

	var args = process.argv.slice(1)

	var opts =
	{
		// stdio: 'ignore',
		// stdio: [ 'ignore', process.stdout, process.stderr ],
		silent: ! process.env.RUN_OR_ATTACH_DEBUG,
		detached: true,
		env:
		{
			RUN_OR_ATTACH_DAEMON: true,
			RUN_OR_ATTACH_DEBUG: process.env.RUN_OR_ATTACH_DEBUG
		}
	}

	var child = fork(args[0], args.slice(1), opts)

	child.unref()

	return child
}

daemon.is = function ()
{
	return process.send && (!! process.env.RUN_OR_ATTACH_DAEMON)
}
