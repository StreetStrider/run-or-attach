
var sockpath = '/tmp/run-or-attach-worker-test'

var attach = require('../../src/attach')

var util = require('../_util')
var delay = util.delay
var waitfor = util.waitfor

var write = require('fs').createWriteStream
var w = write(__dirname + '/../../output.txt')
// process.stdout.pipe(w)

console.log   = (t) => { w.write('log:' + String(t) + '\n', 'utf-8') }
console.error = (t) => { w.write('err:' + String(t) + '\n', 'utf-8') }

console.log(module.parent && module.parent.filename)

attach(sockpath)
.then(console.log, console.error)
.then(() => console.log('OK'))
.then(() =>
{
	//setTimeout(process.exit, 1500)
	return new Promise(rs =>
	{
		w.end(rs)
	})
})
.then(process.exit)
