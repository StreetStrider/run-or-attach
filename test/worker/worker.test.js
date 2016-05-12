
var env = process.env

env.RUN_OR_ATTACH_WORKERPATH = require.resolve('./worker')
env.RUN_OR_ATTACH_SOCKPATH   = '/tmp/run-or-attach-worker-test'

global.run = require('../../src/daemon/run-daemon')


var spawn = require('child_process').spawn

var opts =
{
	// stdio: 'ignore',
	// detached: true,
	env:
	{
	}
}

spawn(process.argv[0], [ require.resolve('./caller.js') ], opts)
