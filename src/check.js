
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
					callback()
				}
				else
				{
					var e = new Error
					e.code = 'NOT_YUP'

					callback(e)
				}
			})

			socket.write('alive?\n')
		})
	}
	catch (e)
	{
		callback(e)
	}
}
