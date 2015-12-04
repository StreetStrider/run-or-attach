
var fs = require('fs')
var access = fs.accessSync
var connect = require('net').connect

module.exports = function (sockpath)
{
	return new Promise(function (rs, rj)
	{
		try
		{
			var up = access(sockpath, fs.R_OK | fs.W_OK)

			var socket = connect(sockpath, function (it)
			{
				socket.setEncoding('utf-8')

				socket.once('data', function (data)
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
