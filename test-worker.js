
var Worker = require('./worker')

var worker = module.exports = Worker()

worker.init = function ()
{
	console.info('init worker')
	process.title = 'run-or-attach'
}

worker.conn = function (socket)
{
	console.info('conn to worker')
}

worker.down = function ()
{
	console.info('worker teardown')
}

worker.recv = function (data)
{
	data.x += 1;
	return new Promise((rs) => { setTimeout(() => rs(data), 100) })
}
