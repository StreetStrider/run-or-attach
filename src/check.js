
var fs = require('fs')
var access = fs.accessSync
var connect = require('net').connect

module.exports = function (sockpath, callback)
{
	try
	{
		var up = access(sockpath, fs.R_OK | fs.W_OK)

		var socket = connect(sockpath, function (it)
		{
			socket.setEncoding('utf-8')

			socket.on('data', function (data)
			{
				if (data === 'yup!\n')
				{
					clearTimeout(timeout)
					return callback(null, socket)
				}
				else
				{
					return notYup()
				}
			})

			var timeout = setTimeout(notYup, 3000)

			function notYup ()
			{
				clearTimeout(timeout)

				var error = new Error('connect NOT_YUP')
				error.code = 'NOT_YUP'

				socket.end()

				return callback(error)
			}

			socket.write('alive?\n')
		})

		socket.on('error', callback)
	}
	catch (error)
	{
		return callback(error)
	}
}
