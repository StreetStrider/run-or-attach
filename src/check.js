
var fs = require('fs')
var access = fs.accessSync
var connect = require('net').connect
var socketUp = require('./util/socket-up')

module.exports = function check (sockpath)
{
	return new Promise((rs, rj) =>
	{
		try
		{
			access(sockpath, fs.R_OK | fs.W_OK)

			var socket = connect(sockpath, () =>
			{
				socket = socketUp(socket)

				socket.once('data', data =>
				{
					if (data === 'yup!\n')
					{
						clearTimeout(timeout)

						return rs(socket)
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

					return rj(error)
				}

				socket.write('alive?\n')
			})

			socket.once('error', rj)
		}
		catch (error)
		{
			return rj(error)
		}
	})
}
