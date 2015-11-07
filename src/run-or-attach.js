

var check = require('./check')

// workerfn
module.exports = function (sockpath, callback)
{
	check(sockpath, function (error, socket)
	{
		if (error)
		{
			if (error.code === 'ENOENT')
			{
				var run = require('./run')

				run(sockpath, function ()
				{
					console.log('connect here')
					return callback(null, 'socket here')
				})
			}
			else
			{
				return callback(error)
			}
		}
		else
		{
			return callback(null, socket)
		}
	})
}
