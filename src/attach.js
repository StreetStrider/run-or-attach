

var fs = require('fs')
var access = fs.accessSync

module.exports = function (sockpath, workerfn)
{
	try
	{
		var up = access(sockpath, fs.R_OK | fs.W_OK)

		console.info('attach')
	}
	catch (e)
	{
		if (e.code === 'ENOENT')
		{
			var create = require('./create')

			create(sockpath, workerfn)
		}
		else
		{
			throw e
		}
	}

	console.log('up')
}
