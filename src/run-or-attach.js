
var daemon = require('./util/daemon')
var check = require('./check')

module.exports = function (sockpath, fWorker)
{
	if (daemon.is())
	{
		var run = require('./run')

		run(sockpath, fWorker)

		return Promise.resolve()
	}
	else return check(sockpath)
	.then(function (socket)
	{
		var attach = require('./attach')

		return attach(socket)
	},
	function (error)
	{
		if (error.code === 'ENOENT')
		{
			var attach = require('./attach')

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
