

var check = require('./check')
var attach = require('./attach')

// workerfn

var daemon = require('./util/daemon')

module.exports = function (sockpath, callback)
{
	if (daemon.is())
	{
		process.env.RUN_OR_ATTACH_DEBUG && console.info('daemon started')

		callback = null

		var run = require('./run')

		run(sockpath)
	}
	else check(sockpath, function (error)
	{
		if (error)
		{
			if (error.code === 'ENOENT')
			{
				var child = daemon()

				child.on('message', function (data)
				{
					if (data === 'RUN_OR_ATTACH_READY')
					{
						return attach(sockpath, callback)
					}
				})
			}
			else
			{
				return callback(error)
			}
		}
		else
		{
			return attach(sockpath, callback)
		}
	})
}
