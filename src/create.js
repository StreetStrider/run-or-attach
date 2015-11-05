
var server = require('net').createServer

module.exports = function (sockpath)
{
	server()
	.listen(sockpath)
	.on('connection', function (socket)
	{
		console.log(socket)
	})
}
