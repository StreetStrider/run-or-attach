
var sockpath = '/tmp/run-or-attach-worker-test'

var attach = require('../../src/attach')

var delay = require('../_util').delay


/*
var write = require('fs').createWriteStream
var w = write(__dirname + '/../../output.txt')
process.stdout.pipe(w)

console.log   = (t) => { w.write('log:' + String(t) + '\n', 'utf-8') }
console.error = (t) => { w.write('err:' + String(t) + '\n', 'utf-8') }
*/

// console.log(module.parent && module.parent.filename)

attach(sockpath)
.then(flow =>
{
	flow.recv = (data) =>
	{
		if (data[0] === 'turn')
		{
			flow([ 'turn', data[1] + '_yes' ])
		}
	}

	return Promise.resolve()
	.then(() =>
	{
		return flow([ 'ok', 'data1' ])
	})
	.then(() =>
	{
		return flow([ 'ok', 'data2' ])
	})
	.then(() =>
	{
		return flow([ 'ok', 'data3' ])
	})
})
// .then(console.log, console.error)
// .then(() => console.log('OK'))
/*
.then(() =>
{
	return new Promise(rs =>
	{
		w.end(rs)
	})
})
//*/
.then(() =>
{
	return delay(100)
})
.then(process.exit)
