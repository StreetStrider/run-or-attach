
var spawn = require('child_process').spawn
var fork = require('child_process').fork

var daemon = module.exports = function ()
{
	var args = process.argv.slice(1)

	var opts =
	{
		// stdio: 'ignore',
		stdio: [ 'ignore', process.stdout, process.stderr ],
		detached: true,
		env:
		{
			RUN_OR_ATTACH_DAEMON: true
		}
	}

	var child = fork(args[0], args.slice(1), opts)

	child.unref()

	return child
}

daemon.is = function ()
{
	return !! process.env.RUN_OR_ATTACH_DAEMON
}
