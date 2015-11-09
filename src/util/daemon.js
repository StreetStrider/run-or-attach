
var spawn = require('child_process').spawn

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

	var child = spawn(process.execPath, args, opts)

	child.unref()

	return child
}

daemon.is = function ()
{
	return !! process.env.RUN_OR_ATTACH_DAEMON
}
