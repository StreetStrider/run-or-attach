

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
				var create = require('./create')

				create(sockpath, function ()
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
