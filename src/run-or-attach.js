

var check = require('./check')
var attach = require('./attach')

// workerfn
module.exports = function (sockpath, callback)
{
	check(sockpath, function (error)
	{
		if (error)
		{
			if (error.code === 'ENOENT')
			{
				var daemon = require('./util/daemon')

				var child = daemon()

				if (daemon.is())
				{
					var run = require('./run')
					callback = null

					run(sockpath)
				}
				else
				{
					child.on('message', function (data)
					{
						if (data === 'RUN_OR_ATTACH_READY')
						{
							return attach(sockpath, callback)
						}
					})
				}
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
