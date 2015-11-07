

var check = require('./check')

// workerfn
module.exports = function (sockpath, callback)
{
	check(sockpath, function (error, socket)
	{
		if (error)
		{
			var create = require('./create')

			console.dir(error)
			//create(sockpath, console.warn)
		}
		else
		{
			callback(socket)
		}
	})
}
