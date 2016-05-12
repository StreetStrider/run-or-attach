
try
{
	module.exports = require('which').sync
}
catch (e)
{
	module.exports = (it) => it
}
