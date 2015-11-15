
var daemon = require('./util/daemon')
var check = require('./check')

module.exports = function (sockpath, fWorker, callback)
{
	if (daemon.is())
	{
		callback = null

		var run = require('./run')

		run(sockpath, fWorker)
	}
	else check(sockpath, function (error)
	{
		var attach = require('./attach')

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
