
if (process.env.running_under_istanbul)
{
	module.exports = require('which').sync
}
else
{
	module.exports = (it) => it
}
