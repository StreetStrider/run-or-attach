
require('console-ultimate/global').replace()

var attach = require('./src/run-or-attach')

attach('/tmp/sock', function (error, socket)
{
	console.info('test', error, socket)
})
