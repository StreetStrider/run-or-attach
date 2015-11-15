

module.exports = function FWorker ()
{
	var worker = {}

	worker.init = noop
	worker.conn = noop
	worker.recv = noop
	worker.down = noop

	return worker
}

function noop () {}
