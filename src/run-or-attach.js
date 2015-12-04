
var daemon = require('./util/daemon')
var check = require('./check')

module.exports = function (sockpath, fWorker)
{
	if (daemon.is())
	{
		var run = require('./run')

		return run(sockpath, fWorker)
	}


	var attach = require('./attach')

	return check(sockpath)
	.then(function (socket)
	{
		return attach(socket)
	},
	function (error)
	{
		if (error.code === 'ENOENT')
		{
			return new Promise(function (rs, rj)
			{
				daemon().on('daemon-ready', function ()
				{
					return rs(attach(sockpath))
				})
			})
		}
		else
		{
			return Promise.reject(error)
		}
	})
}
