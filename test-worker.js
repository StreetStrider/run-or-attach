
var Worker = require('./worker')

var worker = module.exports = Worker()

worker.init = () =>
{
	console.info('init worker')
	process.title = 'run-or-attach'

	worker.clients = new WeakMap
}

worker.conn = (flow) =>
{
	console.info('conn to worker')

	var next  = 0
	var timer = setInterval(() =>
	{
		next = next + 1
		flow({ realtime: next })
	},
	1000)

	console.warn('timer %s', timer)
	worker.clients.set(flow, timer)
}

worker.dscn = (flow) =>
{
	console.info('dscn from worker')
	var timer = worker.clients.get(flow)
	console.warn('timer clear %s', timer)
	clearInterval(timer)
}

worker.down = () =>
{
	console.info('worker teardown')
}

worker.recv = (data) =>
{
	if (data.sqr)
	{
		return { data: data.sqr * data.sqr }
	}

	data.inc = [ data.inc, data.inc + 1 ]
	return new Promise((rs) => { setTimeout(() => rs(data), 100) })
}
