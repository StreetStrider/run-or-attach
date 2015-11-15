

module.exports = function FWorker ()
{
	var worker = {}

	worker.init = noop
	worker.conn = noop
	worker.recv = noop

	return worker
}

function noop () {}
