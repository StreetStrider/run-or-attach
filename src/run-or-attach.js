

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

				daemon()

				var run = require('./run')

				/*if (daemon.is())
				{
					return callback()
				}*/

				run(sockpath, function ()
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
			return attach(sockpath, callback)
		}
	})
}
