
var check  = require('./check')
var attach = require('./attach')
var daemon = require('./daemon/daemon')
var noent  = require('./util/noent')

module.exports = function run_or_attach (sockpath, workerpath)
{
	return check(sockpath)
	.then(attach, noent(() =>
	{
		return daemon(sockpath, workerpath)
		.then(attach)
	}))
}
