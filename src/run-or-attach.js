

var check = require('./check')

module.exports = function (sockpath, workerfn)
{
	/*try
	{
		var up = access(sockpath, fs.R_OK | fs.W_OK)

		console.info('attach')
	}
	catch (e)
	{
		if (e.code === 'ENOENT')
		{
			var create = require('./create')

			console.info('create')
			create(sockpath, workerfn)
		}
		else
		{
			throw e
		}
	}*/

	check(sockpath, console.info.part('check'))
}
