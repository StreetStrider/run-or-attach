
var check  = require('./check')
var attach = require('./attach')
var daemon = require('./daemon/daemon')

module.exports = function (sockpath, workerpath)
{
	return check(sockpath)
	.then(function (socket)
	{
		return attach(socket)
	},
	function (error)
	{
		if (error.code === 'ENOENT')
		{
			return daemon(sockpath, workerpath)
			.then(function (socket)
			{
				return attach(socket)
			})
		}
		else
		{
			return Promise.reject(error)
		}
	})
}
