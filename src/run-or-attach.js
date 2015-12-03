
var daemon = require('./util/daemon')
var check = require('./check')

module.exports = function (sockpath, fWorker, callback)
{
	if (daemon.is())
	{
		callback = null

		var run = require('./run')

		run(sockpath, fWorker)

		return /* daemon returns nothing, since it works in forked */
	}
	else check(sockpath, function (error, socket)
	{
		var attach = require('./attach')

		if (error)
		{
			if (error.code === 'ENOENT')
			{
				daemon().on('daemon-ready', function ()
				{
					return attach(sockpath, callback)
				})
			}
			else
			{
				return callback(error)
			}
		}
		else
		{
			return attach(socket, callback)
		}
	})
}
