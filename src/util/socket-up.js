
module.exports = function socketUp (socket)
{
	socket.setEncoding('utf-8')
	socket.setNoDelay(true)
	return socket
}
