
var spawn = require('child_process').spawn

var check = require('../check')
var noent = require('../util/noent')

var which = require('../util/which')

var daemon = module.exports = function daemon (sockpath, workerpath)
{
	var node = which(process.argv[0]) /* istanbul */

	var opts =
	{
		// stdio: !! process.env.RUN_OR_ATTACH_DEBUG ? 'inherit' : 'ignore',
		stdio: 'ignore',
		detached: true,
		env:
		{
			/* eslint-disable id-length */
			RUN_OR_ATTACH_WORKERPATH: workerpath,
			RUN_OR_ATTACH_SOCKPATH: sockpath,
			RUN_OR_ATTACH_DEBUG: process.env.RUN_OR_ATTACH_DEBUG
			/* eslint-enable */
		}
	}

	var child = spawn(
	  node,
	[ require.resolve('./run-daemon.js') ],
	  opts
	)

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
		.catch(noent(() => { return delay(100, looped(n)) }))
	}

	function delay (timeout, fn)
	{
		return new Promise((rs) => setTimeout(rs, timeout)).then(fn)
	}

	function looped (next)
	{
		return () => loop(next + 1)
	}
}

daemon.is = function is_daemon ()
{
	return (
		(!! process.env.RUN_OR_ATTACH_WORKERPATH)
		&&
		(!! process.env.RUN_OR_ATTACH_SOCKPATH)
	)
}
